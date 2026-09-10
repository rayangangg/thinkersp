import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, FileText, MessageSquare, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StoriesBar from '../components/StoriesBar';
import PostCard from '../components/PostCard';
import PostComposer from '../components/PostComposer';

export default function HomeFeed() {
  const { posts, currentUser, showComposer, setShowComposer } = useApp();
  const [newPostsBar, setNewPostsBar] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* New posts indicator */}
      <AnimatePresence>
        {newPostsBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-30 px-6 py-2.5 rounded-full cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #A07830)',
              boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
            }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setNewPostsBar(false);
            }}
          >
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#0A0A0A' }}>
              ↑ 3 new thoughts in your feed
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stories */}
      <StoriesBar />

      {/* Post Composer Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-4 cursor-pointer"
        onClick={() => setShowComposer(true)}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="avatar-gold-ring rounded-full flex-shrink-0" style={{ padding: '1.5px' }}>
            <img src={currentUser.avatar} alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover" />
          </div>
          <div
            className="flex-1 px-4 py-2.5 rounded-full cursor-text transition-all duration-200 hover:border-gold"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <span style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              color: 'rgba(245,240,232,0.35)',
              fontSize: '0.9rem',
            }}>
              What's on your mind, Thinker?
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {[
            { icon: Image, label: 'Photo', color: '#6B9BAC' },
            { icon: FileText, label: 'Article', color: '#C9A84C' },
            { icon: MessageSquare, label: 'Thought', color: '#9B8EC4' },
            { icon: Tag, label: 'Tag', color: '#6B7C6A' },
          ].map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              onClick={e => { e.stopPropagation(); setShowComposer(true); }}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200 hover:bg-white/5"
            >
              <Icon size={15} color={color} />
              <span style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.55)', fontFamily: '"Inter", sans-serif' }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Feed Posts */}
      <div>
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>

      {/* Load more indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-3">
          <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
          <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif', letterSpacing: '0.1em' }}>
            END OF TODAY'S PARADIGM
          </span>
          <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
        </div>
      </motion.div>

      {/* Composer Modal */}
      <AnimatePresence>
        {showComposer && <PostComposer onClose={() => setShowComposer(false)} />}
      </AnimatePresence>
    </div>
  );
}
