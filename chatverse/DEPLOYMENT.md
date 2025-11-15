# ChatVerse - Deployment Guide

Complete guide for deploying ChatVerse to production.

## 🎯 Deployment Overview

We'll deploy:
- **Backend** → Render (Free tier available)
- **Frontend** → Vercel (Free tier available)

## 📋 Pre-Deployment Checklist

- [ ] Code tested locally
- [ ] Environment variables prepared
- [ ] Admin credentials changed
- [ ] GitHub repository created (optional but recommended)
- [ ] Domain name ready (optional)

---

## 🔧 Method 1: Deploy Backend to Render

### Step 1: Prepare Backend for Deployment

1. **Create a `start` script** in `backend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

2. **Ensure CORS is configured** in `backend/server.js`:
```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});
```

### Step 2: Deploy to Render

1. **Sign up** at [render.com](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository OR use "Public Git repository"

3. **Configure the service**:
   ```
   Name: chatverse-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**:
   ```
   PORT=3001
   FRONTEND_URL=https://your-app.vercel.app
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_secure_password
   ```

5. **Select Instance Type**:
   - Free tier is sufficient for testing
   - Upgrade to paid tier for production

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Copy your backend URL**: `https://chatverse-backend.onrender.com`

---

## 🌐 Method 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend for Deployment

1. **Ensure environment variables are used** in code:
```javascript
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

2. **Test production build locally**:
```bash
cd frontend
npm run build
npm start
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Navigate to frontend directory**:
```bash
cd frontend
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy**:
```bash
vercel
```

5. **Follow prompts**:
   - Set up and deploy? Y
   - Which scope? (your account)
   - Link to existing project? N
   - Project name? chatverse
   - Directory? ./
   - Override settings? N

6. **Add environment variables**:
```bash
vercel env add NEXT_PUBLIC_SOCKET_URL
# Enter: https://chatverse-backend.onrender.com

vercel env add NEXT_PUBLIC_API_URL
# Enter: https://chatverse-backend.onrender.com
```

7. **Redeploy with environment variables**:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. **Sign up** at [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select `frontend` as root directory

3. **Configure Project**:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SOCKET_URL=https://chatverse-backend.onrender.com
   NEXT_PUBLIC_API_URL=https://chatverse-backend.onrender.com
   ```

5. **Click "Deploy"**

6. **Wait for deployment** (2-5 minutes)

7. **Copy your frontend URL**: `https://chatverse.vercel.app`

### Step 3: Update Backend FRONTEND_URL

Go back to Render dashboard:
1. Select your backend service
2. Environment → Edit
3. Update `FRONTEND_URL` to your Vercel URL
4. Save changes (will trigger redeploy)

---

## 🚀 Alternative Deployment Options

### Deploy Backend to Heroku

1. **Install Heroku CLI**:
```bash
npm install -g heroku
```

2. **Login**:
```bash
heroku login
```

3. **Create app**:
```bash
cd backend
heroku create chatverse-backend
```

4. **Set environment variables**:
```bash
heroku config:set FRONTEND_URL=https://your-app.vercel.app
heroku config:set ADMIN_USERNAME=admin
heroku config:set ADMIN_PASSWORD=your_password
```

