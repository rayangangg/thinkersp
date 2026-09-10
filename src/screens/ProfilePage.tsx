import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Link as LinkIcon, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PostCard from '../components/PostCard';

const tabs = ['Posts', 'Articles', 'Photos', 'Saved', 'About'];

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

export default function ProfilePage() {
  const { currentUser, posts } = useApp();
  const [activeTab, setActiveTab] = useState('Posts');
  const [following, setFollowing] = useState(false);

  const handleFollow = () => {
    setFollowing(!following);
  };

  const userPosts = posts.filter(p => p.author.id === currentUser.id);
  const savedPosts = posts.filter(p => p.isBookmarked);

  const stats = [
    { label: 'Articles', value: currentUser.articles },
    { label: 'Followers', value: currentUser.followers },
    { label: 'Following', value: currentUser.following },
    { label: 'Total Reads', value: currentUser.totalReads },
    { label: 'Appreciations', value: currentUser.appreciations },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Cover Photo */}
      <div className="relative" style={{ height: '280px', overflow: 'hidden' }}>
        <motion.img
          src={currentUser.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.9) 100%)' }} />
        <button className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(245,240,232,0.7)',
            backdropFilter: 'blur(8px)',
            fontFamily: '"Inter", sans-serif',
          }}>
          Edit Cover
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-6 pb-0" style={{ position: 'relative', marginTop: '-60px' }}>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="story-ring inline-block rounded-full mb-4"
              style={{ padding: '3px' }}
            >
              <img src={currentUser.avatar} alt={currentUser.name}
                className="w-28 h-28 rounded-full object-cover"
                style={{ border: '3px solid #0A0A0A' }} />
            </motion.div>
          </div>

          <div className="flex gap-3 pb-2">
            <motion.button
              onClick={handleFollow}
              className={following ? 'btn-ghost px-6 py-2.5 rounded-xl text-sm font-semibold' : 'btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold'}
              style={{ fontFamily: '"Inter", sans-serif' }}
              whileTap={{ scale: 0.97 }}
            >
              {following ? (
                <span className="flex items-center gap-2">
                  <Check size={14} />Following
                </span>
              ) : (
                <span>Follow</span>
              )}
            </motion.button>
            <button className="btn-ghost px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ fontFamily: '"Inter", sans-serif' }}>
              Message
            </button>
          </div>
        </div>

        {/* Name & Bio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(1.6rem, 3vw, 2rem)',
            fontWeight: 800,
            color: '#F5F0E8',
            marginBottom: '4px',
          }}>
            {currentUser.name}
          </h1>
          <p className="mb-2" style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.85rem',
            color: '#C9A84C',
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}>
            {currentUser.role}
          </p>
          <p className="mb-4" style={{
            fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: 'rgba(245,240,232,0.6)',
            maxWidth: '500px',
          }}>
            {currentUser.bio}
          </p>

          <div className="flex items-center gap-4 flex-wrap mb-6">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} color="rgba(201,168,76,0.6)" />
              <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)', fontFamily: '"Inter", sans-serif' }}>
                {currentUser.location}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={13} color="rgba(201,168,76,0.6)" />
              <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)', fontFamily: '"Inter", sans-serif' }}>
                Joined {currentUser.joinedDate}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <LinkIcon size={13} color="rgba(201,168,76,0.6)" />
              <span style={{ fontSize: '0.8rem', color: '#C9A84C', fontFamily: '"Inter", sans-serif', cursor: 'pointer' }}>
                eleanor-voss.com
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-6 flex-wrap mb-6 py-4 px-6 rounded-2xl"
            style={{
              background: 'rgba(22,22,22,0.8)',
              border: '1px solid rgba(201,168,76,0.08)',
            }}>
            {stats.map(({ label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="text-center min-w-0"
              >
                <p style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  fontWeight: 700,
                  color: '#C9A84C',
                }}>
                  <AnimatedNumber value={value} />
                </p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-0 border-b mb-6 overflow-x-auto no-scrollbar"
          style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-3 text-sm font-medium flex-shrink-0 relative transition-colors duration-200"
              style={{
                fontFamily: '"Inter", sans-serif',
                color: activeTab === tab ? '#C9A84C' : 'rgba(245,240,232,0.45)',
                fontSize: '0.85rem',
              }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="profileTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'Posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {userPosts.length > 0
                ? userPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
                : posts.slice(0, 3).map((post, i) => <PostCard key={post.id} post={post} index={i} />)
              }
            </motion.div>
          )}

          {activeTab === 'Articles' && (
            <motion.div
              key="articles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {posts.filter(p => p.type === 'article').map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </motion.div>
          )}

          {activeTab === 'Saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {savedPosts.length > 0
                ? savedPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
                : (
                  <div className="text-center py-16">
                    <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: 'rgba(245,240,232,0.4)', fontStyle: 'italic' }}>
                      No saved pieces yet.
                    </p>
                  </div>
                )}
            </motion.div>
          )}

          {activeTab === 'About' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-6 space-y-6"
            >
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
                  Literary Influences
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.influences.map(inf => (
                    <span key={inf} className="px-3 py-1 rounded-full text-sm"
                      style={{
                        background: 'rgba(201,168,76,0.08)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        color: '#F5F0E8',
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '0.82rem',
                      }}>
                      {inf}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
                  Intellectual Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map(interest => (
                    <span key={interest} className="category-badge">{interest}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'rgba(201,168,76,0.7)', fontFamily: '"Inter", sans-serif' }}>
                  About
                </h3>
                <p style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.88rem',
                  color: 'rgba(245,240,232,0.65)',
                  lineHeight: 1.7,
                }}>
                  A philosopher and essayist based in Paris, Eleanor Voss explores the intersections
                  of existentialism, feminist theory, and contemporary thought. Her work has appeared
                  in major literary journals across three continents.
                </p>
              </div>
            </motion.div>
          )}

          {(activeTab === 'Photos') && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                {posts.filter(p => p.images).flatMap(p => p.images || []).slice(0, 9).map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-lg cursor-pointer group">
                    <img src={img} alt="Photo" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-8" />
      </div>
    </div>
  );
}
