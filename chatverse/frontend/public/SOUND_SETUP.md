# Notification Sound

## Adding a Notification Sound

To add a notification sound to ChatVerse:

### Option 1: Use a Free Sound (Recommended)

1. Download a free notification sound from:
   - [Freesound.org](https://freesound.org)
   - [Zapsplat.com](https://zapsplat.com)
   - [Notification Sounds](https://notificationsounds.com)

2. Rename it to `notification.mp3`

3. Place it in the `frontend/public/` directory

### Option 2: Use a Simple Beep Sound

Create a simple beep using the Web Audio API (no file needed):

In `pages/chat.js`, replace the audio element with:

```javascript
const playNotificationSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};
```

### Option 3: Discord-like Sound

For a Discord-like notification sound, search for "Discord notification sound" on YouTube or sound libraries and download it.

### Current Implementation

The code references `/notification.mp3` in the public folder:

```javascript
<audio ref={audioRef} src="/notification.mp3" preload="auto" />
```

If you don't add a sound file, the notification feature will simply not play audio (but won't break the app).

### Testing Sound

1. Place your sound file in `frontend/public/notification.mp3`
2. Start the frontend: `npm run dev`
3. When you receive a message, the sound should play
4. Check browser console for any audio errors

### Browser Permissions

Modern browsers may block auto-play audio. The sound will only play after user interaction (clicking, typing, etc.)

---

## Alternative: Use Howler.js

For better audio control, install Howler.js:

```bash
npm install howler
```

Then use it in your code:

```javascript
import { Howl } from 'howler';

const sound = new Howl({
  src: ['/notification.mp3'],
  volume: 0.5,
  preload: true
});

const playNotificationSound = () => {
  sound.play();
};
```

This provides better browser compatibility and control over audio playback.
