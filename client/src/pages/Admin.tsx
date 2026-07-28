import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, LogOut, FolderOpen, FileJson, Terminal } from 'lucide-react';

const SESSION_KEY = 'sketch_admin_auth';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword]               = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [authError, setAuthError]             = useState('');
  const [shaking, setShaking]                 = useState(false);

  // Restore session on mount
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const adminPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD;
    if (password === adminPassword) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setAuthError('Incorrect password');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  // ── Login screen ────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        style={{ background: '#0a0a0a', fontFamily: "'Space Grotesk', sans-serif" }}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Lock icon */}
          <div className="flex justify-center mb-8">
            <div
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              className="w-14 h-14 rounded-full flex items-center justify-center"
            >
              <Lock size={22} className="text-white/60" />
            </div>
          </div>

          <h1 className="text-white text-xl font-semibold text-center mb-1 tracking-tight">
            Admin Access
          </h1>
          <p className="text-white/30 text-sm text-center mb-8">
            Enter your password to continue
          </p>

          <motion.form
            onSubmit={handleLogin}
            animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="relative mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                placeholder="Password"
                autoFocus
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${authError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: '#fff',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                className="w-full px-4 py-3 rounded-lg text-sm placeholder-white/25 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {authError && (
              <p className="text-red-400/80 text-xs mb-3 pl-1">{authError}</p>
            )}

            <button
              type="submit"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              className="w-full py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Unlock
            </button>
          </motion.form>
        </motion.div>
      </div>
    );
  }

  // ── Instructions panel ──────────────────────────────────────
  const steps = [
    {
      icon: <FolderOpen size={18} className="text-white/50" />,
      label: 'Step 1 — Copy your image',
      description: 'Drop your sketch file (JPG, PNG, or WEBP) into:',
      code: 'client/public/sketches/your-filename.jpg',
    },
    {
      icon: <FileJson size={18} className="text-white/50" />,
      label: 'Step 2 — Add an entry to the JSON',
      description: (
        <>
          Open <Code>data/sketches.json</Code> and add a new entry at the{' '}
          <strong className="text-white/80">top</strong> of the array:
        </>
      ),
      code: `{
  "id": NEXT_NUMBER,
  "url": "/sketches/your-filename.jpg",
  "title": "optional title or null",
  "tags": ["random"],
  "date": "YYYY-MM"
}`,
      multiline: true,
    },
    {
      icon: <Terminal size={18} className="text-white/50" />,
      label: 'Step 3 — Push and deploy',
      description: 'Run these commands in the project root. Vercel will auto-deploy in ~30 seconds.',
      code: `git add .\ngit commit -m "new sketch: filename"\ngit push`,
      multiline: true,
    },
  ];

  return (
    <div
      style={{ background: '#0a0a0a', fontFamily: "'Space Grotesk', sans-serif" }}
      className="min-h-screen py-16 px-4"
    >
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="text-white/25 text-xs uppercase tracking-widest mb-1">Admin</p>
            <h1 className="text-white text-2xl font-semibold tracking-tight">Add a New Sketch</h1>
          </div>
          <button
            onClick={handleLogout}
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              className="rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
            >
              {/* Step label */}
              <div className="flex items-center gap-2 mb-3">
                {step.icon}
                <span className="text-white/70 text-sm font-medium">{step.label}</span>
              </div>

              {/* Description */}
              <p className="text-white/40 text-sm mb-4 leading-relaxed">
                {step.description}
              </p>

              {/* Code block */}
              <div
                style={{
                  background: '#111111',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                className="rounded-lg overflow-hidden"
              >
                <pre
                  style={{
                    color: '#e8e8e8',
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                    fontSize: '0.8rem',
                    lineHeight: '1.65',
                    padding: step.multiline ? '1rem 1.25rem' : '0.75rem 1.25rem',
                    margin: 0,
                    overflowX: 'auto',
                    whiteSpace: 'pre',
                  }}
                >
                  {step.code}
                </pre>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          className="text-white/15 text-xs text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          All sketches are served as static files — no database required.
        </motion.p>

      </div>
    </div>
  );
}

// Inline code span helper
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#e8e8e8',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: '0.78rem',
        padding: '1px 6px',
        borderRadius: '4px',
      }}
    >
      {children}
    </code>
  );
}
