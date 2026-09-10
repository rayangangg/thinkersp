import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, Share2, MessageCircle, MoreHorizontal,
  Globe, Send, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { Post, Comment, reactionTypes } from '../data/mockData';
import { useApp } from '../context/AppContext';

const bgStyles: Record<string, React.CSSProperties> = {
  gold: { background: 'linear-gradient(135deg, #1a1200, #2a2000, #1a1200)' },
  blue: { background: 'linear-gradient(135deg, #050a14, #0a1220, #050a14)' },
  red: { background: 'linear-gradient(135deg, #140505, #200a0a, #140505)' },
  green: { background: 'linear-gradient(135deg, #051405, #0a2010, #051405)' },
};

function ReactionPopup({ onReact, onClose }: { onReact: (type: string) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="absolute bottom-full left-0 mb-2 z-20 flex items-center gap-1 px-3 py-2 rounded-2xl"
      style={{
        background: 'rgba(22,22,22,0.98)',
        border: '1px solid rgba(201,168,76,0.2)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
      }}
      onMouseLeave={onClose}
    >
      {reactionTypes.map((r, i) => (
        <motion.button
          key={r.id}
          initial={{ opacity: 0, y: 10, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.04, type: 'spring', stiffness: 500, damping: 20 }}
          onClick={() => { onReact(r.id); onClose(); }}
          className="flex flex-col items-center gap-1 group p-1.5 rounded-xl transition-all duration-200 hover:scale-125"
          title={r.label}
        >
          <span className="text-xl leading-none">{r.emoji}</span>
          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: r.color, fontFamily: '"Inter", sans-serif', fontSize: '0.55rem', whiteSpace: 'nowrap' }}>
            {r.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${depth > 0 ? 'ml-8 mt-2' : 'mt-3'}`}
    >
      <img src={comment.author.avatar} alt={comment.author.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        style={{ border: '1px solid rgba(201,168,76,0.15)' }} />
      <div className="flex-1">
        <div className="inline-block px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-xs font-semibold mb-1"
            style={{ color: '#C9A84C', fontFamily: '"Playfair Display", serif' }}>
            {comment.author.name}
          </p>
          <p className="text-sm" style={{ color: 'rgba(245,240,232,0.8)', fontFamily: '"Inter", sans-serif', lineHeight: 1.5 }}>
            {comment.content}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-1.5 px-1">
          <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}>
            {comment.timestamp}
          </span>
          <button className="text-xs font-medium transition-colors hover:text-yellow-400"
            style={{ color: 'rgba(245,240,232,0.5)', fontFamily: '"Inter", sans-serif', fontSize: '0.72rem' }}>
            🪶 {comment.reactions}
          </button>
          <button className="text-xs font-medium transition-colors hover:text-yellow-400"
            style={{ color: 'rgba(245,240,232,0.5)', fontFamily: '"Inter", sans-serif', fontSize: '0.72rem' }}>
            Reply
          </button>
        </div>
        {comment.replies.length > 0 && (
          <div>
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 mt-1.5 px-1 text-xs font-medium"
              style={{ color: '#C9A84C', fontFamily: '"Inter", sans-serif', fontSize: '0.72rem' }}
            >
              {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showReplies ? 'Hide' : `View ${comment.replies.length}`} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
            <AnimatePresence>
              {showReplies && comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ImageGrid({ images }: { images: string[] }) {
  const count = images.length;

  if (count === 1) {
    return (
      <div className="mt-3 rounded-xl overflow-hidden" style={{ maxHeight: '400px' }}>
        <img src={images[0]} alt="Post" className="w-full h-full object-cover" style={{ maxHeight: '400px' }} />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
        {images.map((img, i) => (
          <img key={i} src={img} alt="Post" className="w-full object-cover" style={{ height: '200px' }} />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="mt-3 grid gap-1 rounded-xl overflow-hidden"
        style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '200px 200px' }}>
        <img src={images[0]} alt="Post" className="w-full object-cover row-span-2" style={{ height: '401px' }} />
        {images.slice(1).map((img, i) => (
          <img key={i} src={img} alt="Post" className="w-full object-cover" style={{ height: '200px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
      {images.slice(0, 3).map((img, i) => (
        <img key={i} src={img} alt="Post" className="w-full object-cover" style={{ height: '180px' }} />
      ))}
      <div className="relative">
        <img src={images[3]} alt="Post" className="w-full object-cover" style={{ height: '180px' }} />
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(10,10,10,0.7)' }}>
          <span style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#F5F0E8',
          }}>
            +{count - 3}
          </span>
        </div>
      </div>
    </div>
  );
}

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const { toggleBookmark, setSelectedPost } = useApp();
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState(post.totalReactions);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [bookmarkAnim, setBookmarkAnim] = useState(false);
  const reactionRef = useRef<NodeJS.Timeout | null>(null);

  const handleReact = (type: string) => {
    if (userReaction === type) {
      setUserReaction(null);
      setLocalReactions(p => p - 1);
    } else {
      if (!userReaction) setLocalReactions(p => p + 1);
      setUserReaction(type);
    }
  };

  const handleBookmark = () => {
    toggleBookmark(post.id);
    setBookmarkAnim(true);
    setTimeout(() => setBookmarkAnim(false), 600);
  };

  const reactionIcon = userReaction
    ? reactionTypes.find(r => r.id === userReaction)?.emoji || '🪶'
    : '🪶';

  const reactionLabel = userReaction
    ? reactionTypes.find(r => r.id === userReaction)?.label || 'Appreciate'
    : 'Appreciate';

  const cardBg = post.type === 'thought' && post.bgColor
    ? bgStyles[post.bgColor] || {}
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      className="glass-card glass-card-hover mb-4 overflow-hidden"
      style={{
        ...cardBg,
        position: 'relative',
      }}
    >
      {/* Post Header */}
      <div className="flex items-start justify-between p-4 pb-0">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0 cursor-pointer">
            <div className="avatar-gold-ring rounded-full" style={{ padding: '1.5px' }}>
              <img src={post.author.avatar} alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold cursor-pointer hover:text-yellow-400 transition-colors"
                style={{ fontFamily: '"Playfair Display", serif', color: '#F5F0E8', fontSize: '0.95rem' }}>
                {post.author.name}
              </span>
              <span className="category-badge">{post.author.role.split('|')[0].trim()}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif' }}>
                {post.timestamp}
              </span>
              {post.readTime && (
                <>
                  <span style={{ color: 'rgba(245,240,232,0.2)' }}>·</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(201,168,76,0.6)', fontFamily: '"Inter", sans-serif' }}>
                    {post.readTime}
                  </span>
                </>
              )}
              <span style={{ color: 'rgba(245,240,232,0.2)' }}>·</span>
              <Globe size={11} color="rgba(245,240,232,0.3)" />
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-white/5"
          >
            <MoreHorizontal size={18} color="rgba(245,240,232,0.5)" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="absolute right-0 top-10 z-30 rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(22,22,22,0.98)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  backdropFilter: 'blur(20px)',
                  minWidth: '160px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                }}
                onMouseLeave={() => setShowMenu(false)}
              >
                {['Save Post', 'Hide Post', 'Report', 'Copy Link'].map(item => (
                  <button
                    key={item}
                    onClick={() => setShowMenu(false)}
                    className="w-full px-4 py-2.5 text-left text-sm transition-all duration-150 hover:bg-white/5"
                    style={{ color: 'rgba(245,240,232,0.7)', fontFamily: '"Inter", sans-serif', fontSize: '0.82rem' }}
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Body */}
      <div className="px-4 pt-3">
        {/* Category + Tags */}
        {post.category && (
          <div className="mb-2">
            <span className="category-badge">{post.category}</span>
          </div>
        )}

        {/* Article Title */}
        {post.type === 'article' && post.title && (
          <h2 className="mb-2 cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => setSelectedPost(post)}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              fontWeight: 700,
              color: '#F5F0E8',
              lineHeight: 1.3,
            }}>
            {post.title}
          </h2>
        )}

        {/* Content */}
        <div>
          <p style={{
            fontFamily: post.type === 'thought' ? '"Playfair Display", serif' : '"Inter", sans-serif',
            fontSize: post.type === 'thought' ? 'clamp(1rem, 2vw, 1.15rem)' : '0.9rem',
            fontStyle: post.type === 'thought' ? 'normal' : 'normal',
            color: 'rgba(245,240,232,0.85)',
            lineHeight: 1.7,
          }}>
            {expanded || post.content.length < 200
              ? post.content
              : post.content.slice(0, 200) + '...'}
          </p>

          {post.type === 'article' && post.content.length > 200 && (
            <button
              onClick={() => post.type === 'article' ? setSelectedPost(post) : setExpanded(!expanded)}
              className="mt-1 text-sm font-medium transition-colors hover:text-yellow-300"
              style={{ color: '#C9A84C', fontFamily: '"Inter", sans-serif', fontSize: '0.82rem' }}
            >
              Continue Reading →
            </button>
          )}

          {post.type !== 'article' && post.content.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-sm font-medium"
              style={{ color: '#C9A84C', fontFamily: '"Inter", sans-serif', fontSize: '0.82rem' }}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <ImageGrid images={post.images} />
        )}

        {/* Shared Link Card */}
        {post.type === 'shared' && post.sharedLink && (
          <div className="mt-3 rounded-xl overflow-hidden cursor-pointer group"
            style={{ border: '1px solid rgba(201,168,76,0.15)', background: 'rgba(10,10,10,0.5)' }}>
            <div className="flex gap-3 p-3">
              <img src={post.sharedLink.thumbnail} alt="Link"
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs mb-1 uppercase tracking-widest"
                  style={{ color: 'rgba(201,168,76,0.6)', fontFamily: '"Inter", sans-serif', fontSize: '0.62rem' }}>
                  {post.sharedLink.source}
                </p>
                <p className="font-semibold leading-tight group-hover:text-yellow-400 transition-colors"
                  style={{ fontFamily: '"Playfair Display", serif', color: '#F5F0E8', fontSize: '0.85rem' }}>
                  {post.sharedLink.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ExternalLink size={10} color="rgba(245,240,232,0.3)" />
                  <span style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}>
                    {post.sharedLink.url}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all duration-200 hover:opacity-100"
                style={{
                  background: 'rgba(107,124,106,0.12)',
                  border: '1px solid rgba(107,124,106,0.25)',
                  color: '#8FA88E',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.68rem',
                  opacity: 0.8,
                }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reaction summary */}
        {localReactions > 0 && (
          <div className="flex items-center justify-between mt-3 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {post.reactions.slice(0, 3).map((r, i) => {
                  const type = reactionTypes.find(rt => rt.id === r.type);
                  return type ? (
                    <span key={i} className="text-sm" style={{ marginLeft: i > 0 ? '-4px' : 0 }}>
                      {type.emoji}
                    </span>
                  ) : null;
                })}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.45)', fontFamily: '"Inter", sans-serif' }}>
                {localReactions.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 text-xs transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif', fontSize: '0.78rem' }}
              >
                {post.comments.length} comments
              </button>
              <span style={{ color: 'rgba(245,240,232,0.2)', fontSize: '0.78rem' }}>·</span>
              <span style={{ color: 'rgba(245,240,232,0.4)', fontFamily: '"Inter", sans-serif', fontSize: '0.78rem' }}>
                {post.shares} shares
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-1 px-2 py-2 mt-1 mx-2 mb-2 rounded-xl"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>

        {/* Appreciate/React Button */}
        <div className="relative flex-1">
          <motion.button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200 hover:bg-white/5"
            onMouseEnter={() => {
              if (reactionRef.current) clearTimeout(reactionRef.current);
              setShowReactions(true);
            }}
            onMouseLeave={() => {
              reactionRef.current = setTimeout(() => setShowReactions(false), 300);
            }}
            onClick={() => handleReact('appreciate')}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-base">{reactionIcon}</span>
            <span style={{
              fontSize: '0.78rem',
              fontFamily: '"Inter", sans-serif',
              fontWeight: userReaction ? 600 : 400,
              color: userReaction
                ? (reactionTypes.find(r => r.id === userReaction)?.color || '#C9A84C')
                : 'rgba(245,240,232,0.6)',
            }}>
              {reactionLabel}
            </span>
          </motion.button>

          <AnimatePresence>
            {showReactions && (
              <div
                onMouseEnter={() => { if (reactionRef.current) clearTimeout(reactionRef.current); }}
                onMouseLeave={() => setShowReactions(false)}
              >
                <ReactionPopup onReact={handleReact} onClose={() => setShowReactions(false)} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200 hover:bg-white/5"
        >
          <MessageCircle size={16} color="rgba(245,240,232,0.5)" />
          <span style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.6)', fontFamily: '"Inter", sans-serif' }}>
            Comment
          </span>
        </button>

        {/* Share Button */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200 hover:bg-white/5"
          >
            <Share2 size={16} color="rgba(245,240,232,0.5)" />
            <span style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.6)', fontFamily: '"Inter", sans-serif' }}>
              Share
            </span>
          </button>
          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(22,22,22,0.98)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  backdropFilter: 'blur(20px)',
                  minWidth: '180px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                }}
                onMouseLeave={() => setShowShareMenu(false)}
              >
                {['Share to Feed', 'Send in Message', 'Copy Link', "Share to Thinker's Circle"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setShowShareMenu(false)}
                    className="w-full px-4 py-2.5 text-left text-sm transition-all duration-150 hover:bg-white/5"
                    style={{ color: 'rgba(245,240,232,0.7)', fontFamily: '"Inter", sans-serif', fontSize: '0.8rem' }}
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className="flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-white/5 relative overflow-hidden"
        >
          <motion.div
            animate={bookmarkAnim ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Bookmark
              size={16}
              color={post.isBookmarked ? '#C9A84C' : 'rgba(245,240,232,0.5)'}
              fill={post.isBookmarked ? '#C9A84C' : 'none'}
            />
          </motion.div>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="px-4 pb-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            {/* Comment Input */}
            <div className="flex items-center gap-3 mt-3">
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                alt="You" className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                style={{ border: '1.5px solid rgba(201,168,76,0.2)' }} />
              <div className="flex-1 flex items-center rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input
                  type="text"
                  placeholder="Write a thought..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="flex-1 px-4 py-2 bg-transparent text-sm outline-none"
                  style={{ color: '#F5F0E8', fontFamily: '"Inter", sans-serif', fontSize: '0.85rem' }}
                />
                {commentText && (
                  <button className="px-3 py-2 pr-4">
                    <Send size={15} color="#C9A84C" />
                  </button>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="mt-2">
              {post.comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
