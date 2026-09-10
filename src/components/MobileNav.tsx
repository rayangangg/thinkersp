import { motion } from 'framer-motion';
import { Home, Compass, Bell, User, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'explore', icon: Compass, label: 'Explore' },
  { id: 'composer', icon: Plus, label: 'Post' },
  { id: 'notifications', icon: Bell, label: 'Alerts' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
  const { activeView, setActiveView, setShowComposer, unreadCount } = useApp();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="mobile-nav fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 sm:hidden"
    >
      {tabs.map(({ id, icon: Icon, label }) => {
        const isActive = activeView === id;
        const isComposer = id === 'composer';

        return (
          <button
            key={id}
            onClick={() => {
              if (isComposer) {
                setShowComposer(true);
              } else {
                setActiveView(id);
              }
            }}
            className="relative flex flex-col items-center gap-0.5"
          >
            {isComposer ? (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="fab-gold w-12 h-12 rounded-full flex items-center justify-center -mt-6"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)' }}
              >
                <Plus size={22} color="#0A0A0A" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <>
                <div className="relative flex items-center justify-center w-10 h-8">
                  {isActive && (
                    <motion.div
                      layoutId="mobileTabIndicator"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(201,168,76,0.1)' }}
                    />
                  )}
                  <Icon
                    size={20}
                    color={isActive ? '#C9A84C' : 'rgba(245,240,232,0.4)'}
                    strokeWidth={isActive ? 2 : 1.5}
                    className="relative"
                  />
                  {id === 'notifications' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center badge-pulse"
                      style={{ background: '#8B2E2E', fontSize: '0.5rem', color: '#F5F0E8', fontWeight: 700, fontFamily: '"Inter", sans-serif' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: '0.6rem',
                  fontFamily: '"Inter", sans-serif',
                  color: isActive ? '#C9A84C' : 'rgba(245,240,232,0.4)',
                }}>
                  {label}
                </span>
              </>
            )}
          </button>
        );
      })}
    </motion.div>
  );
}
