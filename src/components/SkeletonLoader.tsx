import { motion } from 'framer-motion';

export function PostSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card mb-4 p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-32 rounded" />
          <div className="skeleton h-2 w-20 rounded" />
        </div>
      </div>

      {/* Content lines */}
      <div className="space-y-2 mb-4">
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
      </div>

      {/* Action bar */}
      <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton flex-1 h-7 rounded-lg" />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkeletonFeed() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Stories skeleton */}
      <div className="glass-card p-4 mb-4">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="skeleton w-14 h-14 rounded-full" />
              <div className="skeleton h-2 w-10 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Composer skeleton */}
      <div className="glass-card p-4 mb-4">
        <div className="flex gap-3 mb-3">
          <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
          <div className="skeleton flex-1 h-10 rounded-full" />
        </div>
        <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton flex-1 h-7 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Posts */}
      {[1, 2, 3].map(i => <PostSkeleton key={i} index={i} />)}
    </div>
  );
}
