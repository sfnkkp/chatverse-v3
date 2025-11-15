import { motion } from 'framer-motion';

export default function UserPanel({ user, onClose }) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-80 glass border-l border-border-default p-6"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* User Info */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-24 h-24 rounded-full border-4 border-primary-blue glow-blue mx-auto"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-4 border-bg-surface-solid status-online"></div>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-1">
          {user.username}
        </h2>
        <p className="text-text-secondary text-sm capitalize">{user.status}</p>
      </div>

      {/* User Stats */}
      <div className="bg-bg-surface-solid rounded-lg p-4 mb-4">
        <div className="text-text-secondary text-xs uppercase tracking-wide mb-3">
          User Info
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Status</span>
            <span className="text-success text-sm font-semibold">Online</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Chatting</span>
            <span className="text-text-primary text-sm font-semibold">Yes</span>
          </div>
        </div>
      </div>

      {/* Random Facts */}
      <div className="bg-bg-surface-solid rounded-lg p-4">
        <div className="text-text-secondary text-xs uppercase tracking-wide mb-3">
          About
        </div>
        <p className="text-text-primary text-sm">
          Anonymous user enjoying random conversations on ChatVerse.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-2">
        <button className="w-full bg-warning text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-semibold">
          Report User
        </button>
        <button className="w-full bg-error text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold">
          Block User
        </button>
      </div>
    </motion.div>
  );
}
