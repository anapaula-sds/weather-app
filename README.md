# 🌤️ Vanilla JS Weather App

Este é um projeto moderno, educativo e totalmente montado em **JavaScript Puro (Vanilla JS)** ensinando iniciantes a construir uma aplicação real integrada a APIs, sem necessidade de depender de frameworks que abstraiam a lógica básica.

## 🎯 Objetivo do Projeto
Permitir que o usuário digite o nome de qualquer cidade mundial e obtenha instantaneamente sua temperatura e condição climática usando a confiável e livre plataforma da API **Open-Meteo**.

---

## ✨ Funcionalidades Principais
- 🌍 **Busca de Cidades em Tempo Real:** Via de fluxo Duplo inteligente. O sistema consome *primeiro* uma API de Geocodificação e *em seguida* a API do Open-Meteo.
- 🛡️ **Seguro contra Erros:** Lida tranquilamente com buscas sem-resultado ou queda de internet usando retornos `try / catch`.
- 💎 **Interface Glassmorphism Animada:** Design premium responsivo preso em *Single Page Lock* (absolutamente zero scroll), com partículas dinâmicas fluindo na tela (chuva caindo, névoa, raios de sol) atreladas ao clima devolvido pelo satélite.
- 🌡️ **Motor de Conversão e Extras Matemáticos:** Botões de alternância instantânea de Graus Celsius/Fahrenheit no lado do cliente, com recálculos físicos sofisticados extras de Sensação Térmica (Wind-Chill e Heat-Index) e índice de Radiação UV.
- 🎨 **Modularidade Moderna:** Código dividido nos termos da indústria atual. Há pacotes `api`, pacotes de interface maravilhosos `components` e ferramentas soltas puras no `utils`.
- 🎓 **Código Limpo:** Todo código possui amplos comentários simples e claros focado estritamente na alta organização lógica da engenharia de software utilizada.
---

## 📂 Organização do Projeto

```text
weather-app/
├─ src/
│  ├─ api/
│  │  └─ weatherApi.js        # Executa as comunicações na Internet
│  ├─ components/
│  │  ├─ SearchForm.js        # Lida com teclados e eventos do form
│  │  └─ WeatherCard.js       # Injeta dinamicamente as respostas visuais
│  ├─ utils/
│  │  └─ formatWeather.js     # Formata visuais de temperatura e traduz emoticons
│  ├─ styles/
│  │  └─ main.css             # Cores e posicionamentos centrais em CSS puro
│  └─ main.js                 # Ponto Central Global (Entry Point)
├─ public/
│  └─ index.html              # Interface Gráfica de Usuário Estrutural
├─ APRENDIZADO.md             # 🌟 Livro Diario com todas as matérias extraidas
├─ package.json               # Configurações de módulos de sistema
└─ README.md                  # Este próprio arquivo explicativo
```

---

## 🚀 Como instalar e ver rodando passo-a-passo no seu PC

Como este projeto utiliza inovações ativas do sistema `import/export`, **abrir apenas o index e testar no meio físico do Windows causará bloqueio de Segurança CORS do Computador**. Sendo assim:

1. Acesse seu Editor preferencial **(VS Code)**.
2. Com a pasta raiz aberta nele, aperte a aba lateral esquerda **Extensões**.
3. Baixe e instale a famosa aba **`Live Server`**.
4. Acesse seu arquivo `/public/index.html`. Clique nele com o **botão direito do seu Mouse** e selecione a funcionalidade roxa recém instalada **`Open with Live Server`**.
5. Aproveite. A página será enviada para localhost do seu Navegador perfeitamente funcional!

---

## 📖 Arquivo de Estudos Diários!

Foi adicionado aqui, no pacote, o manual super completo chamado [**APRENDIZADO.md**](./APRENDIZADO.md). Lá detalha como esse aplicativo lida perfeitamente, sob ótica do estudante iniciante, com *Promises*, *TRACI Prompts*, e *Cadeia de Chamadas de APIs.* 
Não feche o repositório sem ler a reflexão incrível que está descrita por lá! 

Obrigada por acompanhar essa montagem fantástica. Cursos reais desenvolvem dev reais! ✨
