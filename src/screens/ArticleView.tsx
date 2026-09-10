import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bookmark, Share2, MessageCircle, Clock, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reactionTypes } from '../data/mockData';

export default function ArticleView() {
  const { selectedPost, setSelectedPost, setActiveView, toggleBookmark } = useApp();
  const [readProgress, setReadProgress] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState(selectedPost?.totalReactions || 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max((scrolled / total) * 100, 0), 100);
      setReadProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!selectedPost) return null;

  const post = selectedPost;

  const handleReact = (type: string) => {
    if (userReaction === type) {
      setUserReaction(null);
      setLocalReactions(p => p - 1);
    } else {
      if (!userReaction) setLocalReactions(p => p + 1);
      setUserReaction(type);
    }
    setShowReactions(false);
  };

  const relatedPosts = [
    {
      title: 'The Geometry of Silence: What We Mean When We Say Nothing',
      author: 'Nikolai Petrov',
      readTime: '6 min',
      img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=200&fit=crop',
    },
    {
      title: 'Montaigne\'s Mirror: Self-Knowledge as Political Act',
      author: 'Eleanor Voss',
      readTime: '9 min',
      img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=200&fit=crop',
    },
    {
      title: 'Against Productivity: The Case for Literary Idleness',
      author: 'Isabelle Marchetti',
      readTime: '7 min',
      img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    },
  ];

  return (
    <div ref={contentRef} className="relative">
      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ width: `${readProgress}%` }} />

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => { setSelectedPost(null); setActiveView('home'); }}
        className="fixed top-4 left-72 z-40 flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-white/10"
        style={{
          background: 'rgba(17,17,17,0.9)',
          border: '1px solid rgba(201,168,76,0.15)',
          backdropFilter: 'blur(12px)',
          color: 'rgba(245,240,232,0.7)',
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.82rem',
        }}
      >
        <ArrowLeft size={14} />
        Back to Feed
      </motion.button>

      {/* Hero Section */}
      <div className="relative" style={{ height: 'clamp(300px, 45vw, 500px)', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '120%', y: readProgress * -0.3 }}
          className="w-full"
        >
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=600&fit=crop"
            alt="Article Hero"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)' }} />
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Category + Tags */}
        {post.category && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="category-badge">{post.category}</span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#F5F0E8',
            lineHeight: 1.2,
            marginBottom: '1.5rem',
          }}
        >
          {post.title || post.content.slice(0, 80) + '...'}
        </motion.h1>

        {/* Author bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-4 mb-8 pb-6"
          style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}
        >
          <div className="story-ring rounded-full" style={{ padding: '2px' }}>
            <img src={post.author.avatar} alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
              style={{ border: '2px solid #0A0A0A' }} />
          </div>
          <div className="flex-1">
            <p style={{ fontFamily: '"Playfair Display", serif', color: '#F5F0E8', fontWeight: 600, fontSize: '1rem' }}>
              {post.author.name}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif' }}>
                {post.timestamp}
              </span>
              {post.readTime && (
                <>
                  <span style={{ color: 'rgba(245,240,232,0.2)' }}>·</span>
                  <div className="flex items-center gap-1">
                    <Clock size={11} color="rgba(201,168,76,0.6)" />
                    <span style={{ fontSize: '0.75rem', color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
                      {post.readTime}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <button className="btn-gold px-4 py-2 rounded-lg text-sm font-medium"
            style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem' }}>
            <span>Follow</span>
          </button>
        </motion.div>

        {/* Article Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="article-body"
          style={{ maxWidth: '720px', margin: '0 auto' }}
        >
          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
            color: 'rgba(245,240,232,0.82)',
            lineHeight: 1.9,
            marginBottom: '1.5rem',
          }}>
            {post.content}
          </p>

          {/* Pull Quote */}
          <div className="pull-quote my-10">
            "The great paradox of the creative life is that its deepest work happens in utter
            solitude, yet its purpose is profound connection."
          </div>

          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
            color: 'rgba(245,240,232,0.82)',
            lineHeight: 1.9,
            marginBottom: '1.5rem',
          }}>
            We retreat to our studies, our notebooks, our 3am thoughts — not to escape humanity,
            but to understand it well enough to speak truth to it. Dostoevsky wrote in prisons.
            Kafka wrote at night. Dickinson rarely left her room. Perhaps the creative mind is
            not antisocial, but pre-social — gathering itself before the offering.
          </p>

          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
            color: 'rgba(245,240,232,0.82)',
            lineHeight: 1.9,
            marginBottom: '1.5rem',
          }}>
            The tradition of the "writer's retreat" is not merely a romantic indulgence but a
            structural necessity. The mind that must constantly perform for an audience cannot
            simultaneously listen to itself with sufficient depth. Every great work of literature
            is, at some level, an act of radical self-attention — a willingness to sit with
            discomfort, ambiguity, and silence long enough for something true to emerge.
          </p>

          {/* Inline image */}
          <div className="my-8 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=400&fit=crop"
              alt="Books"
              className="w-full object-cover"
              style={{ height: '300px' }}
            />
            <p style={{
              fontFamily: '"Inter", sans-serif',
              fontStyle: 'italic',
              fontSize: '0.8rem',
              color: 'rgba(245,240,232,0.4)',
              textAlign: 'center',
              padding: '0.75rem',
            }}>
              The library at dusk — where solitude becomes scholarship.
            </p>
          </div>

          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
            color: 'rgba(245,240,232,0.82)',
            lineHeight: 1.9,
            marginBottom: '1.5rem',
          }}>
            What distinguishes solitude from loneliness is intentionality and, ultimately,
            relationship. The lonely person is separated from others against their will. The
            person in solitude has made a voluntary covenant with silence — and through that
            silence, paradoxically, achieves the deepest kind of communion with the reader
            who will one day encounter their words.
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Tag size={14} color="rgba(201,168,76,0.5)" />
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full cursor-pointer"
                  style={{
                    background: 'rgba(107,124,106,0.12)',
                    border: '1px solid rgba(107,124,106,0.25)',
                    color: '#8FA88E',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.75rem',
                  }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Author Bio Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mt-12 flex gap-5"
          style={{ borderColor: 'rgba(201,168,76,0.15)' }}
        >
          <div className="story-ring rounded-full flex-shrink-0" style={{ padding: '2px', alignSelf: 'start' }}>
            <img src={post.author.avatar} alt={post.author.name}
              className="w-16 h-16 rounded-full object-cover"
              style={{ border: '2px solid #0A0A0A' }} />
          </div>
          <div className="flex-1">
            <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#F5F0E8', fontSize: '1.05rem', marginBottom: '4px' }}>
              {post.author.name}
            </p>
            <p style={{ fontSize: '0.78rem', color: '#C9A84C', fontFamily: '"Inter", sans-serif', marginBottom: '8px' }}>
              {post.author.role}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.6)', fontFamily: '"Inter", sans-serif', lineHeight: 1.6 }}>
              {post.author.bio}
            </p>
            <button className="btn-gold px-4 py-1.5 rounded-lg text-xs font-semibold mt-3"
              style={{ fontFamily: '"Inter", sans-serif' }}>
              <span>Follow this Mind</span>
            </button>
          </div>
        </motion.div>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="mb-6" style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#F5F0E8',
          }}>
            More from the Paradigm
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((rel, i) => (
              <motion.div
                key={rel.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card glass-card-hover overflow-hidden cursor-pointer"
              >
                <img src={rel.img} alt={rel.title} className="w-full object-cover" style={{ height: '140px' }} />
                <div className="p-4">
                  <p style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#F5F0E8',
                    lineHeight: 1.4,
                    marginBottom: '8px',
                  }}>
                    {rel.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.45)', fontFamily: '"Inter", sans-serif' }}>
                      {rel.author}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(201,168,76,0.6)', fontFamily: '"Inter", sans-serif' }}>
                      {rel.readTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Floating Bottom Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-6 py-3 rounded-2xl"
        style={{
          background: 'rgba(17,17,17,0.95)',
          border: '1px solid rgba(201,168,76,0.15)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-white/5"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            <span className="text-lg">{userReaction ? reactionTypes.find(r => r.id === userReaction)?.emoji : '🪶'}</span>
            <span style={{ fontSize: '0.82rem', color: userReaction ? '#C9A84C' : 'rgba(245,240,232,0.6)', fontFamily: '"Inter", sans-serif' }}>
              {localReactions.toLocaleString()}
            </span>
          </button>

          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                className="absolute bottom-full left-0 mb-2 flex items-center gap-1 px-3 py-2 rounded-2xl"
                style={{
                  background: 'rgba(22,22,22,0.98)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  backdropFilter: 'blur(20px)',
                }}
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                {reactionTypes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleReact(r.id)}
                    className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 hover:scale-125 text-xl"
                    title={r.label}
                  >
                    {r.emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-white/5">
          <MessageCircle size={16} color="rgba(245,240,232,0.5)" />
          <span style={{ fontSize: '0.82rem', color: 'rgba(245,240,232,0.6)', fontFamily: '"Inter", sans-serif' }}>
            {post.comments.length}
          </span>
        </button>

        <div className="w-px h-6 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-white/5">
          <Share2 size={16} color="rgba(245,240,232,0.5)" />
        </button>

        <div className="w-px h-6 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <button onClick={() => toggleBookmark(post.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-white/5">
          <Bookmark size={16} color={post.isBookmarked ? '#C9A84C' : 'rgba(245,240,232,0.5)'}
            fill={post.isBookmarked ? '#C9A84C' : 'none'} />
        </button>
      </motion.div>
    </div>
  );
}
