const { v4: uuidv4 } = require('uuid');

// Bad words filter (basic implementation)
const BAD_WORDS = ['spam', 'badword1', 'badword2']; // Extend as needed

function filterBadWords(message) {
  let filtered = message;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  return filtered;
}

// Spam detection
const messageTimestamps = new Map(); // socketId -> [timestamps]

function isSpamming(socketId) {
  const now = Date.now();
  const timestamps = messageTimestamps.get(socketId) || [];
  
  // Remove timestamps older than 5 seconds
  const recentTimestamps = timestamps.filter(t => now - t < 5000);
  
  // If more than 5 messages in 5 seconds, it's spam
  if (recentTimestamps.length >= 5) {
    return true;
  }
  
  recentTimestamps.push(now);
  messageTimestamps.set(socketId, recentTimestamps);
  return false;
}

function addToQueue(socket, userData) {
  // Check if user is already in queue
  const existingIndex = global.waitingQueue.findIndex(item => item.socketId === socket.id);
  if (existingIndex !== -1) {
    console.log(`User ${socket.id} already in queue`);
    return false;
  }
  
  global.waitingQueue.push({
    socketId: socket.id,
    userData,
    joinedAt: Date.now()
  });
  
  console.log(`✅ Added ${userData.username} to queue. Queue size: ${global.waitingQueue.length}`);
  
  // Try to match immediately
  tryMatch();
  return true;
}

function removeFromQueue(socketId) {
  const index = global.waitingQueue.findIndex(item => item.socketId === socketId);
  if (index !== -1) {
    global.waitingQueue.splice(index, 1);
    console.log(`Removed ${socketId} from queue. Queue size: ${global.waitingQueue.length}`);
    return true;
  }
  return false;
}

function tryMatch() {
  // Need at least 2 users to match
  if (global.waitingQueue.length < 2) {
    return null;
  }
  
  // Get first two users from queue
  const user1 = global.waitingQueue.shift();
  const user2 = global.waitingQueue.shift();
  
  // Create chat room
  const roomId = `room_${uuidv4()}`;
  
  const chatRoom = {
    roomId,
    users: [
      { socketId: user1.socketId, ...user1.userData },
      { socketId: user2.socketId, ...user2.userData }
    ],
    messages: [],
    createdAt: Date.now()
  };
  
  global.activeChats.set(roomId, chatRoom);
  
  // Update user data to include roomId
  if (global.activeUsers.has(user1.socketId)) {
    global.activeUsers.get(user1.socketId).roomId = roomId;
  }
  if (global.activeUsers.has(user2.socketId)) {
    global.activeUsers.get(user2.socketId).roomId = roomId;
  }
  
  console.log(`🎉 Matched users in room ${roomId}`);
  
  // Log event
  logEvent('match_created', { roomId, users: [user1.userData.username, user2.userData.username] });
  
  return { roomId, user1, user2 };
}

function endChat(roomId) {
  const chatRoom = global.activeChats.get(roomId);
  if (!chatRoom) {
    return false;
  }
  
  // Remove room from active chats
  global.activeChats.delete(roomId);
  
  // Update users to remove roomId
  chatRoom.users.forEach(user => {
    if (global.activeUsers.has(user.socketId)) {
      delete global.activeUsers.get(user.socketId).roomId;
    }
  });
  
  console.log(`🔚 Ended chat in room ${roomId}`);
  logEvent('chat_ended', { roomId });
  
  return true;
}

function addMessageToRoom(roomId, message) {
  const chatRoom = global.activeChats.get(roomId);
  if (!chatRoom) {
    return false;
  }
  
  // Filter bad words
  message.content = filterBadWords(message.content);
  
  chatRoom.messages.push({
    ...message,
    timestamp: Date.now()
  });
  
  // Keep only last 100 messages
  if (chatRoom.messages.length > 100) {
    chatRoom.messages = chatRoom.messages.slice(-100);
  }
  
  return true;
}

function logEvent(eventType, data) {
  global.chatLogs.push({
    timestamp: new Date().toISOString(),
    type: eventType,
    data
  });
  
  // Keep only last 1000 logs
  if (global.chatLogs.length > 1000) {
    global.chatLogs = global.chatLogs.slice(-1000);
  }
}

module.exports = {
  addToQueue,
  removeFromQueue,
  tryMatch,
  endChat,
  addMessageToRoom,
  filterBadWords,
  isSpamming,
  logEvent
};
