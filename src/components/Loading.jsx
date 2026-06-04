// components/Loading.jsx
// Componente de carregamento reutilizável com efeito orbital

export default function Loading({ message = 'Conectando aos satélites...' }) {
  return (
    <div style={styles.wrap}>
      {/* Anel orbital animado */}
      <div style={styles.orbital}>
        <div style={styles.ring1} />
        <div style={styles.ring2} />
        <div style={styles.core} />
        <div style={styles.dot} />
      </div>
      <p style={styles.message}>{message}</p>
      <p style={styles.sub}>SISTEMA INICIALIZANDO...</p>
    </div>
  );
}

// Loading inline pequeno (para dentro de cards)
export function MiniLoader({ color = 'var(--accent-cyan)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '16px', height: '16px',
        border: `2px solid rgba(255,255,255,0.1)`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin-slow 0.8s linear infinite',
      }} />
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    padding: '60px 20px',
    animation: 'fade-in-up 0.4s ease',
  },
  orbital: {
    position: 'relative',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring1: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '2px solid transparent',
    borderTop: '2px solid var(--accent-cyan)',
    borderRight: '2px solid rgba(0,245,255,0.3)',
    animation: 'spin-slow 1.2s linear infinite',
  },
  ring2: {
    position: 'absolute',
    inset: '12px',
    borderRadius: '50%',
    border: '2px solid transparent',
    borderTop: '2px solid var(--accent-purple)',
    borderLeft: '2px solid rgba(124,58,237,0.3)',
    animation: 'spin-slow 0.8s linear infinite reverse',
  },
  core: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, var(--accent-cyan), var(--accent-blue))',
    boxShadow: 'var(--glow-cyan)',
    animation: 'pulse-glow 2s ease infinite',
  },
  dot: {
    position: 'absolute',
    top: '4px',
    right: '14px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent-cyan)',
    boxShadow: 'var(--glow-cyan)',
  },
  message: {
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
  },
  sub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--text-muted)',
    letterSpacing: '3px',
    animation: 'pulse-glow 1.5s ease infinite',
  },
};
