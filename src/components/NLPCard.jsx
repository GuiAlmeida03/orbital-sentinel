// src/components/NLPCard.jsx
import { useState } from 'react';
import { Brain } from 'lucide-react';
import SpaceCard from './SpaceCard';
import ModuleModal from './ModuleModal';

const METRICS = [
  { label: 'BLEU-4',    value: 212, unit: '+%', color: 'var(--accent-cyan)' },
  { label: 'ROUGE-L',   value: 75,  unit: '+%', color: 'var(--accent-green)' },
  { label: 'BERTScore', value: 9,   unit: '+%', color: 'var(--accent-purple)' },
];

const EXAMPLES = [
  {
    q: 'O que é certificação LEED?',
    a: 'LEED (Leadership in Energy and Environmental Design) é um sistema de certificação de edificações sustentáveis desenvolvido pelo U.S. Green Building Council, que avalia eficiência energética, uso de água, qualidade do ar interno e sustentabilidade dos materiais.',
  },
  {
    q: 'Qual a diferença entre LEED e AQUA-HQE?',
    a: 'AQUA-HQE é a adaptação brasileira do referencial francês HQE, com 14 categorias de qualidade ambiental e maior foco em conforto térmico e acústico adaptados ao clima tropical. LEED é mais voltado à eficiência energética e amplamente reconhecido internacionalmente.',
  },
  {
    q: 'Como edifícios verdes reduzem emissões de carbono?',
    a: 'Através de painéis solares, sistemas de recuperação de calor, materiais de baixo carbono incorporado, automação predial para otimizar consumo e estratégias passivas como orientação solar e ventilação natural, reduzindo emissões operacionais em até 50% vs construção convencional.',
  },
];

export default function NLPCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedEx, setExpandedEx] = useState(null);

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
                <span style={{ color: m.color, fontWeight: 700 }}>{m.value}{m.unit}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, m.value)}%`, height: '100%', background: m.color, borderRadius: '99px' }} />
              </div>
            </div>
          ))}
          <button
            style={{
              marginTop: '4px', background: 'rgba(0,255,136,0.05)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--accent-green)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer', letterSpacing: '1px',
            }}
            onClick={() => setModalOpen(true)}
          >
            VER EXEMPLOS
          </button>
        </div>
      </SpaceCard>

      <ModuleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="NLP — Edifícios Verdes Fine-Tuning">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
            Llama 3.2 3B fine-tuned com QLoRA · Corpus: certificações LEED/AQUA-HQE · Interface Gradio
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {METRICS.map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: m.color }}>{m.value}{m.unit}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>EXEMPLOS DO MODELO</div>
            {EXAMPLES.map((ex, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px', cursor: 'pointer' }}
                onClick={() => setExpandedEx(expandedEx === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>❓ {ex.q}</span>
                  <span style={{ color: 'var(--accent-cyan)', fontSize: '16px', flexShrink: 0 }}>{expandedEx === i ? '▲' : '▼'}</span>
                </div>
                {expandedEx === i && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    💬 {ex.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ModuleModal>
    </>
  );
}
