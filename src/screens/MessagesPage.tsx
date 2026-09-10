import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Plus, Video, Phone, Image, FileText, Smile } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockConversations } from '../data/mockData';

function MessageBubble({ msg, isOwn }: { msg: { id: string; content: string; timestamp: string; seen: boolean; type: string }; isOwn: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className="px-4 py-2.5 rounded-2xl max-w-xs relative group"
        style={isOwn ? {
          background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(160,120,48,0.15))',
          border: '1px solid rgba(201,168,76,0.25)',
          borderBottomRightRadius: '4px',
        } : {
          background: 'rgba(22,22,22,0.9)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderBottomLeftRadius: '4px',
        }}
      >
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.875rem',
          color: isOwn ? '#F5F0E8' : 'rgba(245,240,232,0.85)',
          lineHeight: 1.5,
        }}>
          {msg.content}
        </p>
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span style={{ fontSize: '0.62rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}>
            {msg.timestamp}
          </span>
          {isOwn && (
            <span style={{ fontSize: '0.62rem', color: msg.seen ? '#C9A84C' : 'rgba(245,240,232,0.3)' }}>
              {msg.seen ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-2"
    >
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
        style={{ background: 'rgba(22,22,22,0.9)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />
        <div className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />
        <div className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />
      </div>
    </motion.div>
  );
}

export default function MessagesPage() {
  const { activeConversation, setActiveConversation } = useApp();
  const [conversations, setConversations] = useState(mockConversations);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const currentConv = conversations.find(c => c.id === activeConversation);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConv?.messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !activeConversation) return;
    setSending(true);

    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: '1',
      content: messageText,
      timestamp: 'Now',
      type: 'text' as const,
      seen: false,
    };

    setConversations(prev => prev.map(c =>
      c.id === activeConversation
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: messageText, lastTime: 'Now', unread: 0 }
        : c
    ));

    setMessageText('');
    setSending(false);

    // Simulate reply typing
    setTimeout(() => setIsTyping(true), 800);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "That's a fascinating perspective — it reminds me of what Rilke wrote in Letters to a Young Poet.",
        "Absolutely. The intersection of art and solitude is profound.",
        "I've been thinking about this very subject. Your words have given me much to consider.",
      ];
      const reply = {
        id: 'reply-' + Date.now(),
        senderId: activeConversation.replace('conv', ''),
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: 'Now',
        type: 'text' as const,
        seen: true,
      };
      setConversations(prev => prev.map(c =>
        c.id === activeConversation
          ? { ...c, messages: [...c.messages, reply] }
          : c
      ));
    }, 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConvs = conversations.filter(c =>
    c.participant.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex overflow-hidden" style={{ height: '100vh' }}>
      {/* Left Panel — Conversations */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full sm:w-80 flex-shrink-0 flex flex-col"
        style={{
          background: 'rgba(13,13,13,0.9)',
          borderRight: '1px solid rgba(201,168,76,0.08)',
          height: '100vh',
        }}
      >
        {/* Header */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#F5F0E8',
            }}>
              Discourse
            </h2>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <Plus size={15} color="#C9A84C" />
            </button>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Search size={14} color="rgba(245,240,232,0.3)" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#F5F0E8', fontFamily: '"Inter", sans-serif', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredConvs.map((conv, i) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setActiveConversation(conv.id)}
              className="flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-200 relative"
              style={{
                background: activeConversation === conv.id
                  ? 'rgba(201,168,76,0.06)'
                  : 'transparent',
                borderLeft: activeConversation === conv.id
                  ? '2px solid #C9A84C'
                  : '2px solid transparent',
              }}
            >
              <div className="relative flex-shrink-0">
                <img src={conv.participant.avatar} alt={conv.participant.name}
                  className="w-11 h-11 rounded-full object-cover"
                  style={{ border: '1.5px solid rgba(201,168,76,0.15)' }} />
                {conv.participant.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full online-dot"
                    style={{ background: '#22c55e', border: '2px solid #111111' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      color: activeConversation === conv.id ? '#C9A84C' : '#F5F0E8',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}>
                    {conv.participant.name}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}>
                      {conv.lastTime}
                    </span>
                    {conv.unread > 0 && (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold badge-pulse"
                        style={{ background: '#C9A84C', color: '#0A0A0A', fontSize: '0.6rem' }}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
                <p className="truncate mt-0.5"
                  style={{
                    fontSize: '0.75rem',
                    color: conv.unread > 0 ? 'rgba(245,240,232,0.65)' : 'rgba(245,240,232,0.35)',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: conv.unread > 0 ? 500 : 400,
                  }}>
                  {conv.lastMessage}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Panel — Chat */}
      <div className="flex-1 flex flex-col" style={{ background: 'rgba(10,10,10,0.95)', height: '100vh' }}>
        {currentConv ? (
          <>
            {/* Chat Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={currentConv.participant.avatar} alt={currentConv.participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                    style={{ border: '1.5px solid rgba(201,168,76,0.2)' }} />
                  {currentConv.participant.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full online-dot"
                      style={{ background: '#22c55e', border: '2px solid #0A0A0A' }} />
                  )}
                </div>
                <div>
                  <p style={{ fontFamily: '"Playfair Display", serif', color: '#F5F0E8', fontWeight: 600, fontSize: '0.95rem' }}>
                    {currentConv.participant.name}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: currentConv.participant.isOnline ? '#22c55e' : 'rgba(245,240,232,0.35)', fontFamily: '"Inter", sans-serif' }}>
                    {currentConv.participant.isOnline ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Phone size={16} color="rgba(245,240,232,0.5)" />
                </button>
                <button className="p-2.5 rounded-xl transition-all hover:bg-white/5"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Video size={16} color="rgba(245,240,232,0.5)" />
                </button>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
              {currentConv.messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} isOwn={msg.senderId === '1'} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="px-4 py-4"
              style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <button className="p-2.5 rounded-xl transition-all hover:bg-white/5">
                    <Image size={16} color="rgba(245,240,232,0.4)" />
                  </button>
                  <button className="p-2.5 rounded-xl transition-all hover:bg-white/5">
                    <FileText size={16} color="rgba(245,240,232,0.4)" />
                  </button>
                  <button className="p-2.5 rounded-xl transition-all hover:bg-white/5">
                    <Smile size={16} color="rgba(245,240,232,0.4)" />
                  </button>
                </div>

                <div className="flex-1 flex items-end rounded-2xl overflow-hidden px-4 py-2.5"
                  style={{
                    background: 'rgba(22,22,22,0.9)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    minHeight: '44px',
                  }}>
                  <textarea
                    placeholder="Compose your message..."
                    value={messageText}
                    onChange={e => {
                      setMessageText(e.target.value);
                      if (typingTimer.current) clearTimeout(typingTimer.current);
                    }}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className="flex-1 bg-transparent outline-none resize-none"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.88rem',
                      color: '#F5F0E8',
                      lineHeight: 1.5,
                      maxHeight: '100px',
                    }}
                  />
                </div>

                <motion.button
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  whileTap={messageText.trim() ? { scale: 0.9 } : {}}
                  className="p-3 rounded-xl flex-shrink-0 transition-all duration-200"
                  style={{
                    background: messageText.trim()
                      ? 'linear-gradient(135deg, #C9A84C, #A07830)'
                      : 'rgba(255,255,255,0.04)',
                    border: messageText.trim()
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.06)',
                    opacity: messageText.trim() ? 1 : 0.5,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {sending ? (
                      <motion.div
                        key="sending"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="paper-plane-fly"
                      >
                        <Send size={16} color="#0A0A0A" />
                      </motion.div>
                    ) : (
                      <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Send size={16} color={messageText.trim() ? '#0A0A0A' : 'rgba(245,240,232,0.3)'} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-4">💬</p>
              <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: 'rgba(245,240,232,0.4)', fontSize: '1.1rem' }}>
                Select a conversation to begin the discourse.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
