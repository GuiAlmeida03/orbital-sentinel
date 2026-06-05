// src/components/IoTCard.jsx
import { useState, useEffect, useRef } from 'react';
import { Cpu } from 'lucide-react';
import SpaceCard from './SpaceCard';
import ModuleModal from './ModuleModal';
import { subscribe } from '../services/iotService';

const STATUS_COLORS = {
  GO:      'var(--status-go)',
  CAUTION: 'var(--status-caution)',
  HOLD:    'var(--status-hold)',
  SCRUB:   'var(--status-scrub)',
};

function Sparkline({ data, color, height = 40 }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => typeof d === 'number' ? d : 0);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const range = max - min || 1;
  const w = 100;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={(vals.length - 1) / (vals.length - 1) * w}
        cy={height - ((vals[vals.length - 1] - min) / range) * (height - 4) - 2}
        r="2.5" fill={color}
      />
    </svg>
  );
}

export default function IoTCard({ onStatusChange }) {
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    return subscribe(d => {
      setData(d);
      onStatusChangeRef.current?.({ status: d.status, temp: d.reading.temperatura, umidade: d.reading.umidade });
    });
  }, []);

  const status = data?.status ?? 'GO';
  const color = STATUS_COLORS[status];
  const r = data?.reading;

  return (
    <>
      <SpaceCard title="IoT Espaço Sentinela" icon={Cpu} accentColor={color}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900,
              color, textShadow: `0 0 20px ${color}60`,
            }}>{status}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
              DISCIPLINA: IoT
            </span>
          </div>

          {r && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Temp: <span style={{ color: 'var(--accent-amber)' }}>{r.temperatura.toFixed(1)}°C</span></span>
              <span style={{ color: 'var(--text-secondary)' }}>Umid: <span style={{ color: 'var(--accent-cyan)' }}>{r.umidade.toFixed(1)}%</span></span>
              <span style={{ color: 'var(--text-secondary)' }}>Vib: <span style={{ color: 'var(--accent-purple)' }}>{r.vibracao.toFixed(3)}g</span></span>
              <span style={{ color: 'var(--text-secondary)' }}>Gás: <span style={{ color: color }}>{r.gas.toFixed(1)}%</span></span>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
              <span>CONFIANÇA</span><span>{data?.confidence ?? 0}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${data?.confidence ?? 0}%`, height: '100%', background: color, borderRadius: '99px', transition: 'width 0.5s ease' }} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>TEMPERATURA (últimas 20)</div>
            <Sparkline data={data?.history?.map(h => h.temperatura)} color="var(--accent-amber)" />
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
        </div>
      </SpaceCard>

      <ModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="IoT — Espaço Sentinela">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 900, color, textShadow: `0 0 30px ${color}60` }}>{status}</span>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
              <div>ESP32 + TFLite embarcado</div>
              <div>7 sensores monitorados</div>
              <div>Atualiza a cada 3s</div>
            </div>
          </div>
          {r && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { label: 'Temperatura', value: `${r.temperatura.toFixed(1)} °C`, color: 'var(--accent-amber)' },
                { label: 'Umidade', value: `${r.umidade.toFixed(1)} %`, color: 'var(--accent-cyan)' },
                { label: 'Pressão', value: `${r.pressao.toFixed(1)} hPa`, color: 'var(--accent-blue)' },
                { label: 'Vibração', value: `${r.vibracao.toFixed(3)} g`, color: 'var(--accent-purple)' },
                { label: 'Gás', value: `${r.gas.toFixed(1)} %`, color: color },
                { label: 'Radiação', value: `${r.radiacao.toFixed(1)} %`, color: 'var(--accent-red)' },
                { label: 'Distância', value: `${r.distancia.toFixed(0)} m`, color: 'var(--accent-green)' },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          )}
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>VIBRAÇÃO (últimas 20 leituras)</div>
            <Sparkline data={data?.history?.map(h => h.vibracao)} color="var(--accent-purple)" height={60} />
          </div>
        </div>
      </ModuleModal>
    </>
  );
}
