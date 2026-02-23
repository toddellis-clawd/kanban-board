import { useState } from 'react';
import { supabase } from '../lib/supabase';

const inputBase = {
  width: '100%',
  padding: '10px 12px',
  backgroundColor: '#21253a',
  border: '1px solid #2e3349',
  borderRadius: '8px',
  color: '#e8eaf0',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const inputFocused = {
  ...inputBase,
  borderColor: '#5b6aff',
  boxShadow: '0 0 0 3px rgba(91, 106, 255, 0.15)',
};

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Account created! You can now sign in.');
        setMode('login');
      }
    }

    setLoading(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setMessage('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f1117',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#5b6aff',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="4" height="12" rx="1" fill="white" opacity="0.9" />
            <rect x="6" y="2" width="4" height="8" rx="1" fill="white" opacity="0.7" />
            <rect x="11" y="2" width="4" height="5" rx="1" fill="white" opacity="0.5" />
          </svg>
        </div>
        <span style={{ color: '#e8eaf0', fontSize: '20px', fontWeight: '700' }}>Kanban Board</span>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#1a1d27',
          border: '1px solid #2e3349',
          borderRadius: '16px',
          padding: '32px',
        }}
      >
        <h2
          style={{
            color: '#e8eaf0',
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '6px',
            textAlign: 'center',
          }}
        >
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p
          style={{ color: '#555c75', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}
        >
          {mode === 'login' ? 'Sign in to access your board' : 'Start organizing your work'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{ display: 'block', color: '#8b90a7', fontSize: '13px', marginBottom: '6px' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              style={inputBase}
              onFocus={(e) => Object.assign(e.target.style, inputFocused)}
              onBlur={(e) => Object.assign(e.target.style, inputBase)}
            />
          </div>

          <div>
            <label
              style={{ display: 'block', color: '#8b90a7', fontSize: '13px', marginBottom: '6px' }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={inputBase}
              onFocus={(e) => Object.assign(e.target.style, inputFocused)}
              onBlur={(e) => Object.assign(e.target.style, inputBase)}
            />
          </div>

          {error && (
            <p style={{ color: '#ff5263', fontSize: '13px', margin: 0 }}>{error}</p>
          )}
          {message && (
            <p style={{ color: '#3ecf8e', fontSize: '13px', margin: 0 }}>{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px',
              backgroundColor: loading ? '#3a3f5c' : '#5b6aff',
              color: loading ? '#8b90a7' : '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
              marginTop: '4px',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#4a57f5'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#5b6aff'; }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{ color: '#555c75', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={switchMode}
            style={{
              color: '#5b6aff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              padding: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#7b8aff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#5b6aff'; }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
