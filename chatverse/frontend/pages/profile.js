import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';

const THEMES = [
  { id: 'dark', name: 'Dark', colors: ['#0A0014', '#00BFFF'] },
  { id: 'neon', name: 'Neon', colors: ['#14000A', '#FF00FF'] },
  { id: 'purple', name: 'Purple', colors: ['#050A18', '#8A2BE2'] },
];

export default function Profile() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('chatverse_username') || 'User';
    const savedTheme = localStorage.getItem('chatverse_theme') || 'dark';
    
    setUsername(savedUsername);
    setSelectedTheme(savedTheme);
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${savedUsername}`);
  }, []);

  const handleSave = () => {
    if (username.trim()) {
      localStorage.setItem('chatverse_username', username);
      localStorage.setItem('chatverse_theme', selectedTheme);
      setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleGenerateNewAvatar = () => {
    const randomSeed = `${username}_${Date.now()}`;
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
  };

  return (
    <>
      <Head>
        <title>Profile - ChatVerse</title>
      </Head>

      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold text-text-primary"
            >
              Profile Settings
            </motion.h1>
            <button
              onClick={() => router.push('/')}
              className="text-text-secondary hover:text-primary-blue transition-colors"
            >
              ← Back to Home
            </button>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-lg p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full border-4 border-primary-blue glow-blue"
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-success rounded-full border-4 border-bg-surface-solid status-online"></div>
                </div>
                <button
                  onClick={handleGenerateNewAvatar}
                  className="text-primary-blue hover:text-blue-400 transition-colors text-sm"
                >
                  Generate New Avatar
                </button>
              </div>

              {/* Settings Section */}
              <div className="flex-1 space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-text-secondary text-sm mb-2 font-semibold">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-bg-surface-solid text-text-primary px-4 py-3 rounded-md border border-border-default focus:border-primary-blue focus:outline-none transition-all"
                    placeholder="Enter username..."
                    maxLength={20}
                  />
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-text-secondary text-sm mb-3 font-semibold">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedTheme === theme.id
                            ? 'border-primary-blue glow-blue'
                            : 'border-border-default hover:border-primary-blue'
                        }`}
                      >
                        <div className="flex gap-2 mb-2">
                          {theme.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="text-text-primary text-sm font-semibold">
                          {theme.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex-1"
                  >
                    {saved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => router.push('/chat')}
                    className="bg-bg-surface-solid text-text-primary px-6 py-3 rounded-md border border-border-default hover:border-primary-blue transition-all"
                  >
                    Go to Chat
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-bg-surface-solid rounded-lg p-4 border border-border-default">
                <div className="text-3xl font-bold text-primary-blue mb-1">
                  {Math.floor(Math.random() * 50)}
                </div>
                <div className="text-text-secondary text-sm">Total Chats</div>
              </div>
              <div className="bg-bg-surface-solid rounded-lg p-4 border border-border-default">
                <div className="text-3xl font-bold text-primary-purple mb-1">
                  {Math.floor(Math.random() * 500)}
                </div>
                <div className="text-text-secondary text-sm">Messages Sent</div>
              </div>
              <div className="bg-bg-surface-solid rounded-lg p-4 border border-border-default">
                <div className="text-3xl font-bold text-primary-pink mb-1">
                  {Math.floor(Math.random() * 100)}
                </div>
                <div className="text-text-secondary text-sm">Connections Made</div>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-lg p-8 mt-6 border-2 border-error"
          >
            <h2 className="text-xl font-bold text-error mb-4">Danger Zone</h2>
            <p className="text-text-secondary text-sm mb-4">
              Clear all your local data and reset your profile
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure? This will clear all your local data.')) {
                  localStorage.clear();
                  router.push('/');
                }
              }}
              className="bg-error text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Clear All Data
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
