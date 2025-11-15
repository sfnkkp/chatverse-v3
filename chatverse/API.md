# ChatVerse API Documentation

## Base URL

Local: `http://localhost:3001`
Production: `https://your-backend.onrender.com`

---

## WebSocket Events

### Client → Server

#### `register`
Register user with the server.

**Payload:**
```javascript
{
  username: string,
  avatar: string
}
```

**Response:** `registered` event

---

#### `find_chat`
Request to be matched with another user.

**Payload:**
```javascript
{
  username: string,
  avatar: string
}
```

**Responses:**
- `searching` - Added to queue
- `matched` - Partner found

---

#### `cancel_search`
Cancel search for a chat partner.

**Payload:** None

**Response:** `search_cancelled`

---

#### `send_message`
Send a message in the chat room.

**Payload:**
```javascript
{
  roomId: string,
  message: string
}
```

**Response:** `new_message` broadcast to room

---

#### `typing`
Indicate typing status.

**Payload:**
```javascript
{
  roomId: string,
  isTyping: boolean
}
```

**Response:** `user_typing` to partner

---

#### `add_reaction`
Add reaction to a message.

**Payload:**
```javascript
{
  roomId: string,
  messageId: string,
  emoji: string
}
```

**Response:** `reaction_added` broadcast to room

---

#### `end_chat`
End the current chat session.

**Payload:**
```javascript
{
  roomId: string
}
```

**Response:** `chat_ended` broadcast to room

---

### Server → Client

#### `registered`
Confirmation of successful registration.

**Payload:**
```javascript
{
  success: boolean,
  socketId: string
}
```

---

#### `searching`
User added to matchmaking queue.

**Payload:**
```javascript
{
  message: string
}
```

---

#### `matched`
User matched with a partner.

**Payload:**
```javascript
{
  roomId: string,
  partner: {
    username: string,
    avatar: string,
    status: string
  }
}
```

---

#### `new_message`
New message in the chat room.

**Payload:**
```javascript
{
  id: string,
  content: string,
  senderId: string,
  senderName: string,
  senderAvatar: string,
  timestamp: number
}
```

---

#### `user_typing`
Partner is typing.

**Payload:**
```javascript
{
  username: string,
  isTyping: boolean
}
```

---

#### `reaction_added`
Reaction added to a message.

**Payload:**
```javascript
{
  messageId: string,
  emoji: string,
  userId: string,
  username: string
}
```

---

#### `chat_ended`
Chat session ended.

**Payload:**
```javascript
{
  message: string,
  endedBy: string
}
```

---

#### `force_disconnect`
Admin forced disconnect.

**Payload:**
```javascript
{
  message: string
}
```

---

#### `banned`
User IP is banned.

**Payload:**
```javascript
{
  message: string
}
```

---

#### `error`
Error occurred.

**Payload:**
```javascript
{
  message: string
}
```

---

## REST API Endpoints

### Health Check

#### `GET /health`
Check server status.

**Response:**
```javascript
{
  status: "ok",
  timestamp: string
}
```

---

### Admin Endpoints

All admin endpoints require Bearer token authentication.

#### `POST /api/admin/login`
Admin login.

**Request:**
```javascript
{
  username: string,
  password: string
}
```

**Response:**
```javascript
{
  success: boolean,
  token: string
}
```

---

#### `GET /api/admin/stats`
Get system statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
{
  totalUsers: number,
  totalChats: number,
  queueSize: number,
  totalMessages: number,
  bannedCount: number,
  avgChatDuration: number,
  uptime: number,
  timestamp: number
}
```

---

#### `GET /api/admin/chats`
Get active chat rooms.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
[
  {
    roomId: string,
    users: [
      {
        socketId: string,
        username: string,
        avatar: string
      }
    ],
    messageCount: number,
    createdAt: number,
    duration: number
  }
]
```

---

#### `GET /api/admin/users`
Get active users.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```javascript
[
  {
    socketId: string,
    username: string,
    ip: string,
    status: string,
    roomId: string | null,
    connectedAt: number,
    duration: number
  }
]
```

---

#### `POST /api/admin/disconnect`
Force disconnect a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```javascript
{
  socketId: string
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string
}
```

---

#### `POST /api/admin/ban`
Ban user by IP address.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```javascript
{
  ip: string,
  socketId: string
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string,
  disconnectedUsers: number
}
```

---

#### `GET /api/admin/logs`
Get activity logs.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of logs to return (default: 100)

**Response:**
```javascript
[
  {
    timestamp: string,
    type: string,
    data: object
  }
]
```

---

## Error Codes

### HTTP Status Codes

- `200` - Success
- `401` - Unauthorized (invalid/missing token)
- `404` - Not found
- `500` - Internal server error

### WebSocket Errors

Errors are sent via the `error` event with descriptive messages.

---

## Rate Limiting

### Message Rate Limit
- **Limit**: 5 messages per 5 seconds per user
- **Response**: `error` event with message

### Spam Detection
Messages are automatically filtered for:
- Excessive rate
- Bad words (configurable)
- Repeated content

---

## Data Retention

### In-Memory Storage (Default)

All data is stored in memory and cleared on server restart:
- Active users
- Active chats
- Message history (last 100 per room)
- Logs (last 1000 events)
- Banned IPs

### Persistent Storage (Recommended for Production)

Implement database storage for:
- User profiles
- Chat history
- Ban records
- Analytics

---

## Authentication

### Admin Authentication

Current implementation uses basic token-based auth.

**For Production:**
Implement JWT tokens:

```javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });

// Verify token
const decoded = jwt.verify(token, SECRET_KEY);
```

---

## Security Best Practices

1. **Use HTTPS** in production
2. **Implement rate limiting** on all endpoints
3. **Sanitize user inputs** before processing
4. **Use strong admin passwords**
5. **Implement JWT** for admin auth
6. **Enable CORS** only for trusted domains
7. **Log security events**
8. **Monitor for suspicious activity**

---

## Example Usage

### Client Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Register
socket.emit('register', {
  username: 'User123',
  avatar: 'https://avatar-url.com/avatar.png'
});

// Find chat
socket.emit('find_chat', {
  username: 'User123',
  avatar: 'https://avatar-url.com/avatar.png'
});

// Listen for match
socket.on('matched', (data) => {
  console.log('Matched with:', data.partner.username);
  console.log('Room ID:', data.roomId);
});

// Send message
socket.emit('send_message', {
  roomId: 'room_123',
  message: 'Hello!'
});

// Receive messages
socket.on('new_message', (message) => {
  console.log(`${message.senderName}: ${message.content}`);
});
```

### Admin API Call

```javascript
// Login
const loginResponse = await fetch('http://localhost:3001/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'chatverse2025'
  })
});

const { token } = await loginResponse.json();

// Get stats
const statsResponse = await fetch('http://localhost:3001/api/admin/stats', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const stats = await statsResponse.json();
console.log('Active users:', stats.totalUsers);
```

---

## Changelog

### Version 1.0.0
- Initial release
- Basic chat functionality
- Admin panel
- WebSocket communication
- In-memory storage

---

## Support

For API issues or questions:
1. Check the main README.md
2. Review code comments in `backend/` files
3. Check server logs for errors
4. Verify authentication tokens

---

Made with ❤️ by MiniMax Agent
