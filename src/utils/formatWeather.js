/* =====================================================
   utils/formatWeather.js
   Converte dados brutos da API em formatos visuais
   ===================================================== */

/**
 * Arredonda e formata a temperatura.
 * @param {number} temp - temperatura em graus
 * @param {boolean} fahrenheit - se true, exibe em °F
 */
export function formatTemperature(temp, fahrenheit = false) {
  const rounded = Math.round(temp);
  if (fahrenheit) {
    const f = Math.round((rounded * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${rounded}°C`;
}

/**
 * Calcula o índice de sensação térmica (fórmula Wind Chill / Heat Index simples).
 * @param {number} temp - temperatura em °C
 * @param {number} humidity - umidade relativa em %
 * @param {number} wind - velocidade do vento em km/h
 * @param {boolean} fahrenheit - se true, retorna em °F
 */
export function getFeelsLike(temp, humidity, wind, fahrenheit = false) {
  let feels = temp;
  // Wind Chill (aplica quando frio e vento moderado)
  if (temp <= 10 && wind >= 4.8) {
    feels = 13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * temp * Math.pow(wind, 0.16);
  }
  // Heat Index simplificado (aplica quando quente e úmido)
  else if (temp >= 27 && humidity >= 40) {
    feels = -8.784695 + 1.61139411 * temp + 2.338549 * humidity
      - 0.14611605 * temp * humidity - 0.01230809 * temp * temp
      - 0.01642482 * humidity * humidity + 0.00221173 * temp * temp * humidity
      + 0.00072546 * temp * humidity * humidity
      - 0.00000358 * temp * temp * humidity * humidity;
  }
  return formatTemperature(Math.round(feels), fahrenheit);
}

/**
 * Mapeia o código WMO do Open-Meteo para emoji grande, texto e classe de tema.
 * @returns {{ emoji: string, label: string, theme: string }}
 */
export function getWeatherInfo(code) {
  const map = {
    0:  { emoji: '☀️',  label: 'Céu Limpo',          theme: 'theme-sunny'    },
    1:  { emoji: '🌤️', label: 'Predominantemente Limpo', theme: 'theme-partcloud' },
    2:  { emoji: '⛅',  label: 'Parcialmente Nublado', theme: 'theme-partcloud' },
    3:  { emoji: '☁️',  label: 'Encoberto',            theme: 'theme-cloudy'   },
    45: { emoji: '🌫️', label: 'Nevoeiro',              theme: 'theme-fog'      },
    48: { emoji: '🌫️', label: 'Nevoeiro c/ Geada',    theme: 'theme-fog'      },
    51: { emoji: '🌦️', label: 'Garoa Leve',            theme: 'theme-rainy'    },
    53: { emoji: '🌦️', label: 'Garoa Moderada',        theme: 'theme-rainy'    },
    55: { emoji: '🌧️', label: 'Garoa Intensa',         theme: 'theme-rainy'    },
    61: { emoji: '🌧️', label: 'Chuva Leve',            theme: 'theme-rainy'    },
    63: { emoji: '🌧️', label: 'Chuva Moderada',        theme: 'theme-rainy'    },
    65: { emoji: '🌧️', label: 'Chuva Intensa',         theme: 'theme-rainy'    },
    71: { emoji: '🌨️', label: 'Neve Fraca',            theme: 'theme-cloudy'   },
    73: { emoji: '❄️',  label: 'Neve Moderada',         theme: 'theme-cloudy'   },
    75: { emoji: '❄️',  label: 'Neve Forte',            theme: 'theme-cloudy'   },
    80: { emoji: '🌦️', label: 'Pancadas de Chuva',     theme: 'theme-rainy'    },
    81: { emoji: '🌧️', label: 'Pancadas Moderadas',    theme: 'theme-rainy'    },
    82: { emoji: '⛈️',  label: 'Pancadas Violentas',   theme: 'theme-storm'    },
    95: { emoji: '⛈️',  label: 'Tempestade',            theme: 'theme-storm'    },
    96: { emoji: '🌩️', label: 'Tempestade c/ Granizo', theme: 'theme-storm'    },
    99: { emoji: '🌩️', label: 'Tempestade Forte c/ Granizo', theme: 'theme-storm' },
  };
  return map[code] || { emoji: '❓', label: 'Condição Desconhecida', theme: '' };
}

/**
 * Retorna emoji de direção do vento baseado no ângulo (graus).
 * @param {number} deg
 */
export function getWindDirectionEmoji(deg) {
  const dirs = ['⬆️ N','↗️ NE','➡️ L','↘️ SE','⬇️ S','↙️ SO','⬅️ O','↖️ NO'];
  return dirs[Math.round(deg / 45) % 8] || '';
}

/**
 * Estimativa do nível de UV com base na temperatura e cobertura de nuvem.
 * (Estimativa simplificada, não é dado real da API)
 * @param {number} code - código de clima WMO
 * @param {number} temp - temperatura em °C
 */
export function estimateUV(code, temp) {
  if ([95, 96, 99, 80, 81, 82, 61, 63, 65].includes(code)) return { level: 'Baixo', bar: 1 };
  if ([45, 48, 3].includes(code)) return { level: 'Baixo', bar: 1 };
  if ([2, 1].includes(code)) return temp > 28 ? { level: 'Alto', bar: 4 } : { level: 'Moderado', bar: 3 };
  if (code === 0) return temp > 32 ? { level: 'Muito Alto', bar: 5 } : { level: 'Alto', bar: 4 };
  return { level: 'Moderado', bar: 3 };
}
