import { motion } from 'framer-motion';
import { Search, Bell, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TopBar() {
  const { setActiveView, unreadCount } = useApp();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sm:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
      style={{
        background: 'rgba(10,10,10,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,168,76,0.08)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
          <circle cx="14" cy="12" r="6.5" stroke="#C9A84C" strokeWidth="1.2" fill="none" opacity="0.7" />
          <path d="M14 5.5 Q19 6.5 21 10 Q23 14 19 17 Q17 19 14 19"
            stroke="#C9A84C" strokeWidth="1.2" fill="none" />
          <path d="M14 5.5 Q9 6.5 7 10 Q5 14 9 17 Q11 19 14 19"
            stroke="#C9A84C" strokeWidth="1.2" fill="none" />
          <path d="M14 19 L12.5 26 Q14 27.5 15.5 26 Z" fill="#C9A84C" opacity="0.8" />
        </svg>
        <span style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '0.95rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          The Thinker's Paradigm
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveView('explore')}
          className="p-2 rounded-xl transition-all hover:bg-white/5"
        >
          <Search size={19} color="rgba(245,240,232,0.6)" />
        </button>
        <button
          onClick={() => setActiveView('notifications')}
          className="relative p-2 rounded-xl transition-all hover:bg-white/5"
        >
          <Bell size={19} color="rgba(245,240,232,0.6)" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full badge-pulse"
              style={{ background: '#8B2E2E' }} />
          )}
        </button>
        <button
          onClick={() => setActiveView('messages')}
          className="p-2 rounded-xl transition-all hover:bg-white/5"
        >
          <MessageSquare size={19} color="rgba(245,240,232,0.6)" />
        </button>
      </div>
    </motion.header>
  );
}
