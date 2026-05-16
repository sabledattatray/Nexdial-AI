'use client';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration } from '@/lib/mock-data';
import { Phone, Headphones, Clock, TrendingUp, Search, Filter, UserCheck, UserX, X, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Agents() {
  const { agents, addAgent, archiveAgent, updateAgentStatus } = useStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newExtension, setNewExtension] = useState('');
  const [newTeam, setNewTeam] = useState('Enterprise Sales');
  const [newSkills, setNewSkills] = useState('Inbound, WebRTC');

  const filtered = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) {
      toast.error('Please fill in required fields');
      return;
    }

    const newAgentObj = {
      id: `agent-${Date.now()}`,
      name: newName,
      email: newEmail,
      status: 'idle' as const,
      extension: newExtension || String(Math.floor(100 + Math.random() * 900)),
      callsToday: 0,
      talkTime: 0,
      breakTime: 0,
      team: newTeam,
      skills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      avgHandleTime: 120,
      conversionRate: 0,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addAgent(newAgentObj);
    toast.success(`Agent ${newName} created successfully!`);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewExtension('');
  };

  return (
    <div style={{ padding: 24, overflowY: 'auto', height: '100%', position: 'relative' }}>
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card" style={{ width: 460, padding: 28, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700 }}>
                  <UserPlus size={20} color="var(--accent-blue)" /> Create New Agent
                </div>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateAgent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>FULL NAME *</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Sarah Jenkins" className="input-field" style={{ fontSize: 13, padding: '8px 12px' }} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>WORK EMAIL *</label>
                    <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="sarah@nexdial.ai" className="input-field" style={{ fontSize: 13, padding: '8px 12px' }} required />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>PASSWORD *</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="input-field" style={{ fontSize: 13, padding: '8px 12px' }} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>EXTENSION</label>
                    <input type="text" value={newExtension} onChange={e => setNewExtension(e.target.value)} placeholder="e.g. 104" className="input-field" style={{ fontSize: 13, padding: '8px 12px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>TEAM</label>
                    <input type="text" value={newTeam} onChange={e => setNewTeam(e.target.value)} placeholder="Enterprise Sales" className="input-field" style={{ fontSize: 13, padding: '8px 12px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>SKILLS (COMMA SEPARATED)</label>
                  <input type="text" value={newSkills} onChange={e => setNewSkills(e.target.value)} placeholder="Inbound, WebRTC, Spanish" className="input-field" style={{ fontSize: 13, padding: '8px 12px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Create Agent</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Agent Management</h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {agents.filter(a => a.status !== 'offline').length} agents online · {agents.length} total
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '10px 16px', fontSize: 13 }}>
          <UserPlus size={16} /> Add New Agent
        </button>
      </div>

      {/* Status Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'On Call', count: agents.filter(a => a.status === 'calling').length, color: '88,166,255' },
          { label: 'Available', count: agents.filter(a => a.status === 'active').length, color: '63,185,80' },
          { label: 'Idle', count: agents.filter(a => a.status === 'idle').length, color: '139,148,158' },
          { label: 'Busy', count: agents.filter(a => a.status === 'busy').length, color: '240,136,62' },
          { label: 'Offline', count: agents.filter(a => a.status === 'offline').length, color: '72,79,88' },
        ].map(s => (
          <div key={s.label} className="metric-card" style={{ padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: `rgb(${s.color})` }}>{s.count}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320, marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input className="input-field" style={{ paddingLeft: 32, fontSize: 13 }} placeholder="Search agents..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Agent Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {filtered.map(agent => (
          <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a371f7, #58a6ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, color: 'white',
                }}>
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className={`status-${agent.status}`} style={{
                  position: 'absolute', bottom: 1, right: 1, width: 11, height: 11,
                  borderRadius: '50%', border: '2px solid var(--bg-secondary)',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{agent.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ext. {agent.extension} · {agent.team}</div>
              </div>
              <span className={`badge badge-${agent.status === 'calling' ? 'blue' : agent.status === 'active' ? 'green' : agent.status === 'idle' ? 'gray' : agent.status === 'busy' ? 'orange' : 'gray'}`} style={{ fontSize: 10 }}>
                {agent.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Calls Today', value: agent.callsToday },
                { label: 'Talk Time', value: formatDuration(agent.talkTime) },
                { label: 'Conv. Rate', value: `${agent.conversionRate}%` },
                { label: 'Avg Handle', value: formatDuration(agent.avgHandleTime) },
              ].map(m => (
                <div key={m.label} style={{ padding: '6px 8px', background: 'rgba(13,17,23,0.5)', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', marginTop: 2 }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {agent.skills.map(skill => (
                <span key={skill} className="badge badge-purple" style={{ fontSize: 9 }}>{skill}</span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              {agent.loginTime ? (
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
                  Logged in since {agent.loginTime}
                </div>
              ) : <div />}
              <button 
                onClick={() => { archiveAgent(agent.id); toast.success(`Agent ${agent.name} archived successfully`); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-red)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                title="Archive Agent"
              >
                <UserX size={12} /> Archive
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
