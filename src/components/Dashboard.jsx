// components/Dashboard.jsx
// Dashboard principal — consome APIs reais da NASA (APOD + NeoWs)
// Demonstra: useState, useEffect, Fetch API, renderização condicional, listas

import { useState, useEffect } from 'react';
import {
  Telescope, AlertTriangle, Globe, Satellite,
  Thermometer, Wind, Eye, ExternalLink, TrendingUp, Shield
} from 'lucide-react';
import SpaceCard from './SpaceCard';
import Loading, { MiniLoader } from './Loading';
import { fetchAPOD, fetchAsteroids, processAsteroidData } from '../services/nasaApi';

// Dados mockados para complementar a NASA API
const MOCK_SATELLITES = [
  { name: 'ISS', status: 'OPERATIONAL', orbit: '408 km', signal: 98 },
  { name: 'Hubble ST', status: 'OPERATIONAL', orbit: '547 km', signal: 94 },
  { name: 'James Webb', status: 'OPERATIONAL', orbit: 'L2 Point', signal: 99 },
  { name: 'Starlink-7A', status: 'STANDBY', orbit: '550 km', signal: 72 },
  { name: 'GPS Block III', status: 'OPERATIONAL', orbit: '20,200 km', signal: 100 },
];

const MOCK_ALERTS = [
  { level: 'info', msg: 'Atividade solar moderada detectada — Classe M1.2', time: '02:14 UTC' },
  { level: 'warn', msg: 'Janela de passagem de asteroide em 48h — Monitoramento ativo', time: '06:30 UTC' },
  { level: 'ok', msg: 'Todos os satélites operacionais dentro do parâmetro normal', time: '08:00 UTC' },
  { level: 'info', msg: 'Tempestade geomagnética leve — Índice Kp: 3', time: '10:45 UTC' },
];

// Componente de stat animado
function StatValue({ value, unit, color = 'var(--accent-cyan)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '36px',
        fontWeight: 900,
        color,
        textShadow: `0 0 20px ${color}60`,
        letterSpacing: '-1px',
        animation: 'number-count 0.8s ease',
      }}>{value}</span>
      {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{unit}</span>}
    </div>
  );
}

