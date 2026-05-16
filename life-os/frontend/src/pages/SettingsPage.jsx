import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User, Lock, Bell, HelpCircle, LogOut,
  ChevronRight, Mail, Shield, Trash2, Save
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = () => {
    updateUser({ ...user, ...form });
    toast.success('Profile updated!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const s = {
    container: {
      maxWidth: 700, margin: '0 auto',
      fontFamily: "'Sora', sans-serif",
    },
    title: {
      fontSize: 24, fontWeight: 700,
      color: '#f1f5f9', marginBottom: 24,
    },
    card: {
      background: 'linear-gradient(135deg, #0d0d1f, #0a0a1a)',
      border: '1px solid rgba(167,139,250,0.15)',
      borderRadius: 16, padding: 24, marginBottom: 16,
    },
    tabBar: {
      display: 'flex', gap: 8, marginBottom: 24,
      flexWrap: 'wrap',
    },
    tab: (active) => ({
      padding: '8px 16px', borderRadius: 10,
      border: active ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.05)',
      background: active ? 'rgba(167,139,250,0.15)' : 'transparent',
      color: active ? '#a78bfa' : '#6b7280',
      cursor: 'pointer', fontSize: 13, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 6,
    }),
    label: {
      fontSize: 12, color: '#6b7280',
      marginBottom: 6, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.05em',
    },
    input: {
      width: '100%', padding: '10px 14px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(167,139,250,0.2)',
      borderRadius: 10, color: '#f1f5f9',
      fontSize: 14, outline: 'none',
      boxSizing: 'border-box',
    },
    row: { marginBottom: 16 },
    btn: (color) => ({
      padding: '10px 20px', borderRadius: 10,
      border: 'none', cursor: 'pointer',
      fontWeight: 700, fontSize: 14,
      background: color === 'purple'
        ? 'linear-gradient(135deg, #a78bfa, #60a5fa)'
        : color === 'red'
        ? 'rgba(239,68,68,0.15)'
        : 'rgba(255,255,255,0.05)',
      color: color === 'red' ? '#ef4444' : '#fff',
      border: color === 'red' ? '1px solid rgba(239,68,68,0.3)' : 'none',
      display: 'flex', alignItems: 'center', gap: 8,
    }),
    sectionTitle: {
      fontSize: 16, fontWeight: 700,
      color: '#f1f5f9', marginBottom: 16,
    },
  };

  return (
    <div style={s.container}>
      <div style={s.title}>⚙️ Settings</div>

      {/* Tab Bar */}
      <div style={s.tabBar}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} style={s.tab(activeTab === id)}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Avatar */}
          <div style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, color: '#fff',
            }}>
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{user?.email}</div>
              <div style={{
                marginTop: 4, fontSize: 11, color: '#a78bfa',
                background: 'rgba(167,139,250,0.1)',
                padding: '2px 8px', borderRadius: 6, display: 'inline-block',
              }}>
                {user?.role || 'USER'}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div style={s.card}>
            <div style={s.sectionTitle}>Edit Profile</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={s.row}>
                <div style={s.label}>First Name</div>
                <input style={s.input} value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div style={s.row}>
                <div style={s.label}>Last Name</div>
                <input style={s.input} value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div style={s.row}>
              <div style={s.label}>Email</div>
              <input style={s.input} value={form.email} disabled
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <button onClick={handleSave} style={s.btn('purple')}>
              <Save size={14} /> Save Changes
            </button>
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={s.card}>
            <div style={s.sectionTitle}>🔐 Security</div>
            <div style={s.row}>
              <div style={s.label}>Current Password</div>
              <input type="password" style={s.input} placeholder="••••••••" />
            </div>
            <div style={s.row}>
              <div style={s.label}>New Password</div>
              <input type="password" style={s.input} placeholder="••••••••" />
            </div>
            <div style={s.row}>
              <div style={s.label}>Confirm Password</div>
              <input type="password" style={s.input} placeholder="••••••••" />
            </div>
            <button style={s.btn('purple')} onClick={() => toast.success('Password updated!')}>
              <Lock size={14} /> Update Password
            </button>
          </div>

          <div style={s.card}>
            <div style={s.sectionTitle}>🚨 Danger Zone</div>
            <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 16 }}>
              Once you delete your account, there is no going back.
            </p>
            <button style={s.btn('red')} onClick={() => toast.error('Contact support to delete account')}>
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={s.card}>
            <div style={s.sectionTitle}>🔔 Email Notifications</div>
            {[
              { label: 'Welcome Email', desc: 'Receive welcome email on signup', default: true },
              { label: 'Login Alert', desc: 'Get notified on new login', default: true },
              { label: 'Habit Complete', desc: 'Email when habit streak achieved', default: true },
              { label: 'Task Complete', desc: 'Email when task is completed', default: false },
              { label: 'Daily Reminder', desc: 'Daily 9 AM pending tasks reminder', default: true },
            ].map(({ label, desc, default: def }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{desc}</div>
                </div>
                <div style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: def ? 'linear-gradient(135deg, #a78bfa, #60a5fa)' : 'rgba(255,255,255,0.1)',
                  cursor: 'pointer', position: 'relative',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#fff', position: 'absolute',
                    top: 2, left: def ? 20 : 2,
                    transition: 'left 0.2s',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Help Tab */}
      {activeTab === 'help' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={s.card}>
            <div style={s.sectionTitle}>❓ Help & Support</div>
            {[
              { q: 'How to create a habit?', a: 'Go to Habit Forge → Click "New Habit" → Fill details → Save' },
              { q: 'How to track expenses?', a: 'Go to Wealth Map → Click "Add Expense" → Enter amount & category' },
              { q: 'How to add a task?', a: 'Go to Task Engine → Click "New Task" → Fill title & priority' },
              { q: 'How do I get email reminders?', a: 'Emails are sent automatically at 9 AM daily for pending tasks & habits' },
              { q: 'How to logout?', a: 'Click the logout button in sidebar or below' },
            ].map(({ q, a }) => (
              <div key={q} style={{
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa', marginBottom: 4 }}>
                  {q}
                </div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>{a}</div>
              </div>
            ))}
          </div>

          <div style={s.card}>
            <div style={s.sectionTitle}>📧 Contact Support</div>
            <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 16 }}>
              Having issues? Reach out to us.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a78bfa' }}>
              <Mail size={16} />
              <span style={{ fontSize: 14 }}>support@lifeos.app</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Logout Button */}
      <div style={s.card}>
        <button onClick={handleLogout} style={s.btn('red')}>
          <LogOut size={14} /> Logout from Life OS
        </button>
      </div>
    </div>
  );
}