import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockStories, currentUser } from '../data/mockData';
import { Story } from '../data/mockData';

const bgStyles: Record<string, React.CSSProperties> = {
  gold: { background: 'linear-gradient(135deg, #1a1200, #2a1f00, #1a1200)' },
  blue: { background: 'linear-gradient(135deg, #0a0f1a, #0f1a2e, #0a0f1a)' },
  red: { background: 'linear-gradient(135deg, #1a0606, #2e0f0f, #1a0606)' },
  green: { background: 'linear-gradient(135deg, #061a0a, #0f2e14, #061a0a)' },
};

function StoryBubble({ story, index, onClick }: { story: Story; index: number; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 300 }}
      onClick={onClick}
      className="flex-shrink-0 flex flex-col items-center gap-2 group"
    >
      <div className={`relative ${!story.viewed ? 'story-ring' : ''}`}
        style={story.viewed ? {
          padding: '2px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        } : { padding: '2px', borderRadius: '50%' }}>
        <div className="rounded-full overflow-hidden w-14 h-14"
          style={{ background: '#111', border: '2px solid #0A0A0A' }}>
          <img src={story.author.avatar} alt={story.author.name}
            className="w-full h-full object-cover" />
        </div>
      </div>
      <span className="text-center leading-tight"
        style={{
          fontSize: '0.65rem',
          color: story.viewed ? 'rgba(245,240,232,0.4)' : 'rgba(245,240,232,0.8)',
          fontFamily: '"Inter", sans-serif',
          maxWidth: '60px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
        {story.author.name.split(' ')[0]}
      </span>
    </motion.button>
  );
}

function StoryViewer({ stories, startIndex, onClose }: {
  stories: Story[]; startIndex: number; onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const story = stories[currentIndex];

  const goNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex(i => i + 1);
    else onClose();
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const bg = story.bgColor ? bgStyles[story.bgColor] || bgStyles.gold : bgStyles.gold;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.95)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-sm h-screen sm:h-auto sm:max-h-[85vh] sm:rounded-2xl overflow-hidden"
        style={{ ...bg, aspectRatio: '9/16', maxHeight: '600px' }}
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              {i < currentIndex && (
                <div className="h-full w-full" style={{ background: '#C9A84C' }} />
              )}
              {i === currentIndex && (
                <div className="h-full story-progress-bar" style={{ background: '#C9A84C' }} />
              )}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-10 left-4 right-4 flex items-center gap-3 z-10">
          <img src={story.author.avatar} alt={story.author.name}
            className="w-8 h-8 rounded-full object-cover"
            style={{ border: '2px solid #C9A84C' }} />
          <div className="flex-1">
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F5F0E8', fontFamily: '"Inter", sans-serif' }}>
              {story.author.name}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.5)', fontFamily: '"Inter", sans-serif' }}>
              {story.timestamp}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            <X size={16} color="#F5F0E8" />
          </button>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <p style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            fontStyle: 'italic',
            color: '#F5F0E8',
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            "{story.content}"
          </p>
        </div>

        {/* Gold accent */}
        <div className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(transparent, rgba(201,168,76,0.05))' }} />

        {/* Nav buttons */}
        <button onClick={goPrev} disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-opacity"
          style={{ background: 'rgba(0,0,0,0.4)', opacity: currentIndex === 0 ? 0.3 : 1 }}>
          <ChevronLeft size={20} color="#F5F0E8" />
        </button>
        <button onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          <ChevronRight size={20} color="#F5F0E8" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function StoriesBar() {
  const [viewingStory, setViewingStory] = useState<number | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 mb-4"
      >
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          {/* Add story bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(201,168,76,0.08)',
                border: '2px dashed rgba(201,168,76,0.4)',
              }}>
              <img src={currentUser.avatar} alt="You"
                className="w-10 h-10 rounded-full object-cover opacity-60" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #A07830)' }}>
                <Plus size={11} color="#0A0A0A" strokeWidth={3} />
              </div>
            </div>
            <span style={{
              fontSize: '0.65rem',
              color: 'rgba(201,168,76,0.7)',
              fontFamily: '"Inter", sans-serif',
              maxWidth: '60px',
              textAlign: 'center',
            }}>
              Add Thought
            </span>
          </motion.div>

          {/* Story bubbles */}
          {mockStories.map((story, i) => (
            <StoryBubble
              key={story.id}
              story={story}
              index={i}
              onClick={() => setViewingStory(i)}
            />
          ))}
        </div>
      </motion.div>

      {/* Story Viewer */}
      <AnimatePresence>
        {viewingStory !== null && (
          <StoryViewer
            stories={mockStories}
            startIndex={viewingStory}
            onClose={() => setViewingStory(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