5. **Deploy**:
```bash
git init
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Deploy Frontend to Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Build the project**:
```bash
cd frontend
npm run build
```

3. **Deploy**:
```bash
netlify deploy --prod
```

4. **Configure environment variables** in Netlify dashboard

---

## 🔒 Production Security Checklist

### Backend Security

- [ ] **Change admin credentials** from defaults
- [ ] **Use strong passwords** (min 12 characters)
- [ ] **Implement JWT** for admin authentication
- [ ] **Add rate limiting**:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

- [ ] **Restrict CORS** to your frontend domain only
- [ ] **Use HTTPS** (automatically provided by Render)
- [ ] **Sanitize user inputs**
- [ ] **Set up monitoring** and alerts

### Frontend Security

- [ ] **Never expose backend credentials** in client code
- [ ] **Use environment variables** for all URLs
- [ ] **Implement CSP headers**
- [ ] **Enable HTTPS** (automatically provided by Vercel)
- [ ] **Validate user inputs** before sending to backend

---

## 📊 Post-Deployment Testing

### 1. Test Basic Functionality

- [ ] Home page loads
- [ ] Can enter username
- [ ] Can navigate to chat page
- [ ] Can start search for chat
- [ ] Two users can match and chat
- [ ] Messages send and receive correctly
- [ ] Typing indicator works
- [ ] Reactions work
- [ ] End chat works
- [ ] Profile page works
- [ ] Admin login works
- [ ] Admin dashboard displays data

### 2. Test Performance

```bash
# Test backend endpoint
curl https://your-backend.onrender.com/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

### 3. Monitor Logs

**Render:**
- Go to your service dashboard
- Click "Logs" tab
- Monitor for errors

**Vercel:**
- Go to your project
- Click "Deployments"
- Select latest deployment
- View "Build Logs" and "Function Logs"

---

## 🔧 Troubleshooting Deployment Issues

### Backend Issues

**"Application failed to start"**
```bash
# Check logs in Render dashboard
# Common causes:
- Missing dependencies in package.json
- Wrong start command
- Port configuration issue
```

**"WebSocket connection failed"**
```bash
# Ensure WebSocket is enabled in Render
# Check CORS configuration
# Verify FRONTEND_URL is correct
```

### Frontend Issues

**"Failed to fetch data"**
```bash
# Check environment variables in Vercel
# Verify backend URL is correct and accessible
# Check browser console for CORS errors
```

**"Build failed"**
```bash
# Check build logs in Vercel
# Ensure all dependencies are in package.json
# Test build locally: npm run build
```

---

## 🌍 Custom Domain Setup

### For Vercel (Frontend)

1. **Go to Project Settings** → Domains
2. **Add domain**: `chatverse.yourdomain.com`
3. **Configure DNS**:
   - Type: CNAME
   - Name: chatverse
   - Value: cname.vercel-dns.com
4. **Wait for SSL** certificate (automatic)

### For Render (Backend)

1. **Go to Service Settings** → Custom Domains
2. **Add domain**: `api.chatverse.yourdomain.com`
3. **Configure DNS**:
   - Type: CNAME
   - Name: api.chatverse
   - Value: (provided by Render)
4. **SSL is automatic**

---

## 📈 Scaling Considerations

### When to Scale Backend

- More than 100 concurrent users
- High CPU usage (> 80%)
- Memory issues
- Slow response times

### Scaling Options

1. **Vertical Scaling** (Render):
   - Upgrade to larger instance
   - More RAM and CPU

2. **Horizontal Scaling**:
   - Use Redis for session storage
   - Implement Socket.io Redis adapter
   - Deploy multiple backend instances
   - Use load balancer

3. **Database**:
   - Move from in-memory to MongoDB/PostgreSQL
   - Store chat history
   - Persist user data

### Example Redis Setup

```javascript
// Install: npm install redis socket.io-redis
const redis = require('redis');
const redisAdapter = require('socket.io-redis');

const pubClient = redis.createClient({ host: 'redis-host', port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(redisAdapter({ pubClient, subClient }));
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Configure with Render API
        
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📱 Mobile App (Future)

To create mobile apps:

1. **React Native**: Use existing React components
2. **Capacitor**: Wrap the web app
3. **PWA**: Enable Progressive Web App features

---

## ✅ Deployment Complete!

Your ChatVerse application should now be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Admin**: `https://your-app.vercel.app/admin`

Share the frontend URL with users and enjoy your random chat platform! 🎉

---

## 📞 Support

If you encounter issues:
1. Check application logs
2. Verify environment variables
3. Test locally first
4. Check service status pages (Render, Vercel)
5. Review error messages carefully

---

Made with ❤️ by MiniMax Agent
