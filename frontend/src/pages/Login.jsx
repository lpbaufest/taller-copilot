import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? '/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? 'Credenciales inválidas');
      }
      const data = await res.json();
      login(data.access_token, data.refresh_token);
      navigate('/welcome', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* Background gradient accents */}
      <div style={styles.bgAccentTop} />
      <div style={styles.bgAccentBottom} />

      <div style={styles.card}>
        {/* Gradient border shell */}
        <div style={styles.cardInner}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.logo}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#111827" />
                <path
                  d="M8 14h4m0 0l-2-2m2 2l-2 2M14 8v4m0 0l-2-2m2 2l2-2M20 14h-4m0 0l2-2m-2 2l2 2M14 20v-4m0 0l-2 2m2-2l2 2"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 style={styles.brand}>FlowOps</h1>
          </div>

          <h2 style={styles.title}>Iniciar sesión</h2>
          <p style={styles.subtitle}>Accede a tu panel de control</p>

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="username">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="admin"
                required
                disabled={loading}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div style={styles.errorBox} role="alert">
                <span style={styles.errorIcon}>⚠</span>
                {error}
              </div>
            )}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <p style={styles.hint}>
            Usa las credenciales proporcionadas por tu administrador.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-background)',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgAccentTop: {
    position: 'absolute',
    top: '-120px',
    right: '-80px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(255, 237, 213, 0.5) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgAccentBottom: {
    position: 'absolute',
    bottom: '-100px',
    left: '-60px',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(224, 231, 255, 0.4) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: '32px',
    background: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0) 1px)',
    boxShadow: 'var(--shadow-card)',
    position: 'relative',
    zIndex: 1,
  },
  cardInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '32px',
    padding: '40px',
    backdropFilter: 'blur(4px)',
    border: '0.8px solid rgba(255,255,255,0.8)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  brand: {
    fontSize: '18px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    letterSpacing: '-0.025em',
    lineHeight: 1,
  },
  title: {
    fontSize: '24px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    fontWeight: 300,
    color: 'var(--color-text-primary)',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.35px',
    lineHeight: '20px',
  },
  input: {
    fontFamily: 'var(--font-family)',
    fontSize: '14px',
    fontWeight: 300,
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-surface)',
    border: '0.8px solid #e0e7ff',
    borderRadius: '8px',
    padding: '10px 14px',
    outline: 'none',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
    width: '100%',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff1f2',
    border: '0.8px solid #fecdd3',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#be123c',
  },
  errorIcon: {
    flexShrink: 0,
  },
  button: {
    fontFamily: 'var(--font-family)',
    fontSize: '14px',
    fontWeight: 500,
    letterSpacing: '0.35px',
    color: '#ffffff',
    backgroundColor: 'var(--color-primary)',
    border: '0px solid transparent',
    borderRadius: '9999px',
    padding: '10px',
    cursor: 'pointer',
    transition: 'opacity 150ms ease, transform 150ms ease',
    marginTop: '8px',
  },
  hint: {
    fontSize: '12px',
    fontWeight: 300,
    color: 'var(--color-text-primary)',
    textAlign: 'center',
    marginTop: '24px',
  },
};
