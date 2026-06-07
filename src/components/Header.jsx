// components/Header.jsx
import { useState, useEffect } from 'react';
import { Satellite, Activity, Menu, X, Zap } from 'lucide-react';

// Componente Header — barra de navegação principal com relógio em tempo real
export default function Header({ activeSection, onNavigate }) {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  // Atualiza o relógio a cada segundo com useEffect
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // cleanup ao desmontar
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'sentinel',  label: 'Sentinel' },
  ];

  const formatTime = (date) =>
    date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date) =>
    date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header style={styles.header}>
      {/* Linha de scan animada */}
      <div style={styles.scanLine} />

      <div style={styles.inner}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => onNavigate('dashboard')}>
          <div style={styles.logoIconWrap}>
            <Satellite size={22} color="var(--accent-cyan)" />
            <span style={styles.logoPing} />
          </div>
          <div>
            <div style={styles.logoTitle}>OrbitalMind</div>
            <div style={styles.logoSub}>AI SPACE CENTER</div>
          </div>
        </div>

        {/* Nav desktop */}
        <nav style={styles.nav} className="header-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.navBtn,
                ...(activeSection === item.id ? styles.navBtnActive : {}),
              }}
              onClick={() => onNavigate(item.id)}
            >
              {activeSection === item.id && <span style={styles.navDot} />}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Status / Relógio */}
        <div style={styles.statusArea}>
          <div style={styles.statusPill}>
            <Activity size={12} color="var(--accent-green)" />
            <span style={{ color: 'var(--accent-green)', fontSize: '11px' }}>ONLINE</span>
          </div>
          <div style={styles.clock} className="header-clock">
            <div style={styles.clockTime}>{formatTime(time)}</div>
            <div style={styles.clockDate}>{formatDate(time)}</div>
          </div>
          {/* Hamburguer mobile */}
          <button style={{ ...styles.hamburger, display: 'none' }} className="header-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.mobileNavBtn,
                ...(activeSection === item.id ? styles.mobileNavBtnActive : {}),
              }}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
            >
              <Zap size={14} color={activeSection === item.id ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(2, 4, 8, 0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-subtle)',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
    animation: 'pulse-glow 3s ease-in-out infinite',
  },
  inner: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoIconWrap: {
    position: 'relative',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,245,255,0.08)',
    border: '1px solid rgba(0,245,255,0.2)',
    borderRadius: '10px',
  },
  logoPing: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent-green)',
    boxShadow: '0 0 6px var(--accent-green)',
    animation: 'pulse-glow 2s infinite',
  },
  logoTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--accent-cyan)',
    letterSpacing: '1px',
    textShadow: '0 0 15px rgba(0,245,255,0.4)',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: 'var(--text-muted)',
    letterSpacing: '2px',
  },
  nav: {
    display: 'flex',
    gap: '4px',
    flex: 1,
    justifyContent: 'center',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: 'var(--radius-sm)',
    padding: '7px 18px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  navBtnActive: {
    background: 'rgba(0,245,255,0.08)',
    border: '1px solid rgba(0,245,255,0.2)',
    color: 'var(--accent-cyan)',
    textShadow: '0 0 10px rgba(0,245,255,0.4)',
  },
  navDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: 'var(--accent-cyan)',
    boxShadow: '0 0 6px var(--accent-cyan)',
    animation: 'pulse-glow 1.5s infinite',
  },
  statusArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(0,255,136,0.08)',
    border: '1px solid rgba(0,255,136,0.15)',
    borderRadius: '99px',
    padding: '4px 10px',
  },
  clock: {
    textAlign: 'right',
  },
  clockTime: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--accent-cyan)',
    letterSpacing: '1px',
  },
  clockDate: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: 'var(--text-muted)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  hamburger: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  mobileMenu: {
    padding: '12px 24px',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mobileNavBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    fontWeight: 600,
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'var(--transition)',
  },
  mobileNavBtnActive: {
    background: 'rgba(0,245,255,0.06)',
    color: 'var(--accent-cyan)',
  },
};
