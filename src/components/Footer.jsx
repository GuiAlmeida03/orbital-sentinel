// components/Footer.jsx
import { Satellite, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <Satellite size={14} color="var(--accent-cyan)" />
          <span style={styles.brand}>OrbitalMind AI</span>
          <span style={styles.separator}>·</span>
          <span style={styles.copy}>© {year} FIAP — Inteligência Artificial</span>
        </div>

        <div style={styles.links}>
          {[
            { label: 'NASA API', href: 'https://api.nasa.gov' },
            { label: 'APOD', href: 'https://apod.nasa.gov' },
            { label: 'NeoWs', href: 'https://cneos.jpl.nasa.gov' },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={styles.link}>
              <ExternalLink size={10} />
              {label}
            </a>
          ))}
        </div>

        <div style={styles.right}>
          <span style={styles.techBadge}>React + Vite</span>
          <span style={styles.techBadge}>NASA API</span>
          <span style={styles.techBadge}>Claude AI</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    borderTop: '1px solid var(--border-subtle)',
    padding: '20px 24px',
    background: 'rgba(2,4,8,0.8)',
    backdropFilter: 'blur(10px)',
    marginTop: '40px',
  },
  inner: {
    maxWidth: '1400px', margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '12px',
  },
  left: { display: 'flex', alignItems: 'center', gap: '8px' },
  brand: { fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--accent-cyan)', letterSpacing: '1px' },
  separator: { color: 'var(--text-muted)' },
  copy: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' },
  links: { display: 'flex', gap: '16px' },
  link: {
    display: 'flex', alignItems: 'center', gap: '4px',
    fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)',
    textDecoration: 'none', transition: 'color 0.2s',
  },
  right: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  techBadge: {
    fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
    padding: '3px 8px', borderRadius: '99px',
    background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.12)',
    color: 'var(--text-muted)',
  },
};
