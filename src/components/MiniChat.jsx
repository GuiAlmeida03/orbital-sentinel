// src/components/MiniChat.jsx
// Chat compacto reutilizável — powered by Groq API
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? '';

function FormattedText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ color: 'var(--accent-cyan)' }}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

export default function MiniChat({ systemPrompt, suggestions = [], accentColor = 'var(--accent-cyan)', welcomeMsg }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: welcomeMsg, ts: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg, ts: new Date() }]);
    setLoading(true);

    try {
      const history = messages
        .slice(1)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 600,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: msg },
          ],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Não consegui processar. Tente novamente.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: new Date() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Erro de conexão com a API. Verifique sua chave Groq.',
        ts: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
      {/* Mensagens */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        gap: '10px', maxHeight: '340px', padding: '4px 2px',
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', gap: '8px',
            flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: m.role === 'user' ? 'rgba(0,102,255,0.2)' : `${accentColor}18`,
              border: `1px solid ${m.role === 'user' ? 'rgba(0,102,255,0.3)' : accentColor + '40'}`,
            }}>
              {m.role === 'user' ? <User size={12} /> : <Bot size={12} color={accentColor} />}
            </div>
            <div style={{
              maxWidth: '82%', background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)', borderRadius: '10px',
              padding: '8px 12px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5,
            }}>
              {m.content.split('\n').map((line, j) => (
                <p key={j} style={{ margin: j > 0 ? '4px 0 0' : 0 }}>
                  <FormattedText text={line} />
                </p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${accentColor}18`, border: `1px solid ${accentColor}40`,
            }}>
              <Bot size={12} color={accentColor} />
            </div>
            <div style={{
              display: 'flex', gap: '4px', padding: '8px 12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: accentColor, opacity: 0.6,
                  animation: 'pulse-glow 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Sugestões */}
      {suggestions.length > 0 && messages.length <= 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => send(s)} disabled={loading} style={{
              background: `${accentColor}10`, border: `1px solid ${accentColor}30`,
              borderRadius: 'var(--radius-sm)', padding: '4px 10px',
              color: accentColor, fontFamily: 'var(--font-mono)', fontSize: '10px',
              cursor: 'pointer', transition: 'var(--transition)',
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        display: 'flex', gap: '8px', borderTop: '1px solid var(--border-subtle)',
        paddingTop: '10px',
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
          placeholder="Digite sua pergunta..."
          rows={1}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-subtle)', borderRadius: '8px',
            padding: '8px 12px', color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)', fontSize: '13px',
            resize: 'none', outline: 'none', lineHeight: 1.5,
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
            background: (!input.trim() || loading) ? 'rgba(255,255,255,0.06)' : accentColor,
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
            color: (!input.trim() || loading) ? 'var(--text-muted)' : '#000',
            transition: 'var(--transition)',
          }}
        >
          <Send size={14} />
        </button>
        <button
          onClick={() => setMessages([{ role: 'assistant', content: welcomeMsg, ts: new Date() }])}
          title="Reiniciar conversa"
          style={{
            width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
          }}
        >
          <RefreshCw size={13} />
        </button>
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center' }}>
        Enter para enviar · Groq LLaMA 3.3 70B
      </p>
    </div>
  );
}
