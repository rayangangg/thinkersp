import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const TITLE = "The Thinker's Paradigm";
const TAGLINE = "Where Ideas Find Their Voice.";

function InkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      radius: number; alpha: number; color: string;
      life: number; maxLife: number;
    }

    const particles: Particle[] = [];
    const colors = ['#C9A84C', '#E8C97A', '#A07830', '#F5F0E8', '#6B7C6A'];

    function spawnParticle() {
      const x = Math.random() * canvas!.width;
      const y = Math.random() * canvas!.height;
      const maxLife = 120 + Math.random() * 180;
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 1 + Math.random() * 4,
        alpha: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife,
      });
    }

    for (let i = 0; i < 60; i++) spawnParticle();

    let animId: number;
    let frame = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      if (frame % 3 === 0 && particles.length < 80) spawnParticle();
      frame++;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;

        const progress = p.life / p.maxLife;
        p.alpha = progress < 0.3
          ? progress / 0.3
          : progress > 0.7
            ? 1 - (progress - 0.7) / 0.3
            : 1;
        p.alpha *= 0.4;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx!.fill();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Draw ink trails
      ctx!.beginPath();
      for (let i = 0; i < particles.length - 1; i++) {
        const p1 = particles[i];
        const p2 = particles[i + 1];
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        if (dist < 80) {
          ctx!.moveTo(p1.x, p1.y);
          ctx!.lineTo(p2.x, p2.y);
          const lineAlpha = (1 - dist / 80) * 0.06;
          ctx!.strokeStyle = `rgba(201, 168, 76, ${lineAlpha})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
          ctx!.beginPath();
        }
      }
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

function TypewriterText({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 60);
    return () => clearTimeout(timer);
  }, [started, displayed, text]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="typewriter-cursor" />
      )}
    </span>
  );
}

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [showLogo, setShowLogo] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { setIsAuthenticated } = useApp();

  useEffect(() => {
    const t = setTimeout(() => setShowLogo(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    onEnter();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #0f0c05 50%, #0A0A0A 100%)' }}>
      <InkCanvas />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full">
        {/* Logo */}
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-8"
            >
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)' }} />
                <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
                  {/* Brain/Quill hybrid */}
                  <circle cx="40" cy="35" r="18" stroke="#C9A84C" strokeWidth="1.5" fill="none" opacity="0.6" />
                  <path d="M40 17 Q55 20 58 30 Q62 38 55 45 Q50 52 40 53"
                    stroke="#C9A84C" strokeWidth="1.5" fill="none" />
                  <path d="M40 17 Q25 20 22 30 Q18 38 25 45 Q30 52 40 53"
                    stroke="#C9A84C" strokeWidth="1.5" fill="none" />
                  <path d="M40 25 Q45 30 40 35 Q35 30 40 25" fill="#C9A84C" opacity="0.5" />
                  <path d="M34 30 Q36 35 34 38" stroke="#C9A84C" strokeWidth="1" opacity="0.7" />
                  <path d="M46 30 Q44 35 46 38" stroke="#C9A84C" strokeWidth="1" opacity="0.7" />
                  {/* Quill nib */}
                  <path d="M40 53 L37 65 Q40 70 43 65 Z" fill="#C9A84C" opacity="0.8" />
                  <path d="M40 58 L40 68" stroke="#A07830" strokeWidth="0.8" />
                  {/* Ink drop */}
                  <circle cx="40" cy="71" r="2" fill="#C9A84C" opacity="0.6" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <AnimatePresence>
          {showLogo && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-4"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #C9A84C, #E8C97A, #A07830)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
              }}
            >
              <TypewriterText text={TITLE} delay={0.8} />
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="mb-12 text-lg"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontStyle: 'italic',
            color: 'rgba(245, 240, 232, 0.6)',
            letterSpacing: '0.05em',
          }}
        >
          {TAGLINE}
        </motion.p>

        {/* Auth Section */}
        <AnimatePresence mode="wait">
          {!showAuth ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 3.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center"
            >
              <button
                onClick={() => { setShowAuth(true); setAuthMode('signup'); }}
                className="btn-gold px-8 py-4 rounded-lg text-base font-semibold tracking-wide"
                style={{ fontFamily: '"Inter", sans-serif', minWidth: '200px' }}
              >
                <span>Join the Discourse</span>
              </button>
              <button
                onClick={() => { setShowAuth(true); setAuthMode('login'); }}
                className="btn-ghost px-8 py-4 rounded-lg text-base font-semibold tracking-wide"
                style={{ fontFamily: '"Inter", sans-serif', minWidth: '200px' }}
              >
                Begin Reading
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="glass-card w-full max-w-md p-8"
            >
              {/* Tab switcher */}
              <div className="flex mb-8 rounded-lg overflow-hidden"
                style={{ background: 'rgba(10,10,10,0.5)', border: '1px solid rgba(201,168,76,0.1)' }}>
                {(['signup', 'login'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setAuthMode(mode)}
                    className="flex-1 py-3 text-sm font-medium transition-all duration-300"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      background: authMode === mode
                        ? 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.1))'
                        : 'transparent',
                      color: authMode === mode ? '#C9A84C' : 'rgba(245,240,232,0.4)',
                      borderRight: mode === 'signup' ? '1px solid rgba(201,168,76,0.1)' : 'none',
                    }}
                  >
                    {mode === 'signup' ? 'Join' : 'Sign In'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <AnimatePresence mode="wait">
                  {authMode === 'signup' && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="input-gold w-full px-4 py-3 rounded-lg text-sm"
                        style={{
                          background: 'rgba(10,10,10,0.6)',
                          border: '1px solid rgba(201,168,76,0.2)',
                          color: '#F5F0E8',
                          fontFamily: '"Inter", sans-serif',
                          outline: 'none',
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="input-gold w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: 'rgba(10,10,10,0.6)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: '#F5F0E8',
                    fontFamily: '"Inter", sans-serif',
                    outline: 'none',
                  }}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="input-gold w-full px-4 py-3 rounded-lg text-sm"
                  style={{
                    background: 'rgba(10,10,10,0.6)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: '#F5F0E8',
                    fontFamily: '"Inter", sans-serif',
                    outline: 'none',
                  }}
                />

                <button
                  type="submit"
                  className="btn-gold w-full py-3 rounded-lg text-sm font-semibold tracking-wide mt-2"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  <span>{authMode === 'signup' ? 'Join the Paradigm →' : 'Enter the Discourse →'}</span>
                </button>
              </form>

              <button
                onClick={() => setShowAuth(false)}
                className="mt-4 w-full text-center text-xs"
                style={{ color: 'rgba(245,240,232,0.3)', fontFamily: '"Inter", sans-serif' }}
              >
                ← Go back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
          className="mt-16 flex items-center gap-4 w-full max-w-xs"
        >
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
          <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.65rem', letterSpacing: '0.2em', fontFamily: '"Inter", sans-serif' }}>
            EST. MMXXIV
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
        </motion.div>
      </div>
    </div>
  );
}
