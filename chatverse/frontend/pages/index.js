import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    // Generate random username if not set
    const savedUsername = localStorage.getItem('chatverse_username');
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      const randomUsername = `User${Math.floor(Math.random() * 10000)}`;
      setUsername(randomUsername);
    }
  }, []);

  const handleStartChat = () => {
    if (username.trim()) {
      localStorage.setItem('chatverse_username', username);
      setIsEntering(true);
      setTimeout(() => {
        router.push('/chat');
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleStartChat();
    }
  };

  return (
    <>
      <Head>
        <title>ChatVerse - Connect with Strangers Instantly</title>
        <meta name="description" content="Random text chat with strangers in a futuristic interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl w-full"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-7xl font-bold mb-2 bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink bg-clip-text text-transparent">
              ChatVerse
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary-blue to-primary-purple rounded-full glow-blue"></div>
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-6xl font-bold mb-6 text-text-primary" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
              Start Chatting
            </h2>
            <p className="text-xl text-text-secondary font-normal">
              Connect with strangers instantly.
            </p>
          </motion.div>

          {/* Username Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8"
          >
            <div className="glass rounded-lg p-8 max-w-md mx-auto">
              <label className="block text-left text-text-secondary text-sm mb-2 font-semibold">
                Choose your username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-bg-surface-solid text-text-primary px-4 py-3 rounded-md border border-border-default focus:border-primary-blue focus:outline-none transition-all h-12"
                placeholder="Enter username..."
                maxLength={20}
              />
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button
              onClick={handleStartChat}
              disabled={!username.trim() || isEntering}
              className={`btn-primary h-14 px-12 text-lg ${isEntering ? 'opacity-50' : ''}`}
            >
              {isEntering ? 'Entering...' : 'Start Chatting'}
            </button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="glass rounded-lg p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-text-primary font-semibold mb-2">Instant Match</h3>
              <p className="text-text-secondary text-sm">Get connected with someone in seconds</p>
            </div>
            <div className="glass rounded-lg p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-text-primary font-semibold mb-2">Anonymous</h3>
              <p className="text-text-secondary text-sm">Chat safely without revealing identity</p>
            </div>
            <div className="glass rounded-lg p-6">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="text-text-primary font-semibold mb-2">Global</h3>
              <p className="text-text-secondary text-sm">Connect with people worldwide</p>
            </div>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 text-text-secondary text-sm"
          >
            <button
              onClick={() => router.push('/profile')}
              className="hover:text-primary-blue transition-colors mx-3"
            >
              Profile
            </button>
            <span className="text-border-default">|</span>
            <button
              onClick={() => router.push('/admin')}
              className="hover:text-primary-blue transition-colors mx-3"
            >
              Admin
            </button>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
