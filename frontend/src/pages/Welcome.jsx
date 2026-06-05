import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Welcome() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  // Decode the JWT payload to get the username (no verification needed client-side)
  function getUsername() {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub ?? 'Usuario';
    } catch {
      return 'Usuario';
    }
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const username = getUsername();

  return (
    <div style={styles.page}>
      {/* Background gradient accents */}
      <div style={styles.bgAccentTop} />
      <div style={styles.bgAccentBottom} />

      <div style={styles.container}>
        {/* Top navigation bar */}
        <nav style={styles.nav}>
          <div style={styles.navBrand}>
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
            <span style={styles.brandName}>FlowOps</span>
          </div>
          <div style={styles.navActions}>
            <span style={styles.navUsername}>{username}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Cerrar sesión
            </button>
          </div>
        </nav>

        {/* Hero section */}
        <main style={styles.main}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardInner}>
              <div style={styles.badge}>Panel de Control</div>
              <h1 style={styles.heading}>
                Bienvenido,{' '}
                <span style={styles.headingAccent}>{username}</span>
              </h1>
              <p style={styles.description}>
                Has iniciado sesión correctamente. Tu sesión está activa y protegida con JWT.
                Puedes navegar por el panel con plena confianza.
              </p>

              {/* Stats grid */}
              <div style={styles.statsGrid}>
                <StatCard
                  icon="✦"
                  label="Sesión"
                  value="Activa"
                  accent="var(--color-secondary)"
                />
                <StatCard
                  icon="⬡"
                  label="Autenticación"
                  value="JWT"
                  accent="var(--color-tertiary)"
                />
                <StatCard
                  icon="◈"
                  label="Estado"
                  value="OK"
                  accent="#dcfce7"
                />
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div style={styles.cardsRow}>
            <InfoCard
              title="Seguridad"
              body="Tu token de acceso está almacenado en la sesión del navegador y se limpia al cerrar la pestaña."
            />
            <InfoCard
              title="Acceso protegido"
              body="Esta página no es accesible sin una sesión válida. Al cerrar sesión serás redirigido al login."
            />
            <InfoCard
              title="Backend"
              body="La autenticación usa FastAPI + JWT. El access token expira en 300 segundos tras el login."
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div
      style={{
        ...styles.statCard,
        backgroundColor: accent,
      }}
    >
      <span style={styles.statIcon}>{icon}</span>
      <div>
        <p style={styles.statLabel}>{label}</p>
        <p style={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, body }) {
  return (
    <div style={styles.infoCard}>
      <h3 style={styles.infoTitle}>{title}</h3>
      <p style={styles.infoBody}>{body}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100%',
    backgroundColor: 'var(--color-background)',
    position: 'relative',
    overflow: 'hidden',
  },
  bgAccentTop: {
    position: 'fixed',
    top: '-120px',
    right: '-80px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(255, 237, 213, 0.4) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgAccentBottom: {
    position: 'fixed',
    bottom: '-100px',
    left: '-60px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(224, 231, 255, 0.35) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 0',
    borderBottom: '0.8px solid var(--color-surface)',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  brandName: {
    fontSize: '18px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    letterSpacing: '-0.025em',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navUsername: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    letterSpacing: '0.35px',
  },
  logoutButton: {
    fontFamily: 'var(--font-family)',
    fontSize: '14px',
    fontWeight: 500,
    letterSpacing: '0.35px',
    color: 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    border: '0px solid transparent',
    borderRadius: '0px',
    padding: '0px',
    cursor: 'pointer',
    transition: 'color 150ms ease',
  },
  main: {
    padding: '48px 0 64px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  heroCard: {
    borderRadius: '32px',
    boxShadow: 'var(--shadow-card)',
    background: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0) 1px)',
  },
  heroCardInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '32px',
    padding: '48px',
    backdropFilter: 'blur(4px)',
    border: '0.8px solid rgba(255,255,255,0.8)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.35px',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '9999px',
    padding: '4px 12px',
    marginBottom: '16px',
  },
  heading: {
    fontSize: '48px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    letterSpacing: '-0.025em',
    lineHeight: '1.1',
    marginBottom: '16px',
  },
  headingAccent: {
    color: 'var(--color-primary)',
  },
  description: {
    fontSize: '14px',
    fontWeight: 300,
    color: 'var(--color-text-primary)',
    maxWidth: '520px',
    lineHeight: '22.75px',
    marginBottom: '32px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  statCard: {
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statIcon: {
    fontSize: '20px',
    color: 'var(--color-primary)',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: 300,
    color: 'var(--color-text-primary)',
    lineHeight: 1.2,
    marginBottom: '2px',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.35px',
  },
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    border: '0.8px solid rgba(255,255,255,0.8)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0.04) 0px 8px 30px 0px',
    backdropFilter: 'blur(4px)',
  },
  infoTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.35px',
    marginBottom: '8px',
  },
  infoBody: {
    fontSize: '14px',
    fontWeight: 300,
    color: 'var(--color-text-primary)',
    lineHeight: '22.75px',
  },
};
