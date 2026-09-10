import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';

export default function SavedPage() {
  const { posts } = useApp();
  const savedPosts = posts.filter(p => p.isBookmarked);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <Bookmark size={18} color="#C9A84C" />
        </div>
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#F5F0E8',
            }}
          >
            Saved Pieces
          </motion.h1>
          <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: 'rgba(245,240,232,0.4)', fontSize: '0.82rem' }}>
            {savedPosts.length} piece{savedPosts.length !== 1 ? 's' : ''} saved for later contemplation
          </p>
        </div>
      </div>

      {savedPosts.length > 0 ? (
        savedPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="text-4xl mb-4">🔖</div>
          <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: 'rgba(245,240,232,0.4)', fontSize: '1.1rem' }}>
            Your reading list awaits its first thought.
          </p>
          <p className="mt-2" style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: 'rgba(245,240,232,0.25)' }}>
            Bookmark articles and thoughts to save them here.
          </p>
        </motion.div>
      )}
    </div>
  );
}
