import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2500);
    const t4 = setTimeout(() => onComplete(), 3200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#070714',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: "'Sora', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Background particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0], y: -200 }}
          transition={{ duration: 3, delay: Math.random() * 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#a78bfa' : '#60a5fa',
          }}
        />
      ))}

      {/* Glow ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={phase >= 1 ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.3), transparent)',
          filter: 'blur(20px)',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={phase >= 1 ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36,
          boxShadow: '0 0 60px rgba(167,139,250,0.6), 0 0 120px rgba(96,165,250,0.3)',
          marginBottom: 24,
        }}
      >
        ⚡
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ textAlign: 'center' }}
      >
        <div style={{
          fontSize: 42, fontWeight: 800, color: '#fff',
          background: 'linear-gradient(135deg, #a78bfa, #60a5fa, #34d399)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
        }}>
          Life OS
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          style={{ fontSize: 14, color: '#6b7280', letterSpacing: '0.3em', marginTop: 8 }}
        >
          YOUR PRODUCTIVITY UNIVERSE
        </motion.div>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : {}}
        style={{
          position: 'absolute', bottom: 60,
          width: 200, height: 2,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 1, overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={phase >= 2 ? { width: '100%' } : {}}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
            borderRadius: 1,
          }}
        />
      </motion.div>
    </motion.div>
  );
}