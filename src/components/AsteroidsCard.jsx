// src/components/AsteroidsCard.jsx — NASA NeoWs
import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import SpaceCard from './SpaceCard';
import { MiniLoader } from './Loading';
import { fetchAsteroids, processAsteroidData } from '../services/nasaApi';

export default function AsteroidsCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAsteroids()
      .then(d => setData(processAsteroidData(d)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SpaceCard title="Asteroides Próximos" icon={Eye} accentColor="var(--accent-amber)" badge="NASA NeoWs">
      {loading ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '16px 0' }}>
          <MiniLoader color="var(--accent-amber)" />
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Consultando NASA NeoWs...</span>
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 900,
              color: 'var(--accent-amber)', textShadow: '0 0 20px rgba(255,170,0,0.6)',
              letterSpacing: '-2px',
            }}>{data.total}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>objetos monitorados</span>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--accent-red)' }}>
                {data.hazardous}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>POTENC. PERIGOSOS</div>
            </div>
            {data.closest && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {data.closest.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>MAIS PRÓXIMO</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {data.closest.distance} km
                </div>
              </div>
            )}
          </div>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
            Próximos 3 dias
            {data.isFallback && <span style={{ color: 'var(--accent-amber)', marginLeft: '6px' }}>· SIMULADO</span>}
          </p>
        </div>
      ) : null}
    </SpaceCard>
  );
}
