import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, FileText, MessageSquare, Tag, Upload, Bold, Italic, Link, List, Quote, Globe, Users, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/paradigm';

type Mode = 'thought' | 'article' | 'photo';
type Privacy = 'public' | 'friends' | 'only_me';

const bgOptions = [
  { id: 'none', label: 'None', style: {} },
  { id: 'gold', label: 'Gold', style: { background: 'linear-gradient(135deg, #1a1200, #2a2000)' } },
  { id: 'blue', label: 'Blue', style: { background: 'linear-gradient(135deg, #050a14, #0a1220)' } },
  { id: 'red', label: 'Red', style: { background: 'linear-gradient(135deg, #140505, #200a0a)' } },
  { id: 'green', label: 'Green', style: { background: 'linear-gradient(135deg, #051405, #0a2010)' } },
];

const privacyOptions = [
  { id: 'public', label: 'Public', Icon: Globe },
  { id: 'friends', label: 'Friends', Icon: Users },
  { id: 'only_me', label: 'Only Me', Icon: Lock },
];

export default function PostComposer({ onClose }: { onClose: () => void }) {
  const { currentUser, addPost } = useApp();
  const [mode, setMode] = useState<Mode>('thought');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedBg, setSelectedBg] = useState('none');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState('');
  const [privacy, setPrivacy] = useState<Privacy>('public');
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handlePublish = async () => {
    if (!content.trim() && !title.trim()) return;
    setIsPublishing(true);

    await new Promise(r => setTimeout(r, 1800));

    addPost({
      id: 'new-' + Date.now(),
      author: currentUser,
      type: mode === 'article' ? 'article' : 'thought',
      title: mode === 'article' ? title : undefined,
      content,
      bgColor: selectedBg !== 'none' ? selectedBg : undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      category: selectedCategory || undefined,
      timestamp: 'Just now',
      readTime: mode === 'article' ? `${Math.ceil(wordCount / 200)} min read` : undefined,
      reactions: [],
      totalReactions: 0,
      comments: [],
      shares: 0,
      isBookmarked: false,
      privacy,
    });

    setPublished(true);
    await new Promise(r => setTimeout(r, 800));
    onClose();
  };

  const modes: { id: Mode; label: string; Icon: React.FC<{ size?: number; color?: string }> }[] = [
    { id: 'thought', label: 'Quick Thought', Icon: MessageSquare },
    { id: 'article', label: 'Full Article', Icon: FileText },
    { id: 'photo', label: 'Photo Post', Icon: Image },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ border: '1px solid rgba(201,168,76,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#F5F0E8',
          }}>
            Share Your Thought, Thinker
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-all">
            <X size={18} color="rgba(245,240,232,0.5)" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex px-6 pt-4 gap-1"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {modes.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all duration-200 relative"
              style={{
                fontFamily: '"Inter", sans-serif',
                color: mode === id ? '#C9A84C' : 'rgba(245,240,232,0.5)',
                background: mode === id ? 'rgba(201,168,76,0.06)' : 'transparent',
                fontSize: '0.82rem',
              }}
            >
              <Icon size={14} color={mode === id ? '#C9A84C' : 'rgba(245,240,232,0.5)'} />
              {label}
              {mode === id && (
                <motion.div
                  layoutId="modeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                  style={{ background: '#C9A84C' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* User info */}
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: '1.5px solid rgba(201,168,76,0.3)' }} />
            <div>
              <p style={{ fontFamily: '"Playfair Display", serif', color: '#F5F0E8', fontWeight: 600, fontSize: '0.9rem' }}>
                {currentUser.name}
              </p>
              {/* Privacy Selector */}
              <div className="flex gap-1 mt-1">
                {privacyOptions.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPrivacy(id as Privacy)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all duration-200"
                    style={{
                      background: privacy === id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${privacy === id ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      color: privacy === id ? '#C9A84C' : 'rgba(245,240,232,0.4)',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.68rem',
                    }}
                  >
                    <Icon size={10} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'thought' && (
              <motion.div
                key="thought"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Background selector */}
                <div className="flex items-center gap-2">
                  {bgOptions.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBg(bg.id)}
                      className="w-7 h-7 rounded-lg transition-all duration-200"
                      style={{
                        ...(bg.style as React.CSSProperties),
                        background: bg.id === 'none'
                          ? 'rgba(255,255,255,0.06)'
                          : bg.style.background as string,
                        border: selectedBg === bg.id
                          ? '2px solid #C9A84C'
                          : '2px solid transparent',
                        outline: selectedBg === bg.id ? '1px solid rgba(201,168,76,0.3)' : 'none',
                      }}
                      title={bg.label}
                    />
                  ))}
                  <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}>
                    Background
                  </span>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={bgOptions.find(b => b.id === selectedBg)?.style}
                >
                  <textarea
                    className="w-full bg-transparent outline-none resize-none"
                    placeholder="What's on your mind, Thinker?"
                    value={content}
                    onChange={e => { setContent(e.target.value); setWordCount(e.target.value.split(/\s+/).filter(Boolean).length); }}
                    rows={5}
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '1.05rem',
                      color: '#F5F0E8',
                      lineHeight: 1.7,
                    }}
                  />
                </div>
              </motion.div>
            )}

            {mode === 'article' && (
              <motion.div
                key="article"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Article Title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-transparent outline-none border-b pb-3"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: '#F5F0E8',
                    borderColor: 'rgba(201,168,76,0.15)',
                  }}
                />

                {/* Rich text toolbar */}
                <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg flex-wrap"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { Icon: Bold, label: 'Bold' },
                    { Icon: Italic, label: 'Italic' },
                    { Icon: Link, label: 'Link' },
                    { Icon: List, label: 'List' },
                    { Icon: Quote, label: 'Quote' },
                    { Icon: Image, label: 'Image' },
                  ].map(({ Icon, label }) => (
                    <button key={label} title={label}
                      className="p-1.5 rounded transition-all hover:bg-white/5"
                      style={{ color: 'rgba(245,240,232,0.5)' }}>
                      <Icon size={15} />
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-2">
                    <span style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}>
                      H1
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}>
                      H2
                    </span>
                  </div>
                </div>

                <textarea
                  className="w-full bg-transparent outline-none resize-none"
                  placeholder="Begin your discourse..."
                  value={content}
                  onChange={e => { setContent(e.target.value); setWordCount(e.target.value.split(/\s+/).filter(Boolean).length); }}
                  rows={8}
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.9rem',
                    color: 'rgba(245,240,232,0.85)',
                    lineHeight: 1.8,
                  }}
                />

                <div className="flex items-center gap-3">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                    style={{
                      background: 'rgba(10,10,10,0.8)',
                      border: '1px solid rgba(201,168,76,0.15)',
                      color: selectedCategory ? '#F5F0E8' : 'rgba(245,240,232,0.4)',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.82rem',
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.35)', fontFamily: '"Inter", sans-serif' }}>
                    {wordCount} words
                  </span>
                </div>
              </motion.div>
            )}

            {mode === 'photo' && (
              <motion.div
                key="photo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="rounded-xl flex flex-col items-center justify-center gap-4 py-12 cursor-pointer transition-all duration-200 hover:border-gold"
                  style={{
                    border: '2px dashed rgba(201,168,76,0.3)',
                    background: 'rgba(201,168,76,0.02)',
                  }}>
                  <Upload size={32} color="rgba(201,168,76,0.5)" />
                  <div className="text-center">
                    <p style={{ fontFamily: '"Playfair Display", serif', color: '#F5F0E8', fontWeight: 600 }}>
                      Drop your images here
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif', marginTop: '4px' }}>
                      or click to browse
                    </p>
                  </div>
                </div>
                <textarea
                  className="w-full bg-transparent outline-none resize-none"
                  placeholder="Add a caption..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.9rem',
                    color: 'rgba(245,240,232,0.85)',
                    lineHeight: 1.7,
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    padding: '12px',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tags */}
          <div className="flex items-center gap-2">
            <Tag size={14} color="rgba(201,168,76,0.5)" />
            <input
              type="text"
              placeholder="Add tags, separated by commas"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{
                fontFamily: '"Inter", sans-serif',
                color: 'rgba(245,240,232,0.7)',
                fontSize: '0.82rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                paddingBottom: '6px',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.35)', fontFamily: '"Inter", sans-serif' }}>
            Sharing to: {privacy === 'public' ? '🌍 All Thinkers' : privacy === 'friends' ? '👥 Connections' : '🔒 Only You'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ color: 'rgba(245,240,232,0.5)', fontFamily: '"Inter", sans-serif', fontSize: '0.82rem' }}
            >
              Cancel
            </button>
            <motion.button
              onClick={handlePublish}
              disabled={isPublishing || (!content.trim() && !title.trim())}
              className="btn-gold px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
              style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', opacity: (!content.trim() && !title.trim()) ? 0.5 : 1 }}
              whileTap={{ scale: 0.97 }}
            >
              {isPublishing ? (
                <>
                  <span className="inline-block" style={{ animation: 'quill-write 0.5s ease infinite' }}>🪶</span>
                  <span>Publishing...</span>
                </>
              ) : published ? (
                <>✓ <span>Published!</span></>
              ) : (
                <span>Publish to the Paradigm</span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
