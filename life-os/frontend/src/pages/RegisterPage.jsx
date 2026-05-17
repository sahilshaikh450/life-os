import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { Zap, Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';

const Field = ({ label, icon: Icon, ...props }) => (
  <div>
    <label style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
      <input className="life-input" {...props} autoComplete="off" spellCheck={false} style={{
        width: '100%', padding: '12px 12px 12px 40px',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.2)',
        borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: '0.2s',
      }} />
    </div>
  </div>
);

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await authApi.sendOtp(form.email);
      toast.success('OTP sent to your email! 📧');
      setStep(2);
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.verifyOtp(form.email, otp);
      await register(form);
      toast.success('Account created! Welcome to Life OS 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP or Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070714', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Sora', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <motion.div style={{ position: 'absolute', top: '10%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(60px)', opacity: 0.2 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 460, padding: '48px 40px', background: 'linear-gradient(135deg, rgba(13,13,31,0.9), rgba(10,10,26,0.9))', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 24, backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1 }}>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px', background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(167,139,250,0.5)' }}>
            {step === 1 ? <Zap size={24} color="#fff" /> : <Shield size={24} color="#fff" />}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-1px' }}>
            {step === 1 ? 'Start your journey' : 'Verify Email'}
          </h1>
          <p style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>
            {step === 1 ? 'Build your Life OS today' : `OTP sent to ${form.email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="FIRST NAME" icon={User} type="text" required placeholder="John" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
              <Field label="LAST NAME" icon={User} type="text" placeholder="Doe" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <Field label="EMAIL" icon={Mail} type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <Field label="PASSWORD" icon={Lock} type="password" required placeholder="At least 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer', marginTop: 8, background: loading ? '#4b5563' : 'linear-gradient(135deg, #a78bfa, #60a5fa)', color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 0 30px rgba(167,139,250,0.4)' }}>
              {loading ? 'Sending OTP...' : <><span>Send OTP</span><ArrowRight size={16} /></>}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>ENTER OTP</label>
              <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6}
                style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, color: '#f1f5f9', fontSize: 28, fontWeight: 800, outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '12px' }} />
            </div>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer', marginTop: 8, background: loading ? '#4b5563' : 'linear-gradient(135deg, #a78bfa, #60a5fa)', color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? 'Verifying...' : <><span>Verify & Create Account</span><ArrowRight size={16} /></>}
            </motion.button>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 13 }}>← Back</button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, color: '#6b7280', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}