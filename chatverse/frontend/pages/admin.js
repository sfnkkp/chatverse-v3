import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Admin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [stats, setStats] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      loadDashboardData(savedToken);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        loadDashboardData(token);
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  const loadDashboardData = async (authToken) => {
    try {
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      };

      const [statsRes, chatsRes, usersRes, logsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/chats`, { headers }),
        fetch(`${API_URL}/api/admin/users`, { headers }),
        fetch(`${API_URL}/api/admin/logs?limit=50`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (chatsRes.ok) setActiveChats(await chatsRes.json());
      if (usersRes.ok) setActiveUsers(await usersRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        loadDashboardData(data.token);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setToken('');
  };

  const handleDisconnect = async (socketId) => {
    if (!confirm('Disconnect this user?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ socketId })
      });

      const data = await response.json();
      if (data.success) {
        alert('User disconnected');
        loadDashboardData(token);
      }
    } catch (err) {
      alert('Failed to disconnect user');
    }
  };

  const handleBan = async (ip, socketId) => {
    if (!confirm(`Ban IP ${ip}?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/ban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip, socketId })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        loadDashboardData(token);
      }
    } catch (err) {
      alert('Failed to ban user');
    }
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - ChatVerse</title>
        </Head>

        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-lg p-8 max-w-md w-full"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Admin Panel
              </h1>
              <p className="text-text-secondary">ChatVerse Management</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-bg-surface-solid text-text-primary px-4 py-3 rounded-md border border-border-default focus:border-primary-blue focus:outline-none"
                  placeholder="admin"
                  required
                />
              </div>

              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-surface-solid text-text-primary px-4 py-3 rounded-md border border-border-default focus:border-primary-blue focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-error text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-text-secondary hover:text-primary-blue transition-colors text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - ChatVerse</title>
      </Head>

      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-text-primary mb-2">
                Admin Dashboard
              </h1>
              <p className="text-text-secondary">
                Real-time monitoring and management
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="text-text-secondary hover:text-primary-blue transition-colors"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="bg-error text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-lg p-6 border-l-4 border-primary-blue"
              >
                <div className="text-3xl font-bold text-primary-blue mb-2">
                  {stats.totalUsers}
                </div>
                <div className="text-text-secondary text-sm">Active Users</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-lg p-6 border-l-4 border-primary-purple"
              >
                <div className="text-3xl font-bold text-primary-purple mb-2">
                  {stats.totalChats}
                </div>
                <div className="text-text-secondary text-sm">Active Chats</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-lg p-6 border-l-4 border-success"
              >
                <div className="text-3xl font-bold text-success mb-2">
                  {stats.queueSize}
                </div>
                <div className="text-text-secondary text-sm">In Queue</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-lg p-6 border-l-4 border-error"
              >
                <div className="text-3xl font-bold text-error mb-2">
                  {stats.bannedCount}
                </div>
                <div className="text-text-secondary text-sm">Banned IPs</div>
              </motion.div>
            </div>
          )}

          {/* Tabs */}
          <div className="glass rounded-lg mb-6">
            <div className="flex border-b border-border-default">
              {['overview', 'users', 'chats', 'logs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-semibold transition-colors capitalize ${
                    activeTab === tab
                      ? 'text-primary-blue border-b-2 border-primary-blue'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-lg p-6"
          >
            {activeTab === 'overview' && stats && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">
                    System Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-bg-surface-solid rounded-lg p-4 border border-border-default">
                      <div className="text-text-secondary text-sm mb-1">
                        Total Messages
                      </div>
                      <div className="text-2xl font-bold text-text-primary">
                        {stats.totalMessages}
                      </div>
                    </div>
                    <div className="bg-bg-surface-solid rounded-lg p-4 border border-border-default">
                      <div className="text-text-secondary text-sm mb-1">
                        Avg Chat Duration
                      </div>
                      <div className="text-2xl font-bold text-text-primary">
                        {formatDuration(stats.avgChatDuration * 1000)}
                      </div>
                    </div>
                    <div className="bg-bg-surface-solid rounded-lg p-4 border border-border-default">
                      <div className="text-text-secondary text-sm mb-1">
                        Server Uptime
                      </div>
                      <div className="text-2xl font-bold text-text-primary">
                        {formatDuration(stats.uptime * 1000)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  Active Users ({activeUsers.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-default">
                        <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">
                          Username
                        </th>
                        <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">
                          Socket ID
                        </th>
                        <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">
                          IP Address
                        </th>
                        <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">
                          Duration
                        </th>
                        <th className="text-left py-3 px-4 text-text-secondary text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeUsers.map((user) => (
                        <tr
                          key={user.socketId}
                          className="border-b border-border-default hover:bg-bg-surface-solid transition-colors"
                        >
                          <td className="py-3 px-4 text-text-primary">
                            {user.username}
                          </td>
                          <td className="py-3 px-4 text-text-secondary text-sm font-mono">
                            {user.socketId.substring(0, 8)}...
                          </td>
                          <td className="py-3 px-4 text-text-secondary text-sm">
                            {user.ip}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              user.roomId ? 'bg-success text-white' : 'bg-warning text-white'
                            }`}>
                              {user.roomId ? 'In Chat' : 'Idle'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-text-secondary text-sm">
                            {formatDuration(user.duration)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDisconnect(user.socketId)}
                                className="text-warning hover:text-yellow-400 transition-colors text-sm"
                              >
                                Kick
                              </button>
                              <button
                                onClick={() => handleBan(user.ip, user.socketId)}
                                className="text-error hover:text-red-400 transition-colors text-sm"
                              >
                                Ban
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'chats' && (
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  Active Chats ({activeChats.length})
                </h3>
                <div className="space-y-4">
                  {activeChats.map((chat) => (
                    <div
                      key={chat.roomId}
                      className="bg-bg-surface-solid rounded-lg p-4 border border-border-default"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-text-primary font-semibold mb-1">
                            Room: {chat.roomId.substring(0, 12)}...
                          </div>
                          <div className="text-text-secondary text-sm">
                            Duration: {formatDuration(chat.duration)} | Messages: {chat.messageCount}
                          </div>
                        </div>
                        <div className="text-success text-sm">Active</div>
                      </div>
                      <div className="flex gap-4">
                        {chat.users.map((user, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-text-primary text-sm">
                              {user.username}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {activeChats.length === 0 && (
                    <div className="text-center text-text-secondary py-8">
                      No active chats
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  Recent Logs ({logs.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.slice().reverse().map((log, idx) => (
                    <div
                      key={idx}
                      className="bg-bg-surface-solid rounded p-3 border border-border-default text-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-primary-blue font-mono">
                          {log.type}
                        </span>
                        <span className="text-text-secondary text-xs">
                          {log.timestamp}
                        </span>
                      </div>
                      <div className="text-text-secondary font-mono text-xs">
                        {JSON.stringify(log.data)}
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-center text-text-secondary py-8">
                      No logs available
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
