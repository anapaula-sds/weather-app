/* =====================================================
   main.js — Ponto de Entrada Central do Aplicativo
   ===================================================== */

/* ── Importações de Módulos ── */
import { setupSearchForm }                          from './components/SearchForm.js';
import { fetchWeatherByCity }                       from './api/weatherApi.js';
import { showLoading, showError, showData,
         rerenderUnit, setFahrenheit }              from './components/WeatherCard.js';
import { rodarAutomacaoDeTestes }                  from './meustestes.js';

// ── Toggle °C / °F ────────────────────────────────────
const btnC = document.getElementById('btn-celsius');
const btnF = document.getElementById('btn-fahrenheit');
let isFahrenheit = false;

btnC.addEventListener('click', () => {
  isFahrenheit = false;
  btnC.classList.add('active');
  btnF.classList.remove('active');
  setFahrenheit(false);
  rerenderUnit(false);
});

btnF.addEventListener('click', () => {
  isFahrenheit = true;
  btnF.classList.add('active');
  btnC.classList.remove('active');
  setFahrenheit(true);
  rerenderUnit(true);
});

// ── Fluxo Principal de Busca ──────────────────────────
async function processWeatherSearch(cityName) {
  showLoading();

  try {
    const weatherData = await fetchWeatherByCity(cityName);
    showData(weatherData);
  } catch (error) {
    showError(error.message);
  }
}

// ── Liga o Formulário de Busca ────────────────────────
setupSearchForm(processWeatherSearch);

// ─────────────────────────────────────────────────────
// MOTOR DE TESTES AUTOMÁTICOS (F12 → Console)
// Roda laboratórios de QA a cada carregamento da URL
// ─────────────────────────────────────────────────────
rodarAutomacaoDeTestes();
