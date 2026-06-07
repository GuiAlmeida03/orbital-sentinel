# 🛰️ Orbital Sentinel

> Plataforma integrada de monitoramento espacial — Global Solution FIAP 2026

**🌐 Deploy:** [guialmeida03.github.io/orbital-sentinel](https://guialmeida03.github.io/orbital-sentinel/)

---

## 📌 Sobre o Projeto

O **Orbital Sentinel** é um centro de controle espacial unificado que integra 8 módulos de disciplinas distintas da Global Solution FIAP numa única plataforma web. O sistema resolve um problema real: decisões críticas de operações espaciais dependem de dados espalhados em múltiplos sistemas sem visão integrada.

### O problema que resolve

Um lançamento espacial requer monitoramento simultâneo de sensores físicos do pad (IoT), clima espacial (RPA), saúde dos satélites em órbita (QML), risco ambiental na área (Visão Computacional) e acesso a conhecimento técnico (RAG). Sem integração, esses dados ficam fragmentados entre equipes e sistemas diferentes.

O Orbital Sentinel centraliza tudo em tempo real numa interface única.

---

## 🗂️ Módulos e Disciplinas

| Card | Disciplina | O que faz |
|---|---|---|
| **IoT Espaço Sentinela** | IoT | 7 sensores ESP32 simulados (temp, umidade, pressão, vibração, gás, radiação, distância) classificados em GO/CAUTION/HOLD/SCRUB em tempo real |
| **Space RAG** | Cognitive Computing | Chat com LLaMA 3.3 70B especializado em 5 domínios: NASA Artemis, ESA Copernicus, INPE Queimadas, Starlink, EMBRAPA Geo |
| **Telemetria de Satélites** | QML / Machine Learning | Classificador SVM de telemetria de 5 satélites reais (ISS, Hubble, Webb, Starlink-42, GPS-IIF) em Normal / Alerta / Falha Iminente |
| **Mapa de Risco de Incêndio** | Visão Computacional | Mapa SVG do Brasil com 6 biomas coloridos por nível de risco, baseado nos resultados do EfficientNetB0 (AUC-ROC 0.9987) |
| **NLP Fine-Tuning** | NLP | Chat sobre certificações LEED/AQUA-HQE simulando o Llama 3.2 3B fine-tuned com QLoRA (BLEU-4 +212%) |
| **Launch Window** | RPA | Dados reais da NOAA SWPC (índice Kp geomagnético) + Launch Library 2 para classificar janelas de lançamento |
| **Energy Analyzer** | CLUSTER | Calculadora interativa da fórmula SpaceTrain Energy com comparativo dos Jobs A/B/C (trade-off acurácia × energia) |
| **Asteroides Próximos** | Front-End | Integração real com NASA NeoWs — objetos próximos da Terra nos próximos 3 dias |
| **Astronomia do Dia** | Front-End | Integração real com NASA APOD — imagem e descrição astronômica diária |

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| **React 18** | UI com Hooks funcionais (useState, useEffect, useCallback, useMemo, useRef) |
| **Vite 5** | Build tool e dev server |
| **JavaScript ES2022+** | Linguagem principal |
| **CSS puro** | Design system com variáveis CSS, sem frameworks externos |
| **SVG puro** | Todos os gráficos (sparklines, gauges, mapas, barras) |
| **Groq API** | LLaMA 3.3 70B para os chats RAG e NLP (tier gratuito) |
| **NASA API** | APOD + NeoWs (dados reais com fallback simulado) |
| **NOAA SWPC API** | Índice Kp geomagnético em tempo real |
| **Launch Library 2** | Próximos lançamentos espaciais reais |
| **Lucide React** | Ícones |
| **GitHub Actions** | CI/CD — deploy automático a cada push |

---

## 📁 Estrutura do Projeto

```
src/
├── App.jsx                    # Componente raiz
├── components/
│   ├── SentinelHub.jsx        # Hub principal — grid 3×3 dos 9 cards
│   ├── IoTCard.jsx            # Módulo IoT
│   ├── SpaceRAGCard.jsx       # Módulo RAG (chat Groq)
│   ├── SatelliteCard.jsx      # Módulo QML
│   ├── FireRiskMap.jsx        # Módulo Visão Computacional
│   ├── NLPCard.jsx            # Módulo NLP (chat Groq)
│   ├── LaunchWindowCard.jsx   # Módulo RPA
│   ├── EnergyAnalyzer.jsx     # Módulo CLUSTER
│   ├── AsteroidsCard.jsx      # NASA NeoWs
│   ├── APODCard.jsx           # NASA APOD
│   ├── MiniChat.jsx           # Componente de chat reutilizável
│   ├── ModuleModal.jsx        # Modal genérico
│   ├── SpaceCard.jsx          # Card glassmorphism base
│   ├── Header.jsx             # Navegação + relógio
│   ├── Footer.jsx             # Rodapé
│   └── Loading.jsx            # Indicadores de carregamento
├── services/
│   ├── iotService.js          # Simulação IoT (Box-Muller, GO/CAUTION/HOLD/SCRUB)
│   ├── satelliteService.js    # Telemetria satélites (classificador SVM)
│   ├── launchWindowService.js # NOAA SWPC + Launch Library 2
│   └── nasaApi.js             # NASA APOD + NeoWs (com fallback)
└── styles/
    └── global.css             # Variáveis CSS, animações, grid responsivo
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 20+
- Chave Groq gratuita: [console.groq.com](https://console.groq.com)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/GuiAlmeida03/orbital-sentinel.git
cd orbital-sentinel

# 2. Crie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite .env e adicione sua chave Groq

# 3. Instale as dependências
npm install

# 4. Rode em desenvolvimento
npm run dev
# Acesse: http://localhost:5173
```

### Variáveis de Ambiente

```env
VITE_GROQ_API_KEY=sua_chave_groq_aqui
```

Chave Groq gratuita em: [console.groq.com](https://console.groq.com) → API Keys → Create API Key

> **NASA API:** usa `DEMO_KEY` por padrão (30 req/hora). Para mais requisições, adicione `VITE_NASA_API_KEY=sua_chave` após cadastro gratuito em [api.nasa.gov](https://api.nasa.gov).

---

## 🌐 Deploy

O projeto está configurado para deploy automático no **GitHub Pages** via GitHub Actions.

A cada push na branch `master`:
1. GitHub Actions faz o build com `npm run build`
2. O resultado é publicado automaticamente

**URL:** [guialmeida03.github.io/orbital-sentinel](https://guialmeida03.github.io/orbital-sentinel/)

Para configurar em seu próprio repositório:
1. Ajuste `base` em `vite.config.js` com o nome do seu repo
2. Adicione `VITE_GROQ_API_KEY` em Settings → Secrets → Actions
3. Ative GitHub Pages com source "GitHub Actions"

---

## 🎨 Design System

```css
/* Paleta neon sci-fi */
--accent-cyan:    #00f5ff   /* Destaque principal */
--accent-blue:    #0066ff   /* Links e ações */
--accent-purple:  #7c3aed   /* IA e elementos NLP */
--accent-green:   #00ff88   /* Status OK / GO */
--accent-red:     #ff3366   /* Alertas / SCRUB */
--accent-amber:   #ffaa00   /* Avisos / CAUTION */
--accent-orange:  #ff6600   /* Risco moderado-alto */

/* Status de lançamento */
--status-go:      #00ff88
--status-caution: #ffaa00
--status-hold:    #ff6600
--status-scrub:   #ff3366

/* Tipografia */
Orbitron        → Títulos e displays (sci-fi)
Rajdhani        → Corpo do texto
Share Tech Mono → Dados técnicos e monospace
```

**Padrões:** Glassmorphism (`backdrop-filter: blur`), starfield via CSS, SVG puro para todos os gráficos, dark mode total.

---

## 👥 Equipe

| Nome | RM |
|---|---|
| Vitor Adauto Alves Barbosa | 590247 |
| Guilherme Henrique Costa de Almeida | 559977 |
| Matheus Barbosa da Silva | 560185 |

---

**Instituição:** FIAP · **Ano:** 2026 · **Evento:** Global Solution
