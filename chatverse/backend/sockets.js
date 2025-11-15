const { addToQueue, removeFromQueue, tryMatch, endChat, addMessageToRoom, isSpamming, logEvent } = require('./matchmaking');

function handleSocketConnection(io, socket) {
  const clientIp = socket.handshake.address;
  
  // Check if IP is banned
  if (global.bannedIPs.has(clientIp)) {
    console.log(`🚫 Banned IP ${clientIp} attempted to connect`);
    socket.emit('banned', { message: 'You have been banned from ChatVerse' });
    socket.disconnect();
    return;
  }
  
  console.log(`🔌 New connection: ${socket.id} from ${clientIp}`);
  
  // Store user data
  global.activeUsers.set(socket.id, {
    socketId: socket.id,
    ip: clientIp,
    connectedAt: Date.now(),
    username: null,
    avatar: null,
    status: 'online'
  });
  
  logEvent('user_connected', { socketId: socket.id, ip: clientIp });
  
  // Handle user registration
  socket.on('register', (userData) => {
    console.log(`📝 User registered: ${userData.username} (${socket.id})`);
    
    const user = global.activeUsers.get(socket.id);
    if (user) {
      user.username = userData.username;
      user.avatar = userData.avatar;
      user.theme = userData.theme || 'dark';
    }
    
    socket.emit('registered', { success: true, socketId: socket.id });
    logEvent('user_registered', { socketId: socket.id, username: userData.username });
  });
  
  // Handle find chat request
  socket.on('find_chat', (userData) => {
    console.log(`🔍 ${userData.username} is looking for a chat`);
    
    const added = addToQueue(socket, userData);
    if (added) {
      socket.emit('searching', { message: 'Searching for a chat partner...' });
      
      // Try to match
      const match = tryMatch();
      if (match) {
        const { roomId, user1, user2 } = match;
        
        // Get socket instances
        const socket1 = io.sockets.sockets.get(user1.socketId);
        const socket2 = io.sockets.sockets.get(user2.socketId);
        
        if (socket1 && socket2) {
          // Join room
          socket1.join(roomId);
          socket2.join(roomId);
          
          // Notify both users
          socket1.emit('matched', {
            roomId,
            partner: {
              username: user2.userData.username,
              avatar: user2.userData.avatar,
              status: 'online'
            }
          });
          
          socket2.emit('matched', {
            roomId,
            partner: {
              username: user1.userData.username,
              avatar: user1.userData.avatar,
              status: 'online'
            }
          });
          
          console.log(`✨ Match successful: ${user1.userData.username} ↔ ${user2.userData.username}`);
        }
      }
    }
  });
  
  // Handle cancel search
  socket.on('cancel_search', () => {
    removeFromQueue(socket.id);
    socket.emit('search_cancelled');
    console.log(`❌ ${socket.id} cancelled search`);
  });
  
  // Handle sending message
  socket.on('send_message', (data) => {
    const { roomId, message } = data;
    
    // Check for spam
    if (isSpamming(socket.id)) {
      socket.emit('error', { message: 'You are sending messages too quickly!' });
      logEvent('spam_detected', { socketId: socket.id });
      return;
    }
    
    const user = global.activeUsers.get(socket.id);
    if (!user || !user.roomId || user.roomId !== roomId) {
      socket.emit('error', { message: 'You are not in this chat room' });
      return;
    }
    
    const messageData = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: message,
      senderId: socket.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      timestamp: Date.now()
    };
    
    // Add message to room
    addMessageToRoom(roomId, messageData);
    
    // Broadcast to room
    io.to(roomId).emit('new_message', messageData);
    
    console.log(`💬 Message in ${roomId}: ${user.username}: ${message.substring(0, 50)}`);
  });
  
  // Handle typing indicator
  socket.on('typing', (data) => {
    const { roomId, isTyping } = data;
    const user = global.activeUsers.get(socket.id);
    
    if (user && user.roomId === roomId) {
      // Broadcast to other users in room
      socket.to(roomId).emit('user_typing', {
        username: user.username,
        isTyping
      });
    }
  });
  
  // Handle message reaction
  socket.on('add_reaction', (data) => {
    const { roomId, messageId, emoji } = data;
    const user = global.activeUsers.get(socket.id);
    
    if (user && user.roomId === roomId) {
      io.to(roomId).emit('reaction_added', {
        messageId,
        emoji,
        userId: socket.id,
        username: user.username
      });
    }
  });
  
  // Handle end chat
  socket.on('end_chat', (data) => {
    const { roomId } = data;
    const user = global.activeUsers.get(socket.id);
    
    if (user && user.roomId === roomId) {
      // Notify room
      io.to(roomId).emit('chat_ended', { 
        message: `${user.username} left the chat`,
        endedBy: socket.id
      });
      
      // End the chat
      endChat(roomId);
      
      // Remove users from room
      const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
      if (socketsInRoom) {
        socketsInRoom.forEach(socketId => {
          const socket = io.sockets.sockets.get(socketId);
          if (socket) {
            socket.leave(roomId);
          }
        });
      }
      
      console.log(`👋 ${user.username} ended chat in ${roomId}`);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 Disconnected: ${socket.id}`);
    
    const user = global.activeUsers.get(socket.id);
    
    if (user) {
      // Remove from queue if waiting
      removeFromQueue(socket.id);
      
      // End chat if in one
      if (user.roomId) {
        const roomId = user.roomId;
        io.to(roomId).emit('chat_ended', {
          message: `${user.username} disconnected`,
          endedBy: socket.id
        });
        endChat(roomId);
      }
      
      logEvent('user_disconnected', { socketId: socket.id, username: user.username });
    }
    
    // Remove from active users
    global.activeUsers.delete(socket.id);
  });
}

module.exports = { handleSocketConnection };
