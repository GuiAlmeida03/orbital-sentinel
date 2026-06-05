// src/services/satelliteService.js

const SATELLITES = [
  { id: 'iss',     name: 'ISS',         baseline: { temp_painel: 24,   voltagem: 28.4, radiacao: 12, temp_bat: 18  } },
  { id: 'hubble',  name: 'Hubble ST',   baseline: { temp_painel: 19,   voltagem: 27.1, radiacao: 18, temp_bat: 15  } },
  { id: 'webb',    name: 'James Webb',  baseline: { temp_painel: -223, voltagem: 29.8, radiacao: 8,  temp_bat: -220 } },
  { id: 'sl42',    name: 'Starlink-42', baseline: { temp_painel: 45,   voltagem: 26.5, radiacao: 22, temp_bat: 38  } },
  { id: 'gpsiif',  name: 'GPS-IIF',     baseline: { temp_painel: 31,   voltagem: 28.0, radiacao: 15, temp_bat: 25  } },
];

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function classifySatellite(reading, baseline) {
  const dT  = Math.abs(reading.temp_painel - baseline.temp_painel);
  const v   = reading.voltagem;
  const rad = reading.radiacao;

  if (v < 24 || rad > 45 || dT > 25) return 'Falha Iminente';
  if (v < 26 || rad > 30 || dT > 15) return 'Alerta';
  return 'Normal';
}

function updateSatellite(sat) {
  const b = sat.baseline;
  const reading = {
    temp_painel: b.temp_painel + randn() * 1.5,
    voltagem:    Math.max(22, b.voltagem + randn() * 0.3),
    radiacao:    Math.max(0,  b.radiacao + randn() * 2),
    temp_bat:    b.temp_bat + randn() * 1.0,
  };
  return {
    ...sat,
    reading,
    status: classifySatellite(reading, b),
  };
}

export function subscribe(callback) {
  let satellites = SATELLITES.map(s => updateSatellite(s));

  function tick() {
    satellites = satellites.map(s => updateSatellite(s));
    const normal  = satellites.filter(s => s.status === 'Normal').length;
    const alerta  = satellites.filter(s => s.status === 'Alerta').length;
    const falha   = satellites.filter(s => s.status === 'Falha Iminente').length;
    const health  = Math.round((normal / satellites.length) * 100);
    callback({ satellites, normal, alerta, falha, health });
  }

  tick();
  const id = setInterval(tick, 5000);
  return () => clearInterval(id);
}
