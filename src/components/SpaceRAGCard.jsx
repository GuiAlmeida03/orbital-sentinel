// src/components/SpaceRAGCard.jsx
import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import SpaceCard from './SpaceCard';
import ModuleModal from './ModuleModal';

const RAG_URL = 'https://space-rag-jkffesh9hebfkgwywcxca9.streamlit.app';

const SAMPLE_QUESTIONS = [
  'O que é o programa Artemis da NASA?',
  'Como o Copernicus monitora queimadas?',
  'Quais satélites Starlink estão ativos?',
  'Como o INPE detecta desmatamento?',
  'O que é o satélite EMBRAPA?',
];

export default function SpaceRAGCard() {
  const [online, setOnline] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    fetch(RAG_URL, { mode: 'no-cors', signal: controller.signal })
      .then(() => setOnline(true))
      .catch(() => setOnline(false))
      .finally(() => clearTimeout(timeout));
    return () => { controller.abort(); clearTimeout(timeout); };
  }, []);

  return (
    <>
      <SpaceCard title="Space RAG" icon={BookOpen} accentColor="var(--accent-blue)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.5px', lineHeight: 1.6 }}>
              5 domínios · 19 chunks<br/>LLaMA 3.3 70B via Groq
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '3px 8px',
              borderRadius: '99px', letterSpacing: '1px',
              background: online === null ? 'rgba(255,255,255,0.06)' : online ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.1)',
              color: online === null ? 'var(--text-muted)' : online ? 'var(--accent-green)' : 'var(--accent-red)',
              border: `1px solid ${online === null ? 'transparent' : online ? 'rgba(0,255,136,0.25)' : 'rgba(255,51,102,0.25)'}`,
            }}>
              {online === null ? 'VERIFICANDO' : online ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {['NASA Artemis', 'ESA Copernicus', 'INPE Queimadas', 'Starlink', 'EMBRAPA Geo'].map(domain => (
              <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block', flexShrink: 0 }} />
                {domain}
              </div>
            ))}
          </div>

          <button
            style={{
              marginTop: '4px', background: 'rgba(0,102,255,0.05)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--accent-blue)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer', letterSpacing: '1px',
            }}
            onClick={() => setModalOpen(true)}
          >
            ABRIR ASSISTENTE
          </button>
        </div>
      </SpaceCard>

      <ModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Space RAG — Assistente de IA Espacial">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!iframeError ? (
            <iframe
              src={RAG_URL}
              style={{ width: '100%', height: '500px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: '#0a0a0a' }}
              title="Space RAG"
              onError={() => setIframeError(true)}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
                O app Streamlit não pode ser embutido aqui (X-Frame-Options).<br/>
                Acesse diretamente:
              </div>
              <a href={RAG_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '12px', textDecoration: 'none' }}>
                <ExternalLink size={14} /> Abrir Space RAG
              </a>
              <div style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', letterSpacing: '1px', marginBottom: '10px' }}>PERGUNTAS DE EXEMPLO</div>
                {SAMPLE_QUESTIONS.map(q => (
                  <a key={q} href={`${RAG_URL}?question=${encodeURIComponent(q)}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', padding: '10px 12px', marginBottom: '6px', background: 'rgba(0,102,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                    {q}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </ModuleModal>
    </>
  );
}
