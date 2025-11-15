const { logEvent } = require('./matchmaking');

// Middleware to verify admin authentication
function adminAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  // In production, verify JWT token properly
  // For now, just check if token exists
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (decoded.startsWith('admin:')) {
      next();
    } else {
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// Get system statistics
function getStats() {
  const totalUsers = global.activeUsers.size;
  const totalChats = global.activeChats.size;
  const queueSize = global.waitingQueue.length;
  const bannedCount = global.bannedIPs.size;
  
  // Calculate total messages
  let totalMessages = 0;
  global.activeChats.forEach(chat => {
    totalMessages += chat.messages.length;
  });
  
  // Get chat duration stats
  const chatDurations = [];
  global.activeChats.forEach(chat => {
    const duration = Date.now() - chat.createdAt;
    chatDurations.push(duration);
  });
  
  const avgChatDuration = chatDurations.length > 0
    ? chatDurations.reduce((a, b) => a + b, 0) / chatDurations.length
    : 0;
  
  return {
    totalUsers,
    totalChats,
    queueSize,
    totalMessages,
    bannedCount,
    avgChatDuration: Math.round(avgChatDuration / 1000), // in seconds
    uptime: process.uptime(),
    timestamp: Date.now()
  };
}

// Get list of active chats with details
function getActiveChatsList() {
  const chats = [];
  
  global.activeChats.forEach((chat, roomId) => {
    chats.push({
      roomId,
      users: chat.users.map(u => ({
        socketId: u.socketId,
        username: u.username,
        avatar: u.avatar
      })),
      messageCount: chat.messages.length,
      createdAt: chat.createdAt,
      duration: Date.now() - chat.createdAt
    });
  });
  
  return chats;
}

// Get list of active users
function getActiveUsersList() {
  const users = [];
  
  global.activeUsers.forEach((user, socketId) => {
    users.push({
      socketId,
      username: user.username || 'Anonymous',
      ip: user.ip,
      status: user.status,
      roomId: user.roomId || null,
      connectedAt: user.connectedAt,
      duration: Date.now() - user.connectedAt
    });
  });
  
  return users;
}

// Force disconnect a user
function forceDisconnect(io, socketId) {
  const socket = io.sockets.sockets.get(socketId);
  
  if (!socket) {
    return { success: false, message: 'User not found' };
  }
  
  const user = global.activeUsers.get(socketId);
  
  // Notify user
  socket.emit('force_disconnect', { message: 'You have been disconnected by an admin' });
  
  // End chat if in one
  if (user && user.roomId) {
    const roomId = user.roomId;
    io.to(roomId).emit('chat_ended', {
      message: 'Chat ended by admin',
      endedBy: 'admin'
    });
    
    const { endChat } = require('./matchmaking');
    endChat(roomId);
  }
  
  // Disconnect socket
  socket.disconnect(true);
  
  logEvent('admin_disconnect', { socketId, username: user?.username });
  
  return { success: true, message: 'User disconnected' };
}

// Ban a user by IP
function banUser(io, ip, socketId) {
  // Add IP to banned list
  global.bannedIPs.add(ip);
  
  // Disconnect all users with this IP
  let disconnectedCount = 0;
  
  global.activeUsers.forEach((user, sid) => {
    if (user.ip === ip) {
      const socket = io.sockets.sockets.get(sid);
      if (socket) {
        socket.emit('banned', { message: 'You have been banned from ChatVerse' });
        socket.disconnect(true);
        disconnectedCount++;
      }
    }
  });
  
  logEvent('admin_ban', { ip, affectedUsers: disconnectedCount });
  
  return { 
    success: true, 
    message: `Banned IP ${ip}`, 
    disconnectedUsers: disconnectedCount 
  };
}

// Unban an IP
function unbanUser(ip) {
  if (global.bannedIPs.has(ip)) {
    global.bannedIPs.delete(ip);
    logEvent('admin_unban', { ip });
    return { success: true, message: `Unbanned IP ${ip}` };
  }
  
  return { success: false, message: 'IP not found in ban list' };
}

// Get banned IPs list
function getBannedIPs() {
  return Array.from(global.bannedIPs);
}

module.exports = {
  adminAuth,
  getStats,
  getActiveChatsList,
  getActiveUsersList,
  forceDisconnect,
  banUser,
  unbanUser,
  getBannedIPs
};
