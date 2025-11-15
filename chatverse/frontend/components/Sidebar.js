import { motion } from 'framer-motion';

export default function Sidebar({ onFindChat, onSettings, onHome, isSearching, isInChat }) {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-72 glass border-r border-border-default flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border-default">
        <button
          onClick={onHome}
          className="text-2xl font-bold bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          ChatVerse
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <button
          onClick={onFindChat}
          disabled={isSearching || isInChat}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
            isSearching || isInChat
              ? 'bg-bg-surface-solid text-text-secondary cursor-not-allowed'
              : 'hover:bg-primary-blue hover:text-white text-text-primary'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="font-semibold">
            {isSearching ? 'Searching...' : isInChat ? 'In Chat' : 'Find New Chat'}
          </span>
        </button>

        <button
          onClick={onSettings}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-bg-surface-solid text-text-primary transition-all flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-semibold">Settings</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border-default">
        <div className="bg-bg-surface-solid rounded-lg p-3">
          <div className="text-text-secondary text-xs mb-2">Quick Tips</div>
          <ul className="text-text-secondary text-xs space-y-1">
            <li>• Press Enter to send messages</li>
            <li>• Hover messages to react</li>
            <li>• Stay respectful and friendly</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
