
import { motion } from 'framer-motion';
import {
  Home, User, Users, Bookmark, BookOpen,
  Bell, MessageSquare, Settings, Hash, Sun, Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { trendingTopics } from '../data/paradigm';

const navItems = [
  { id: 'home', icon: Home, label: 'Home Feed' },
  { id: 'profile', icon: User, label: 'My Profile' },
  { id: 'circles', icon: Users, label: "Thinker's Circle" },
  { id: 'saved', icon: Bookmark, label: 'Saved Pieces' },
  { id: 'reading', icon: BookOpen, label: 'Reading List' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'messages', icon: MessageSquare, label: 'Discourse' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function LeftSidebar() {
  const { currentUser, activeView, setActiveView, lightMode, toggleLightMode, unreadCount } = useApp();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-full flex flex-col overflow-hidden"
      style={{
        width: '260px',
        background: 'rgba(10,10,10,0.95)',
        borderRight: '1px solid rgba(201,168,76,0.08)',
        backdropFilter: 'blur(20px)',
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
            <circle cx="18" cy="16" r="8" stroke="#C9A84C" strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M18 8 Q24 9 26 14 Q28 18 24 21 Q21 24 18 24"
              stroke="#C9A84C" strokeWidth="1.2" fill="none" />
            <path d="M18 8 Q12 9 10 14 Q8 18 12 21 Q15 24 18 24"
              stroke="#C9A84C" strokeWidth="1.2" fill="none" />
            <path d="M18 24 L16.5 31 Q18 33 19.5 31 Z" fill="#C9A84C" opacity="0.8" />
            <circle cx="18" cy="33" r="1" fill="#C9A84C" opacity="0.5" />
          </svg>
        </div>
        <div>
          <p style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '0.85rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2,
          }}>
            The Thinker's<br />Paradigm
          </p>
        </div>
      </div>

      {/* User mini card */}
      <div className="px-4 py-4 mx-3 my-3 rounded-xl cursor-pointer"
        style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}
        onClick={() => setActiveView('profile')}>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="avatar-gold-ring rounded-full" style={{ padding: '2px' }}>
              <img src={currentUser.avatar} alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2"
              style={{ borderColor: '#0A0A0A' }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate"
              style={{ fontFamily: '"Playfair Display", serif', color: '#F5F0E8' }}>
              {currentUser.name}
            </p>
            <p className="text-xs truncate" style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
              {currentUser.role.split('|')[0].trim()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item, i) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          const badge = item.id === 'notifications' && unreadCount > 0 ? unreadCount : null;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
              style={{
                background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                color: isActive ? '#C9A84C' : 'rgba(245,240,232,0.65)',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
              }}
              whileHover={{ x: 3 }}
            >
              <div className="flex-shrink-0 relative">
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              <span className="flex-1">{item.label}</span>
              {badge && (
                <span className="badge-pulse flex-shrink-0 min-w-5 h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: '#8B2E2E', color: '#F5F0E8', fontSize: '0.7rem' }}>
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full"
                  style={{ height: '60%', background: 'linear-gradient(180deg, #C9A84C, #E8C97A)' }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Trending Topics */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(201,168,76,0.06)' }}>
        <p className="text-xs font-semibold mb-3 uppercase tracking-widest"
          style={{ color: 'rgba(201,168,76,0.5)', fontFamily: '"Inter", sans-serif' }}>
          Trending
        </p>
        <div className="space-y-2">
          {trendingTopics.slice(0, 4).map((topic, i) => (
            <motion.button
              key={topic.tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="w-full flex items-center justify-between group hover:opacity-100 transition-opacity"
              style={{ opacity: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <Hash size={10} color="#C9A84C" />
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: '"Inter", sans-serif',
                  color: '#F5F0E8',
                }}>
                  {topic.tag.replace('#', '')}
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif' }}>
                {topic.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Light/Dark toggle */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(201,168,76,0.06)' }}>
        <button
          onClick={toggleLightMode}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200"
          style={{
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid rgba(201,168,76,0.1)',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', fontFamily: '"Inter", sans-serif' }}>
            {lightMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <div className="flex items-center gap-2">
            {lightMode ? <Moon size={14} color="#C9A84C" /> : <Sun size={14} color="#C9A84C" />}
          </div>
        </button>
      </div>
    </motion.aside>
  );
}
