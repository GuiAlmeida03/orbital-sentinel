// src/components/ModuleModal.jsx
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function ModuleModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="module-modal-overlay" onClick={onClose}>
      <div className="module-modal-box" onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>{title}</span>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
    color: 'var(--accent-cyan)', letterSpacing: '1.5px', textTransform: 'uppercase',
  },
  closeBtn: {
    background: 'transparent', border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-sm)', padding: '6px', color: 'var(--text-secondary)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'var(--transition)',
  },
  body: { padding: '24px' },
};
