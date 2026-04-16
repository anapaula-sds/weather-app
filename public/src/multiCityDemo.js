/**
 * LABORATÓRIO: Busca Eficiente de Múltiplas Cidades
 * Objetivo: Minimizar chamadas a API agrupando coordenadas em uma só viagem ao servidor.
 */

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function buscarTemperaturasEmMassa() {
  const cidadesAlvo = ["Tokyo", "New York", "London"];
  console.log("Iniciando varredura conjunta para: ", cidadesAlvo);

  try {
    // PASSO 1: Fazer as traduções de Nomes para GPS (Em Paralelo)
    // O Promise.all() dispara todos os 3 motoboys ao mesmo tempo no Google, economizando tempo.
    const pacotesGeograficos = await Promise.all(
      cidadesAlvo.map(cidade =>
        fetch(`${GEO_API}?name=${cidade}&count=1`).then(res => res.json())
      )
    );

    // Separamos as cooredenadas para listas isoladas
    const latitudes = [];
    const longitudes = [];
    const nomesValidados = [];

    // Verificamos e extraimos as cooredenadas em Loop
    pacotesGeograficos.forEach(pesquisa => {
      if (pesquisa.results && pesquisa.results.length > 0) {
        latitudes.push(pesquisa.results[0].latitude);
        longitudes.push(pesquisa.results[0].longitude);
        nomesValidados.push(pesquisa.results[0].name);
      }
    });

    // PASSO 2: O TRUQUE DE MESTRE DA OPEN-METEO
    // A documentação deles permite concatenar valores separando por DÍGITOS E VÍRGULAS.
    // Ex: latitude=35,-74,51  & longitude=139,40,-0.12
    const latitudesMescladas = latitudes.join(',');
    const longitudesMescladas = longitudes.join(',');

    // PASSO 3: Enviamos os arrays de coordenadas numa única e econômica Viagem
    const urlPrevisao = `${WEATHER_API}?latitude=${latitudesMescladas}&longitude=${longitudesMescladas}&current=temperature_2m`;
    
    const respostaPrevisao = await fetch(urlPrevisao);
    if (!respostaPrevisao.ok) throw new Error("Falha colossal no satélite central.");

    const dadosClimaOtimizado = await respostaPrevisao.json();

    // Quando enviamos um Array pra Open-Meteo, ela nos devolve outro Array mágico!
    console.log("\n🌍 STATUS MUNDIAL ATUALIZADO (Sucesso):");
    
    // Looping final para imprimir para cada cidade a temperatura atrelada a ela
    nomesValidados.forEach((nomeFinal, index) => {
      // Como a API devolve uma lista de dados (1 pra cada cidade), usamos o "index" para linká-los
      const temperaturaDele = dadosClimaOtimizado[index].current.temperature_2m;
      console.log(`📍 ${nomeFinal} está fazendo exatos ${temperaturaDele}°C`);
    });

  } catch (error) {
    console.error("❌ A Operação Mundial em Massa Fracassou: ", error.message);
  }
}
