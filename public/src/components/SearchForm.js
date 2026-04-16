export function setupSearchForm(onSubmitCallback) {
  const form = document.getElementById('search-form');
  const input = document.getElementById('city-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recarregar a tela da forma burra e nativa do navegador!
    const city = input.value.trim();
    if (city) {
      onSubmitCallback(city);
      input.value = ''; // Limpa pra não ter trabalho no próximo digitado
    }
  });
}
