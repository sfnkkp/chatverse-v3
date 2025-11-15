import { motion } from 'framer-motion';

export default function TypingIndicator({ username }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3"
    >
      <div className="w-10 h-10" /> {/* Spacer for avatar alignment */}
      <div className="bg-bg-surface-solid px-4 py-3 rounded-lg rounded-tl-sm">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">{username} is typing</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary-blue rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-primary-blue rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-primary-blue rounded-full typing-dot"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
