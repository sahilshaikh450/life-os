import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';

export default function LoginPage() {

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();

  const navigate = useNavigate();

  // =========================
  // HANDLE LOGIN
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    console.log(form);

    setLoading(true);

    try {

      await login(form);

      toast.success('Welcome back! 🚀');

      navigate('/');

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        'Login failed'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      style={{
        minHeight: '100vh',
        background: '#070714',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Sora', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      {/* BACKGROUND */}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #7c3aed, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #2563eb, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

      </div>

      {/* CARD */}

      <motion.div

        initial={{
          opacity: 0,
          y: 30,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.6,
        }}

        style={{
          width: '100%',
          maxWidth: 440,
          padding: '48px 40px',

          background:
            'linear-gradient(135deg, rgba(13,13,31,0.9) 0%, rgba(10,10,26,0.9) 100%)',

          border:
            '1px solid rgba(167,139,250,0.2)',

          borderRadius: 24,

          backdropFilter: 'blur(20px)',

          position: 'relative',

          zIndex: 1,
        }}
      >

        {/* LOGO */}

        <div
          style={{
            textAlign: 'center',
            marginBottom: 40,
          }}
        >

          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              margin: '0 auto 16px',

              background:
                'linear-gradient(135deg, #a78bfa, #60a5fa)',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              boxShadow:
                '0 0 30px rgba(167,139,250,0.5)',
            }}
          >
            <Zap size={24} color="#fff" />
          </div>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#f1f5f9',
              margin: 0,
              letterSpacing: '-1px',
            }}
          >
            Welcome back
          </h1>

          <p
            style={{
              color: '#6b7280',
              marginTop: 8,
              fontSize: 14,
            }}
          >
            Sign in to your Life OS
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >

          {/* EMAIL */}

          <div>

            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#9ca3af',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: 8,
              }}
            >
              EMAIL
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >

              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                }}
              />

              <input

                className="life-input"

                type="email"

                required

                autoComplete="off"

                spellCheck={false}

                value={form.email}

                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }

                placeholder="you@example.com"

                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',

                  background:
                    'rgba(255,255,255,0.05)',

                  border:
                    '1px solid rgba(167,139,250,0.2)',

                  borderRadius: 10,

                  color: '#f1f5f9',

                  fontSize: 14,

                  outline: 'none',

                  boxSizing: 'border-box',

                  transition: '0.2s',
                }}

              />

            </div>

          </div>

          {/* PASSWORD */}

          <div>

            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#9ca3af',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: 8,
              }}
            >
              PASSWORD
            </label>

            <div
              style={{
                position: 'relative',
              }}
            >

              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                }}
              />

              <input

                className="life-input"

                type={
                  showPass
                    ? 'text'
                    : 'password'
                }

                required

                autoComplete="off"

                spellCheck={false}

                value={form.password}

                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }

                placeholder="••••••••"

                style={{
                  width: '100%',

                  padding:
                    '12px 40px 12px 40px',

                  background:
                    'rgba(255,255,255,0.05)',

                  border:
                    '1px solid rgba(167,139,250,0.2)',

                  borderRadius: 10,

                  color: '#f1f5f9',

                  fontSize: 14,

                  outline: 'none',

                  boxSizing: 'border-box',

                  transition: '0.2s',
                }}

              />

              <button

                type="button"

                onClick={() =>
                  setShowPass(!showPass)
                }

                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',

                  background: 'none',

                  border: 'none',

                  cursor: 'pointer',

                  color: '#6b7280',
                }}
              >

                {
                  showPass
                    ? <EyeOff size={16} />
                    : <Eye size={16} />
                }

              </button>

            </div>

          </div>

          {/* BUTTON */}

          <motion.button

            type="submit"

            disabled={loading}

            whileHover={{
              scale: 1.02,
            }}

            whileTap={{
              scale: 0.98,
            }}

            style={{

              padding: '14px',

              borderRadius: 12,

              border: 'none',

              cursor: 'pointer',

              marginTop: 8,

              background:
                loading
                  ? '#4b5563'
                  : 'linear-gradient(135deg, #a78bfa, #60a5fa)',

              color: '#fff',

              fontSize: 15,

              fontWeight: 700,

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              gap: 8,

              boxShadow:
                loading
                  ? 'none'
                  : '0 0 30px rgba(167,139,250,0.4)',
            }}
          >

            {
              loading
                ? 'Signing in...'
                : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )
            }

          </motion.button>

        </form>

        {/* REGISTER */}

        <p
          style={{
            textAlign: 'center',
            marginTop: 24,
            color: '#6b7280',
            fontSize: 14,
          }}
        >
          Don't have an account?{' '}

          <Link
            to="/register"
            style={{
              color: '#a78bfa',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Create one
          </Link>

        </p>

      </motion.div>

    </div>
  );
}