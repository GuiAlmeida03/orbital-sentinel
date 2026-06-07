# Orbital Sentinel — Design Document
**Versão:** 2.0 (pós-refinamento)
**Data:** 2026-06-06
**Status:** Implementado e deployado

---

## 1. Visão Geral

### Problema
Operações espaciais críticas dependem de dados fragmentados em múltiplos sistemas. Um lançamento, por exemplo, exige monitoramento simultâneo de:
- Sensores físicos do pad de lançamento
- Clima espacial (índice Kp geomagnético)
- Saúde dos satélites em órbita
- Risco ambiental na área de lançamento
- Conhecimento técnico especializado

Sem integração, equipes diferentes olham para sistemas diferentes sem enxergar a correlação entre os dados em tempo real.

### Solução
O **Orbital Sentinel** unifica os 8 módulos da Global Solution FIAP 2026 numa única plataforma web que funciona como um centro de controle espacial integrado.

---

## 2. Arquitetura Final

### Estrutura de navegação
O projeto tem **uma única tela** — o `SentinelHub` — com um grid 3×3 de 9 cards. Não há navegação entre seções; tudo é visível de uma vez. Modais expandem cada card com detalhes e interações profundas.

```
Header (logo + relógio + status ONLINE)
│
└── SentinelHub (grid 3×3)
    ├── IoTCard              ← IoT
    ├── SpaceRAGCard         ← Cognitive Computing (chat real)
    ├── SatelliteCard        ← QML
    ├── FireRiskMap          ← Visão Computacional
    ├── NLPCard              ← NLP Fine-Tuning (chat real)
    ├── LaunchWindowCard     ← RPA
    ├── EnergyAnalyzer       ← CLUSTER
    ├── AsteroidsCard        ← Front-End / NASA NeoWs
    └── APODCard             ← Front-End / NASA APOD
│
Footer
```

### Decisão: uma tela vs. múltiplas seções
Versões anteriores tinham 3-4 seções de navegação (Dashboard, Sentinel, Monitor, Astra AI). Foram eliminadas porque:
- Dashboard separado ficava vazio após a limpeza dos cards irrelevantes
- Seção Monitor não tinha vínculo com nenhum entregável de matéria
- Seção Astra AI duplicava o chat do SpaceRAGCard

---

## 3. Módulos

### 3.1 IoTCard + iotService.js
**Disciplina:** IoT
**Tipo de dado:** Simulado (ruído gaussiano Box-Muller, intervalo 3s)

Simula 7 sensores de um ESP32 num pad de lançamento: temperatura (18-45°C), umidade (35-95%), pressão (1005-1025 hPa), vibração (0-0.8g), gás (0-100%), radiação (0-100%), distância (50-500m).

Classificador JS puro com thresholds derivados do modelo TFLite real:
- **GO:** todas as variáveis abaixo dos limites
- **CAUTION:** qualquer variável 10% acima do limite
- **HOLD:** qualquer variável 20% acima
- **SCRUB:** qualquer variável 40% acima

Card exibe: classificação atual, barra de confiança (0-100%), sparkline SVG de temperatura. Modal exibe todos os 7 sensores com valores atuais + sparkline de vibração.

### 3.2 SpaceRAGCard + MiniChat.jsx
**Disciplina:** Cognitive Computing / RAG
**Tipo de dado:** API real (Groq LLaMA 3.3 70B)

Chat integrado diretamente no React via API Groq. System prompt especializado em 5 domínios: NASA Artemis, ESA Copernicus, INPE Queimadas, Starlink, EMBRAPA Geo.

**Decisão de design:** versão anterior usava iframe apontando para Streamlit externo. Substituído por chat direto porque o iframe era bloqueado pelo X-Frame-Options do Streamlit, tornando o módulo inacessível sem sair da plataforma.

### 3.3 SatelliteCard + satelliteService.js
**Disciplina:** QML / Machine Learning
**Tipo de dado:** Simulado (ruído gaussiano, intervalo 5s)

5 satélites com baseline de telemetria real: ISS, Hubble ST, James Webb, Starlink-42, GPS-IIF. Classificador SVM simplificado com thresholds lineares derivados dos resultados reais (SVM RBF, C=1.0, acurácia 95%).

**Correção implementada:** James Webb opera a -223°C. O threshold de temperatura absoluto era inatingível para satélites criogênicos. Corrigido com fator de escala proporcional (`tempScale = 0.5` quando `|baseline| > 100°C`).

Card exibe: gauge SVG semicircular de saúde geral (0-100%), contagem Normal/Alerta/Falha, lista com badge por satélite. Modal exibe 4 readings por satélite (temp_painel, voltagem, radiação, temp_bat).

### 3.4 FireRiskMap.jsx
**Disciplina:** Visão Computacional
**Tipo de dado:** Simulado (ruído gaussiano, intervalo 10s)

SVG estático do Brasil com 6 paths de biomas: Amazônia, Cerrado, Pantanal, Mata Atlântica, Caatinga, Pampa. Riscos iniciais baseados nos resultados reais do EfficientNetB0 treinado em 42.850 imagens (AUC-ROC 0.9987, Recall 97.3%).

Escala de cores: verde (<30%), amarelo (30-60%), laranja (60-80%), vermelho (>80%).

Tooltip posicionado com `getBoundingClientRect()` e `Math.max(0, y - 60)` para evitar saída da tela em biomas no topo do SVG.

### 3.5 NLPCard + MiniChat.jsx
**Disciplina:** NLP / Fine-Tuning
**Tipo de dado:** API real (Groq LLaMA 3.3 70B)

