import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Eye, Shield, Globe, Palette } from 'lucide-react';
import { useApp } from '../context/AppContext';

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300"
      style={{ background: checked ? 'linear-gradient(135deg, #C9A84C, #A07830)' : 'rgba(255,255,255,0.1)' }}
    >
      <motion.div
        animate={{ x: checked ? 18 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-4 h-4 rounded-full bg-white shadow"
      />
    </button>
  );
}

const sections = [
  {
    title: 'Appearance',
    icon: Palette,
    items: [
      { label: 'Dark Mode', key: 'darkMode', description: 'Obsidian black editorial theme' },
      { label: 'Grain Texture', key: 'grain', description: 'Premium printed-paper depth feel' },
      { label: 'Reduced Motion', key: 'reducedMotion', description: 'Minimize animations for accessibility' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Appreciation Alerts', key: 'appreciations', description: 'When someone appreciates your work' },
      { label: 'Comment Alerts', key: 'comments', description: 'When someone replies to your thoughts' },
      { label: 'New Followers', key: 'followers', description: 'When someone joins your discourse' },
      { label: 'Mentions', key: 'mentions', description: 'When someone cites you in their work' },
    ],
  },
  {
    title: 'Privacy',
    icon: Shield,
    items: [
      { label: 'Public Profile', key: 'publicProfile', description: 'Allow non-members to view your profile' },
      { label: 'Show Online Status', key: 'onlineStatus', description: 'Let others see when you\'re active' },
      { label: 'Allow Direct Messages', key: 'directMessages', description: 'Receive messages from all thinkers' },
    ],
  },
  {
    title: 'Reading',
    icon: Eye,
    items: [
      { label: 'Reading Progress Bar', key: 'readingProgress', description: 'Show article reading progress at top' },
      { label: 'Large Typography', key: 'largeType', description: 'Increase article body font size' },
      { label: 'Word Count Display', key: 'wordCount', description: 'Show word count on all posts' },
    ],
  },
  {
    title: 'Language',
    icon: Globe,
    items: [
      { label: 'Use Serif Font for Feed', key: 'serifFeed', description: 'Editorial serif typography everywhere' },
      { label: 'Show Read Time', key: 'readTime', description: 'Display estimated read time on articles' },
    ],
  },
];

export default function SettingsPage() {
  const { lightMode, toggleLightMode } = useApp();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    darkMode: true,
    grain: true,
    reducedMotion: false,
    appreciations: true,
    comments: true,
    followers: true,
    mentions: true,
    publicProfile: true,
    onlineStatus: true,
    directMessages: true,
    readingProgress: true,
    largeType: false,
    wordCount: true,
    serifFeed: false,
    readTime: true,
  });

  const toggle = (key: string) => {
    if (key === 'darkMode') { toggleLightMode(); }
    setToggles(p => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 800,
          color: '#F5F0E8',
          marginBottom: '4px',
        }}
      >
        Settings
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
        style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          color: 'rgba(245,240,232,0.4)',
          fontSize: '0.9rem',
        }}
      >
        Curate your literary environment.
      </motion.p>

      <div className="space-y-6">
        {sections.map((section, si) => {
          const SectionIcon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
              className="glass-card overflow-hidden"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(201,168,76,0.1)' }}>
                  <SectionIcon size={14} color="#C9A84C" />
                </div>
                <h2 style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#F5F0E8',
                  letterSpacing: '0.02em',
                }}>
                  {section.title}
                </h2>
              </div>

              {/* Items */}
              {section.items.map((item, ii) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/2"
                  style={{
                    borderBottom: ii < section.items.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  }}
                >
                  <div className="flex-1 mr-4">
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: '#F5F0E8' }}>
                      {item.label}
                    </p>
                    <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', color: 'rgba(245,240,232,0.35)', marginTop: '2px' }}>
                      {item.description}
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={item.key === 'darkMode' ? !lightMode : (toggles[item.key] ?? false)}
                    onChange={() => toggle(item.key)}
                  />
                </div>
              ))}
            </motion.div>
          );
        })}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-5"
          style={{ borderColor: 'rgba(139,46,46,0.2)' }}
        >
          <h2 className="mb-4" style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#8B2E2E',
          }}>
            Account
          </h2>
          <div className="space-y-2">
            {['Change Password', 'Export Your Data', 'Deactivate Account'].map(action => (
              <button key={action}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all hover:bg-white/5"
                style={{
                  color: action === 'Deactivate Account' ? '#8B2E2E' : 'rgba(245,240,232,0.6)',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.82rem',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                {action}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Version */}
        <div className="text-center py-2">
          <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.2)', fontFamily: '"Inter", sans-serif', letterSpacing: '0.1em' }}>
            THE THINKER'S PARADIGM v1.0.0 · © MMXXIV
          </p>
        </div>
      </div>
    </div>
  );
}
