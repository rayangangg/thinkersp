import { motion } from 'framer-motion';
import { BookOpen, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mindsToFollow, todaysParadigm, trendingTopics, mockUsers } from '../data/paradigm';

export default function RightSidebar() {
  const { setActiveView } = useApp();

  const onlineUsers = mockUsers.filter(u => u.isOnline).slice(0, 5);

  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed right-0 top-0 h-full overflow-y-auto no-scrollbar py-6 px-4 space-y-5"
      style={{
        width: '280px',
        background: 'rgba(10,10,10,0.95)',
        borderLeft: '1px solid rgba(201,168,76,0.08)',
        backdropFilter: 'blur(20px)',
        zIndex: 40,
      }}
    >
      {/* Minds to Follow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
          Minds to Follow
        </h3>
        <div className="space-y-3">
          {mindsToFollow.map((item, i) => (
            <motion.div
              key={item.user.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="relative flex-shrink-0">
                <img src={item.user.avatar} alt={item.user.name}
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ border: '1.5px solid rgba(201,168,76,0.2)' }} />
                {item.user.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border online-dot"
                    style={{ borderColor: '#111111' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate"
                  style={{ fontFamily: '"Playfair Display", serif', color: '#F5F0E8', fontSize: '0.82rem' }}>
                  {item.user.name}
                </p>
                <p className="text-xs truncate"
                  style={{ color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif' }}>
                  {item.mutualFollowers} mutual connections
                </p>
              </div>
              <button className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: '#C9A84C',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.7rem',
                }}>
                Follow
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Today's Paradigm */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(22,22,22,0.9))',
          borderColor: 'rgba(201,168,76,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={12} color="#C9A84C" />
          <h3 className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
            Today's Paradigm
          </h3>
        </div>
        <blockquote className="mb-3"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic',
            fontSize: '0.9rem',
            color: '#F5F0E8',
            lineHeight: 1.6,
          }}>
          "{todaysParadigm.quote}"
        </blockquote>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C9A84C', fontFamily: '"Inter", sans-serif' }}>
              — {todaysParadigm.author}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif' }}>
              {todaysParadigm.source}
            </p>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(201,168,76,0.1)' }}>
            <span style={{ fontSize: '1rem' }}>🪶</span>
          </div>
        </div>
      </motion.div>

      {/* Active Connections */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
          Active Thinkers
        </h3>
        <div className="space-y-3">
          {onlineUsers.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveView('messages')}
            >
              <div className="relative flex-shrink-0">
                <img src={user.avatar} alt={user.name}
                  className="w-8 h-8 rounded-full object-cover transition-all duration-200 group-hover:ring-1"
                  style={{ outline: '1px solid rgba(201,168,76,0.3)' }} />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full online-dot"
                  style={{
                    background: user.isOnline ? '#22c55e' : '#6B7C6A',
                    border: '1.5px solid #111111',
                  }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate transition-colors duration-200 group-hover:text-yellow-400"
                  style={{ fontFamily: '"Playfair Display", serif', color: '#F5F0E8', fontSize: '0.78rem' }}>
                  {user.name}
                </p>
                <p className="text-xs" style={{ color: user.isOnline ? '#22c55e' : 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif', fontSize: '0.65rem' }}>
                  {user.isOnline ? 'Active now' : 'Offline'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trending Articles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={12} color="#C9A84C" />
          <h3 className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
            Trending Topics
          </h3>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic, i) => (
            <motion.div
              key={topic.tag}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center justify-between cursor-pointer group py-1"
            >
              <span className="text-xs transition-colors duration-200 group-hover:text-yellow-400"
                style={{ color: '#F5F0E8', fontFamily: '"Inter", sans-serif', opacity: 0.7 }}>
                {topic.tag}
              </span>
              <span className="text-xs px-2 py-0.5 rounded"
                style={{
                  background: 'rgba(107,124,106,0.15)',
                  border: '1px solid rgba(107,124,106,0.3)',
                  color: '#8FA88E',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.65rem',
                }}>
                {topic.count}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}
