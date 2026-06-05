// src/services/launchWindowService.js

const FALLBACK_KP = [
  ['2026-06-04 00:00:00', '2.3'], ['2026-06-04 03:00:00', '3.0'],
  ['2026-06-04 06:00:00', '2.7'], ['2026-06-04 09:00:00', '3.3'],
  ['2026-06-04 12:00:00', '2.8'], ['2026-06-04 15:00:00', '3.1'],
  ['2026-06-04 18:00:00', '2.5'], ['2026-06-04 21:00:00', '3.2'],
];

const FALLBACK_LAUNCHES = [
  { name: 'Falcon 9 · Starlink 6-69', net: '2026-06-06T14:30:00Z', status: 'Go for Launch', provider: 'SpaceX' },
  { name: 'Ariane 6 · Galileo M15', net: '2026-06-08T09:15:00Z', status: 'TBD', provider: 'ArianeGroup' },
  { name: 'New Glenn · NG-5', net: '2026-06-10T22:00:00Z', status: 'TBD', provider: 'Blue Origin' },
];

function classifyKp(kp) {
  if (kp >= 7) return 'SCRUB';
  if (kp >= 6) return 'HOLD';
  if (kp >= 5) return 'CAUTION';
  return 'GO';
}

async function fetchKp() {
  const res = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
  if (!res.ok) throw new Error('NOAA fetch failed');
  const raw = await res.json();
  return raw.slice(1).map(row => ({ datetime: row[0], kp: parseFloat(row[1]) }));
}

async function fetchLaunches() {
  const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5&format=json');
  if (!res.ok) throw new Error('LL2 fetch failed');
  const data = await res.json();
  return (data.results || []).slice(0, 3).map(l => ({
    name: l.name,
    net: l.net,
    status: l.status?.name ?? 'TBD',
    provider: l.launch_service_provider?.name ?? '',
  }));
}

export async function fetchLaunchWindowData() {
  let kpData, launches, kpCurrent;

  try {
    kpData = await fetchKp();
    kpCurrent = kpData[kpData.length - 1]?.kp ?? 3.2;
  } catch {
    kpData = FALLBACK_KP.map(r => ({ datetime: r[0], kp: parseFloat(r[1]) }));
    kpCurrent = 3.2;
  }

  try {
    launches = await fetchLaunches();
  } catch {
    launches = FALLBACK_LAUNCHES;
  }

  return {
    kpHistory: kpData,
    kpCurrent,
    status: classifyKp(kpCurrent),
    launches,
  };
}
