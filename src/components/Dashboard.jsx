// components/Dashboard.jsx
// Dashboard NASA — APOD + Asteroides próximos (dados reais via NASA API)

import { useState, useEffect } from 'react';
import { Telescope, Eye, ExternalLink } from 'lucide-react';
import SpaceCard from './SpaceCard';
import Loading, { MiniLoader } from './Loading';
import { fetchAPOD, fetchAsteroids, processAsteroidData } from '../services/nasaApi';

function StatValue({ value, unit, color = 'var(--accent-cyan)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900,
        color, textShadow: `0 0 20px ${color}60`, letterSpacing: '-1px',
        animation: 'number-count 0.8s ease',
      }}>{value}</span>
      {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{unit}</span>}
    </div>
  );
}

export default function Dashboard() {
  const [apod, setApod] = useState(null);
  const [asteroids, setAsteroids] = useState(null);
  const [loadingApod, setLoadingApod] = useState(true);
  const [loadingAsteroids, setLoadingAsteroids] = useState(true);

  useEffect(() => {
    fetchAPOD()
      .then(data => setApod(data))
      .finally(() => setLoadingApod(false));
  }, []);

  useEffect(() => {
    fetchAsteroids()
      .then(data => setAsteroids(processAsteroidData(data)))
      .finally(() => setLoadingAsteroids(false));
  }, []);

  return (
    <div style={styles.wrap}>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Dashboard NASA</h2>
          <p style={styles.sectionSub}>Dados reais integrados com NASA Open API</p>
        </div>
        <div style={styles.liveTag}>
          <span style={styles.liveDot} />
          LIVE
        </div>
      </div>

      <div style={styles.grid}>

        {/* Asteroides Próximos — NASA NeoWs */}
        <SpaceCard title="Asteroides Próximos" icon={Eye} accentColor="var(--accent-amber)" delay={0} badge="NASA NeoWs">
          {loadingAsteroids ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '16px 0' }}>
              <MiniLoader color="var(--accent-amber)" />
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Consultando NASA NeoWs...</span>
            </div>
          ) : asteroids ? (
            <div>
              <StatValue value={asteroids.total} unit="objetos" color="var(--accent-amber)" />
              <div style={styles.asteroidGrid}>
                <div style={styles.asteroidStat}>
                  <span style={{ color: 'var(--accent-red)', fontSize: '28px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                    {asteroids.hazardous}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>POTENC. PERIGOSOS</span>
                </div>
                {asteroids.closest && (
                  <div style={styles.asteroidStat}>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {asteroids.closest.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>MAIS PRÓXIMO</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                      {asteroids.closest.distance} km
                    </span>
                  </div>
                )}
              </div>
              <p style={styles.dataSource}>
                NASA NeoWs · Próximos 3 dias
                {asteroids.isFallback && <span style={{ color: 'var(--accent-amber)', marginLeft: '6px' }}>· SIMULADO</span>}
              </p>
            </div>
          ) : null}
        </SpaceCard>

        {/* Astronomia do Dia — NASA APOD */}
        <SpaceCard title="Astronomia do Dia" icon={Telescope} accentColor="var(--accent-cyan)" delay={150} badge="NASA APOD">
          {loadingApod ? (
            <Loading message="Carregando imagem da NASA..." />
          ) : apod ? (
            <div>
              {apod.media_type === 'image' ? (
                <div style={styles.apodImageWrap}>
                  <img src={apod.url} alt={apod.title} style={styles.apodImage}
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div style={styles.apodImageOverlay} />
                </div>
              ) : (
                <div style={{ padding: '16px', background: 'rgba(0,245,255,0.05)', borderRadius: '8px', textAlign: 'center', marginBottom: '14px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Mídia em vídeo — acesse pelo link abaixo</p>
                </div>
              )}
              <h3 style={styles.apodTitle}>{apod.title}</h3>
              <p style={styles.apodExplanation}>{apod.explanation?.slice(0, 280)}...</p>
              {apod._fallback && (
                <p style={{ fontSize: '10px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  ⚠ NASA API indisponível — exibindo dados simulados
                </p>
              )}
              <a href={apod.hdurl || apod.url} target="_blank" rel="noopener noreferrer" style={styles.apodLink}>
                <ExternalLink size={12} />
                Ver em alta resolução
              </a>
            </div>
          ) : null}
        </SpaceCard>

      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: '32px 24px', maxWidth: '1000px', margin: '0 auto' },
  sectionHeader: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: '32px', gap: '16px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700,
    color: 'var(--text-primary)', letterSpacing: '1px', marginBottom: '6px',
  },
  sectionSub: { color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' },
  liveTag: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.25)',
    borderRadius: '99px', padding: '6px 14px',
    fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-red)', letterSpacing: '2px',
  },
  liveDot: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-red)', animation: 'pulse-glow 1s infinite' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' },
  asteroidGrid: { display: 'flex', gap: '32px', marginTop: '16px', flexWrap: 'wrap' },
  asteroidStat: { display: 'flex', flexDirection: 'column', gap: '4px' },
  dataSource: { color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)', marginTop: '16px', letterSpacing: '0.5px' },
  apodImageWrap: { position: 'relative', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' },
  apodImage: { width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block' },
  apodImageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, var(--bg-card))' },
  apodTitle: { fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.5px' },
  apodExplanation: { fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' },
  apodLink: { display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--accent-cyan)', fontSize: '12px', textDecoration: 'none', fontFamily: 'var(--font-mono)' },
};
