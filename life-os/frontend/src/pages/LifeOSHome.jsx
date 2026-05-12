import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { habitApi, expenseApi, todoApi } from '../services/api';
import { Activity, DollarSign, CheckSquare, TrendingUp, Flame, Target, Zap, ArrowRight, Star } from 'lucide-react';

const moduleCards = [
  {
    to: '/habits',
    title: 'Habit Forge',
    subtitle: 'Build unstoppable routines',
    icon: Activity,
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
    glow: '#10b981',
    stat: 'Active Habits',
    statKey: 'habits',
  },
  {
    to: '/expenses',
    title: 'Wealth Map',
    subtitle: 'Master your finances',
    icon: DollarSign,
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    glow: '#f59e0b',
    stat: 'Net Balance',
    statKey: 'expenses',
  },
  {
    to: '/todos',
    title: 'Task Engine',
    subtitle: 'Conquer your goals',
    icon: CheckSquare,
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)',
    glow: '#3b82f6',
    stat: 'Pending Tasks',
    statKey: 'todos',
  },
];

export default function LifeOSHome() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ habits: null, expenses: null, todos: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      habitApi.getStats(),
      expenseApi.getStats(),
      todoApi.getStats(),
    ]).then(([habits, expenses, todos]) => {
      setStats({
        habits: habits.status === 'fulfilled' ? habits.value.data : null,
        expenses: expenses.status === 'fulfilled' ? expenses.value.data : null,
        todos: todos.status === 'fulfilled' ? todos.value.data : null,
      });
      setLoading(false);
    });
  }, []);

  const getStatDisplay = (key) => {
    if (loading) return '...';
    if (key === 'habits') return stats.habits?.activeHabits ?? '—';
    if (key === 'expenses') {
      const bal = stats.expenses?.netBalance;
      return bal != null ? `₹${Math.abs(bal).toLocaleString('en-IN')}` : '—';
    }
    if (key === 'todos') return stats.todos?.pendingTasks ?? '—';
    return '—';
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Sora', sans-serif" }}>

      {/* Hero greeting */}
      <motion.div variants={itemVariants} style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(167,139,250,0.4)',
          }}>
            <Zap size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1.5px' }}>
              {greeting()}, {user?.firstName} 👋
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 15 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 28 }}>
          {[
            { label: 'Streak Today', value: `${stats.habits?.longestCurrentStreak ?? 0}🔥`, icon: Flame, color: '#f59e0b' },
            { label: 'Tasks Done', value: stats.todos?.completedTasks ?? 0, icon: Target, color: '#34d399' },
            { label: 'Completion Rate', value: `${Math.round(stats.todos?.completionRate ?? 0)}%`, icon: TrendingUp, color: '#a78bfa' },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div key={label} whileHover={{ scale: 1.02 }}
              style={{
                padding: '16px 20px', borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 14,
              }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>{loading ? '—' : value}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Module cards */}
      <motion.div variants={itemVariants}>
        <h2 style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 600, color: '#4b5563', letterSpacing: '0.15em' }}>YOUR MODULES</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {moduleCards.map(({ to, title, subtitle, icon: Icon, gradient, glow, stat, statKey }) => (
            <motion.div
              key={to}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => navigate(to)}
              style={{ cursor: 'pointer', borderRadius: 20, overflow: 'hidden', position: 'relative' }}
            >
              {/* Card background */}
              <div style={{
                padding: '32px 28px', background: gradient,
                position: 'relative', minHeight: 200,
              }}>
                {/* Glow orb */}
                <div style={{
                  position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%',
                  background: `radial-gradient(circle, ${glow}60, transparent 70%)`,
                }} />
                {/* Pattern */}
                <div style={{
                  position: 'absolute', bottom: -20, left: -20, width: 140, height: 140, borderRadius: '50%',
                  border: `1px solid rgba(255,255,255,0.15)`,
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 10, width: 100, height: 100, borderRadius: '50%',
                  border: `1px solid rgba(255,255,255,0.1)`,
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={22} color="#fff" />
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{title}</h3>
                  <p style={{ margin: '0 0 20px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{subtitle}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{getStatDisplay(statKey)}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>{stat}</div>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={16} color="#fff" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quote / Motivation */}
      <motion.div variants={itemVariants} style={{
        marginTop: 40, padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(96,165,250,0.05))',
        border: '1px solid rgba(167,139,250,0.15)', borderRadius: 16,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <Star size={20} color="#a78bfa" />
        <p style={{ margin: 0, color: '#9ca3af', fontSize: 14, fontStyle: 'italic' }}>
          "Success is the sum of small efforts, repeated day in and day out." — Robert Collier
        </p>
      </motion.div>
    </motion.div>
  );
}
