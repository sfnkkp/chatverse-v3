# ChatVerse - Random Text Chat Platform

> A modern, futuristic Discord-inspired random chat application with real-time messaging.

![ChatVerse](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎨 Features

### Frontend
- ✨ **Modern Discord-inspired UI** with dark theme
- 🎭 **Glassmorphism effects** with neon accents
- 🎬 **Smooth animations** using Framer Motion
- 📱 **Fully responsive** design
- 🎨 **Custom themes** (Dark, Neon, Purple)
- 👤 **Auto-generated avatars** using DiceBear
- 💬 **Real-time messaging** with typing indicators
- 😊 **Message reactions** support
- 🔔 **Sound notifications**

### Backend
- ⚡ **Real-time communication** with Socket.io
- 🎲 **Random matchmaking** system
- 🚫 **Spam detection** and filtering
- 🔒 **Bad word filtering**
- 📊 **Admin dashboard** with real-time stats
- 🛡️ **IP banning** capability
- 📝 **Activity logging**

### Admin Panel
- 📊 **Real-time statistics**
- 👥 **Active users monitoring**
- 💬 **Chat room management**
- 🔨 **Force disconnect users**
- 🚫 **Ban/unban IP addresses**
- 📜 **Activity logs viewer**

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **WebSocket**: Socket.io
- **UUID Generation**: uuid

## 📁 Project Structure

```
chatverse/
├── backend/
│   ├── server.js          # Main server file
│   ├── sockets.js         # Socket.io event handlers
│   ├── matchmaking.js     # Matchmaking logic
│   ├── admin.js           # Admin functionality
│   └── package.json
├── frontend/
│   ├── components/
│   │   ├── MessageBubble.js
│   │   ├── Sidebar.js
│   │   ├── UserPanel.js
│   │   └── TypingIndicator.js
│   ├── pages/
│   │   ├── index.js       # Home page
│   │   ├── chat.js        # Chat page
│   │   ├── profile.js     # Profile settings
│   │   ├── admin.js       # Admin dashboard
│   │   └── _app.js
│   ├── styles/
│   │   └── globals.css
│   ├── public/
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

#### 1. Clone or download the project

```bash
cd chatverse
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Running Locally

#### 1. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:3001`

For development with auto-reload:
```bash
npm run dev
```

#### 2. Start the Frontend

Open a new terminal window:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

#### 3. Open in Browser

Navigate to `http://localhost:3000` in your web browser.

## 🔐 Admin Credentials

Default admin credentials:
- **Username**: `admin`
- **Password**: `chatverse2025`

**⚠️ IMPORTANT**: Change these credentials in production by setting environment variables!

## 🌐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### Frontend (.env.local)

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📦 Deployment

### Deploy Backend (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
4. Add environment variables:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   ```
5. Deploy!

### Deploy Frontend (Vercel)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```

5. Redeploy after adding environment variables

## 🎮 Usage Guide

### For Users

1. **Enter Username**: On the home page, enter your desired username
2. **Start Chatting**: Click "Start Chatting" to enter the chat page
3. **Find Partner**: Click "Find New Chat" in the sidebar
4. **Chat**: Once matched, start sending messages!
5. **React**: Hover over messages to add reactions (only partner's messages)
6. **End Chat**: Click "End Chat" to disconnect and find a new partner
7. **Profile**: Access profile settings to change username or theme

### For Admins

1. Navigate to `/admin`
2. Login with admin credentials
3. Monitor:
   - Active users count
   - Active chats
   - Queue size
   - System statistics
4. Manage:
   - View all active users and their IPs
   - Force disconnect users
   - Ban IP addresses
   - View activity logs

## 🎨 Customization

### Themes

Edit `frontend/tailwind.config.js` to customize colors:

```javascript
colors: {
  'primary-blue': '#00BFFF',    // Change primary color
  'primary-purple': '#8A2BE2',  // Change secondary color
  'primary-pink': '#FF00FF',    // Change accent color
}
```

### Avatar Provider

Change avatar provider in code by replacing DiceBear URLs:

```javascript
// Current: DiceBear Avataaars
const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

// Alternative styles: adventurer, avataaars-neutral, bottts, personas
```

## 🔧 Advanced Configuration

### Message Rate Limiting

Edit `backend/matchmaking.js`:

```javascript
// Current: 5 messages per 5 seconds
if (recentTimestamps.length >= 5) {
  return true;
}
```

### Bad Words Filter

Edit `backend/matchmaking.js`:

```javascript
const BAD_WORDS = ['spam', 'badword1', 'badword2'];
// Add more words to filter
```

### Auto-disconnect Timeout

Add to `backend/sockets.js`:

```javascript
// Disconnect inactive users after 5 minutes
setTimeout(() => {
  if (/* check if inactive */) {
    socket.disconnect();
  }
}, 5 * 60 * 1000);
```

## 📱 Mobile Optimization

The application is fully responsive and optimized for:
- 📱 Mobile phones (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktops (> 1024px)

Touch targets are minimum 44x44px for accessibility.

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check CORS settings in `backend/server.js`
- Ensure `NEXT_PUBLIC_SOCKET_URL` environment variable is set correctly

### Socket.io connection issues
- Check firewall settings
- Ensure WebSocket protocol is allowed
- Verify the backend URL is accessible

### Admin login fails
- Check credentials match environment variables
- Verify backend `/api/admin/login` endpoint is accessible
- Check browser console for errors

## 🔒 Security Considerations

### For Production

1. **Change default admin credentials** immediately
2. **Use HTTPS** for both frontend and backend
3. **Implement JWT** for admin authentication (currently basic)
4. **Add rate limiting** to API endpoints
5. **Sanitize user inputs** more thoroughly
6. **Use environment variables** for all sensitive data
7. **Enable CORS** only for your frontend domain
8. **Implement proper session management**
9. **Add IP rate limiting** to prevent DDoS
10. **Use a proper database** for persistence (currently in-memory)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

**MiniMax Agent**

## 🙏 Acknowledgments

- Discord for UI/UX inspiration
- DiceBear for avatar generation API
- Framer Motion for smooth animations
- Socket.io for real-time communication

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Check browser console for errors
4. Verify all environment variables are set

---

Made with ❤️ using React, Next.js, and Socket.io