Chat com system prompt especializado em edificações sustentáveis, certificações LEED/AQUA-HQE, eficiência energética e materiais sustentáveis. Simula o Llama 3.2 3B fine-tuned com QLoRA.

Card exibe: métricas reais do fine-tuning (BLEU-4 +212%, ROUGE-L +75%, BERTScore +9%) com barras de progresso. Modal exibe as métricas em destaque + chat interativo.

**Decisão:** versão anterior mostrava 3 Q&As hardcoded expandíveis. Substituído por chat real porque era indistinguível de texto estático e não demonstrava a capacidade do modelo.

### 3.6 LaunchWindowCard + launchWindowService.js
**Disciplina:** RPA
**Tipo de dado:** APIs reais com fallback

Duas chamadas assíncronas independentes:
1. **NOAA SWPC:** `GET https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json` — array de [datetime, Kp] das últimas 24h
2. **Launch Library 2:** `GET https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5` — próximos lançamentos reais

Classificação Kp: GO(<5), CAUTION(5-6), HOLD(6-7), SCRUB(≥7).

Se qualquer fetch falhar, dados simulados realistas entram como fallback automaticamente. Promise chain com `.catch(() => setLoading(false))` garante que o spinner nunca fica preso.

Card exibe: status atual com glow colorido, Kp atual, sparkline 24h com linha threshold pontilhada em Kp=5, top 3 lançamentos. Modal exibe sparkline maior + todos os lançamentos com data/hora e provedor.

### 3.7 EnergyAnalyzer.jsx
**Disciplina:** CLUSTER
**Tipo de dado:** Calculadora local (sem API)

Implementação da fórmula SpaceTrain Energy: `pJ = 640×RAM_ops + 5×Reg_ops + 10×ALU_ops`

3 sliders interativos (features 1-10, épocas 1-50, amostras 100-10000) com `useMemo` para recalcular em tempo real. Gráfico de barras SVG compara o cálculo atual com os 3 Jobs reais (A: 94.4%/10MPJ, B: 97.8%/27MPJ, C: 100%/72MPJ). Badge ★ RECOMENDADO no job com melhor ratio acurácia/log10(energia).

### 3.8 AsteroidsCard + APODCard
**Disciplina:** Front-End
**Tipo de dado:** APIs reais NASA com fallback

`nasaApi.js` usa `import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'`. Quando a API falha (rate limit 30 req/hora com DEMO_KEY), dados de fallback entram silenciosamente com badge "SIMULADO" discreto.

---

## 4. Componentes Compartilhados

### MiniChat.jsx
Chat compacto reutilizado por SpaceRAGCard e NLPCard. Props:
- `systemPrompt` — instrução do domínio especializado
- `suggestions` — botões de sugestão exibidos antes da primeira mensagem
- `accentColor` — cor temática do módulo
- `welcomeMsg` — mensagem inicial do assistente

### ModuleModal.jsx
Modal genérico com: `role="dialog"`, `aria-modal="true"`, scroll lock no body, ESC listener, backdrop click para fechar, hover state no botão X.

### SpaceCard.jsx
Card base com glassmorphism, linha de acento colorida, hover glow, animação `fade-in-up`. Props: `title`, `icon`, `accentColor`, `badge`, `delay`.

---

## 5. Serviços

| Arquivo | Padrão | Intervalo |
|---|---|---|
| `iotService.js` | `subscribe(cb) → unsubscribe` | 3s |
| `satelliteService.js` | `subscribe(cb) → unsubscribe` | 5s |
| `launchWindowService.js` | `async fetchLaunchWindowData()` | Fetch único |
| `nasaApi.js` | `async fetch + fallback` | Fetch único |

Padrão subscribe/unsubscribe: retorna função de limpeza chamada pelo `return` do `useEffect`.

Estabilização de callbacks: todos os `onStatusChange` props usam `useRef` para evitar stale closure sem precisar de `useCallback` nos componentes pai.

---

## 6. CI/CD e Deploy

GitHub Actions (`.github/workflows/deploy.yml`):
- Trigger: push em `master`
- Node.js 24
- `npm ci` + `npm run build`
- `VITE_GROQ_API_KEY` via GitHub Secret
- Publicação via `actions/deploy-pages@v4`

`vite.config.js`: `base: '/orbital-sentinel/'` para subpath correto no GitHub Pages.

---

## 7. Decisões Removidas vs. Mantidas

| Removido | Motivo |
|---|---|
| Seção Monitor | Nenhum vínculo com entregável de matéria |
| Seção Astra AI | Duplicava SpaceRAGCard |
| Dashboard separado | Ficava vazio; cards NASA movidos para Sentinel |
| iframe Streamlit (SpaceRAG) | Bloqueado pelo X-Frame-Options |
| Q&A estático (NLP) | Indistinguível de texto comum |
| Cards decorativos (temp global, clima, alertas, status satélites no Dashboard) | Sem fonte real, sem vínculo com matéria |
| AstraContextCard (8º card) | Confuso para visitantes |
| Antropic Claude | Substituído por Groq (gratuito) |

| Mantido | Motivo |
|---|---|
| SVG puro para todos os gráficos | Sem dependências externas |
| CSS puro com variáveis | Total controle do design system |
| Inline styles nos componentes | Padrão estabelecido no projeto original |
| Glassmorphism + neon | Identidade visual do projeto |

---

## 8. Equipe

| Nome | RM |
|---|---|
| Vitor Adauto Alves Barbosa | 590247 |
| Guilherme Henrique Costa de Almeida | 559977 |
| Matheus Barbosa da Silva | 560185 |
