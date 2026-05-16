'use client';
import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDuration } from '@/lib/mock-data';
import { Activity, Phone, Users, Clock, AlertCircle, Radio } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function generateLiveData() {
  return Array.from({ length: 20 }, (_, i) => ({
    t: i,
    calls: Math.floor(Math.random() * 30 + 8),
    agents: Math.floor(Math.random() * 6 + 3),
  }));
}

export default function LiveMonitor() {
  const { agents, calls, queue, metrics } = useStore();
  const [liveData, setLiveData] = useState(generateLiveData());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => [...prev.slice(1), { t: prev[prev.length - 1].t + 1, calls: Math.floor(Math.random() * 30 + 8), agents: Math.floor(Math.random() * 6 + 3) }]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const activeCalls = calls.filter(c => c.status === 'connected').slice(0, 8);

  return (
    <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Radio size={18} color="var(--accent-green)" />
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Live Monitor</h1>
        <span className="badge badge-green" style={{ fontSize: 10 }}>REAL-TIME</span>
        <span className="live-indicator" />
      </div>

      {/* Live Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Live Calls', value: metrics.activeCalls, color: '63,185,80', pulse: true },
          { label: 'In Queue', value: queue.length, color: '240,136,62' },
          { label: 'Agents Active', value: agents.filter(a => a.status !== 'offline').length, color: '88,166,255' },
          { label: 'Avg Wait', value: `${metrics.avgWaitTime}s`, color: '163,113,247' },
          { label: 'Service Level', value: `${metrics.serviceLevel}%`, color: '63,185,80' },
        ].map(m => (
          <div key={m.label} className="metric-card" style={{ padding: 16, textAlign: 'center' }}>
            {m.pulse && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}><span className="live-indicator" /></div>}
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'monospace', color: `rgb(${m.color})` }}>{m.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Live Call Volume Chart */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={14} color="var(--accent-blue)" /> Live Call Volume
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={liveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.3)" />
            <XAxis dataKey="t" hide />
            <YAxis hide />
            <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
            <Line type="monotone" dataKey="calls" stroke="#58a6ff" strokeWidth={2} dot={false} name="Active Calls" isAnimationActive={false} />
            <Line type="monotone" dataKey="agents" stroke="#3fb950" strokeWidth={2} dot={false} name="Active Agents" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Active Calls */}
      <div className="glass-card" style={{ overflow: 'auto', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Active Calls</span>
          <span className="badge badge-green" style={{ fontSize: 10 }}>{metrics.activeCalls} LIVE</span>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Agent</th><th>Lead / Phone</th><th>Campaign</th><th>Duration</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {activeCalls.map(call => (
              <tr key={call.id}>
                <td style={{ fontSize: 12, fontWeight: 500 }}>{call.agentName}</td>
                <td>
                  <div style={{ fontSize: 12 }}>{call.leadName}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{call.phone}</div>
                </td>
                <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{call.campaignName || '—'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="status-calling" style={{ width: 6, height: 6, borderRadius: '50%' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-blue)' }}>
                      {formatDuration(call.duration || 120)}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(88,166,255,0.1)', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: 10 }}>Listen</button>
                    <button style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(163,113,247,0.1)', border: 'none', color: 'var(--accent-purple)', cursor: 'pointer', fontSize: 10 }}>Whisper</button>
                    <button style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(240,136,62,0.1)', border: 'none', color: 'var(--accent-orange)', cursor: 'pointer', fontSize: 10 }}>Barge</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Queue */}
      <div className="glass-card">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Call Queue</span>
          <span className="badge badge-orange" style={{ fontSize: 10 }}>{queue.length}</span>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Caller</th><th>Phone</th><th>Wait Time</th><th>Priority</th><th>Skill</th><th>Action</th></tr>
          </thead>
          <tbody>
            {queue.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, fontSize: 12 }}>{item.callerName}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{item.phone}</td>
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: item.waitTime > 30 ? 'var(--accent-red)' : 'var(--accent-orange)' }}>
                    {item.waitTime}s
                  </span>
                </td>
                <td><span className={`badge badge-${item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'gray'}`} style={{ fontSize: 10 }}>{item.priority}</span></td>
                <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.skill || 'general'}</td>
                <td><button style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(63,185,80,0.1)', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', fontSize: 11 }}>Answer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
