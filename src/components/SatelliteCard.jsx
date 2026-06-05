// src/components/SatelliteCard.jsx
import { useState, useEffect, useRef } from 'react';
import { Satellite } from 'lucide-react';
import SpaceCard from './SpaceCard';
import ModuleModal from './ModuleModal';
import { subscribe } from '../services/satelliteService';

const STATUS_COLOR = {
  'Normal':         'var(--status-go)',
  'Alerta':         'var(--status-caution)',
  'Falha Iminente': 'var(--status-scrub)',
};

function GaugeMini({ value, color, label }) {
  const angle = (value / 100) * 180;
  const r = 36, cx = 50, cy = 44;
  const endAngle = (-180 + angle) * (Math.PI / 180);
  const endX = cx + r * Math.cos(endAngle);
  const endY = cy + r * Math.sin(endAngle);
  return (
    <svg viewBox="0 0 100 52" style={{ width: '100%', maxWidth: '120px' }}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round" />
      {value > 0 && (
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${endX} ${endY}`}
          fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
      )}
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color}
        style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700 }}>{value}%</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(255,255,255,0.35)"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '6px', letterSpacing: '1px' }}>{label}</text>
    </svg>
  );
}

export default function SatelliteCard({ onStatusChange }) {
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    return subscribe(d => {
      setData(d);
      onStatusChangeRef.current?.({ health: d.health, normal: d.normal, alerta: d.alerta, falha: d.falha });
    });
  }, []);

  return (
    <>
      <SpaceCard title="Telemetria de Satélites" icon={Satellite} accentColor="var(--accent-cyan)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}>
              <GaugeMini value={data?.health ?? 0} color="var(--accent-green)" label="SAÚDE" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--status-go)' }}>■ {data?.normal ?? 0} Normal</span>
              <span style={{ color: 'var(--status-caution)' }}>■ {data?.alerta ?? 0} Alerta</span>
              <span style={{ color: 'var(--status-scrub)' }}>■ {data?.falha ?? 0} Falha</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data?.satellites.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--text-primary)' }}>{s.name}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 7px', borderRadius: '99px',
                  background: `${STATUS_COLOR[s.status]}20`, color: STATUS_COLOR[s.status],
                  border: `1px solid ${STATUS_COLOR[s.status]}40`,
                }}>{s.status}</span>
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
        </div>
      </SpaceCard>

      <ModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="QML — Telemetria de Satélites">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            Classificador SVM RBF (C=1.0) · Acurácia 95% · 4 features: temp_painel, voltagem, radiacao, temp_bat
          </div>
          {data?.satellites.map(s => (
            <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--text-primary)' }}>{s.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 10px', borderRadius: '99px', background: `${STATUS_COLOR[s.status]}15`, color: STATUS_COLOR[s.status] }}>{s.status}</span>
              </div>
              {s.reading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>TEMP PAINEL</div><div style={{ color: 'var(--accent-amber)' }}>{s.reading.temp_painel.toFixed(1)}°C</div></div>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>VOLTAGEM</div><div style={{ color: 'var(--accent-green)' }}>{s.reading.voltagem.toFixed(2)}V</div></div>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>RADIAÇÃO</div><div style={{ color: 'var(--accent-red)' }}>{s.reading.radiacao.toFixed(1)} rad/s</div></div>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>TEMP BAT</div><div style={{ color: 'var(--accent-cyan)' }}>{s.reading.temp_bat.toFixed(1)}°C</div></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ModuleModal>
    </>
  );
}
