/* =====================================================
   components/WeatherCard.js
   Renderiza o card de resultado e gerencia temas visuais
   ===================================================== */
import {
  formatTemperature,
  getWeatherInfo,
  getWindDirectionEmoji,
  estimateUV,
} from '../utils/formatWeather.js';

const resultSection = document.getElementById('weather-result');
const statusMsg     = document.getElementById('status-message');
const headerIcon    = document.getElementById('header-icon');
const rainContainer = document.getElementById('rain-container');
const body          = document.body;

// Lista de classes de tema para limpeza antes de aplicar novo
const THEMES = ['theme-sunny','theme-partcloud','theme-cloudy','theme-rainy','theme-storm','theme-fog'];

// Armazena os dados mais recentes para o toggle °C/°F
let _lastData = null;
let _isFahrenheit = false;

/** Registra a preferência vinda do toggle */
export function setFahrenheit(val) { _isFahrenheit = !!val; }

// ── Exibe animação de loading ─────────────────────────
export function showLoading() {
  resultSection.classList.add('hidden');
  statusMsg.className = 'status-message';
  statusMsg.innerHTML = `
    <span>🔭 Buscando clima</span>
    <span class="loading-dots">
      <span></span><span></span><span></span>
    </span>
  `;
}

// ── Exibe mensagem de erro ────────────────────────────
export function showError(message) {
  resultSection.classList.add('hidden');
  statusMsg.className = 'status-message error';
  statusMsg.innerHTML = `❌ ${message}`;
}

// ── Renderiza o card com dados do clima ───────────────
export function showData(data) {
  _lastData = data;
  _render(data, _isFahrenheit);
}

/** Chamado pelo toggle para re-renderizar na nova unidade */
export function rerenderUnit(fahrenheit) {
  _isFahrenheit = fahrenheit;
  if (_lastData) _render(_lastData, fahrenheit);
}

// ── Renderização interna ──────────────────────────────
function _render(data, fahrenheit) {
  statusMsg.innerHTML = '';

  const info    = getWeatherInfo(data.weathercode);
  const tempStr = formatTemperature(data.temperature, fahrenheit);
  const feelsStr = formatTemperature(data.feelsLike ?? data.temperature, fahrenheit);
  const windDir  = getWindDirectionEmoji(data.windDirection ?? 0);
  const uv       = estimateUV(data.weathercode, data.temperature);
  const uvDots   = '●'.repeat(uv.bar) + '○'.repeat(5 - uv.bar);

  // Hora Local da Cidade
  const localTime = _getLocalTime(data.timezone);

  // Aplica tema visual no body
  _applyTheme(info.theme);

  // Atualiza ícone do header
  if (headerIcon) headerIcon.textContent = info.emoji;

  // Gera gotas de chuva se necessário
  _updateRain(info.theme);

  // Monta o HTML do card
  resultSection.innerHTML = `
    <span class="weather-icon-result">${info.emoji}</span>
    <div class="weather-city">${data.cityName}${data.state ? ' - ' + data.state : ''}${data.country ? ', ' + data.country : ''}</div>
    <div class="weather-condition-label">${info.label}</div>
    <div class="temperature-display">${tempStr}</div>

    <div class="details-grid">
      <div class="detail-tile">
        <span class="tile-icon">🤔</span>
        <span class="tile-label">Sensação</span>
        <span class="tile-value">${feelsStr}</span>
      </div>
      <div class="detail-tile">
        <span class="tile-icon">💧</span>
        <span class="tile-label">Umidade</span>
        <span class="tile-value">${data.humidity}%</span>
      </div>
      <div class="detail-tile">
        <span class="tile-icon">💨</span>
        <span class="tile-label">Vento ${windDir}</span>
        <span class="tile-value">${data.windspeed} km/h</span>
      </div>
      <div class="detail-tile">
        <span class="tile-icon">🌡️</span>
        <span class="tile-label">Pressão</span>
        <span class="tile-value">${data.pressure ? Math.round(data.pressure) + ' hPa' : '---'}</span>
      </div>
      <div class="detail-tile">
        <span class="tile-icon">🌧️</span>
        <span class="tile-label">Precipitação</span>
        <span class="tile-value">${data.precipitation} mm</span>
      </div>
      <div class="detail-tile">
        <span class="tile-icon">☀️</span>
        <span class="tile-label">UV (~)</span>
        <span class="tile-value" title="${uv.level}">${uvDots}</span>
      </div>
    </div>

    <div class="local-time-bar">
      🕐 Hora local: <strong>${localTime}</strong>
    </div>
  `;

  resultSection.classList.remove('hidden');
}

/** Aplica classe de tema no body removendo as anteriores */
function _applyTheme(theme) {
  THEMES.forEach(t => body.classList.remove(t));
  if (theme) body.classList.add(theme);
}

/** Cria ou remove partículas de chuva do container */
function _updateRain(theme) {
  if (!rainContainer) return;
  rainContainer.innerHTML = '';
  if (theme === 'theme-rainy' || theme === 'theme-storm') {
    const count = theme === 'theme-storm' ? 80 : 45;
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.className = 'raindrop';
      const h = Math.random() * 80 + 20; // altura entre 20-100px
      drop.style.cssText = `
        left: ${Math.random() * 100}%;
        height: ${h}px;
        animation-duration: ${Math.random() * 0.7 + 0.5}s;
        animation-delay: -${Math.random() * 2}s;
        opacity: ${Math.random() * 0.4 + 0.3};
      `;
      rainContainer.appendChild(drop);
    }
  }
}

/** Formata a hora local de um fuso horário IANA */
function _getLocalTime(timezone) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    }).format(new Date());
  } catch {
    return '---';
  }
}
