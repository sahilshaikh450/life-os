import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { habitApi } from '../services/api';
import {
  Plus, Flame, Target, TrendingUp, CheckCircle2, Circle,
  Activity, Trash2, Archive, X, BarChart2, Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#34d399','#60a5fa','#a78bfa','#f59e0b','#f87171','#ec4899','#14b8a6','#8b5cf6'];
const CATEGORIES = ['HEALTH','FITNESS','MINDFULNESS','LEARNING','PRODUCTIVITY','SOCIAL','FINANCE','CREATIVITY','OTHER'];
const FREQUENCIES = ['DAILY','WEEKLY','MONTHLY'];
const ICONS = ['💪','🧘','📚','💧','🏃','😴','🥗','🎯','💡','🧠','🎵','✍️','🌱','⚡','🔥'];

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div whileHover={{ y: -3 }} style={{
      padding: '16px', borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      border: `1px solid ${color}25`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
        <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{sub}</div>}
    </motion.div>
  );
}

function HabitCard({ habit, onLog, onDelete, onArchive }) {
  const pct = Math.min(100, Math.round(habit.completionRate || 0));
  const color = habit.color || '#34d399';
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      style={{
        padding: '16px', borderRadius: 16,
        background: habit.completedToday ? `linear-gradient(135deg, ${color}15, ${color}08)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${habit.completedToday ? color + '40' : 'rgba(255,255,255,0.08)'}`,
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{habit.icon || '⚡'}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{habit.name}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{habit.category} · {habit.frequency}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={() => onDelete(habit.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}><Trash2 size={13} /></button>
          <button onClick={() => onArchive(habit.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}><Archive size={13} /></button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Flame size={14} color="#f59e0b" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>{habit.currentStreak}d</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Award size={14} color="#a78bfa" />
          <span style={{ fontSize: 12, color: '#9ca3af' }}>Best: {habit.longestStreak}d</span>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#6b7280' }}>Completion</span>
          <span style={{ fontSize: 11, fontWeight: 700, color }}>{pct}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 3 }} />
        </div>
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => onLog(habit.id, !habit.completedToday)}
        style={{
          width: '100%', padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: habit.completedToday ? `${color}25` : `linear-gradient(135deg, ${color}, ${color}bb)`,
          color: habit.completedToday ? color : '#fff',
          fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
        {habit.completedToday ? <><CheckCircle2 size={15} /> Done Today!</> : <><Circle size={15} /> Mark Complete</>}
      </motion.button>
    </motion.div>
  );
}

function HabitModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', description: '', icon: '💪', color: COLORS[0], frequency: 'DAILY', category: 'HEALTH' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onCreate(form); onClose(); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 }}>
      <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
        style={{ width: '100%', maxWidth: 520, background: '#0d0d1f', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '20px 20px 0 0', padding: '24px 20px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 18, fontWeight: 800 }}>New Habit</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>HABIT NAME</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Meditate for 10 minutes"
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>ICON</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ICONS.map(ic => (
                <button type="button" key={ic} onClick={() => setForm({ ...form, icon: ic })}
                  style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${form.icon === ic ? '#a78bfa' : 'transparent'}`, background: form.icon === ic ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: 18 }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>FREQUENCY</label>
              <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', background: '#1a1a2e', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none' }}>
                {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>CATEGORY</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', background: '#1a1a2e', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>COLOR</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map(c => (
                <button type="button" key={c} onClick={() => setForm({ ...form, color: c })}
                  style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: `3px solid ${form.color === c ? '#fff' : 'transparent'}`, cursor: 'pointer' }} />
              ))}
            </div>
          </div>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #34d399, #059669)', color: '#fff', fontWeight: 700, fontSize: 14 }}>
            {loading ? 'Creating...' : 'Create Habit ✨'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function HabitDashboard() {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [habitsRes, statsRes] = await Promise.all([habitApi.getAll(), habitApi.getStats()]);
      setHabits(habitsRes.data);
      setStats(statsRes.data);
    } catch { toast.error('Failed to load habits'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (form) => {
    try { await habitApi.create(form); toast.success('Habit created! 🎯'); fetchData(); }
    catch { toast.error('Failed to create habit'); }
  };

  const handleLog = async (id, completed) => {
    try {
      await habitApi.log(id, { completed, logDate: new Date().toISOString().split('T')[0] });
      toast.success(completed ? 'Habit completed! 🔥' : 'Habit unmarked');
      fetchData();
    } catch { toast.error('Failed to log habit'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this habit?')) return;
    try { await habitApi.delete(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleArchive = async (id) => {
    try { await habitApi.archive(id); toast.success('Archived'); fetchData(); }
    catch { toast.error('Failed to archive'); }
  };

  const weeklyChartData = stats?.weeklyData?.map(d => ({
    day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
    completed: d.completed,
    total: d.total,
    rate: Math.round(d.rate),
  })) || [];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Sora', sans-serif" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 24 : 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>💪</span> Habit Forge
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13 }}>Build atomic habits. Transform your life.</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #34d399, #059669)',
              color: '#fff', fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 0 20px rgba(52,211,153,0.3)', flexShrink: 0,
            }}>
            <Plus size={15} /> New Habit
          </motion.button>
        </div>
      </motion.div>

      {/* Stats — 2x2 grid on mobile, 4 columns on desktop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 10 : 16,
          marginBottom: 20,
        }}>
        <StatCard icon={Activity} label="TOTAL" value={stats?.totalHabits ?? 0} color="#34d399" />
        <StatCard icon={CheckCircle2} label="DONE TODAY" value={stats?.completedToday ?? 0} color="#60a5fa" sub={`of ${stats?.activeHabits ?? 0}`} />
        <StatCard icon={Flame} label="STREAK" value={`${stats?.longestCurrentStreak ?? 0}🔥`} color="#f59e0b" />
        <StatCard icon={TrendingUp} label="RATE" value={`${Math.round(stats?.overallCompletionRate ?? 0)}%`} color="#a78bfa" />
      </motion.div>

      {/* Weekly chart */}
      {weeklyChartData.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px', color: '#f1f5f9', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart2 size={15} color="#34d399" /> This Week
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weeklyChartData} barSize={28}>
              <XAxis dataKey="day" stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 8, color: '#f1f5f9' }} />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                {weeklyChartData.map((_, i) => <Cell key={i} fill={`hsl(${160 + i * 10}, 70%, 60%)`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Habits grid */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, color: '#9ca3af', fontSize: 12, fontWeight: 600, letterSpacing: '0.15em' }}>
          YOUR HABITS ({habits.length})
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading habits...</div>
      ) : habits.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: 60, borderRadius: 20, border: '2px dashed rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
          <h3 style={{ color: '#9ca3af', margin: '0 0 8px', fontSize: 18 }}>No habits yet</h3>
          <p style={{ color: '#6b7280', margin: '0 0 20px', fontSize: 14 }}>Start your first habit today</p>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowModal(true)}
            style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #34d399, #059669)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            Create First Habit
          </motion.button>
        </motion.div>
      ) : (
        <motion.div layout style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: isMobile ? 12 : 16,
        }}>
          <AnimatePresence>
            {habits.map(habit => (
              <HabitCard key={habit.id} habit={habit} onLog={handleLog} onDelete={handleDelete} onArchive={handleArchive} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <HabitModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
      </AnimatePresence>
    </div>
  );
}