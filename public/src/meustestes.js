/* =======================================
 * ARQUIVO: src/meustestes.js 
 * Objetivo: Motor Nativo Automatizado de QA
 * ======================================= */
import { fetchWeatherByCity } from './api/weatherApi.js';

export async function rodarAutomacaoDeTestes() {
  console.log("🚀 LIGANDO MOTOR DE TESTES DE API 🚀");
  console.log("-----------------------------------------");

  // TESTE 1: A API consegue buscar os dados reais com sucesso pleno?
  try {
    const dadosDeSucesso = await fetchWeatherByCity("Rio de Janeiro");
    
    // Testa minuciosamente as sub-propriedades vitais (Temperatura e Umidade)
    if (dadosDeSucesso.cityName && dadosDeSucesso.temperature !== undefined && dadosDeSucesso.humidity !== undefined) {
      console.log(`✅ TESTE 1 PASSOU: A API encontrou ${dadosDeSucesso.cityName} perfazendo ${dadosDeSucesso.temperature}°C.`);
    } else {
      console.error("❌ TESTE 1 FALHOU: A API efetuou o processo, porém os dados de saída voltaram corrompidos.");
    }
  } catch(e) {
    console.error("❌ TESTE 1 FALHOU: Houve ruptura global na tentativa do caso perfeito.", e);
  }

  // TESTE 2: A API se defende da engenharia do Caos e lixos?
  try {
    // Intencionalmente batendo na parede para verificar a blindagem da função
    await fetchWeatherByCity("Narnia123");
    
    // Se não for lançado ao CATCH, ocorreu um grave vazamento lógico na rotina restritiva
    console.error("❌ TESTE 2 FALHOU: Falha Crítica. A validação perdoou e engoliu o parâmetro fictício sem aviso.");
  } catch(erro) {
    // Retorno do Catch almejado - Triunfo defensivo
    console.log(`✅ TESTE 2 PASSOU: Escudo ativado perfeitamente. O Sistema rechaçou a sujeira exigindo: "${erro.message}"`);
  }
}
