import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
  Home, Activity, DollarSign, CheckSquare, LogOut,
  Menu, X, Zap, Bell, Settings, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Command Center', icon: Home, color: '#a78bfa', exact: true },
  { to: '/habits', label: 'Habit Forge', icon: Activity, color: '#34d399' },
  { to: '/expenses', label: 'Wealth Map', icon: DollarSign, color: '#f59e0b' },
  { to: '/todos', label: 'Task Engine', icon: CheckSquare, color: '#60a5fa' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: '#070714', overflow: 'hidden',
      fontFamily: "'Sora', sans-serif",
      position: 'relative',
    }}>

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{
          x: isMobile ? (sidebarOpen ? 0 : -280) : 0,
          width: isMobile ? 260 : (sidebarOpen ? 260 : 72),
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(180deg, #0d0d1f 0%, #0a0a1a 100%)',
          borderRight: '1px solid rgba(167,139,250,0.15)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          position: isMobile ? 'fixed' : 'relative',
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(167,139,250,0.1)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(167,139,250,0.4)',
            }}>
              <Zap size={18} color="#fff" />
            </div>
            <AnimatePresence>
              {(sidebarOpen || !isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Life OS</div>
                  <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em' }}>YOUR UNIVERSE</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isMobile && (
            <button onClick={() => setSidebarOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav style={{
          flex: 1, padding: '16px 12px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {navItems.map(({ to, label, icon: Icon, color, exact }) => (
            <NavLink key={to} to={to} end={exact} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 2 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 12px', borderRadius: 10,
                    cursor: 'pointer', position: 'relative',
                    background: isActive ? `${color}18` : 'transparent',
                    border: isActive ? `1px solid ${color}30` : '1px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {isActive && (
                    <motion.div layoutId="activeIndicator" style={{
                      position: 'absolute', left: 0, top: '20%', bottom: '20%',
                      width: 3, borderRadius: 2,
                      background: color, boxShadow: `0 0 8px ${color}`,
                    }} />
                  )}
                  <Icon size={20} color={isActive ? color : '#6b7280'} style={{ flexShrink: 0 }} />
                  <AnimatePresence>
                    {(sidebarOpen || !isMobile) && (
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                          fontSize: 14, fontWeight: isActive ? 600 : 400,
                          color: isActive ? '#f1f5f9' : '#9ca3af',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && sidebarOpen && (
                    <ChevronRight size={14} color={color} style={{ marginLeft: 'auto' }} />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(167,139,250,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff',
            }}>
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
            <AnimatePresence>
              {(sidebarOpen || !isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: '#f1f5f9',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div style={{
                    fontSize: 11, color: '#6b7280',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {user?.email}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>

      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(167,139,250,0.1)',
          background: 'rgba(7,7,20,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', gap: 12,
          position: 'sticky', top: 0, zIndex: 5,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: 8, padding: '7px',
              color: '#a78bfa', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Menu size={18} />
          </button>

          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
              Life OS
            </span>
          </div>

          <button style={{
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.2)',
            borderRadius: 8, padding: '7px',
            color: '#a78bfa', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
          }}>
            <Bell size={16} />
          </button>

          {/* ✅ Settings button - navigate to /settings */}
          <button
            onClick={() => navigate('/settings')}
            style={{
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: 8, padding: '7px',
              color: '#a78bfa', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}>
            <Settings size={16} />
          </button>
        </div>

        <div style={{ flex: 1, padding: isMobile ? '16px' : '28px', overflow: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}