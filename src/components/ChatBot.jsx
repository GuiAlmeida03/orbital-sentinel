// components/ChatBot.jsx
// Assistente de IA "Astra" — integrado com Groq API (LLaMA 3.3 70B, tier gratuito)
// Demonstra: useState, useEffect, eventos, renderização condicional, listas

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? '';

function buildSystemPrompt(ctx) {
  const base = `Você é Astra, assistente de IA especializada em astronomia, missões espaciais, economia espacial, tecnologia aeroespacial e ciências planetárias. Você faz parte do Orbital Sentinel, um centro inteligente de monitoramento espacial.

Responda SEMPRE em português brasileiro. Seja concisa, informativa e use linguagem científica acessível. Use ** ** para destacar termos importantes. Limite suas respostas a no máximo 3 parágrafos. Se não souber algo, admita honestamente.`;

  if (!ctx) return base;

  const { iot, sat, launch, fire } = ctx;
  return `${base}

Status atual dos sistemas do Orbital Sentinel:
- IoT Espaço Sentinela: ${iot?.status ?? 'desconhecido'} (temp=${iot?.temp?.toFixed(1) ?? '–'}°C, umidade=${iot?.umidade?.toFixed(1) ?? '–'}%)
- Satélites monitorados: ${sat?.normal ?? 0} normais, ${sat?.alerta ?? 0} em alerta, ${sat?.falha ?? 0} falha iminente (saúde geral: ${sat?.health ?? 0}%)
- Clima espacial: ${launch?.status ?? 'desconhecido'} (Kp=${launch?.kp?.toFixed(1) ?? '–'})
- Risco de incêndio: ${fire?.highRiskPercent ?? 0}% do território monitorado em risco elevado

Use esses dados para contextualizar suas respostas quando relevante.`;
}

// Perguntas sugeridas para o usuário
const SUGGESTED = [
  'Há risco de asteroides hoje?',
  'O que é economia espacial?',
  'Como funciona o telescópio James Webb?',
  'O que é uma tempestade geomagnética?',
  'Quais missões espaciais estão ativas?',
  'O que é o programa Artemis?',
];

// Mensagem de boas-vindas da Astra
const WELCOME = {
  role: 'assistant',
  content: `Olá! Sou **Astra**, sua assistente de inteligência artificial especializada em astronomia, missões espaciais e a nova economia do cosmos. 🚀\n\nPosso responder dúvidas sobre asteroides, missões ativas, telescópios, clima espacial, exploração orbital e muito mais.\n\nComo posso ajudar você hoje?`,
  ts: new Date(),
};

