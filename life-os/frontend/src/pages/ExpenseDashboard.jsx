import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { expenseApi } from '../services/api';
import {
  Plus, TrendingUp, TrendingDown, DollarSign, PieChart,
  Trash2, X, BarChart2, Wallet, Target, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CATEGORIES = ['FOOD','TRANSPORT','HOUSING','HEALTHCARE','ENTERTAINMENT','SHOPPING',
  'EDUCATION','UTILITIES','SAVINGS','INVESTMENT','SALARY','FREELANCE','BUSINESS','GIFT','OTHER'];
const PAYMENT_METHODS = ['CASH','CREDIT_CARD','DEBIT_CARD','UPI','NET_BANKING','WALLET','OTHER'];
const CAT_COLORS = { FOOD:'#f59e0b',TRANSPORT:'#60a5fa',HOUSING:'#a78bfa',HEALTHCARE:'#34d399',
  ENTERTAINMENT:'#f87171',SHOPPING:'#ec4899',EDUCATION:'#14b8a6',UTILITIES:'#fb923c',
  SAVINGS:'#22d3ee',INVESTMENT:'#818cf8',SALARY:'#4ade80',FREELANCE:'#fbbf24',OTHER:'#94a3b8' };

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <motion.div whileHover={{ y: -3 }} style={{
      padding: '20px 24px', borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      border: `1px solid ${color}25`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
      {trend && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{trend}</div>}
    </motion.div>
  );
}

function TransactionModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '', amount: '', type: 'EXPENSE', category: 'FOOD',
    paymentMethod: 'UPI', description: '', expenseDate: new Date().toISOString().split('T')[0], currency: 'INR'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate({ ...form, amount: parseFloat(form.amount) });
      onClose();
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        style={{ width: '100%', maxWidth: 500, background: '#0d0d1f', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 20, fontWeight: 800 }}>Add Transaction</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={20} /></button>
        </div>

        {/* Type toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 }}>
          {['INCOME','EXPENSE'].map(t => (
            <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                background: form.type === t ? (t === 'INCOME' ? '#34d399' : '#f87171') : 'transparent',
                color: form.type === t ? '#fff' : '#6b7280', transition: 'all 0.2s',
              }}>{t}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>TITLE</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Grocery shopping" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>AMOUNT (₹)</label>
              <input required type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>DATE</label>
              <input type="date" required value={form.expenseDate} onChange={e => setForm({ ...form, expenseDate: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>CATEGORY</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ ...inputStyle, background: '#1a1a2e' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>PAYMENT</label>
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                style={{ ...inputStyle, background: '#1a1a2e' }}>
                {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{
              padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: form.type === 'INCOME' ? 'linear-gradient(135deg, #34d399, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff', fontWeight: 700, fontSize: 14, marginTop: 4,
            }}>
            {loading ? 'Adding...' : `Add ${form.type === 'INCOME' ? '💰' : '💸'} ${form.type}`}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchData = useCallback(async () => {
    try {
      const [expRes, statsRes] = await Promise.all([expenseApi.getAll(), expenseApi.getStats()]);
      setExpenses(expRes.data);
      setStats(statsRes.data);
    } catch { toast.error('Failed to load expenses'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (form) => {
    try {
      await expenseApi.create(form);
      toast.success('Transaction added! 💰');
      fetchData();
    } catch { toast.error('Failed to add transaction'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try { await expenseApi.delete(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const fmt = (n) => n != null ? `₹${Math.abs(Number(n)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0';

  const pieData = Object.entries(stats?.categoryBreakdown || {}).map(([name, value]) => ({
    name, value: Number(value), color: CAT_COLORS[name] || '#94a3b8',
  })).filter(d => d.value > 0);

  const areaData = (stats?.monthlyTrend || []).map(m => ({
    name: MONTHS[(m.month || 1) - 1],
    income: Number(m.income || 0),
    expenses: Number(m.expenses || 0),
  }));

  const filtered = expenses.filter(e => filter === 'ALL' || e.type === filter);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Sora', sans-serif" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>💰</span> Wealth Map
          </h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 14 }}>Track income, expenses & build wealth.</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          style={{ padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
          <Plus size={16} /> Add Transaction
        </motion.button>
      </motion.div>

      {/* Stat cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard icon={TrendingUp} label="INCOME" value={fmt(stats?.totalIncome)} color="#34d399" />
        <StatCard icon={TrendingDown} label="EXPENSES" value={fmt(stats?.totalExpenses)} color="#f87171" />
        <StatCard icon={Wallet} label="NET BALANCE" value={fmt(stats?.netBalance)} color={Number(stats?.netBalance) >= 0 ? '#34d399' : '#f87171'} />
        <StatCard icon={Target} label="SAVINGS RATE" value={`${Math.round(Number(stats?.savingsRate || 0))}%`} color="#a78bfa" />
      </motion.div>

      {/* Charts row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Area chart */}
        <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ margin: '0 0 20px', color: '#f1f5f9', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart2 size={16} color="#f59e0b" /> 6-Month Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, color: '#f1f5f9' }} />
              <Area type="monotone" dataKey="income" stroke="#34d399" fill="url(#incomeGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="#f87171" fill="url(#expGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ margin: '0 0 16px', color: '#f1f5f9', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieChart size={16} color="#a78bfa" /> By Category
          </h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <RechartsPie>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, color: '#f1f5f9' }} formatter={(v) => fmt(v)} />
                </RechartsPie>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 100, overflowY: 'auto' }}>
                {pieData.slice(0, 4).map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                      <span style={{ color: '#9ca3af' }}>{d.name}</span>
                    </div>
                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280', fontSize: 13 }}>No expense data</div>
          )}
        </div>
      </motion.div>

      {/* Transactions list */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ padding: '24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: 15, fontWeight: 700 }}>Transactions</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {['ALL','INCOME','EXPENSE'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: filter === f ? (f === 'INCOME' ? '#34d399' : f === 'EXPENSE' ? '#f87171' : '#a78bfa') : 'rgba(255,255,255,0.05)',
                  color: filter === f ? '#fff' : '#6b7280', transition: 'all 0.2s',
                }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
          <AnimatePresence>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: 40, color: '#6b7280', fontSize: 14 }}>
                No transactions yet. Add your first one!
              </motion.div>
            ) : filtered.map(e => (
              <motion.div key={e.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'background 0.2s',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${CAT_COLORS[e.category] || '#94a3b8'}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    {e.type === 'INCOME' ? '💰' : '💸'}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{e.title}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>
                      {e.category} · {e.paymentMethod?.replace('_', ' ')} · {new Date(e.expenseDate).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: e.type === 'INCOME' ? '#34d399' : '#f87171' }}>
                    {e.type === 'INCOME' ? '+' : '-'}{fmt(e.amount)}
                  </span>
                  <button onClick={() => handleDelete(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && <TransactionModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
      </AnimatePresence>
    </div>
  );
}
