'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Image, Paperclip, CheckCheck, Clock, Bot, Phone, Users } from 'lucide-react';

const conversations = [
  { id: 1, name: 'John Smith', phone: '+1 555-234-5678', lastMsg: 'Yes I am interested, please send details', time: '2m ago', unread: 2, status: 'online' },
  { id: 2, name: 'Maria Garcia', phone: '+1 555-876-5432', lastMsg: 'When can we schedule a call?', time: '15m ago', unread: 1, status: 'offline' },
  { id: 3, name: 'Robert J.', phone: '+1 555-345-6789', lastMsg: 'Thank you for the information', time: '1h ago', unread: 0, status: 'offline' },
  { id: 4, name: 'Jennifer D.', phone: '+1 555-432-1098', lastMsg: 'Not interested at this time', time: '2h ago', unread: 0, status: 'offline' },
];

export default function WhatsApp() {
  const [selected, setSelected] = useState(conversations[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I saw your inquiry about our call center solution.', role: 'out', time: '10:30 AM', status: 'read' },
    { id: 2, text: 'Yes I am interested, please send details', role: 'in', time: '10:32 AM' },
    { id: 3, text: 'Great! Our NexDial AI platform offers predictive dialing, AI analytics, and WhatsApp integration. Would you like a demo?', role: 'out', time: '10:33 AM', status: 'read' },
    { id: 4, text: 'Yes please! When are you available?', role: 'in', time: '10:35 AM' },
  ]);

  const send = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { id: prev.length + 1, text: message, role: 'out', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), status: 'sent' }]);
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Conversations List */}
      <div style={{ width: 300, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>WhatsApp</h2>
          <input className="input-field" placeholder="Search conversations..." style={{ fontSize: 12 }} />
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => setSelected(conv)}
              style={{
                padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid rgba(48,54,61,0.3)',
                background: selected.id === conv.id ? 'rgba(88,166,255,0.08)' : 'transparent',
                display: 'flex', gap: 10, alignItems: 'center',
              }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #25d366, #128c7e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: 'white' }}>
                  {conv.name.split(' ').map(n => n[0]).join('')}
                </div>
                {conv.status === 'online' && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#25d366', border: '2px solid var(--bg-secondary)' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{conv.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{conv.time}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.lastMsg}</div>
              </div>
              {conv.unread > 0 && (
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700, flexShrink: 0 }}>{conv.unread}</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
            <MessageSquare size={13} /> Bulk Message Campaign
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #25d366, #128c7e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white' }}>
              {selected.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selected.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selected.phone}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 11 }}><Phone size={12} /> Call</button>
            <button className="btn-secondary" style={{ fontSize: 11 }}><Bot size={12} /> AI Reply</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: 'rgba(13,17,23,0.3)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'out' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%', padding: '10px 14px', borderRadius: msg.role === 'out' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'out' ? 'linear-gradient(135deg, #25d366, #128c7e)' : 'rgba(22,27,34,0.9)',
                border: msg.role === 'in' ? '1px solid var(--border)' : 'none',
                fontSize: 13, color: 'white',
              }}>
                <div>{msg.text}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 3, textAlign: 'right', display: 'flex', gap: 4, justifyContent: 'flex-end', alignItems: 'center' }}>
                  {msg.time}
                  {msg.status === 'read' && <CheckCheck size={10} color="rgba(255,255,255,0.8)" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', gap: 8 }}>
          <button className="btn-secondary" style={{ padding: '8px 10px' }}><Paperclip size={15} /></button>
          <button className="btn-secondary" style={{ padding: '8px 10px' }}><Image size={15} /></button>
          <input className="input-field" value={message} onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." style={{ flex: 1, fontSize: 13 }} />
          <button className="btn-primary" onClick={send}><Send size={14} /></button>
        </div>
      </div>
    </div>
  );
}