// Barra de progresso de sinal
function SignalBar({ value, color }) {
  return (
    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${value}%`,
        background: color,
        borderRadius: '99px',
        boxShadow: `0 0 6px ${color}`,
        transition: 'width 1s ease',
      }} />
    </div>
  );
}

export default function Dashboard() {
  // Estados da aplicação
  const [apod, setApod] = useState(null);
  const [asteroids, setAsteroids] = useState(null);
  const [loadingApod, setLoadingApod] = useState(true);
  const [loadingAsteroids, setLoadingAsteroids] = useState(true);
  const [errorApod, setErrorApod] = useState(null);
  const [errorAsteroids, setErrorAsteroids] = useState(null);
  const [globalTemp] = useState((14.2 + Math.random() * 0.6).toFixed(1));

  // Busca APOD ao montar o componente
  useEffect(() => {
    fetchAPOD()
      .then(data => setApod(data))
      .catch(err => setErrorApod(err.message))
      .finally(() => setLoadingApod(false));
  }, []);

  // Busca Asteroides ao montar o componente
  useEffect(() => {
    fetchAsteroids()
      .then(data => setAsteroids(processAsteroidData(data)))
      .catch(err => setErrorAsteroids(err.message))
      .finally(() => setLoadingAsteroids(false));
  }, []);

  const alertColors = {
    info: 'var(--accent-cyan)',
    warn: 'var(--accent-amber)',
    ok: 'var(--accent-green)',
    error: 'var(--accent-red)',
  };

  return (
    <div style={styles.wrap}>
      {/* Título da seção */}
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Dashboard Espacial</h2>
          <p style={styles.sectionSub}>Monitoramento em tempo real — Dados integrados com NASA API</p>
        </div>
        <div style={styles.liveTag}>
          <span style={styles.liveDot} />
          LIVE
        </div>
      </div>

      {/* Grid de cards */}
      <div style={styles.grid}>

        {/* Card 1: Asteroides */}
        <SpaceCard title="Asteroides Próximos" icon={Eye} accentColor="var(--accent-amber)" delay={0}>
          {loadingAsteroids ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '16px 0' }}>
              <MiniLoader color="var(--accent-amber)" />
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Consultando NASA NeoWs...</span>
            </div>
          ) : errorAsteroids ? (
            /* Renderização condicional para erro */
            <p style={{ color: 'var(--accent-red)', fontSize: '13px' }}>⚠ {errorAsteroids}</p>
          ) : asteroids ? (
            <div>
              <StatValue value={asteroids.total} unit="objetos" color="var(--accent-amber)" />
              <div style={styles.asteroidGrid}>
                <div style={styles.asteroidStat}>
                  <span style={{ color: 'var(--accent-red)', fontSize: '20px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                    {asteroids.hazardous}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>POTENC. PERIGOSOS</span>
                </div>
                {asteroids.closest && (
                  <div style={styles.asteroidStat}>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                      {asteroids.closest.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>MAIS PRÓXIMO</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
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

        {/* Card 2: Temperatura Global */}
        <SpaceCard title="Temperatura Global" icon={Thermometer} accentColor="var(--accent-red)" delay={100}>
          <StatValue value={globalTemp} unit="°C" color="var(--accent-red)" />
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
            Anomalia: <span style={{ color: 'var(--accent-amber)' }}>+1.1°C</span> acima da média pré-industrial
          </p>
          <div style={styles.tempBar}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
              <span>13.0°C</span><span>ATUAL</span><span>16.0°C</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                width: `${((parseFloat(globalTemp) - 13) / 3) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-red))',
                borderRadius: '99px',
              }} />
            </div>
          </div>
          <p style={styles.dataSource}>NASA GISS · Dados simulados</p>
        </SpaceCard>

        {/* Card 3: Status Climático Espacial */}
        <SpaceCard title="Clima Espacial" icon={Wind} accentColor="var(--accent-purple)" delay={200}>
          <div style={styles.spaceWeather}>
            {[
              { label: 'Índice Solar (Kp)', value: '3', max: 9, color: 'var(--accent-green)' },
              { label: 'Fluxo de Prótons', value: '1.2', max: 10, color: 'var(--accent-cyan)', unit: 'pfu' },
              { label: 'Campo Magnético', value: '6.4', max: 20, color: 'var(--accent-purple)', unit: 'nT' },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: item.color }}>
                    {item.value}{item.unit ? ` ${item.unit}` : ''}
                  </span>
                </div>
                <SignalBar value={(parseFloat(item.value) / item.max) * 100} color={item.color} />
              </div>
            ))}
          </div>
          <p style={styles.dataSource}>NOAA SWPC · Dados simulados</p>
        </SpaceCard>

        {/* Card 4: Imagem do Dia NASA (APOD) — card grande */}
        <SpaceCard title="Astronomia do Dia" icon={Telescope} accentColor="var(--accent-cyan)" delay={300} badge="NASA APOD">
          {loadingApod ? (
            <Loading message="Carregando imagem da NASA..." />
          ) : apod ? (
            <div>
              {/* Renderização condicional: imagem ou vídeo */}
              {apod.media_type === 'image' ? (
                <div style={styles.apodImageWrap}>
                  <img
                    src={apod.url}
                    alt={apod.title}
                    style={styles.apodImage}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div style={styles.apodImageOverlay} />
                </div>
              ) : (
                <div style={{ padding: '16px', background: 'rgba(0,245,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Mídia em vídeo — Acesse pelo link abaixo</p>
                </div>
              )}
              <h3 style={styles.apodTitle}>{apod.title}</h3>
              <p style={styles.apodExplanation}>
                {apod.explanation?.slice(0, 220)}...
              </p>
              {apod._fallback && (
                <p style={{ fontSize: '10px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                  ⚠ NASA API indisponível — exibindo dados simulados
                </p>
              )}
              <a
                href={apod.hdurl || apod.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.apodLink}
              >
                <ExternalLink size={12} />
                Ver em alta resolução
              </a>
            </div>
          ) : null}
        </SpaceCard>

        {/* Card 5: Alertas — renderização de lista */}
        <SpaceCard title="Alertas do Sistema" icon={AlertTriangle} accentColor="var(--accent-red)" delay={400}>
          <ul style={styles.alertList}>
            {MOCK_ALERTS.map((alert, i) => (
              /* Renderização de lista com key */
              <li key={i} style={styles.alertItem}>
                <div style={{ ...styles.alertDot, background: alertColors[alert.level], boxShadow: `0 0 6px ${alertColors[alert.level]}` }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{alert.msg}</p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{alert.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </SpaceCard>

        {/* Card 6: Satélites — renderização de lista */}
        <SpaceCard title="Status de Satélites" icon={Satellite} accentColor="var(--accent-green)" delay={500}>
          <ul style={styles.satList}>
            {MOCK_SATELLITES.map((sat) => (
              <li key={sat.name} style={styles.satItem}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-primary)' }}>{sat.name}</span>
                    <span style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '99px',
                      fontFamily: 'var(--font-mono)',
                      background: sat.status === 'OPERATIONAL' ? 'rgba(0,255,136,0.1)' : 'rgba(255,170,0,0.1)',
                      color: sat.status === 'OPERATIONAL' ? 'var(--accent-green)' : 'var(--accent-amber)',
                    }}>{sat.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SignalBar
                      value={sat.signal}
                      color={sat.signal > 90 ? 'var(--accent-green)' : 'var(--accent-amber)'}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {sat.signal}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SpaceCard>

      </div>

      {/* Banner de stats rápidos */}
      <div style={styles.statsBanner}>
        {[
          { icon: Globe, label: 'Satélites Ativos', value: '4,852', color: 'var(--accent-cyan)' },
          { icon: TrendingUp, label: 'Missões em Andamento', value: '37', color: 'var(--accent-green)' },
          { icon: Shield, label: 'Ameaças Monitoradas', value: '12', color: 'var(--accent-amber)' },
          { icon: Telescope, label: 'Objetos Catalogados', value: '1.2M', color: 'var(--accent-purple)' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={styles.statItem}>
            <Icon size={20} color={color} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{label}</div>
            </div>
          </div>
        ))}
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
  sectionTitle: {
    fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700,
    color: 'var(--text-primary)', letterSpacing: '1px', marginBottom: '6px',
  },
  sectionSub: { color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' },
  liveTag: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.25)',
    borderRadius: '99px', padding: '6px 14px',
    fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-red)',
    letterSpacing: '2px',
  },
  liveDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'var(--accent-red)', animation: 'pulse-glow 1s infinite',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  asteroidGrid: { display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' },
  asteroidStat: { display: 'flex', flexDirection: 'column', gap: '3px' },
  dataSource: { color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)', marginTop: '12px', letterSpacing: '0.5px' },
  tempBar: { marginTop: '16px' },
  spaceWeather: { paddingTop: '4px' },
  apodImageWrap: { position: 'relative', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' },
  apodImage: { width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' },
  apodImageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, var(--bg-card))' },
  apodTitle: { fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.5px' },
  apodExplanation: { fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' },
  apodLink: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    color: 'var(--accent-cyan)', fontSize: '12px', textDecoration: 'none',
    fontFamily: 'var(--font-mono)',
    transition: 'var(--transition)',
  },
  alertList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' },
  alertItem: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  alertDot: { width: '7px', height: '7px', borderRadius: '50%', marginTop: '5px', flexShrink: 0 },
  satList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' },
  satItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  statsBanner: {
    background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)',
    padding: '24px 32px',
    display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px',
  },
  statItem: {
    display: 'flex', alignItems: 'center', gap: '14px',
  },
};
