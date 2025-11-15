import { useState } from 'react';
import { motion } from 'framer-motion';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export default function MessageBubble({ message, isOwn, onAddReaction }) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'} message-bubble`}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="w-10 h-10 rounded-full border-2 border-primary-blue"
        />
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-md`}>
        {/* Header */}
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-text-primary text-sm font-semibold">
            {message.senderName}
          </span>
          <span className="text-text-secondary text-xs">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>

        {/* Message Bubble */}
        <div className="relative">
          <div
            className={`px-4 py-2 rounded-lg ${
              isOwn
                ? 'bg-primary-blue text-white rounded-tr-sm'
                : 'bg-bg-surface-solid text-text-primary rounded-tl-sm'
            }`}
            style={{
              wordWrap: 'break-word',
              maxWidth: '100%'
            }}
          >
            {message.content}
          </div>

          {/* Reaction Display */}
          {message.reaction && (
            <div className="absolute -bottom-2 right-2 bg-bg-surface-solid border border-border-default rounded-full px-2 py-1 text-xs">
              {message.reaction.emoji}
            </div>
          )}

          {/* Reaction Picker */}
          {showReactions && !isOwn && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-10 left-0 glass rounded-full px-3 py-2 flex gap-2 shadow-lg"
            >
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onAddReaction(message.id, emoji)}
                  className="hover:scale-125 transition-transform text-xl"
                  title={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
