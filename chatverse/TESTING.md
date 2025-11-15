# Testing Guide for ChatVerse

## 🧪 Testing Overview

This guide helps you test all features of ChatVerse locally and in production.

---

## 📋 Pre-Test Checklist

- [ ] Backend server is running on port 3001
- [ ] Frontend server is running on port 3000
- [ ] No console errors in browser (F12)
- [ ] No errors in backend terminal

---

## 🎯 Feature Testing

### 1. Home Page Testing

**Test: Page Load**
1. Navigate to `http://localhost:3000`
2. Verify page loads completely
3. Check for smooth animations
4. Verify gradient background animates

**Test: Username Input**
1. Click username input field
2. Type a username
3. Verify input displays correctly
4. Try entering special characters
5. Test max length (20 characters)

**Test: Navigation**
1. Click "Start Chatting" button
2. Verify redirect to `/chat`
3. Go back, click "Profile"
4. Verify redirect to `/profile`
5. Test "Admin" link

**Expected Results:**
- ✅ All pages load without errors
- ✅ Animations are smooth
- ✅ Navigation works correctly
- ✅ Username persists in localStorage

---

### 2. Chat Page Testing

#### Basic Connection Test

**Test: Socket Connection**
1. Open browser console (F12)
2. Navigate to chat page
3. Check for "Registered" message in console
4. Verify no WebSocket errors

**Test: Find Chat (Single User)**
1. Click "Find New Chat"
2. Verify "Searching..." state appears
3. Verify loading spinner shows
4. Wait 10 seconds
5. Click "Cancel"
6. Verify search cancels

**Expected Results:**
- ✅ Socket connects successfully
- ✅ Search state updates correctly
- ✅ Cancel works properly

#### Two-User Chat Test

**Setup: Open Two Browser Windows**
- Window 1: Chrome normal mode
- Window 2: Chrome incognito mode
- OR use two different browsers

**Test: Matching**
1. In both windows, enter different usernames
2. Go to chat page in both
3. Click "Find New Chat" in Window 1
4. Click "Find New Chat" in Window 2
5. Verify both show "Matched" message
6. Verify partner info displays correctly

**Test: Send Messages**
1. Type "Hello" in Window 1
2. Press Enter
3. Verify message appears in Window 1 (right side, blue)
4. Verify message appears in Window 2 (left side, dark)
5. Reply from Window 2
6. Verify messages display correctly in both

