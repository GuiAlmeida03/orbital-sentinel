# 🚀 OrbitalMind AI

> Centro Inteligente de Monitoramento Espacial com IA Generativa

**Projeto acadêmico — FIAP | Disciplina: Inteligência Artificial**

---

## 📸 Visão Geral

OrbitalMind AI é uma plataforma web futurista que simula um centro de monitoramento espacial inteligente. O sistema integra dados reais da NASA, visualiza telemetria orbital em tempo real e conta com **Astra**, um assistente de IA generativa alimentado pelo modelo Claude da Anthropic.

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| **React 18** | Framework UI com Hooks e Componentes Funcionais |
| **Vite** | Build tool e dev server ultrarrápido |
| **JavaScript (ES2022+)** | Linguagem principal |
| **CSS puro** com variáveis | Estilização com design system customizado |
| **Fetch API** | Consumo de APIs externas |
| **NASA API** | Dados astronômicos reais (APOD + NeoWs) |
| **Anthropic Claude API** | IA Generativa para o assistente Astra |
| **Lucide React** | Ícones modernos |

---

## ✅ Requisitos FIAP Demonstrados

| Requisito | Implementado em |
|---|---|
| `useState` | Todos os componentes (mensagens, seção ativa, dados NASA) |
| `useEffect` | Dashboard (fetch NASA), Monitor (intervalo de telemetria), Header (relógio) |
| Props | Header recebe `activeSection` e `onNavigate`; SpaceCard recebe múltiplas props |
| Eventos | `onClick`, `onKeyDown`, `onChange`, `onMouseEnter/Leave` |
| Renderização Condicional | Loading states, erros, seções da app, tipo de mídia APOD |
| Renderização de Listas | Alertas, satélites, missões, sugestões do chat |
| Componentização | Header, Dashboard, Monitor, ChatBot, SpaceCard, Loading, Footer |
| Consumo de API | NASA APOD, NASA NeoWs, Anthropic Claude |
| Interface Responsiva | Grid responsivo, menu mobile hamburger |
| IA Generativa | Assistente Astra via API Claude (real, não simulada) |

---

## 📁 Estrutura do Projeto

```
orbitalmind/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx              # Ponto de entrada
    ├── App.jsx               # Componente raiz + navegação
    ├── components/
    │   ├── Header.jsx        # Barra de navegação + relógio
    │   ├── Dashboard.jsx     # Dashboard principal (NASA APIs)
    │   ├── Monitor.jsx       # Telemetria + gráficos em tempo real
    │   ├── ChatBot.jsx       # Assistente Astra AI
    │   ├── SpaceCard.jsx     # Card reutilizável glassmorphism
    │   ├── Loading.jsx       # Indicadores de carregamento
    │   └── Footer.jsx        # Rodapé
    ├── services/
    │   └── nasaApi.js        # Integração NASA API
    └── styles/
        └── global.css        # Variáveis CSS + animações + base
```

---

## 🚀 Como Instalar e Rodar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passo a Passo

```bash
# 1. Clone ou extraia o projeto
cd orbitalmind

# 2. Instale as dependências
npm install

# 3. Rode em desenvolvimento
npm run dev

# 4. Acesse no navegador
# http://localhost:5173
```

### Build para produção

```bash
npm run build
npm run preview  # visualiza o build localmente
```

---

## 🌐 Deploy na Vercel

### Opção 1: Via CLI (recomendado)

```bash
# Instale a CLI da Vercel
npm install -g vercel

# Faça deploy
vercel

# Siga as instruções interativas
# O projeto será detectado automaticamente como Vite
```

### Opção 2: Via Interface Web

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"New Project"**
3. Importe o repositório Git (GitHub/GitLab)
4. Vercel detecta automaticamente o Vite
5. Clique em **Deploy** ✅

### Configurações automáticas detectadas:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 🔑 APIs Utilizadas

### NASA API (gratuita)
- **Base URL**: `https://api.nasa.gov`
- **Chave padrão**: `DEMO_KEY` (30 req/hora)
- **Chave gratuita**: Cadastre em [api.nasa.gov](https://api.nasa.gov) para 1000 req/hora
- **Endpoints**: `/planetary/apod` e `/neo/rest/v1/feed`

Para usar sua própria chave, edite `src/services/nasaApi.js`:
```js
const NASA_API_KEY = 'SUA_CHAVE_AQUI';
```

### Anthropic Claude API (para o assistente Astra)
- A API key é injetada automaticamente pelo ambiente Claude.ai
- Em produção própria, adicione `anthropic-beta: messages-2023-06-01` e sua API key

---

## 🎨 Funcionalidades

### 📊 Dashboard Espacial
- **Asteroides próximos** via NASA NeoWs (dados reais, 3 dias)
- **APOD** — Imagem Astronômica do Dia com título e descrição
- **Temperatura global** com barra de anomalia climática
- **Clima espacial** — índice solar, campo magnético, raios cósmicos
- **Alertas do sistema** — renderização de lista dinâmica
- **Status de satélites** — ISS, Hubble, James Webb e outros

### 📡 Monitor
- **Telemetria orbital** — gráfico de linhas SVG atualizado a cada 2s
- **Performance do sistema** — gauges circulares animados
- **Missões ativas** — Artemis IV, Mars Rover, Europa Clipper
- **Frequências de comunicação** — canais e intensidade de sinal

### 🤖 Astra AI
- Chat com IA generativa real (Claude via Anthropic API)
- Contexto especializado em astronomia e espaço
- Histórico de conversa mantido durante a sessão
- Sugestões de perguntas pré-definidas
- Typing indicator animado
- Suporte a formatação **bold** nas respostas

---

## 🖌 Design System

```css
/* Paleta principal */
--accent-cyan:   #00f5ff  /* Destaque principal */
--accent-blue:   #0066ff  /* Ações e links */
--accent-purple: #7c3aed  /* IA e elementos secundários */
--accent-green:  #00ff88  /* Status online / ok */
--accent-red:    #ff3366  /* Alertas / perigos */
--accent-amber:  #ffaa00  /* Avisos moderados */

/* Tipografia */
Orbitron     → Títulos e displays (sci-fi)
Rajdhani     → Corpo do texto (legível e futurista)
Share Tech Mono → Dados técnicos e código
```

---

## 📝 Decisões de Projeto

- **SVG nativo** para gráficos — sem dependência de biblioteca pesada
- **CSS puro** com variáveis — sem Tailwind, total controle do design
- **Glassmorphism** via `backdrop-filter: blur()` — efeito moderno
- **Starfield no body** — atmosfera espacial sem canvas pesado
- **API real** para Astra — diferencial sobre chatbot simulado
- **Dados mockados** complementam as APIs quando há limitação de rate

---

## 👨‍🎓 Informações Acadêmicas

- **Instituição**: FIAP
- **Disciplina**: Inteligência Artificial
- **Tema**: Soluções Inteligentes de IA para a Nova Economia Espacial
- **Tecnologias principais**: ReactJS + Vite + NASA API + Claude AI

---

*Desenvolvido com 🚀 para a disciplina de Front da FIAP*
