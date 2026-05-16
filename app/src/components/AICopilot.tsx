'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, MessageSquare, TrendingUp, Target, Star, Send, Sparkles } from 'lucide-react';

const suggestions = [
  'What was my best performing campaign this week?',
  'Show me agents with low conversion rates',
  'Which leads should I prioritize?',
  'Analyze call sentiment for today',
  'Generate a sales script for SMB segment',
  'What time is best to call leads in California?',
];

interface Message { role: 'user' | 'ai'; text: string; }

const aiResponses: Record<string, string> = {
  default: "Based on your call data analysis:\n\n**Key Insights:**\n• Your peak hours are 10-11 AM and 2-3 PM\n• Agents with 85+ AI score have 34% higher conversion rates\n• Campaign 'Q2 Sales Blitz' is at 70% completion with strong momentum\n• 15 hot leads (score > 80) haven't been contacted today\n\n**Recommended Actions:**\n1. Prioritize high-score leads in the next 2 hours\n2. Review James Rodriguez's approach — highest CVR at 22.1%\n3. Schedule callbacks for 8 prospects from yesterday",
};

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hello! I'm your NexDial AI Copilot. I can analyze your call data, provide coaching insights, generate scripts, and help optimize your campaigns. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: aiResponses.default }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #a371f7, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>NexDial AI Copilot</div>
            <div style={{ fontSize: 11, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="live-indicator" style={{ width: 5, height: 5 }} />Online · Analyzing your data
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'ai' && (
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #a371f7, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0 }}>
                  <Sparkles size={13} color="white" />
                </div>
              )}
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #58a6ff, #4f46e5)' : 'rgba(22,27,34,0.8)',
                border: msg.role === 'ai' ? '1px solid var(--border)' : 'none',
                fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6,
                whiteSpace: 'pre-line',
              }}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #a371f7, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={13} color="white" />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(22,27,34,0.8)', border: '1px solid var(--border)' }}>
                <motion.div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <motion.span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-purple)', display: 'inline-block' }}
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} />
                  ))}
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div style={{ padding: '0 20px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {suggestions.slice(0, 3).map(s => (
            <button key={s} onClick={() => sendMessage(s)} style={{
              padding: '4px 10px', borderRadius: 16, border: '1px solid rgba(163,113,247,0.3)',
              background: 'rgba(163,113,247,0.08)', color: 'var(--accent-purple)', fontSize: 11, cursor: 'pointer',
            }}>{s}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <input className="input-field" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask AI anything about your campaigns, agents, leads..."
            style={{ flex: 1, fontSize: 13 }} />
          <button className="btn-primary" onClick={() => sendMessage(input)} disabled={!input.trim()}>
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Side Panel */}
      <div style={{ width: 280, borderLeft: '1px solid var(--border)', background: 'var(--bg-secondary)', overflowY: 'auto', padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>AI Capabilities</div>
        {[
          { icon: TrendingUp, color: '88,166,255', title: 'Performance Analysis', desc: 'Deep dive into agent and campaign metrics' },
          { icon: Target, color: '63,185,80', title: 'Lead Scoring', desc: 'AI-powered lead prioritization' },
          { icon: MessageSquare, color: '163,113,247', title: 'Script Generation', desc: 'Create personalized call scripts' },
          { icon: Zap, color: '240,136,62', title: 'Real-time Coaching', desc: 'Live suggestions during calls' },
          { icon: Star, color: '255,123,114', title: 'QA Scoring', desc: 'Automated quality assessment' },
        ].map(cap => (
          <div key={cap.title} style={{ padding: '10px', marginBottom: 8, borderRadius: 8, border: `1px solid rgba(${cap.color},0.2)`, background: `rgba(${cap.color},0.05)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <cap.icon size={14} color={`rgb(${cap.color})`} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>{cap.title}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cap.desc}</div>
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Quick Actions</div>
          {suggestions.slice(3).map(s => (
            <button key={s} onClick={() => sendMessage(s)} style={{
              width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer',
              textAlign: 'left', marginBottom: 6, transition: 'all 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(88,166,255,0.06)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              → {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
