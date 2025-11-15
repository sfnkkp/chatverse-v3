const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { handleSocketConnection } = require('./sockets');
const { adminAuth, getStats, getActiveChatsList, getActiveUsersList, forceDisconnect, banUser } = require('./admin');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store for active users and chats
global.activeUsers = new Map(); // socketId -> user data
global.activeChats = new Map(); // roomId -> { users: [], messages: [] }
global.waitingQueue = [];
global.bannedIPs = new Set();
global.chatLogs = [];

// Admin credentials (in production, use environment variables and hash passwords)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'chatverse2025';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin API endpoints
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // In production, use JWT tokens
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/admin/stats', adminAuth, (req, res) => {
  res.json(getStats());
});

app.get('/api/admin/chats', adminAuth, (req, res) => {
  res.json(getActiveChatsList());
});

app.get('/api/admin/users', adminAuth, (req, res) => {
  res.json(getActiveUsersList());
});

app.post('/api/admin/disconnect', adminAuth, (req, res) => {
  const { socketId } = req.body;
  const result = forceDisconnect(io, socketId);
  res.json(result);
});

app.post('/api/admin/ban', adminAuth, (req, res) => {
  const { ip, socketId } = req.body;
  const result = banUser(io, ip, socketId);
  res.json(result);
});

app.get('/api/admin/logs', adminAuth, (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  res.json(global.chatLogs.slice(-limit));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  handleSocketConnection(io, socket);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 ChatVerse server running on port ${PORT}`);
  console.log(`📊 Admin panel available at http://localhost:${PORT}/admin`);
});

module.exports = { app, server, io };
