// components/SpaceCard.jsx
// Card reutilizável com efeito glassmorphism e hover glow
// Props: title, icon, accentColor, children, delay (para animação escalonada)

import { useState } from 'react';

export default function SpaceCard({
  title,
  icon: Icon,
  accentColor = 'var(--accent-cyan)',
  children,
  delay = 0,
  fullHeight = false,
  badge = null,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? { ...styles.cardHover, borderColor: accentColor + '55', boxShadow: `0 0 30px ${accentColor}20, 0 8px 32px rgba(0,0,0,0.4)` } : {}),
        animationDelay: `${delay}ms`,
        height: fullHeight ? '100%' : 'auto',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="animate-fade-in-up"
    >
      {/* Linha de acento superior */}
      <div style={{ ...styles.accentLine, background: accentColor }} />

      {/* Header do card */}
      {(title || Icon) && (
        <div style={styles.header}>
          <div style={styles.titleWrap}>
            {Icon && (
              <div style={{ ...styles.iconWrap, background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>
                <Icon size={16} color={accentColor} />
              </div>
            )}
            {title && (
              <span style={{ ...styles.title, color: accentColor }}>{title}</span>
            )}
          </div>
          {badge && (
            <span style={{ ...styles.badge, background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}>
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Conteúdo */}
      <div style={styles.content}>{children}</div>
    </div>
  );
}

const styles = {
  card: {
    position: 'relative',
    background: 'var(--bg-card)',
    backdropFilter: 'blur(16px)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    transition: 'var(--transition)',
    overflow: 'hidden',
    animation: 'fade-in-up 0.6s ease forwards',
    opacity: 0,
  },
  cardHover: {
    background: 'var(--bg-card-hover)',
    transform: 'translateY(-2px)',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    opacity: 0.6,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
  badge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    padding: '3px 8px',
    borderRadius: '99px',
    letterSpacing: '0.5px',
  },
  content: {
    flex: 1,
  },
};
