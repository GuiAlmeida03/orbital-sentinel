// src/services/iotService.js

const BASELINE = {
  temperatura: 22, umidade: 55, pressao: 1013,
  vibracao: 0.08, gas: 25, radiacao: 20, distancia: 280,
};

const LIMITS_GO = {
  temperatura: 30, umidade: 70, vibracao: 0.2, gas: 40, radiacao: 40,
};

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function generateReading(prev) {
  return {
    temperatura: clamp(prev.temperatura + randn() * 0.5, 18, 45),
    umidade:     clamp(prev.umidade     + randn() * 1.0, 35, 95),
    pressao:     clamp(prev.pressao     + randn() * 0.3, 1005, 1025),
    vibracao:    clamp(prev.vibracao    + randn() * 0.02, 0, 0.8),
    gas:         clamp(prev.gas         + randn() * 2.0, 0, 100),
    radiacao:    clamp(prev.radiacao    + randn() * 2.0, 0, 100),
    distancia:   clamp(prev.distancia   + randn() * 5.0, 50, 500),
    ts: Date.now(),
  };
}

function classify(r) {
  const { temperatura: t, umidade: u, vibracao: v, gas: g, radiacao: rad } = r;
  const limits = LIMITS_GO;
  const scrubFactor  = 1.4;
  const holdFactor   = 1.2;
  const cautionFactor = 1.1;

  if (
    t >= limits.temperatura * scrubFactor ||
    u >= limits.umidade * scrubFactor ||
    v >= limits.vibracao * scrubFactor ||
    g >= limits.gas * scrubFactor ||
    rad >= limits.radiacao * scrubFactor
  ) return 'SCRUB';

  if (
    t >= limits.temperatura * holdFactor ||
    u >= limits.umidade * holdFactor ||
    v >= limits.vibracao * holdFactor ||
    g >= limits.gas * holdFactor ||
    rad >= limits.radiacao * holdFactor
  ) return 'HOLD';

  if (
    t >= limits.temperatura * cautionFactor ||
    u >= limits.umidade * cautionFactor ||
    v >= limits.vibracao * cautionFactor ||
    g >= limits.gas * cautionFactor ||
    rad >= limits.radiacao * cautionFactor
  ) return 'CAUTION';

  return 'GO';
}

function confidence(r) {
  const limits = LIMITS_GO;
  const ratios = [
    r.temperatura / limits.temperatura,
    r.umidade     / limits.umidade,
    r.vibracao    / limits.vibracao,
    r.gas         / limits.gas,
    r.radiacao    / limits.radiacao,
  ];
  const maxRatio = Math.max(...ratios);
  return clamp(Math.round((1 - (maxRatio - 0.5)) * 100), 10, 100);
}

export function subscribe(callback) {
  let current = { ...BASELINE, ts: Date.now() };
  let history = Array.from({ length: 20 }, () => ({ ...BASELINE, ts: Date.now() }));

  function tick() {
    current = generateReading(current);
    history = [...history.slice(-19), current];
    callback({
      reading: current,
      history,
      status: classify(current),
      confidence: confidence(current),
    });
  }

  tick();
  const id = setInterval(tick, 3000);
  return () => clearInterval(id);
}
