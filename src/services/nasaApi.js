// services/nasaApi.js
// Serviço para integração com a NASA API
// Chave DEMO_KEY tem limite de 30 req/hora — substitua por uma chave real em api.nasa.gov

const NASA_API_KEY = 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

/**
 * Busca a Astronomy Picture of the Day (APOD)
 * @returns {Promise<Object>} Dados da imagem do dia
 */
export async function fetchAPOD() {
  const res = await fetch(`${NASA_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}`);
  if (!res.ok) throw new Error('Falha ao buscar APOD');
  return res.json();
}

/**
 * Busca asteroides próximos da Terra nos próximos 3 dias
 * @returns {Promise<Object>} Dados de asteroides NeoWs
 */
export async function fetchAsteroids() {
  const today = new Date();
  const end = new Date();
  end.setDate(today.getDate() + 3);

  const startDate = today.toISOString().split('T')[0];
  const endDate = end.toISOString().split('T')[0];

  const res = await fetch(
    `${NASA_BASE_URL}/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
  );
  if (!res.ok) throw new Error('Falha ao buscar asteroides');
  return res.json();
}

/**
 * Processa os dados de asteroides e retorna um resumo
 * @param {Object} data - Dados brutos da API NeoWs
 * @returns {Object} Resumo dos asteroides
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
