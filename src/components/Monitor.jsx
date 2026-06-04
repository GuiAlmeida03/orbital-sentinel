// components/Monitor.jsx
// Painel de monitoramento com gráficos e métricas em tempo real
// Demonstra: useState, useEffect com intervalos, renderização de listas

import { useState, useEffect } from 'react';
import { Activity, Cpu, Wifi, BarChart2, Radio, Layers } from 'lucide-react';
import SpaceCard from './SpaceCard';

// Gera dados aleatórios para simular telemetria em tempo real
const generateTelemetry = () =>
  Array.from({ length: 20 }, (_, i) => ({
    t: i,
    solar: 40 + Math.random() * 60,
    magnetic: 20 + Math.random() * 80,
    cosmic: 30 + Math.random() * 50,
  }));

// Mini gráfico de linhas SVG — sem biblioteca externa
function LineChart({ data, color, height = 60 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Área preenchida */}
      <polygon
        points={`0,${height} ${pts} ${w},${height}`}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      {/* Linha */}
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ponto atual */}
      <circle
        cx={(data.length - 1) / (data.length - 1) * w}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 8) - 4}
        r="3"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

// Medidor radial (gauge) SVG
function GaugeChart({ value, max = 100, color, label }) {
  const angle = (value / max) * 180;
  const r = 40;
  const cx = 55, cy = 50;
  const startX = cx - r, startY = cy;
  const endAngle = (-180 + angle) * (Math.PI / 180);
  const endX = cx + r * Math.cos(endAngle);
  const endY = cy + r * Math.sin(endAngle);

  return (
    <svg viewBox="0 0 110 60" style={{ width: '100%', maxWidth: '140px' }}>
      {/* Track */}
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round" />
      {/* Fill */}
      <path d={`M ${startX} ${startY} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${endX} ${endY}`}
        fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      {/* Valor */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color}
        style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 }}>
        {Math.round(value)}%
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.35)"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '6px', letterSpacing: '1px' }}>
        {label}
      </text>
    </svg>
  );
}

const MISSIONS = [
  { name: 'Artemis IV', phase: 'Trânsito Lunar', progress: 68, status: 'active' },
  { name: 'Mars Rover 2026', phase: 'Análise de Solo', progress: 43, status: 'active' },
  { name: 'Europa Clipper', phase: 'Aproximação', progress: 22, status: 'active' },
  { name: 'DART II', phase: 'Planejamento', progress: 8, status: 'planning' },
];

