/* =====================================================
   api/weatherApi.js
   Camada de dados: geocodificação + previsão do tempo
   Open-Meteo (gratuita, sem chave)
   ===================================================== */

const GEO_API     = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Busca clima atual de uma cidade pelo nome.
 * Etapa 1 → Geocoding (nome → lat/lon)
 * Etapa 2 → Forecast (lat/lon → dados meteorológicos)
 *
 * @param {string} cityName - Nome da cidade digitado pelo usuário
 * @returns {Promise<Object>} Objeto com dados formatados do clima
 */
export async function fetchWeatherByCity(cityName) {
  try {
    // ── Etapa 1: Geocodificação ──────────────────────────
    const geoRes = await fetch(
      `${GEO_API}?name=${encodeURIComponent(cityName)}&count=1&language=pt`
    );
    if (!geoRes.ok) throw new Error('O serviço de mapa falhou. Tente novamente.');

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`A cidade "${cityName}" não foi encontrada. Verifique o nome e tente novamente.`);
    }

    const { latitude, longitude, name, country, country_code, timezone, admin1 } = geoData.results[0];

    // ── Etapa 2: Previsão do Tempo ───────────────────────
    const params = new URLSearchParams({
      latitude, longitude,
      // Dados atuais solicitados
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'wind_speed_10m',
        'wind_direction_10m',
        'weather_code',
        'precipitation',
        'surface_pressure',
      ].join(','),
      wind_speed_unit: 'kmh',
      timezone: timezone || 'auto',
    });

    const weatherRes = await fetch(`${WEATHER_API}?${params}`);
    if (!weatherRes.ok) throw new Error('O servidor de clima não respondeu. Tente novamente.');

    const weatherData = await weatherRes.json();
    if (!weatherData || !weatherData.current) {
      throw new Error('A resposta da API de clima chegou vazia ou incompleta.');
    }

    const cur = weatherData.current;

    // ── Etapa 3: Empacotar retorno limpo ─────────────────
    return {
      cityName   : name,
      state      : admin1 || '',
      country    : country || '',
      countryCode: (country_code || '').toLowerCase(),
      timezone   : weatherData.timezone || timezone || 'UTC',
      temperature: cur.temperature_2m,
      feelsLike  : cur.apparent_temperature,
      weathercode: cur.weather_code,
      humidity   : cur.relative_humidity_2m,
      windspeed  : cur.wind_speed_10m,
      windDirection: cur.wind_direction_10m,
      precipitation: cur.precipitation ?? 0,
      pressure   : cur.surface_pressure ?? null,
    };

  } catch (error) {
    // Relança para o main.js tratar e exibir na tela
    throw error;
  }
}
