import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { mockPosts, mockUsers, trendingTopics } from '../data/paradigm';
import { useApp } from '../context/AppContext';

const searchTabs = ['All', 'Articles', 'People', 'Tags', 'Circles'];

export default function ExplorePage() {
  const { setSelectedPost } = useApp();
  const [searchText, setSearchText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const filteredPosts = searchText
    ? mockPosts.filter(p =>
        p.content.toLowerCase().includes(searchText.toLowerCase()) ||
        p.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchText.toLowerCase()))
      )
    : mockPosts.filter(p => p.type === 'article');

  const filteredPeople = searchText
    ? mockUsers.filter(u =>
        u.name.toLowerCase().includes(searchText.toLowerCase()) ||
        u.role.toLowerCase().includes(searchText.toLowerCase())
      )
    : mockUsers.slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300"
          style={{
            background: 'rgba(22,22,22,0.9)',
            border: `1px solid ${isExpanded ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: isExpanded ? '0 0 20px rgba(201,168,76,0.08)' : 'none',
          }}
        >
          <Search size={18} color={isExpanded ? '#C9A84C' : 'rgba(245,240,232,0.3)'} />
          <input
            type="text"
            placeholder="Search the Paradigm — articles, people, ideas..."
            value={searchText}
            onChange={e => { setSearchText(e.target.value); setIsExpanded(true); }}
            onFocus={() => setIsExpanded(true)}
            className="flex-1 bg-transparent outline-none"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.9rem',
              color: '#F5F0E8',
            }}
          />
          {searchText && (
            <button onClick={() => setSearchText('')}>
              <X size={16} color="rgba(245,240,232,0.4)" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Search Tabs */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 overflow-x-auto no-scrollbar mb-6"
        >
          {searchTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200"
              style={{
                background: activeTab === tab ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeTab === tab ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.07)'}`,
                color: activeTab === tab ? '#C9A84C' : 'rgba(245,240,232,0.5)',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.8rem',
              }}
            >
              {tab}
            </button>
          ))}
        </motion.div>
      )}

      {/* Trending Tags */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'rgba(201,168,76,0.6)', fontFamily: '"Inter", sans-serif' }}>
          Trending Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic, i) => (
            <motion.button
              key={topic.tag}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => { setSearchText(topic.tag); setIsExpanded(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#C9A84C',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.82rem',
              }}
            >
              {topic.tag}
              <span style={{ fontSize: '0.68rem', color: 'rgba(201,168,76,0.5)' }}>{topic.count}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Minds to Discover */}
      {(!searchText || activeTab === 'People' || activeTab === 'All') && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'rgba(201,168,76,0.6)', fontFamily: '"Inter", sans-serif' }}>
            Minds to Discover
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredPeople.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card glass-card-hover p-4 text-center cursor-pointer"
              >
                <div className="story-ring inline-block rounded-full mb-3" style={{ padding: '2px' }}>
                  <img src={user.avatar} alt={user.name}
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ border: '2px solid #0A0A0A' }} />
                </div>
                <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '0.85rem', fontWeight: 700, color: '#F5F0E8', lineHeight: 1.3, marginBottom: '4px' }}>
                  {user.name}
                </p>
                <p className="category-badge mb-3 inline-block" style={{ fontSize: '0.6rem' }}>
                  {user.role.split('|')[0].trim()}
                </p>
                <button className="w-full btn-ghost py-1.5 rounded-lg text-xs font-medium"
                  style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem' }}>
                  Follow
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Articles */}
      {(!searchText || activeTab === 'Articles' || activeTab === 'All') && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'rgba(201,168,76,0.6)', fontFamily: '"Inter", sans-serif' }}>
            {searchText ? 'Search Results' : 'Featured Articles'}
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: 'rgba(245,240,232,0.4)' }}>
                No results found for "{searchText}"
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.slice(0, 5).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass-card glass-card-hover p-4 cursor-pointer flex gap-4"
                  onClick={() => post.type === 'article' && setSelectedPost(post)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={post.author.avatar} alt={post.author.name}
                        className="w-6 h-6 rounded-full object-cover" />
                      <span style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.5)', fontFamily: '"Inter", sans-serif' }}>
                        {post.author.name}
                      </span>
                      {post.category && <span className="category-badge">{post.category}</span>}
                    </div>
                    <h3 style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#F5F0E8',
                      lineHeight: 1.4,
                      marginBottom: '6px',
                    }}>
                      {post.title || post.content.slice(0, 80) + '...'}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.45)', fontFamily: '"Inter", sans-serif', lineHeight: 1.5 }}>
                      {post.content.slice(0, 100)}...
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}>
                        {post.timestamp}
                      </span>
                      {post.readTime && (
                        <span style={{ fontSize: '0.68rem', color: 'rgba(201,168,76,0.5)', fontFamily: '"Inter", sans-serif' }}>
                          {post.readTime}
                        </span>
                      )}
                      <span style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}>
                        🪶 {post.totalReactions.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {post.images && post.images[0] && (
                    <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: '90px', height: '80px' }}>
                      <img src={post.images[0]} alt="Article" className="w-full h-full object-cover" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
