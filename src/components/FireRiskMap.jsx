// src/components/FireRiskMap.jsx
import { useState, useEffect, useRef } from 'react';
import { Flame } from 'lucide-react';
import SpaceCard from './SpaceCard';
import ModuleModal from './ModuleModal';

const BIOMES = [
  {
    id: 'amazonia', name: 'Amazônia', area: '5.5M km²',
    initialRisk: 22,
    path: 'M 80,30 L 200,20 L 260,50 L 280,120 L 240,180 L 160,200 L 80,180 L 50,120 Z',
  },
  {
    id: 'cerrado', name: 'Cerrado', area: '2.0M km²',
    initialRisk: 55,
    path: 'M 200,140 L 280,130 L 320,160 L 330,220 L 280,260 L 200,260 L 170,220 L 180,170 Z',
  },
  {
    id: 'pantanal', name: 'Pantanal', area: '150K km²',
    initialRisk: 45,
    path: 'M 170,250 L 220,240 L 240,280 L 230,320 L 190,330 L 160,310 L 155,275 Z',
  },
  {
    id: 'mata_atlantica', name: 'Mata Atlântica', area: '1.3M km²',
    initialRisk: 30,
    path: 'M 310,180 L 360,170 L 390,220 L 380,300 L 340,340 L 300,320 L 290,260 L 300,210 Z',
  },
  {
    id: 'caatinga', name: 'Caatinga', area: '844K km²',
    initialRisk: 68,
    path: 'M 300,80 L 370,70 L 400,110 L 390,160 L 340,175 L 295,155 L 280,110 Z',
  },
  {
    id: 'pampa', name: 'Pampa', area: '176K km²',
    initialRisk: 15,
    path: 'M 240,340 L 300,330 L 320,370 L 300,400 L 240,410 L 215,380 L 220,355 Z',
  },
];

function riskColor(pct) {
  if (pct >= 80) return '#ff3366';
  if (pct >= 60) return '#ff6600';
  if (pct >= 30) return '#ffaa00';
  return '#00ff88';
}

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export default function FireRiskMap({ onStatusChange }) {
  const [risks, setRisks] = useState(() =>
    Object.fromEntries(BIOMES.map(b => [b.id, b.initialRisk]))
  );
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setRisks(prev => {
        const next = {};
        for (const b of BIOMES) {
          next[b.id] = Math.max(5, Math.min(100, prev[b.id] + randn() * 3));
        }
        return next;
      });
      setLastUpdate(new Date());
    }, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const highRiskPct = Math.round(
      (BIOMES.filter(b => risks[b.id] >= 60).length / BIOMES.length) * 100
    );
    onStatusChange?.({ highRiskPercent: highRiskPct });
  }, [risks, onStatusChange]);

  const highRiskCount = BIOMES.filter(b => risks[b.id] >= 60).length;
  const highRiskPct = Math.round((highRiskCount / BIOMES.length) * 100);

  function handleMouseMove(e, biome) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHovered(biome);
  }

  return (
    <>
      <SpaceCard title="Mapa de Risco de Incêndio" icon={Flame} accentColor="var(--accent-red)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: 'var(--accent-red)', textShadow: '0 0 20px rgba(255,51,102,0.6)' }}>
              {highRiskPct}%
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>território em risco elevado</span>
          </div>

          <div style={{ position: 'relative' }} ref={svgRef}>
            <svg viewBox="0 0 460 430" style={{ width: '100%', display: 'block' }}>
              <rect width="460" height="430" fill="rgba(0,0,0,0.2)" rx="8" />
              {BIOMES.map(b => (
                <g key={b.id}
                  onMouseMove={e => handleMouseMove(e, b)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d={b.path}
                    fill={riskColor(risks[b.id]) + '55'}
                    stroke={riskColor(risks[b.id])}
                    strokeWidth={hovered?.id === b.id ? 2 : 1}
                    style={{ transition: 'all 0.5s ease', filter: hovered?.id === b.id ? `drop-shadow(0 0 6px ${riskColor(risks[b.id])})` : 'none' }}
                  />
                  <text
                    x={0} y={0}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', fill: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}
                    transform={`translate(${b.path.match(/M ([\d.]+),([\d.]+)/)?.[1] ?? 0},${parseFloat(b.path.match(/M ([\d.]+),([\d.]+)/)?.[2] ?? 0) + 14})`}
                  >
                    {Math.round(risks[b.id])}%
                  </text>
                </g>
              ))}
            </svg>

            {hovered && (
              <div style={{
                position: 'absolute', left: tooltipPos.x + 10, top: Math.max(0, tooltipPos.y - 60),
                background: 'rgba(6,16,30,0.95)', border: '1px solid var(--border-glow)',
                borderRadius: 'var(--radius-sm)', padding: '8px 12px',
                fontFamily: 'var(--font-mono)', fontSize: '11px', pointerEvents: 'none', zIndex: 10,
                minWidth: '150px',
              }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '4px' }}>{hovered.name}</div>
                <div style={{ color: riskColor(risks[hovered.id]) }}>Risco: {Math.round(risks[hovered.id])}%</div>
                <div style={{ color: 'var(--text-muted)' }}>Área: {hovered.area}</div>
                <div style={{ color: 'var(--text-muted)' }}>Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
            {[['< 30%', '#00ff88'], ['30-60%', '#ffaa00'], ['60-80%', '#ff6600'], ['> 80%', '#ff3366']].map(([label, color]) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>

          <button
            style={{
              background: 'rgba(255,51,102,0.05)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--accent-red)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer', letterSpacing: '1px',
            }}
            onClick={() => setModalOpen(true)}
          >
            VER DETALHES
          </button>
        </div>
      </SpaceCard>

      <ModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Visão Computacional — Risco de Incêndio">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            EfficientNetB0 · 42.850 imagens de satélite · AUC-ROC 0.9987 · Recall 97.3%
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {BIOMES.map(b => (
              <div key={b.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${riskColor(risks[b.id])}40`, borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-primary)' }}>{b.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: riskColor(risks[b.id]) }}>{Math.round(risks[b.id])}%</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ width: `${risks[b.id]}%`, height: '100%', background: riskColor(risks[b.id]), borderRadius: '99px', transition: 'width 1s ease' }} />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{b.area}</div>
              </div>
            ))}
          </div>
        </div>
      </ModuleModal>
    </>
  );
}
