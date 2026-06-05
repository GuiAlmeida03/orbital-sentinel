// services/nasaApi.js
// Serviço para integração com a NASA API
// Chave DEMO_KEY tem limite de 30 req/hora — substitua por uma chave real em api.nasa.gov

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

// Dados de fallback exibidos quando a NASA API estiver indisponível ou com limite atingido
const FALLBACK_APOD = {
  title: 'Nebulosa de Órion',
  explanation: 'A Nebulosa de Órion (M42) é uma das regiões de formação estelar mais estudadas do universo. Localizada a cerca de 1.344 anos-luz da Terra, é visível a olho nu como uma mancha difusa na constelação de Órion. O Telescópio James Webb revelou detalhes sem precedentes de suas estruturas filamentares e protoplanetas em formação.',
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/800px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg',
  hdurl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg',
  media_type: 'image',
  date: new Date().toISOString().split('T')[0],
  _fallback: true,
};

const FALLBACK_ASTEROIDS = {
  element_count: 23,
  near_earth_objects: {
    today: [
      {
        name: '(2024 BX1)',
        is_potentially_hazardous_asteroid: false,
        close_approach_data: [{ miss_distance: { kilometers: '1842300.5' } }],
        estimated_diameter: { kilometers: { estimated_diameter_min: 0.008, estimated_diameter_max: 0.018 } },
      },
      {
        name: '(2023 QA5)',
        is_potentially_hazardous_asteroid: true,
        close_approach_data: [{ miss_distance: { kilometers: '4210500.2' } }],
        estimated_diameter: { kilometers: { estimated_diameter_min: 0.12, estimated_diameter_max: 0.27 } },
      },
      {
        name: '(2021 GT3)',
        is_potentially_hazardous_asteroid: false,
        close_approach_data: [{ miss_distance: { kilometers: '6732100.0' } }],
        estimated_diameter: { kilometers: { estimated_diameter_min: 0.04, estimated_diameter_max: 0.09 } },
      },
    ],
  },
  _fallback: true,
};

/**
 * Busca a Astronomy Picture of the Day (APOD)
 * Retorna dados de fallback se a API estiver indisponível
 */
export async function fetchAPOD() {
  try {
    const res = await fetch(`${NASA_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}`);
    if (!res.ok) {
      console.warn('NASA APOD indisponível (limite atingido ou erro). Usando dados simulados.');
      return FALLBACK_APOD;
    }
    return res.json();
  } catch {
    console.warn('NASA APOD: erro de rede. Usando dados simulados.');
    return FALLBACK_APOD;
  }
}

/**
 * Busca asteroides próximos da Terra nos próximos 3 dias
 * Retorna dados de fallback se a API estiver indisponível
 */
export async function fetchAsteroids() {
  try {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 3);

    const startDate = today.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    const res = await fetch(
      `${NASA_BASE_URL}/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
    );
    if (!res.ok) {
      console.warn('NASA NeoWs indisponível (limite atingido ou erro). Usando dados simulados.');
      return FALLBACK_ASTEROIDS;
    }
    return res.json();
  } catch {
    console.warn('NASA NeoWs: erro de rede. Usando dados simulados.');
    return FALLBACK_ASTEROIDS;
  }
}

/**
 * Processa os dados de asteroides e retorna um resumo
 */
export function processAsteroidData(data) {
  const allAsteroids = Object.values(data.near_earth_objects).flat();
  const hazardous = allAsteroids.filter(a => a.is_potentially_hazardous_asteroid);
  const closest = allAsteroids.sort(
    (a, b) =>
      parseFloat(a.close_approach_data[0]?.miss_distance?.kilometers) -
      parseFloat(b.close_approach_data[0]?.miss_distance?.kilometers)
  )[0];

  return {
    total: data.element_count,
    hazardous: hazardous.length,
    isFallback: !!data._fallback,
    closest: closest
      ? {
          name: closest.name,
          distance: parseFloat(
            closest.close_approach_data[0]?.miss_distance?.kilometers
          ).toLocaleString('pt-BR', { maximumFractionDigits: 0 }),
          diameter: (
            (closest.estimated_diameter.kilometers.estimated_diameter_min +
              closest.estimated_diameter.kilometers.estimated_diameter_max) /
            2
          ).toFixed(3),
        }
      : null,
  };
}
