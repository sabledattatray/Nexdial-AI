'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Play, Pause, Download, Search, Star, Clock, Bot, Filter } from 'lucide-react';
import { formatDuration } from '@/lib/mock-data';

const recordings = Array.from({ length: 15 }, (_, i) => ({
  id: `rec-${i + 1}`,
  agent: ['Sarah Mitchell', 'James Rodriguez', 'Emma Thompson', 'Michael Chen', 'Priya Sharma'][i % 5],
  lead: `Lead ${i + 1}`,
  phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
  duration: Math.floor(Math.random() * 600 + 60),
  date: `2026-05-${String(16 - (i % 7)).padStart(2, '0')} ${String(Math.floor(Math.random() * 12 + 8)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  sentiment: (['positive', 'neutral', 'negative'] as const)[i % 3],
  aiScore: Math.floor(Math.random() * 40 + 60),
  campaign: ['Q2 Sales Blitz', 'Insurance Renewal', 'Customer Survey'][i % 3],
  keywords: ['pricing', 'interested', 'callback', 'demo', 'competitor'][i % 5],
  transcribed: i % 4 !== 0,
}));

export default function Recordings() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = recordings.filter(r =>
    r.agent.toLowerCase().includes(search.toLowerCase()) ||
    r.lead.toLowerCase().includes(search.toLowerCase()) ||
    r.campaign.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Call Recordings</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input-field" style={{ paddingLeft: 32, fontSize: 12, width: 220 }} placeholder="Search recordings..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn-secondary" style={{ fontSize: 12 }}><Filter size={13} /> Filter</button>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr><th>Recording</th><th>Agent</th><th>Lead / Phone</th><th>Campaign</th><th>Duration</th><th>Sentiment</th><th>AI Score</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(rec => (
              <tr key={rec.id}>
                <td>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>#{rec.id}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{rec.date}</div>
                  </div>
                </td>
                <td style={{ fontSize: 12 }}>{rec.agent}</td>
                <td>
                  <div style={{ fontSize: 12 }}>{rec.lead}</div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{rec.phone}</div>
                </td>
                <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rec.campaign}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{formatDuration(rec.duration)}</td>
                <td>
                  <span className={`badge badge-${rec.sentiment === 'positive' ? 'green' : rec.sentiment === 'negative' ? 'red' : 'gray'}`} style={{ fontSize: 10 }}>
                    {rec.sentiment}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="progress-bar" style={{ width: 40 }}>
                      <div className="progress-fill" style={{ width: `${rec.aiScore}%`, background: rec.aiScore > 80 ? '#3fb950' : '#f0883e' }} />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'monospace' }}>{rec.aiScore}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => setPlaying(playing === rec.id ? null : rec.id)}
                      style={{ padding: '3px 8px', borderRadius: 6, background: playing === rec.id ? 'rgba(63,185,80,0.2)' : 'rgba(88,166,255,0.1)', border: 'none', color: playing === rec.id ? 'var(--accent-green)' : 'var(--accent-blue)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                      {playing === rec.id ? <Pause size={11} /> : <Play size={11} />}
                      {playing === rec.id ? 'Pause' : 'Play'}
                    </button>
                    {rec.transcribed && (
                      <button style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(163,113,247,0.1)', border: 'none', color: 'var(--accent-purple)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Bot size={11} /> AI
                      </button>
                    )}
                    <button style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(48,54,61,0.6)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Download size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
