import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { mockCircles } from '../data/paradigm';

export default function CirclesPage() {
  const [circles, setCircles] = useState(mockCircles);

  const toggleJoin = (id: string) => {
    setCircles(prev => prev.map(c =>
      c.id === id ? { ...c, isJoined: !c.isJoined } : c
    ));
  };



  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          fontWeight: 800,
          color: '#F5F0E8',
          marginBottom: '8px',
        }}
      >
        Thinker's Circles
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
        style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          color: 'rgba(245,240,232,0.45)',
          fontSize: '0.95rem',
        }}
      >
        Curated communities for the life of the mind.
      </motion.p>

      {/* Your Circles */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} color="#C9A84C" />
          <h2 className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
            Your Circles
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {circles.filter(c => c.isJoined).map((circle, i) => (
            <CircleCard key={circle.id} circle={circle} index={i} onToggleJoin={toggleJoin} />
          ))}
        </div>
      </div>

      {/* Discover */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} color="#C9A84C" />
          <h2 className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
            Discover More Circles
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {circles.filter(c => !c.isJoined).map((circle, i) => (
            <CircleCard key={circle.id} circle={circle} index={i} onToggleJoin={toggleJoin} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CircleCard({ circle, index, onToggleJoin }: {
  circle: typeof mockCircles[0];
  index: number;
  onToggleJoin: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card glass-card-hover overflow-hidden cursor-pointer"
    >
      {/* Cover */}
      <div className="relative" style={{ height: '130px' }}>
        <img src={circle.cover} alt={circle.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(10,10,10,0.85) 100%)' }} />
        <div className="absolute bottom-3 left-4">
          <span className="category-badge">{circle.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1.5" style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#F5F0E8',
        }}>
          {circle.name}
        </h3>
        <p className="mb-3 leading-relaxed" style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.78rem',
          color: 'rgba(245,240,232,0.5)',
          lineHeight: 1.5,
        }}>
          {circle.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.45)', fontFamily: '"Inter", sans-serif' }}>
              <span style={{ color: '#C9A84C', fontWeight: 600 }}>{circle.members.toLocaleString()}</span> members
            </p>
            <p style={{ fontSize: '0.68rem', color: '#6B7C6A', fontFamily: '"Inter", sans-serif', marginTop: '2px' }}>
              {circle.recentActivity}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleJoin(circle.id); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${circle.isJoined ? 'btn-ghost' : 'btn-gold'}`}
            style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem' }}
          >
            {circle.isJoined ? <span>✓ Joined</span> : <span>Join</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
