import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from '@/components/MessageBubble';
import Sidebar from '@/components/Sidebar';
import UserPanel from '@/components/UserPanel';
import TypingIndicator from '@/components/TypingIndicator';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function Chat() {
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const audioRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket and user
  useEffect(() => {
    const savedUsername = localStorage.getItem('chatverse_username');
    if (!savedUsername) {
      router.push('/');
      return;
    }

    setUsername(savedUsername);
    
    // Generate avatar URL
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedUsername}`;
    setAvatar(avatarUrl);

    // Initialize socket
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Register user
    newSocket.emit('register', {
      username: savedUsername,
      avatar: avatarUrl
    });

    // Socket event listeners
    newSocket.on('registered', (data) => {
      console.log('Registered:', data);
    });

    newSocket.on('searching', (data) => {
      console.log(data.message);
    });

    newSocket.on('matched', (data) => {
      console.log('Matched!', data);
      setRoomId(data.roomId);
      setPartner(data.partner);
      setIsSearching(false);
      setMessages([{
        id: 'system_match',
        content: `You are now connected with ${data.partner.username}`,
        type: 'system',
        timestamp: Date.now()
      }]);
      playNotificationSound();
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      if (message.senderId !== newSocket.id) {
        playNotificationSound();
      }
    });

    newSocket.on('user_typing', (data) => {
      setPartnerTyping(data.isTyping);
    });

    newSocket.on('reaction_added', (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, reaction: { emoji: data.emoji, username: data.username } }
          : msg
      ));
    });

    newSocket.on('chat_ended', (data) => {
      setMessages(prev => [...prev, {
        id: `system_end_${Date.now()}`,
        content: data.message,
        type: 'system',
        timestamp: Date.now()
      }]);
      
      setTimeout(() => {
        handleEndChat(true);
      }, 2000);
    });

    newSocket.on('force_disconnect', (data) => {
      alert(data.message);
      router.push('/');
    });

    newSocket.on('banned', (data) => {
      alert(data.message);
      router.push('/');
    });

    newSocket.on('error', (data) => {
      alert(data.message);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const handleFindChat = () => {
    if (socket && !roomId) {
      setIsSearching(true);
      socket.emit('find_chat', { username, avatar });
    }
  };

  const handleCancelSearch = () => {
    if (socket) {
      socket.emit('cancel_search');
      setIsSearching(false);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !roomId || !socket) return;

    socket.emit('send_message', {
      roomId,
      message: messageInput
    });

    setMessageInput('');
    
    // Stop typing indicator
    if (isTyping) {
      socket.emit('typing', { roomId, isTyping: false });
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    if (!socket || !roomId) return;

    // Start typing indicator
    if (!isTyping && e.target.value.length > 0) {
      socket.emit('typing', { roomId, isTyping: true });
      setIsTyping(true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { roomId, isTyping: false });
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddReaction = (messageId, emoji) => {
    if (socket && roomId) {
      socket.emit('add_reaction', { roomId, messageId, emoji });
    }
  };

  const handleEndChat = (skipEmit = false) => {
    if (socket && roomId && !skipEmit) {
      socket.emit('end_chat', { roomId });
    }
    
    setRoomId(null);
    setPartner(null);
    setMessages([]);
    setIsSearching(false);
    setPartnerTyping(false);
  };

  return (
    <>
      <Head>
        <title>Chat - ChatVerse</title>
      </Head>

      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="h-screen flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar 
          onFindChat={handleFindChat}
          onSettings={() => router.push('/profile')}
          onHome={() => router.push('/')}
          isSearching={isSearching}
          isInChat={!!roomId}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="glass border-b border-border-default p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {partner ? (
                <>
                  <div className="relative">
                    <img 
                      src={partner.avatar} 
                      alt={partner.username}
                      className="w-10 h-10 rounded-full border-2 border-success"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-bg-surface-solid status-online"></div>
                  </div>
                  <div>
                    <div className="text-text-primary font-semibold">{partner.username}</div>
                    <div className="text-text-secondary text-xs">{partner.status}</div>
                  </div>
                </>
              ) : (
                <div className="text-text-secondary">
                  {isSearching ? 'Searching for a partner...' : 'No active chat'}
                </div>
              )}
            </div>

            {roomId && (
              <button
                onClick={() => handleEndChat()}
                className="bg-error text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                End Chat
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!roomId && !isSearching ? (
              <div className="h-full flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-2xl text-text-primary font-semibold mb-2">
                    Ready to chat?
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Click "Find New Chat" to get started
                  </p>
                </motion.div>
              </div>
            ) : isSearching ? (
              <div className="h-full flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="spinner mx-auto mb-4"></div>
                  <h3 className="text-xl text-text-primary font-semibold mb-2">
                    Finding someone for you...
                  </h3>
                  <button
                    onClick={handleCancelSearch}
                    className="text-text-secondary hover:text-primary-blue transition-colors"
                  >
                    Cancel
                  </button>
                </motion.div>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {messages.map((message) => (
                    message.type === 'system' ? (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-text-secondary text-sm py-2"
                      >
                        {message.content}
                      </motion.div>
                    ) : (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={socket?.id === message.senderId}
                        onAddReaction={handleAddReaction}
                      />
                    )
                  ))}
                </AnimatePresence>
                
                {partnerTyping && <TypingIndicator username={partner?.username} />}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          {roomId && (
            <div className="glass border-t border-border-default p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-bg-surface-solid text-text-primary px-4 py-3 rounded-md border border-border-default focus:border-primary-blue focus:outline-none transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-primary-blue text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:glow-blue"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right User Panel */}
        {showUserPanel && partner && (
          <UserPanel 
            user={partner}
            onClose={() => setShowUserPanel(false)}
          />
        )}
      </div>
    </>
  );
}