// Formata o texto com suporte básico a markdown bold e quebras de linha
function FormattedText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} style={{ color: 'var(--accent-cyan)' }}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// Bolha de mensagem individual
function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ ...styles.bubble, ...(isUser ? styles.bubbleUser : styles.bubbleBot) }}>
      {/* Avatar */}
      <div style={{ ...styles.avatar, ...(isUser ? styles.avatarUser : styles.avatarBot) }}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>
      {/* Conteúdo */}
      <div style={{ ...styles.bubbleContent, ...(isUser ? styles.bubbleContentUser : styles.bubbleContentBot) }}>
        {!isUser && (
          <div style={styles.bubbleName}>
            <Sparkles size={10} color="var(--accent-cyan)" />
            Astra AI
          </div>
        )}
        <div style={styles.bubbleText}>
          {message.content.split('\n').map((line, i) => (
            <p key={i} style={{ margin: i > 0 ? '6px 0 0' : 0, lineHeight: 1.6 }}>
              <FormattedText text={line} />
            </p>
          ))}
        </div>
        <div style={styles.bubbleTime}>
          {message.ts?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

// Indicador de digitação animado
function TypingIndicator() {
  return (
    <div style={{ ...styles.bubble, ...styles.bubbleBot }}>
      <div style={{ ...styles.avatar, ...styles.avatarBot }}>
        <Bot size={14} />
      </div>
      <div style={{ ...styles.bubbleContent, ...styles.bubbleContentBot }}>
        <div style={styles.bubbleName}><Sparkles size={10} color="var(--accent-cyan)" /> Astra AI</div>
        <div style={styles.typingDots}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatBot({ sentinelContext }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Scroll automático ao receber nova mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Envia mensagem para a API do Claude
  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    setInput('');
    const userMessage = { role: 'user', content: userMsg, ts: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Monta o histórico para enviar à API (sem timestamps, que não fazem parte do schema)
      const history = messages
        .slice(1) // remove mensagem de boas-vindas local
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: buildSystemPrompt(sentinelContext) },
            ...history,
            { role: 'user', content: userMsg },
          ],
        }),
      });

      const data = await response.json();
      const replyText = data.choices?.[0]?.message?.content || 'Não consegui processar sua pergunta. Tente novamente.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: replyText,
        ts: new Date(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ocorreu um erro na comunicação com o sistema de IA. Verifique sua conexão e tente novamente.',
        ts: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function resetChat() {
    setMessages([WELCOME]);
    setInput('');
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Astra AI</h2>
          <p style={styles.sectionSub}>Assistente inteligente especializado em ciência e exploração espacial</p>
        </div>
        <button style={styles.resetBtn} onClick={resetChat} title="Reiniciar conversa">
          <RefreshCw size={14} />
          Reiniciar
        </button>
      </div>

      <div style={styles.chatContainer}>
        {/* Painel de chat */}
        <div style={styles.chatPanel}>
          {/* Header do chat */}
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderLeft}>
              <div style={styles.astraAvatar}>
                <Bot size={18} color="var(--accent-cyan)" />
                <span style={styles.onlineDot} />
              </div>
              <div>
                <div style={styles.astraName}>Astra AI</div>
                <div style={styles.astraStatus}>
                  <span style={styles.onlineDotSmall} /> Online — Powered by Claude
                </div>
              </div>
            </div>
            <div style={styles.chatBadge}>IA GENERATIVA</div>
          </div>

          {/* Mensagens — renderização de lista */}
          <div style={styles.messagesArea}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {/* Renderização condicional do typing indicator */}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <textarea
              style={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre espaço, missões, asteroides..."
              rows={1}
              disabled={loading}
            />
            <button
              style={{
                ...styles.sendBtn,
                ...((!input.trim() || loading) ? styles.sendBtnDisabled : {}),
              }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <Send size={16} />
            </button>
          </div>
          <p style={styles.hint}>Enter para enviar · Shift+Enter para nova linha</p>
        </div>

        {/* Sugestões */}
        <div style={styles.suggestionsPanel}>
          <div style={styles.suggestTitle}>
            <Sparkles size={12} color="var(--accent-cyan)" />
            Perguntas Sugeridas
          </div>
          <div style={styles.suggestionsList}>
            {SUGGESTED.map((s) => (
              <button
                key={s}
                style={styles.suggestionBtn}
                onClick={() => sendMessage(s)}
                disabled={loading}
              >
                <ChevronRight size={12} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                {s}
              </button>
            ))}
          </div>

          {/* Info box */}
          <div style={styles.infoBox}>
            <div style={styles.infoTitle}>
              <Bot size={12} color="var(--accent-purple)" />
              Sobre a Astra
            </div>
            <p style={styles.infoText}>
              Astra é alimentada pelo modelo Claude da Anthropic, especializada com contexto sobre astronomia, missões espaciais e economia do espaço.
            </p>
            <p style={{ ...styles.infoText, marginTop: '6px', color: 'var(--accent-cyan)', opacity: 0.7 }}>
              Dados espaciais integrados via NASA API em tempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' },
  sectionHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', gap: '16px' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '1px', marginBottom: '6px' },
  sectionSub: { color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' },
  resetBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(0,245,255,0.05)', border: '1px solid var(--border-glow)',
    borderRadius: 'var(--radius-sm)', padding: '8px 16px',
    color: 'var(--accent-cyan)', fontFamily: 'var(--font-body)', fontSize: '13px',
    cursor: 'pointer', transition: 'var(--transition)',
  },
  chatContainer: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' },
  chatPanel: {
    background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  chatHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)',
    background: 'rgba(0,245,255,0.03)',
  },
  chatHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  astraAvatar: {
    position: 'relative', width: '40px', height: '40px',
    background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'var(--glow-cyan)',
  },
  onlineDot: {
    position: 'absolute', bottom: '1px', right: '1px',
    width: '10px', height: '10px', borderRadius: '50%',
    background: 'var(--accent-green)', border: '2px solid var(--bg-deep)',
    boxShadow: '0 0 6px var(--accent-green)',
  },
  astraName: { fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)' },
  astraStatus: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' },
  onlineDotSmall: { width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' },
  chatBadge: {
    fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
    padding: '4px 10px', borderRadius: '99px',
    background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
    color: 'var(--accent-purple)',
  },
  messagesArea: {
    padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
    height: '450px', overflowY: 'auto', overflowX: 'hidden',
  },
  bubble: { display: 'flex', gap: '10px', animation: 'slide-in-right 0.3s ease' },
  bubbleUser: { flexDirection: 'row-reverse' },
  bubbleBot: { flexDirection: 'row' },
  avatar: {
    width: '30px', height: '30px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarUser: { background: 'rgba(0,102,255,0.2)', border: '1px solid rgba(0,102,255,0.3)' },
  avatarBot: { background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)' },
  bubbleContent: { maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px' },
  bubbleContentUser: { alignItems: 'flex-end' },
  bubbleContentBot: { alignItems: 'flex-start' },
  bubbleName: {
    display: 'flex', alignItems: 'center', gap: '4px',
    fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-cyan)', letterSpacing: '0.5px',
  },
  bubbleText: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
    borderRadius: '12px', padding: '10px 14px',
    fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5,
  },
  bubbleTime: { fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', padding: '0 4px' },
  typingDots: { display: 'flex', gap: '4px', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '12px' },
  dot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: 'var(--accent-cyan)', opacity: 0.6,
    animation: 'pulse-glow 1.2s ease-in-out infinite',
  },
  inputArea: {
    display: 'flex', gap: '10px', padding: '14px 16px',
    borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)',
  },
  input: {
    flex: 1, background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-subtle)', borderRadius: '8px',
    padding: '10px 14px', color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)', fontSize: '14px',
    resize: 'none', outline: 'none',
    transition: 'border-color 0.2s ease',
    lineHeight: 1.5,
  },
  sendBtn: {
    width: '40px', height: '40px', borderRadius: '8px',
    background: 'var(--accent-cyan)', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'var(--transition)', color: '#000', flexShrink: 0,
    boxShadow: 'var(--glow-cyan)',
  },
  sendBtnDisabled: { opacity: 0.3, cursor: 'not-allowed', boxShadow: 'none' },
  hint: { fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', padding: '6px', letterSpacing: '0.5px' },
  suggestionsPanel: { display: 'flex', flexDirection: 'column', gap: '12px' },
  suggestTitle: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--accent-cyan)',
    letterSpacing: '1.5px', marginBottom: '4px',
  },
  suggestionsList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  suggestionBtn: {
    display: 'flex', alignItems: 'flex-start', gap: '8px',
    background: 'var(--bg-card)', backdropFilter: 'blur(10px)',
    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
    padding: '10px 12px', color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer',
    textAlign: 'left', transition: 'var(--transition)', lineHeight: 1.4,
  },
  infoBox: {
    background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)',
    borderRadius: 'var(--radius)', padding: '14px', marginTop: '8px',
  },
  infoTitle: { display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--accent-purple)', letterSpacing: '1px', marginBottom: '8px' },
  infoText: { fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 },
};
