// src/components/EnergyAnalyzer.jsx
import { useState, useMemo } from 'react';
import { Zap } from 'lucide-react';
import SpaceCard from './SpaceCard';
import ModuleModal from './ModuleModal';

const JOBS = [
  { id: 'A', features: 2,  epochs: 8,  samples: 1000, accuracy: 94.4,  energy: 10029600  },
  { id: 'B', features: 4,  epochs: 15, samples: 1000, accuracy: 97.8,  energy: 27405000  },
  { id: 'C', features: 6,  epochs: 25, samples: 1000, accuracy: 100.0, energy: 72817500  },
];

function calcEnergy(features, epochs, samples) {
  const ram  = samples * features * epochs;
  const reg  = features * epochs * 100;
  const alu  = features * epochs * samples * 0.5;
  return { ram, reg, alu, total: Math.round(640 * ram + 5 * reg + 10 * alu) };
}

function formatPj(pj) {
  if (pj >= 1e9) return `${(pj / 1e9).toFixed(2)} TPJ`;
  if (pj >= 1e6) return `${(pj / 1e6).toFixed(2)} MPJ`;
  return `${pj.toLocaleString('pt-BR')} pJ`;
}

function BarChart({ jobs, currentEnergy }) {
  const maxEnergy = Math.max(...jobs.map(j => j.energy), currentEnergy);
  const barColors = ['var(--accent-green)', 'var(--accent-cyan)', 'var(--accent-purple)', 'var(--accent-amber)'];
  const allBars = [...jobs.map(j => ({ label: `Job ${j.id}`, energy: j.energy, accuracy: j.accuracy })),
    { label: 'Atual', energy: currentEnergy, accuracy: null }];

  return (
    <svg viewBox="0 0 300 140" style={{ width: '100%', display: 'block' }}>
      {allBars.map((bar, i) => {
        const bw = 40, gap = 20, x = i * (bw + gap) + 20;
        const bh = Math.max(4, (bar.energy / maxEnergy) * 100);
        const y = 110 - bh;
        const color = i < 3 ? barColors[i] : 'var(--accent-amber)';
        return (
          <g key={bar.label}>
            <rect x={x} y={y} width={bw} height={bh} fill={color + '40'} stroke={color} strokeWidth="1" rx="3" />
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" fill={color}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '7px' }}>{formatPj(bar.energy)}</text>
            {bar.accuracy != null && (
              <text x={x + bw / 2} y={y - 13} textAnchor="middle" fill="rgba(255,255,255,0.5)"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '7px' }}>{bar.accuracy}%</text>
            )}
            <text x={x + bw / 2} y={120} textAnchor="middle" fill="rgba(255,255,255,0.5)"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '8px' }}>{bar.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function EnergyAnalyzer({ onStatusChange }) {
  const [features, setFeatures] = useState(4);
  const [epochs,   setEpochs]   = useState(15);
  const [samples,  setSamples]  = useState(1000);
  const [modalOpen, setModalOpen] = useState(false);

  const result = useMemo(() => calcEnergy(features, epochs, samples), [features, epochs, samples]);

  const recommended = useMemo(() => {
    const ratios = JOBS.map(j => ({ ...j, ratio: j.accuracy / Math.log10(j.energy) }));
    return ratios.sort((a, b) => b.ratio - a.ratio)[0];
  }, []);

  return (
    <>
      <SpaceCard title="Energy Analyzer" icon={Zap} accentColor="var(--accent-purple)" badge="CLUSTER">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 900, color: 'var(--accent-purple)', textShadow: '0 0 20px rgba(124,58,237,0.6)' }}>
              {formatPj(result.total)}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            F={features} · E={epochs} · S={samples}
          </div>
          <BarChart jobs={JOBS} currentEnergy={result.total} />
          <button
            style={{
              background: 'rgba(124,58,237,0.05)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--accent-purple)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer', letterSpacing: '1px',
            }}
            onClick={() => setModalOpen(true)}
          >
            CALCULADORA
          </button>
        </div>
      </SpaceCard>

      <ModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="CLUSTER — SpaceTrain Energy Analyzer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            pJ = 640×RAM_ops + 5×Reg_ops + 10×ALU_ops<br/>
            RAM = samples×features×epochs · Reg = features×epochs×100 · ALU = features×epochs×samples×0.5
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Features', value: features, setter: setFeatures, min: 1, max: 10 },
              { label: 'Épocas',   value: epochs,   setter: setEpochs,   min: 1, max: 50 },
              { label: 'Amostras', value: samples,  setter: setSamples,  min: 100, max: 10000, step: 100 },
            ].map(({ label, value, setter, min, max, step = 1 }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{value}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value}
                  aria-label={label}
                  onChange={e => setter(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent-purple)', fontFamily: 'var(--font-display)', letterSpacing: '1px', marginBottom: '10px' }}>RESULTADO</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
              <div><div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>RAM OPS</div><div style={{ color: 'var(--accent-cyan)' }}>{result.ram.toLocaleString('pt-BR')}</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>REG OPS</div><div style={{ color: 'var(--accent-green)' }}>{result.reg.toLocaleString('pt-BR')}</div></div>
              <div><div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>ALU OPS</div><div style={{ color: 'var(--accent-amber)' }}>{result.alu.toLocaleString('pt-BR')}</div></div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: 'var(--accent-purple)' }}>{formatPj(result.total)}</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', letterSpacing: '1px', marginBottom: '12px' }}>COMPARATIVO DOS JOBS</div>
            <BarChart jobs={JOBS} currentEnergy={result.total} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
              {JOBS.map((j, i) => {
                const colors = ['var(--accent-green)', 'var(--accent-cyan)', 'var(--accent-purple)'];
                return (
                  <div key={j.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${colors[i]}30`, borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ color: colors[i], fontWeight: 700, marginBottom: '6px' }}>Job {j.id}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Acc: <span style={{ color: 'var(--text-primary)' }}>{j.accuracy}%</span></div>
                    <div style={{ color: 'var(--text-muted)' }}>Energia: <span style={{ color: colors[i] }}>{formatPj(j.energy)}</span></div>
                    {j.id === recommended.id && (
                      <div style={{ marginTop: '6px', fontSize: '9px', color: 'var(--accent-green)', letterSpacing: '0.5px' }}>★ RECOMENDADO</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ModuleModal>
    </>
  );
}
