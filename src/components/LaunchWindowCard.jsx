// src/components/LaunchWindowCard.jsx
import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import SpaceCard from './SpaceCard';
import ModuleModal from './ModuleModal';
import { fetchLaunchWindowData } from '../services/launchWindowService';

const STATUS_COLORS = {
  GO:      'var(--status-go)',
  CAUTION: 'var(--status-caution)',
  HOLD:    'var(--status-hold)',
  SCRUB:   'var(--status-scrub)',
};

function KpSparkline({ data, height = 50 }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d.kp);
  const max = Math.max(...vals, 9);
  const min = 0;
  const range = max - min;
  const w = 100;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const thresholdY = height - (5 / range) * (height - 4) - 2;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <line x1="0" y1={thresholdY} x2={w} y2={thresholdY} stroke="rgba(255,170,0,0.3)" strokeWidth="1" strokeDasharray="3,3" />
      <polyline points={pts} fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(vals.length - 1) / (vals.length - 1) * w}
        cy={height - ((vals[vals.length - 1] - min) / range) * (height - 4) - 2}
        r="2.5" fill="var(--accent-cyan)" />
    </svg>
  );
}

export default function LaunchWindowCard({ onStatusChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchLaunchWindowData().then(d => {
      setData(d);
      setLoading(false);
      onStatusChange?.({ status: d.status, kp: d.kpCurrent });
    });
  }, []);

  const status = data?.status ?? 'GO';
  const color = STATUS_COLORS[status];

  return (
    <>
      <SpaceCard title="Launch Window" icon={Rocket} accentColor={color} badge="RPA">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>Consultando NOAA + LL2...</div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color, textShadow: `0 0 20px ${color}60` }}>{status}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>Kp = {data?.kpCurrent.toFixed(1)}</span>
              </div>

              <div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>ÍNDICE Kp (24h)</div>
                <KpSparkline data={data?.kpHistory} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {data?.launches.slice(0, 3).map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>{l.name}</span>
                    <span style={{ color: l.status === 'Go for Launch' ? 'var(--status-go)' : 'var(--status-caution)', flexShrink: 0 }}>
                      {l.status === 'Go for Launch' ? 'GO' : 'TBD'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                style={{
                  marginTop: '4px', background: 'rgba(0,245,255,0.05)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--accent-cyan)',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer', letterSpacing: '1px',
                }}
                onClick={() => setModalOpen(true)}
              >
                VER DETALHES
              </button>
            </>
          )}
        </div>
      </SpaceCard>

      <ModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="RPA — Launch Window Intelligence">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            RandomForest · 23.360 amostras NOAA reais · Fontes: NOAA SWPC + Launch Library 2
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>ÍNDICE Kp — ÚLTIMAS 24H</div>
            <KpSparkline data={data?.kpHistory} height={80} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>PRÓXIMOS LANÇAMENTOS</div>
            {data?.launches.map((l, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-primary)' }}>{l.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: l.status === 'Go for Launch' ? 'var(--status-go)' : 'var(--status-caution)' }}>{l.status}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(l.net).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} UTC
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{l.provider}</div>
              </div>
            ))}
          </div>
        </div>
      </ModuleModal>
    </>
  );
}
