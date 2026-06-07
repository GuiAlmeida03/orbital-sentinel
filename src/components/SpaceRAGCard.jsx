// src/components/SpaceRAGCard.jsx — chat real via Groq (5 domínios espaciais)
import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import SpaceCard from './SpaceCard';
import ModuleModal from './ModuleModal';
import MiniChat from './MiniChat';

const SYSTEM_PROMPT = `Você é o Space RAG, assistente de IA especializado em monitoramento espacial e ambiental. Domínios:
1. NASA Artemis: retorno à Lua, missões Artemis I/II/III, Gateway lunar, SLS e Orion
2. ESA Copernicus: satélites Sentinel, observação da Terra, monitoramento climático
3. INPE Queimadas: focos de incêndio no Brasil, DETER, PRODES, dados de satélite
4. Starlink (SpaceX): constelação de internet, cobertura global, impacto astronômico
5. EMBRAPA Geoespacial: agricultura de precisão, geotecnologias, agronegócio brasileiro

Responda SEMPRE em português brasileiro. Cite dados reais. Use ** ** para termos importantes. Máximo 3 parágrafos.`;

const SUGGESTIONS = [
  'O que é o programa Artemis?',
  'Como o Copernicus monitora queimadas?',
  'Quantos satélites Starlink existem?',
  'Como o INPE detecta desmatamento?',
];

const DOMAINS = [
  { name: 'NASA Artemis',   color: 'var(--accent-cyan)' },
  { name: 'ESA Copernicus', color: 'var(--accent-blue)' },
  { name: 'INPE Queimadas', color: 'var(--accent-red)' },
  { name: 'Starlink',       color: 'var(--accent-green)' },
  { name: 'EMBRAPA Geo',    color: 'var(--accent-amber)' },
];

const WELCOME = `Olá! Sou o **Space RAG**, assistente especializado em monitoramento espacial. 🛰️\n\nCubro 5 domínios: NASA Artemis, ESA Copernicus, INPE Queimadas, Starlink e EMBRAPA Geoespacial.\n\nFaça sua pergunta!`;

export default function SpaceRAGCard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SpaceCard title="Space RAG" icon={BookOpen} accentColor="var(--accent-blue)" badge="RAG">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
            5 domínios · LLaMA 3.3 70B · Groq
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {DOMAINS.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setModalOpen(true)} style={{
            marginTop: '4px', background: 'rgba(0,102,255,0.08)', border: '1px solid rgba(0,102,255,0.25)',
            borderRadius: 'var(--radius-sm)', padding: '7px 12px', color: 'var(--accent-blue)',
            fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer', letterSpacing: '1px',
          }}>
            ABRIR ASSISTENTE
          </button>
        </div>
      </SpaceCard>

      <ModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Space RAG — Assistente de IA Espacial">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {DOMAINS.map(d => (
              <span key={d.name} style={{
                display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px',
                fontFamily: 'var(--font-mono)', color: d.color,
                background: `${d.color}12`, border: `1px solid ${d.color}30`,
                borderRadius: '4px', padding: '3px 9px',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                {d.name}
              </span>
            ))}
          </div>
          <MiniChat
            systemPrompt={SYSTEM_PROMPT}
            suggestions={SUGGESTIONS}
            accentColor="var(--accent-blue)"
            welcomeMsg={WELCOME}
          />
        </div>
      </ModuleModal>
    </>
  );
}
