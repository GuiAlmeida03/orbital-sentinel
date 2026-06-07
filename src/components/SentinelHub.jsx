// src/components/SentinelHub.jsx
import { useState, useCallback } from 'react';
import { Shield } from 'lucide-react';
import IoTCard from './IoTCard';
import SpaceRAGCard from './SpaceRAGCard';
import SatelliteCard from './SatelliteCard';
import FireRiskMap from './FireRiskMap';
import NLPCard from './NLPCard';
import LaunchWindowCard from './LaunchWindowCard';
import EnergyAnalyzer from './EnergyAnalyzer';

export default function SentinelHub({ onContextUpdate }) {
  const [iotCtx,    setIotCtx]    = useState({ status: 'GO', temp: 22, umidade: 55 });
  const [satCtx,    setSatCtx]    = useState({ health: 100, normal: 5, alerta: 0, falha: 0 });
  const [launchCtx, setLaunchCtx] = useState({ status: 'GO', kp: 3.2 });
  const [fireCtx,   setFireCtx]   = useState({ highRiskPercent: 33 });

  const handleIoT = useCallback(ctx => {
    setIotCtx(ctx);
    onContextUpdate?.({ iot: ctx, sat: satCtx, launch: launchCtx, fire: fireCtx });
  }, [satCtx, launchCtx, fireCtx, onContextUpdate]);

  const handleSat = useCallback(ctx => {
    setSatCtx(ctx);
    onContextUpdate?.({ iot: iotCtx, sat: ctx, launch: launchCtx, fire: fireCtx });
  }, [iotCtx, launchCtx, fireCtx, onContextUpdate]);

  const handleLaunch = useCallback(ctx => {
    setLaunchCtx(ctx);
    onContextUpdate?.({ iot: iotCtx, sat: satCtx, launch: ctx, fire: fireCtx });
  }, [iotCtx, satCtx, fireCtx, onContextUpdate]);

  const handleFire = useCallback(ctx => {
    setFireCtx(ctx);
    onContextUpdate?.({ iot: iotCtx, sat: satCtx, launch: launchCtx, fire: ctx });
  }, [iotCtx, satCtx, launchCtx, onContextUpdate]);

  return (
    <div style={styles.wrap}>
      <div style={styles.sectionHeader}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={styles.iconWrap}>
              <Shield size={20} color="var(--accent-cyan)" />
            </div>
            <h2 style={styles.sectionTitle}>Orbital Sentinel Hub</h2>
          </div>
          <p style={styles.sectionSub}>Centro de controle integrado — 7 módulos da Global Solution</p>
        </div>
        <div style={styles.liveTag}>
          <span style={styles.liveDot} />
          LIVE
        </div>
      </div>

      <div className="sentinel-grid">
        <IoTCard          onStatusChange={handleIoT} />
        <SpaceRAGCard />
        <SatelliteCard    onStatusChange={handleSat} />
        <FireRiskMap      onStatusChange={handleFire} />
        <NLPCard />
        <LaunchWindowCard onStatusChange={handleLaunch} />
        <EnergyAnalyzer />
      </div>
    </div>
  );
}

function AstraContextCard({ iotCtx, satCtx, launchCtx, fireCtx }) {
  const statusGoColor = ctx => ctx === 'GO' ? 'var(--status-go)' : ctx === 'CAUTION' ? 'var(--status-caution)' : 'var(--status-scrub)';

  const items = [
    { label: 'IoT Status',      value: iotCtx.status,                                  color: statusGoColor(iotCtx.status) },
    { label: 'Saúde Satélites', value: `${satCtx.health}%`,                            color: satCtx.health >= 80 ? 'var(--accent-green)' : 'var(--accent-amber)' },
    { label: 'Clima Espacial',  value: `${launchCtx.status} (Kp ${launchCtx.kp?.toFixed(1) ?? '–'})`, color: launchCtx.status === 'GO' ? 'var(--status-go)' : 'var(--status-caution)' },
    { label: 'Risco Incêndio',  value: `${fireCtx.highRiskPercent}% do território`,    color: fireCtx.highRiskPercent >= 50 ? 'var(--accent-red)' : 'var(--accent-amber)' },
  ];

  return (
    <div style={{
      position: 'relative', background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: '20px',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--accent-purple)', opacity: 0.6 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
        }}>
          <span style={{ fontSize: '14px' }}>🤖</span>
        </div>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
          letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent-purple)',
        }}>
          Astra — Contexto Ativo
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.label}</span>
            <span style={{ color: item.color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{item.value}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontStyle: 'italic' }}>
        Esses dados são injetados no contexto da Astra a cada mensagem.
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' },
  sectionHeader: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: '32px', gap: '16px',
  },
  iconWrap: {
    width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700,
    color: 'var(--text-primary)', letterSpacing: '1px',
  },
  sectionSub: { color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' },
  liveTag: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.25)',
    borderRadius: '99px', padding: '6px 14px',
    fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-red)', letterSpacing: '2px',
  },
  liveDot: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-red)', animation: 'pulse-glow 1s infinite' },
};
