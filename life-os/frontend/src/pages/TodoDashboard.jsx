
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { todoApi } from '../services/api';
import {
  Plus, CheckCircle2, Circle, Clock, AlertTriangle, Trash2,
  X, Tag, Calendar, BarChart2, Layers, List, Target,
  ChevronDown, ChevronRight
} from 'lucide-react';

const PRIORITIES = ['LOW','MEDIUM','HIGH','URGENT'];
const STATUSES = ['TODO','IN_PROGRESS','REVIEW','DONE','CANCELLED'];
const PRIORITY_COLORS = { LOW: '#6b7280', MEDIUM: '#60a5fa', HIGH: '#f59e0b', URGENT: '#f87171' };
const STATUS_COLORS = { TODO: '#6b7280', IN_PROGRESS: '#60a5fa', REVIEW: '#f59e0b', DONE: '#34d399', CANCELLED: '#f87171' };
const PRIORITY_ICONS = { LOW: '🟢', MEDIUM: '🔵', HIGH: '🟡', URGENT: '🔴' };

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div whileHover={{ y: -3 }} style={{
      padding: '14px', borderRadius: 14,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      border: `1px solid ${color}25`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color={color} />
        </div>
        <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
    </motion.div>
  );
}

function TodoModal({ onClose, onCreate, projects }) {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM', status: 'TODO',
    dueDate: '', tags: '', estimatedMinutes: '', projectId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate({
        ...form,
        dueDate: form.dueDate || null,
        estimatedMinutes: form.estimatedMinutes ? parseInt(form.estimatedMinutes) : null,
        projectId: form.projectId || null,
      });
      onClose();
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(96,165,250,0.2)',
    borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 }}>
      <motion.div initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }}
        style={{ width: '100%', maxWidth: 520, background: '#0d0d1f', border: '1px solid rgba(96,165,250,0.25)', borderRadius: '20px 20px 0 0', padding: '24px 20px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 18, fontWeight: 800 }}>New Task</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>TASK TITLE</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>DESCRIPTION</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Add details..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>PRIORITY</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                style={{ ...inputStyle, background: '#1a1a2e' }}>
                {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_ICONS[p]} {p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>STATUS</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ ...inputStyle, background: '#1a1a2e' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>DUE DATE</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>MINUTES</label>
              <input type="number" min="0" value={form.estimatedMinutes} onChange={e => setForm({ ...form, estimatedMinutes: e.target.value })} placeholder="30" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em', display: 'block', marginBottom: 5 }}>TAGS</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="work, urgent" style={inputStyle} />
          </div>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', fontWeight: 700, fontSize: 14, marginTop: 4 }}>
            {loading ? 'Creating...' : 'Create Task ✨'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function TaskItem({ task, onToggle, onDelete, depth = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const pColor = PRIORITY_COLORS[task.priority] || '#6b7280';
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <motion.div layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px',
        borderRadius: 12, marginLeft: depth * 16,
        background: task.completed ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${task.completed ? 'rgba(52,211,153,0.2)' : task.overdue ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.05)'}`,
        marginBottom: 6,
      }}>
        {hasSubtasks && (
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '2px 0', flexShrink: 0, marginTop: 1 }}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        <button onClick={() => onToggle(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? '#34d399' : '#6b7280', padding: 0, flexShrink: 0, marginTop: 1 }}>
          {task.completed ? <CheckCircle2 size={17} /> : <Circle size={17} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: task.completed ? '#6b7280' : '#f1f5f9', textDecoration: task.completed ? 'line-through' : 'none', flex: 1 }}>
              {task.title}
            </span>
            <button onClick={() => onDelete(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '2px', flexShrink: 0 }}>
              <Trash2 size={13} />
            </button>
          </div>

          {/* Tags row */}
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${pColor}20`, color: pColor, fontWeight: 700 }}>
              {PRIORITY_ICONS[task.priority]} {task.priority}
            </span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${STATUS_COLORS[task.status]}20`, color: STATUS_COLORS[task.status], fontWeight: 600 }}>
              {task.status?.replace('_', ' ')}
            </span>
            {task.overdue && !task.completed && (
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(248,113,113,0.15)', color: '#f87171', fontWeight: 700 }}>⚠️ OVERDUE</span>
            )}
            {task.dueDate && (
              <span style={{ fontSize: 10, color: task.overdue ? '#f87171' : '#6b7280', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Calendar size={9} /> {new Date(task.dueDate).toLocaleDateString('en-IN')}
              </span>
            )}
            {task.tags && (
              <span style={{ fontSize: 10, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tag size={9} /> {task.tags}
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && hasSubtasks && (
        <AnimatePresence>
          {task.subtasks.map(sub => (
            <TaskItem key={sub.id} task={sub} onToggle={onToggle} onDelete={onDelete} depth={depth + 1} />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function KanbanColumn({ status, tasks, onToggle, onDelete }) {
  const color = STATUS_COLORS[status];
  return (
    <div style={{ minWidth: 200, flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '7px 10px', borderRadius: 8, background: `${color}15`, border: `1px solid ${color}30` }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{status.replace('_', ' ')}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b7280' }}>{tasks.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
        <AnimatePresence>
          {tasks.map(t => (
            <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.completed ? '#6b7280' : '#f1f5f9', marginBottom: 6, textDecoration: t.completed ? 'line-through' : 'none' }}>
                {t.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${PRIORITY_COLORS[t.priority]}20`, color: PRIORITY_COLORS[t.priority], fontWeight: 700 }}>
                  {t.priority}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => onToggle(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.completed ? '#34d399' : '#6b7280', padding: 2 }}>
                    {t.completed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                  </button>
                  <button onClick={() => onDelete(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 2 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [todosRes, statsRes, projRes] = await Promise.all([
        todoApi.getAll(), todoApi.getStats(), todoApi.getProjects()
      ]);
      setTodos(todosRes.data);
      setStats(statsRes.data);
      setProjects(projRes.data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (form) => {
    try { await todoApi.create(form); toast.success('Task created! ✅'); fetchData(); }
    catch { toast.error('Failed to create task'); }
  };

  const handleToggle = async (id) => {
    try { await todoApi.toggle(id); fetchData(); }
    catch { toast.error('Failed to update task'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await todoApi.delete(id); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const filteredTodos = todos.filter(t => {
    const statusOk = filter === 'ALL' || (filter === 'DONE' ? t.completed : !t.completed && t.status === filter);
    const priorityOk = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return statusOk && priorityOk;
  });

  const kanbanCols = STATUSES.reduce((acc, s) => {
    acc[s] = todos.filter(t => t.status === s);
    return acc;
  }, {});

  const completionPct = stats ? Math.round(stats.completionRate) : 0;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Sora', sans-serif" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 24 : 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>✅</span> Task Engine
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13 }}>Focus, execute, and get things done.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 3, gap: 3 }}>
              <button onClick={() => setView('list')} style={{ padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', background: view === 'list' ? '#3b82f6' : 'transparent', color: view === 'list' ? '#fff' : '#6b7280' }}>
                <List size={14} />
              </button>
              <button onClick={() => setView('kanban')} style={{ padding: '6px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', background: view === 'kanban' ? '#3b82f6' : 'transparent', color: view === 'kanban' ? '#fff' : '#6b7280' }}>
                <Layers size={14} />
              </button>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              style={{
                padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 5,
                boxShadow: '0 0 15px rgba(59,130,246,0.3)',
              }}>
              <Plus size={14} /> New
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats — 3 columns on mobile (smaller), 5 on desktop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
          gap: isMobile ? 8 : 16,
          marginBottom: 16,
        }}>
        <StatCard icon={BarChart2} label="TOTAL" value={stats?.totalTasks ?? 0} color="#60a5fa" />
        <StatCard icon={CheckCircle2} label="DONE" value={stats?.completedTasks ?? 0} color="#34d399" />
        <StatCard icon={Clock} label="PENDING" value={stats?.pendingTasks ?? 0} color="#f59e0b" />
        {!isMobile && <StatCard icon={AlertTriangle} label="OVERDUE" value={stats?.overdueTasks ?? 0} color="#f87171" />}
        {!isMobile && <StatCard icon={Target} label="RATE" value={`${completionPct}%`} color="#a78bfa" />}
      </motion.div>

      {/* Mobile: show overdue + rate in a small row */}
      {isMobile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <StatCard icon={AlertTriangle} label="OVERDUE" value={stats?.overdueTasks ?? 0} color="#f87171" />
          <StatCard icon={Target} label="RATE" value={`${completionPct}%`} color="#a78bfa" />
        </motion.div>
      )}

      {/* Progress bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>Overall Progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>{completionPct}%</span>
        </div>
        <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #a78bfa)', borderRadius: 4 }} />
        </div>
      </motion.div>

      {/* Filters — wrap on mobile */}
      {view === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ marginBottom: 16 }}>
          {/* Status filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {['ALL','TODO','IN_PROGRESS','REVIEW','DONE'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: isMobile ? 11 : 12, fontWeight: 600,
                  background: filter === f ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  color: filter === f ? '#fff' : '#6b7280', transition: 'all 0.2s',
                }}>{f.replace('_', ' ')}</button>
            ))}
          </div>
          {/* Priority filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['ALL', ...PRIORITIES].map(p => (
              <button key={p} onClick={() => setPriorityFilter(p)}
                style={{
                  padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 600,
                  background: priorityFilter === p ? (PRIORITY_COLORS[p] || '#3b82f6') : 'rgba(255,255,255,0.05)',
                  color: priorityFilter === p ? '#fff' : '#6b7280', transition: 'all 0.2s',
                }}>{p === 'ALL' ? 'All' : `${PRIORITY_ICONS[p]} ${p}`}</button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading tasks...</div>
      ) : view === 'kanban' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
          {STATUSES.map(s => (
            <KanbanColumn key={s} status={s} tasks={kanbanCols[s]} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </motion.div>
      ) : filteredTodos.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: 60, borderRadius: 20, border: '2px dashed rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <h3 style={{ color: '#9ca3af', margin: '0 0 8px', fontSize: 18 }}>No tasks here</h3>
          <p style={{ color: '#6b7280', margin: '0 0 20px', fontSize: 14 }}>Create your first task</p>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowModal(true)}
            style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            Create First Task
          </motion.button>
        </motion.div>
      ) : (
        <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <AnimatePresence>
            {filteredTodos.map(todo => (
              <TaskItem key={todo.id} task={todo} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <TodoModal onClose={() => setShowModal(false)} onCreate={handleCreate} projects={projects} />}
      </AnimatePresence>
    </div>
  );
}