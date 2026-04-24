import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>⚡</span>
          <h1 style={styles.logo}>DevBoard</h1>
        </div>
        <p style={styles.subtitle}>Manage your dev tasks with AI</p>
        {error && <div style={styles.error}>{error}</div>}
        <input style={styles.input} placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={styles.link}>Don't have an account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: '600' }}>Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', background: 'linear-gradient(135deg, #ede9fe 0%, #f5f7ff 50%, #e0f2fe 100%)'
  },
  card: {
    background: 'white', padding: '2.5rem', borderRadius: '20px',
    width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem',
    boxShadow: '0 20px 60px rgba(79, 70, 229, 0.15)'
  },
  logoArea: { display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
  logoIcon: { fontSize: '2rem' },
  logo: { fontSize: '1.8rem', fontWeight: '800', color: '#4f46e5', margin: 0 },
  subtitle: { color: '#6b7280', textAlign: 'center', margin: '-0.5rem 0 0.5rem', fontSize: '0.9rem' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' },
  input: {
    padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #e5e7eb',
    fontSize: '1rem', outline: 'none', transition: 'border 0.2s'
  },
  button: {
    padding: '0.85rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
    fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 12px rgba(79,70,229,0.3)'
  },
  link: { textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }
};