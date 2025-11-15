# ChatVerse - Quick Start Guide

## 🚀 Get Started in 5 Minutes!

### Step 1: Install Dependencies

Open two terminal windows.

**Terminal 1 - Backend:**
```bash
cd chatverse/backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd chatverse/frontend
npm install
```

### Step 2: Start the Servers

**Terminal 1 - Start Backend:**
```bash
npm start
```

You should see:
```
🚀 ChatVerse server running on port 3001
📊 Admin panel available at http://localhost:3001/admin
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 3: Open the Application

1. Open your browser
2. Navigate to `http://localhost:3000`
3. Enter a username
4. Click "Start Chatting"

### Step 4: Test the Chat

**Option 1: Use Two Browsers**
- Open `http://localhost:3000` in Chrome
- Open `http://localhost:3000` in Firefox
- Both users click "Find New Chat"
- They will be matched automatically!

**Option 2: Use Incognito Mode**
- Open normal window + incognito window
- Both navigate to `http://localhost:3000`
- Follow the same process

### Step 5: Try the Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. Login with:
   - **Username**: `admin`
   - **Password**: `chatverse2025`
3. View real-time statistics and manage users

## 🎮 Features to Try

### Chat Features
- ✅ **Send messages** - Type and press Enter
- ✅ **Typing indicator** - Start typing to show indicator to partner
- ✅ **Message reactions** - Hover over partner's messages and click emoji
- ✅ **End chat** - Click "End Chat" button
- ✅ **Find new chat** - Click "Find New Chat" after ending

### Profile Features
- ✅ **Change username** - Go to Profile page
- ✅ **Generate new avatar** - Click "Generate New Avatar"
- ✅ **Change theme** - Select from Dark, Neon, or Purple themes

### Admin Features
- ✅ **View statistics** - See active users, chats, queue size
- ✅ **Monitor users** - View all connected users and their IPs
- ✅ **Monitor chats** - See all active chat rooms
- ✅ **Force disconnect** - Kick users from the platform
- ✅ **Ban users** - Ban IP addresses
- ✅ **View logs** - See all system activities

## ⚠️ Troubleshooting

### "Cannot connect to server"
- Make sure backend is running on port 3001
- Check if port is already in use: `lsof -i :3001` (Mac/Linux) or `netstat -ano | findstr :3001` (Windows)

### "Page not found"
- Make sure frontend is running on port 3000
- Try clearing browser cache
- Check browser console for errors (F12)

### "Cannot find module"
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Backend crashes
- Check Node.js version: `node --version` (need 18+)
- Look at error message in terminal
- Make sure all files are present

## 🎯 Next Steps

1. **Customize the UI** - Edit colors in `tailwind.config.js`
2. **Add more features** - Check the code comments for ideas
3. **Deploy to production** - Follow the deployment guide
4. **Secure the app** - Change admin credentials, add HTTPS

## 📚 File Structure

```
chatverse/
├── backend/          # Server code
│   ├── server.js     # Main entry point
│   ├── sockets.js    # WebSocket handlers
│   └── matchmaking.js # Chat matching logic
│
└── frontend/         # Client code
    ├── pages/        # Next.js pages
    │   ├── index.js  # Home page
    │   ├── chat.js   # Chat interface
    │   ├── profile.js # Settings
    │   └── admin.js  # Admin panel
    │
    └── components/   # Reusable components
        ├── MessageBubble.js
        ├── Sidebar.js
        └── ...
```

## 🆘 Need Help?

1. Check the main README.md for detailed documentation
2. Look at the DEPLOYMENT.md for production setup
3. Review code comments in the files
4. Check browser console (F12) for errors
5. Check terminal output for backend errors

---

Happy Chatting! 🎉
