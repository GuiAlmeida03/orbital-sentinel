// src/components/APODCard.jsx — NASA Astronomy Picture of the Day
import { useState, useEffect } from 'react';
import { Telescope, ExternalLink } from 'lucide-react';
import SpaceCard from './SpaceCard';
import Loading from './Loading';
import { fetchAPOD } from '../services/nasaApi';

export default function APODCard() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPOD()
      .then(d => setApod(d))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SpaceCard title="Astronomia do Dia" icon={Telescope} accentColor="var(--accent-cyan)" badge="NASA APOD">
      {loading ? (
        <Loading message="Carregando imagem da NASA..." />
      ) : apod ? (
        <div>
          {apod.media_type === 'image' ? (
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
              <img
                src={apod.url}
                alt={apod.title}
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, var(--bg-card))' }} />
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'rgba(0,245,255,0.05)', borderRadius: '8px', textAlign: 'center', marginBottom: '12px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Mídia em vídeo</p>
            </div>
          )}
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.5px',
          }}>{apod.title}</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
            {apod.explanation?.slice(0, 200)}...
          </p>
          {apod._fallback && (
            <p style={{ fontSize: '10px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              ⚠ NASA API indisponível — dados simulados
            </p>
          )}
          <a href={apod.hdurl || apod.url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--accent-cyan)', fontSize: '12px', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
            <ExternalLink size={12} /> Ver em alta resolução
          </a>
        </div>
      ) : null}
    </SpaceCard>
  );
}
