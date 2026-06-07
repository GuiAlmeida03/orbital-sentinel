// src/components/NLPCard.jsx — chat real via Groq com domínio LEED/AQUA-HQE
import { useState } from 'react';
import { Brain } from 'lucide-react';
import SpaceCard from './SpaceCard';
import ModuleModal from './ModuleModal';
import MiniChat from './MiniChat';

const SYSTEM_PROMPT = `Você é um assistente especializado em edificações sustentáveis e certificações ambientais, simulando o modelo Llama 3.2 3B fine-tuned com QLoRA sobre corpus de certificações LEED e AQUA-HQE.

Seus domínios:
- **LEED** (Leadership in Energy and Environmental Design): sistema americano de certificação verde, categorias (BD+C, ID+C, O+M), pontuação Certified/Silver/Gold/Platinum
- **AQUA-HQE**: adaptação brasileira do referencial francês, 14 categorias de qualidade ambiental, foco em clima tropical
- **Eficiência energética**: sistemas AVAC, automação predial, energia solar, certificação PROCEL Edifica
- **Materiais sustentáveis**: ciclo de vida, baixo carbono incorporado, reciclagem e reaproveitamento
- **Qualidade ambiental interna**: conforto térmico, acústico, iluminação natural, qualidade do ar

Responda SEMPRE em português brasileiro. Use ** ** para termos técnicos importantes. Máximo 3 parágrafos. Seja preciso com normas e percentuais reais.`;

const SUGGESTIONS = [
  'O que é certificação LEED?',
  'Diferença entre LEED e AQUA-HQE?',
  'Como reduzir consumo energético em 50%?',
  'O que é carbono incorporado?',
];

const WELCOME = `Olá! Sou o assistente de **Edifícios Verdes**, especializado em certificações LEED e AQUA-HQE. 🏢🌿\n\nPosso responder sobre eficiência energética, materiais sustentáveis, conforto ambiental e processos de certificação.\n\nFine-tuned com QLoRA: BLEU-4 +212% · ROUGE-L +75% · BERTScore +9%`;

const METRICS = [
  { label: 'BLEU-4',    value: 212, color: 'var(--accent-cyan)' },
  { label: 'ROUGE-L',   value: 75,  color: 'var(--accent-green)' },
  { label: 'BERTScore', value: 9,   color: 'var(--accent-purple)' },
];

export default function NLPCard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SpaceCard title="NLP Fine-Tuning" icon={Brain} accentColor="var(--accent-green)" badge="LLM">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            Llama 3.2 3B · QLoRA · LEED/AQUA-HQE
          </div>
          {METRICS.map(m => (
            <div key={m.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                <span style={{ color: m.color, fontWeight: 700 }}>+{m.value}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, m.value)}%`, height: '100%', background: m.color, borderRadius: '99px' }} />
              </div>
            </div>
          ))}
          <button onClick={() => setModalOpen(true)} style={{
            marginTop: '4px', background: 'rgba(0,255,136,0.05)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--accent-green)',
            fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer', letterSpacing: '1px',
          }}>
            TESTAR MODELO
          </button>
        </div>
      </SpaceCard>

      <ModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="NLP — Edifícios Verdes (Fine-Tuned LLaMA 3.2)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {METRICS.map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 900, color: m.color }}>+{m.value}%</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>
            CONVERSE COM O MODELO
          </div>
          <MiniChat
            systemPrompt={SYSTEM_PROMPT}
            suggestions={SUGGESTIONS}
            accentColor="var(--accent-green)"
            welcomeMsg={WELCOME}
          />
        </div>
      </ModuleModal>
    </>
  );
}
