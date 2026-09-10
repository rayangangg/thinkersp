import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Notification } from '../data/paradigm';

const filterTabs = ['All', 'Appreciations', 'Comments', 'Follows', 'Mentions'];

const typeIcons: Record<string, string> = {
  appreciation: '🪶',
  comment: '💬',
  follow: '👤',
  mention: '@',
  share: '↗',
};

const typeBg: Record<string, string> = {
  appreciation: 'rgba(201,168,76,0.15)',
  comment: 'rgba(107,124,106,0.15)',
  follow: 'rgba(100,130,160,0.15)',
  mention: 'rgba(139,46,46,0.15)',
  share: 'rgba(155,142,196,0.15)',
};

const typeBorder: Record<string, string> = {
  appreciation: 'rgba(201,168,76,0.3)',
  comment: 'rgba(107,124,106,0.3)',
  follow: 'rgba(100,130,160,0.3)',
  mention: 'rgba(139,46,46,0.3)',
  share: 'rgba(155,142,196,0.3)',
};

function NotificationItem({ notif, index }: { notif: Notification; index: number }) {
  const [removed, setRemoved] = useState(false);

  if (removed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative flex items-start gap-3 p-4 rounded-xl cursor-pointer group transition-all duration-200 hover:bg-white/3"
      style={{
        borderLeft: !notif.read ? `2px solid rgba(201,168,76,0.5)` : '2px solid transparent',
        background: !notif.read ? 'rgba(201,168,76,0.03)' : 'transparent',
      }}
    >
      {/* Avatar with type badge */}
      <div className="relative flex-shrink-0">
        <img src={notif.actor.avatar} alt={notif.actor.name}
          className="w-11 h-11 rounded-full object-cover"
          style={{ border: '1.5px solid rgba(201,168,76,0.2)' }} />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
          style={{
            background: typeBg[notif.type],
            border: `1px solid ${typeBorder[notif.type]}`,
          }}>
          {typeIcons[notif.type]}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.85rem',
          color: 'rgba(245,240,232,0.85)',
          lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 600, color: '#F5F0E8', fontFamily: '"Playfair Display", serif' }}>
            {notif.actor.name}
          </span>{' '}
          {notif.message}
          {notif.target && (
            <span style={{ color: '#C9A84C' }}> "{notif.target}"</span>
          )}
        </p>
        <p className="mt-1" style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.35)', fontFamily: '"Inter", sans-serif' }}>
          {notif.timestamp}
        </p>
      </div>

      {/* Unread dot */}
      {!notif.read && (
        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full mt-2 gold-pulse"
          style={{ background: '#C9A84C' }} />
      )}

      {/* Hover actions */}
      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); setRemoved(true); }}
          className="px-2 py-0.5 rounded text-xs transition-all hover:bg-white/10"
          style={{ color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif', fontSize: '0.65rem', background: 'rgba(0,0,0,0.5)' }}
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const { notifications, markNotificationsRead, unreadCount } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    const map: Record<string, string> = {
      Appreciations: 'appreciation',
      Comments: 'comment',
      Follows: 'follow',
      Mentions: 'mention',
    };
    return n.type === map[activeFilter];
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800,
            color: '#F5F0E8',
          }}
        >
          Notifications
          {unreadCount > 0 && (
            <span className="ml-3 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm badge-pulse"
              style={{ background: '#8B2E2E', color: '#F5F0E8', fontSize: '0.72rem', fontFamily: '"Inter", sans-serif', fontWeight: 600, verticalAlign: 'middle' }}>
              {unreadCount}
            </span>
          )}
        </motion.h1>
        {unreadCount > 0 && (
          <button
            onClick={markNotificationsRead}
            className="text-xs font-medium transition-colors hover:text-yellow-300"
            style={{ color: '#C9A84C', fontFamily: '"Inter", sans-serif', fontSize: '0.78rem' }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar mb-6 pb-1">
        {filterTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: activeFilter === tab ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeFilter === tab ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.07)'}`,
              color: activeFilter === tab ? '#C9A84C' : 'rgba(245,240,232,0.5)',
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.8rem',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="glass-card overflow-hidden">
        <AnimatePresence>
          {filtered.length > 0 ? (
            filtered.map((notif, i) => (
              <div key={notif.id}>
                <NotificationItem notif={notif} index={i} />
                {i < filtered.length - 1 && (
                  <div className="mx-4" style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />
                )}
              </div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🪶</p>
              <p style={{
                fontFamily: '"Playfair Display", serif',
                fontStyle: 'italic',
                color: 'rgba(245,240,232,0.4)',
                fontSize: '1rem',
              }}>
                The silence of no notifications.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