export default function Monitor() {
  const [telemetry, setTelemetry] = useState(generateTelemetry());
  const [solarHistory, setSolarHistory] = useState(Array.from({ length: 30 }, () => 40 + Math.random() * 60));
  const [magneticHistory, setMagneticHistory] = useState(Array.from({ length: 30 }, () => 20 + Math.random() * 80));
  const [cosmicHistory, setCosmicHistory] = useState(Array.from({ length: 30 }, () => 30 + Math.random() * 50));
  const [systemLoad, setSystemLoad] = useState({ cpu: 67, memory: 54, network: 88 });

  // Simula telemetria em tempo real com intervalo
  useEffect(() => {
    const interval = setInterval(() => {
      const newSolar = 40 + Math.random() * 60;
      const newMagnetic = 20 + Math.random() * 80;
      const newCosmic = 30 + Math.random() * 50;

      setSolarHistory(prev => [...prev.slice(-29), newSolar]);
      setMagneticHistory(prev => [...prev.slice(-29), newMagnetic]);
      setCosmicHistory(prev => [...prev.slice(-29), newCosmic]);
      setSystemLoad({
        cpu: 50 + Math.random() * 40,
        memory: 40 + Math.random() * 45,
        network: 70 + Math.random() * 28,
      });
    }, 2000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div style={styles.wrap}>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Centro de Monitoramento</h2>
          <p style={styles.sectionSub}>Telemetria orbital e métricas do sistema em tempo real</p>
        </div>
      </div>

      <div style={styles.grid}>

        {/* Gráficos de Telemetria */}
        <SpaceCard title="Telemetria Orbital" icon={Activity} accentColor="var(--accent-cyan)" delay={0} badge="REAL-TIME">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Radiação Solar', data: solarHistory, color: '#ffaa00', unit: 'W/m²' },
              { label: 'Campo Magnético', data: magneticHistory, color: '#7c3aed', unit: 'nT' },
              { label: 'Raios Cósmicos', data: cosmicHistory, color: '#00f5ff', unit: 'CPS' },
            ].map(({ label, data, color, unit }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color }}>
                    {Math.round(data[data.length - 1])} {unit}
                  </span>
                </div>
                <LineChart data={data} color={color} height={50} />
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            Atualizado a cada 2s — Dados simulados
          </p>
        </SpaceCard>

        {/* Performance do Sistema */}
        <SpaceCard title="Performance do Sistema" icon={Cpu} accentColor="var(--accent-purple)" delay={150}>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px', padding: '8px 0' }}>
            <GaugeChart value={systemLoad.cpu} color="var(--accent-cyan)" label="CPU" />
            <GaugeChart value={systemLoad.memory} color="var(--accent-purple)" label="MEMÓRIA" />
            <GaugeChart value={systemLoad.network} color="var(--accent-green)" label="REDE" />
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '8px' }}>
            {[
              { label: 'Latência', value: '12ms', ok: true },
              { label: 'Uptime', value: '99.97%', ok: true },
              { label: 'Pacotes/s', value: '2,847', ok: true },
              { label: 'Erros', value: '0.001%', ok: true },
            ].map(({ label, value, ok }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: ok ? 'var(--accent-green)' : 'var(--accent-red)' }}>{value}</span>
              </div>
            ))}
          </div>
        </SpaceCard>

        {/* Missões Ativas */}
        <SpaceCard title="Missões Espaciais" icon={Layers} accentColor="var(--accent-green)" delay={300}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MISSIONS.map((m) => (
              <div key={m.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--text-primary)' }}>{m.name}</span>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.phase}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: m.status === 'active' ? 'var(--accent-green)' : 'var(--accent-cyan)' }}>
                    {m.progress}%
                  </span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${m.progress}%`, height: '100%', borderRadius: '99px',
                    background: m.status === 'active'
                      ? 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))'
                      : 'var(--accent-cyan)',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </SpaceCard>

        {/* Frequências de Comunicação */}
        <SpaceCard title="Frequências de Comunicação" icon={Radio} accentColor="var(--accent-cyan)" delay={450}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { freq: '2.4 GHz', name: 'ISS Downlink', strength: 94, active: true },
              { freq: '8.4 GHz', name: 'Deep Space Network', strength: 78, active: true },
              { freq: '437 MHz', name: 'CubeSat Array', strength: 61, active: true },
              { freq: '1.575 GHz', name: 'GPS L1 Beacon', strength: 99, active: true },
              { freq: '26 GHz', name: 'Ka-Band Reserve', strength: 0, active: false },
            ].map((ch) => (
              <div key={ch.freq} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: ch.active ? 'var(--accent-green)' : 'rgba(255,255,255,0.15)', boxShadow: ch.active ? '0 0 6px var(--accent-green)' : 'none', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '12px', color: ch.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{ch.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{ch.freq}</span>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${ch.strength}%`, height: '100%',
                      background: ch.strength > 80 ? 'var(--accent-green)' : ch.strength > 50 ? 'var(--accent-amber)' : 'var(--accent-red)',
                      borderRadius: '99px', transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', width: '30px', textAlign: 'right' }}>{ch.strength}%</span>
              </div>
            ))}
          </div>
        </SpaceCard>

      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' },
  sectionHeader: { marginBottom: '32px' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '1px', marginBottom: '6px' },
  sectionSub: { color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
};