**Test: Typing Indicator**
1. Start typing in Window 1 (don't send)
2. Check Window 2 for typing indicator
3. Stop typing
4. Verify indicator disappears after 1 second

**Test: Message Reactions**
1. Send a message from Window 1
2. In Window 2, hover over the message
3. Click a reaction emoji
4. Verify reaction appears on message in both windows

**Test: End Chat**
1. Click "End Chat" in Window 1
2. Verify "Chat ended" message in both windows
3. Verify both return to idle state

**Expected Results:**
- ✅ Users match within 1 second
- ✅ Messages sync in real-time
- ✅ Typing indicator works
- ✅ Reactions display correctly
- ✅ End chat works for both users

---

### 3. Profile Page Testing

**Test: Profile Display**
1. Navigate to `/profile`
2. Verify avatar displays
3. Verify username shows correctly
4. Verify theme is selected (dark by default)

**Test: Change Username**
1. Edit username field
2. Enter new name
3. Click "Save Changes"
4. Verify success message shows
5. Go to home page
6. Verify new username is shown

**Test: Change Avatar**
1. Click "Generate New Avatar"
2. Verify avatar changes
3. Refresh page
4. Note: Avatar resets (expected behavior)

**Test: Theme Selection**
1. Click each theme option
2. Verify selection indicator shows
3. Click "Save Changes"
4. Note: Theme is saved (currently visual only)

**Test: Clear Data**
1. Scroll to Danger Zone
2. Click "Clear All Data"
3. Confirm the action
4. Verify redirect to home
5. Verify username is reset

**Expected Results:**
- ✅ Profile data loads correctly
- ✅ Changes save to localStorage
- ✅ Avatar updates work
- ✅ Clear data removes everything

---

### 4. Admin Panel Testing

**Test: Admin Login**
1. Navigate to `/admin`
2. Enter username: `admin`
3. Enter password: `chatverse2025`
4. Click "Login"
5. Verify dashboard loads

**Test: Statistics Display**
1. Check all stat cards display numbers
2. Open two chat windows (from above test)
3. Refresh admin panel
4. Verify stats update:
   - Active Users: 2
   - Active Chats: 1
   - Queue: 0

**Test: Users Tab**
1. Click "Users" tab
2. Verify user list displays
3. Check user information:
   - Username
   - Socket ID
   - IP address
   - Status
   - Duration
4. Verify table is responsive

**Test: Chats Tab**
1. Click "Chats" tab
2. Verify active chat displays
3. Check chat information:
   - Room ID
   - Both usernames
   - Message count
   - Duration

**Test: Force Disconnect**
1. In Users tab, find a user
2. Click "Kick" button
3. Confirm action
4. Check user's browser - should be disconnected
5. Verify user removed from list

**Test: Ban User**
1. In Users tab, click "Ban" on a user
2. Confirm action
3. Verify user disconnected
4. Try reconnecting from that user
5. Verify "You have been banned" message
6. Check stats - Banned count should increase

**Test: Logs Tab**
1. Click "Logs" tab
2. Verify logs display
3. Perform actions (login, find chat, etc.)
4. Refresh logs
5. Verify new events appear

**Test: Auto-Refresh**
1. Keep admin panel open
2. Perform actions in chat windows
3. Watch admin panel update every 5 seconds
4. Verify data stays current

**Test: Logout**
1. Click "Logout" button
2. Verify return to login screen
3. Try accessing dashboard without login
4. Verify redirect to login

**Expected Results:**
- ✅ Login works with correct credentials
- ✅ All tabs display correct data
- ✅ Admin actions work properly
- ✅ Real-time updates function
- ✅ Security prevents unauthorized access

---

### 5. Security Testing

**Test: Spam Prevention**
1. Open chat with two users
2. Rapidly send 5+ messages quickly
3. Verify error message appears
4. Wait 5 seconds
5. Try sending again - should work

**Test: Bad Word Filter**
1. Send a message with "spam"
2. Verify it's replaced with "***"
3. Test with mixed case: "SpAm"
4. Verify filtering still works

**Test: IP Banning**
1. Ban an IP from admin panel
2. Refresh that user's browser
3. Verify banned message appears
4. Try to reconnect
5. Verify connection blocked

**Test: Admin Auth**
1. Try accessing `/api/admin/stats` without token
2. Verify 401 Unauthorized response
3. Try with invalid token
4. Verify access denied
5. Login and retry with valid token
6. Verify access granted

**Expected Results:**
- ✅ Spam detection triggers correctly
- ✅ Bad words are filtered
- ✅ Bans persist across reconnections
- ✅ Admin endpoints are protected

---

### 6. Error Handling Testing

**Test: Backend Offline**
1. Stop backend server
2. Try to use chat
3. Verify connection error displays
4. Restart backend
5. Refresh page
6. Verify connection restored

**Test: Invalid Room**
1. Open console in chat page
2. Manually emit: `socket.emit('send_message', { roomId: 'fake', message: 'test' })`
3. Verify error message appears

**Test: Network Interruption**
1. Start a chat
2. Disconnect internet briefly
3. Reconnect internet
4. Test if chat still works
5. May need to refresh

**Expected Results:**
- ✅ Graceful error messages
- ✅ No app crashes
- ✅ Clear user feedback
- ✅ Recovery when possible

---

### 7. Mobile Testing

**Test: Mobile Layout (Chrome DevTools)**
1. Open DevTools (F12)
2. Click device toolbar icon
3. Select iPhone/Android preset
4. Test all pages:
   - Home page
   - Chat page
   - Profile page
   - Admin page

**Test: Touch Interactions**
1. Use touch simulation
2. Tap buttons
3. Scroll messages
4. Test input fields

**Test: Responsive Breakpoints**
1. Resize browser window
2. Test at:
   - 375px (mobile)
   - 768px (tablet)
   - 1024px (desktop)
3. Verify layout adapts

**Expected Results:**
- ✅ All pages are responsive
- ✅ Touch targets are adequate
- ✅ No horizontal scrolling
- ✅ Text remains readable

---

### 8. Performance Testing

**Test: Page Load Speed**
1. Open Network tab in DevTools
2. Reload pages
3. Check load times:
   - Home: < 2 seconds
   - Chat: < 2 seconds
   - Admin: < 2 seconds

**Test: Message Latency**
1. Open chat with two users
2. Note timestamp when sending message
3. Check timestamp when received
4. Calculate difference
5. Should be < 100ms on localhost

**Test: Memory Usage**
1. Open Performance Monitor in DevTools
2. Use chat for 5 minutes
3. Send 50+ messages
4. Check memory doesn't grow excessively

**Expected Results:**
- ✅ Fast page loads
- ✅ Low message latency
- ✅ No memory leaks
- ✅ Smooth animations

---

### 9. Browser Compatibility

**Test Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**For Each Browser:**
1. Test basic chat flow
2. Check animations work
3. Verify WebSocket connection
4. Test admin panel
5. Check console for errors

**Expected Results:**
- ✅ Works in all modern browsers
- ✅ Consistent appearance
- ✅ No browser-specific errors

---

### 10. Production Testing

After deploying to Render + Vercel:

**Test: HTTPS Connection**
1. Verify both URLs use HTTPS
2. Check for mixed content warnings
3. Test WebSocket over WSS

**Test: CORS**
1. Verify frontend can connect to backend
2. Check Network tab for CORS errors
3. Test from different devices

**Test: Environment Variables**
1. Verify correct backend URL in frontend
2. Test admin login with production credentials
3. Check all features work

**Test: Performance**
1. Test from different locations
2. Check latency (will be higher than localhost)
3. Verify acceptable response times

**Expected Results:**
- ✅ Secure connections (HTTPS/WSS)
- ✅ No CORS errors
- ✅ All features work
- ✅ Good performance globally

---

## 🐛 Common Issues and Solutions

### Issue: WebSocket connection fails
**Solution:**
- Check backend is running
- Verify SOCKET_URL is correct
- Check firewall settings
- Try different network

### Issue: Messages not syncing
**Solution:**
- Check both users are in same room
- Verify WebSocket connection is active
- Check browser console for errors
- Refresh both browsers

### Issue: Admin login fails
**Solution:**
- Verify credentials are correct
- Check ADMIN_PASSWORD environment variable
- Clear browser cache
- Check Network tab for API errors

### Issue: Animations laggy
**Solution:**
- Check CPU usage
- Reduce animation complexity
- Test on different device
- Disable animations in code

---

## ✅ Testing Checklist

Before considering testing complete:

- [ ] All features tested individually
- [ ] Two-user chat flow tested
- [ ] Admin panel fully tested
- [ ] Security features verified
- [ ] Error handling confirmed
- [ ] Mobile layout checked
- [ ] Performance acceptable
- [ ] Multiple browsers tested
- [ ] Production deployment works
- [ ] Documentation reviewed

---

## 📊 Test Results Template

```
ChatVerse Test Results
=====================

Date: ___________
Tester: ___________
Environment: [ ] Local [ ] Production

Feature Tests:
- Home Page: [ ] Pass [ ] Fail
- Chat System: [ ] Pass [ ] Fail
- Profile Page: [ ] Pass [ ] Fail
- Admin Panel: [ ] Pass [ ] Fail
- Security: [ ] Pass [ ] Fail
- Mobile: [ ] Pass [ ] Fail
- Performance: [ ] Pass [ ] Fail

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
```

---

## 🔄 Automated Testing (Future)

To implement automated testing:

### Backend Tests (Jest)
```javascript
// Install: npm install --save-dev jest supertest

const request = require('supertest');
const { app } = require('./server');

test('Health check endpoint', async () => {
  const response = await request(app).get('/health');
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('ok');
});
```

### Frontend Tests (Jest + React Testing Library)
```javascript
// Install: npm install --save-dev @testing-library/react

import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

test('renders home page', () => {
  render(<Home />);
  expect(screen.getByText('ChatVerse')).toBeInTheDocument();
});
```

### E2E Tests (Playwright)
```javascript
// Install: npm install --save-dev @playwright/test

test('complete chat flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('input', 'TestUser');
  await page.click('text=Start Chatting');
  // ... more steps
});
```

---

Made with ❤️ by MiniMax Agent
