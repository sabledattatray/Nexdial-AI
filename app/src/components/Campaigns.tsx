'use client';
import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Play, Pause, StopCircle, Settings, Eye, 
  Users, Phone, Target, Clock, TrendingUp, Calendar,
  ChevronRight, Zap, Bot, Filter, BarChart2, X, Check
} from 'lucide-react';
import { Campaign, CampaignStatus, DialerType } from '@/lib/types';
import { format, addDays } from 'date-fns';
import { formatDuration } from '@/lib/mock-data';

const STATUS_STYLE: Record<CampaignStatus, { color: string; label: string }> = {
  active: { color: 'green', label: 'Active' },
  paused: { color: 'orange', label: 'Paused' },
  completed: { color: 'gray', label: 'Completed' },
  scheduled: { color: 'purple', label: 'Scheduled' },
  draft: { color: 'gray', label: 'Draft' },
};

function CreateCampaignModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Partial<Campaign>) => void }) {
  const [form, setForm] = useState({
    name: '', dialerType: 'predictive' as DialerType, description: '',
    maxAttempts: 5, callsPerAgent: 3, timezone: 'America/New_York',
    dncEnabled: true, aiEnabled: true,
    startDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    script: '',
  });

  const handleSubmit = () => {
    if (!form.name) return;
    onSave({
      ...form,
      id: `camp-${Date.now()}`,
      status: 'scheduled',
      totalLeads: 0,
      contactedLeads: 0,
      remainingLeads: 0,
      answeredCalls: 0,
      convertedLeads: 0,
      agents: [],
      progress: 0,
      conversionRate: 0,
      avgCallDuration: 0,
      totalTalkTime: 0,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="modal-box" style={{ width: 600, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Create Campaign</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Campaign Name *</label>
            <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Q3 Sales Campaign" />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Description</label>
            <textarea className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Campaign description..." style={{ resize: 'none', height: 60 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Dialer Type</label>
              <select className="input-field" value={form.dialerType} onChange={e => setForm({ ...form, dialerType: e.target.value as DialerType })}>
                {['predictive', 'progressive', 'preview', 'power', 'auto', 'manual'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Timezone</label>
              <select className="input-field" value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })}>
                {['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'UTC'].map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Max Attempts</label>
              <input className="input-field" type="number" min={1} max={10} value={form.maxAttempts} onChange={e => setForm({ ...form, maxAttempts: +e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Start Date</label>
              <input className="input-field" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            {[{ key: 'dncEnabled', label: 'DNC Filtering' }, { key: 'aiEnabled', label: 'AI Enabled' }].map(opt => (
              <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div
                  onClick={() => setForm({ ...form, [opt.key]: !form[opt.key as keyof typeof form] })}
                  style={{
                    width: 36, height: 20, borderRadius: 10, position: 'relative', cursor: 'pointer',
                    background: form[opt.key as keyof typeof form] ? 'var(--accent-blue)' : 'rgba(48,54,61,0.8)',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3, left: form[opt.key as keyof typeof form] ? 18 : 3,
                    width: 14, height: 14, borderRadius: '50%', background: 'white',
                    transition: 'left 0.2s',
                  }} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{opt.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Call Script</label>
            <textarea className="input-field" value={form.script} onChange={e => setForm({ ...form, script: e.target.value })}
              placeholder="Hi, this is [Agent Name] calling from..." style={{ resize: 'none', height: 80 }} />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={!form.name}>
              <Check size={14} /> Create Campaign
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Campaigns() {
  const { campaigns, updateCampaign, setCampaigns, fetchCampaigns, createCampaign } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns('tenant-nexdial-enterprise');
  }, [fetchCampaigns]);

  const handleSave = async (c: Partial<Campaign>) => {
    await createCampaign('tenant-nexdial-enterprise', c.name || 'New Campaign', c.dialerType || 'predictive');
  };

  const toggleStatus = (camp: Campaign) => {
    const newStatus: CampaignStatus = camp.status === 'active' ? 'paused' : camp.status === 'paused' ? 'active' : camp.status;
    updateCampaign(camp.id, { status: newStatus });
  };

  return (
    <div className="mobile-p-4" style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      {showCreate && <CreateCampaignModal onClose={() => setShowCreate(false)} onSave={handleSave} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Campaign Management</h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {campaigns.filter(c => c.status === 'active').length} active · {campaigns.length} total
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={14} /> New Campaign
        </button>
      </div>

      {/* Stats Row */}
      <div className="responsive-grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Leads', value: campaigns.reduce((a, c) => a + c.totalLeads, 0).toLocaleString(), icon: Users, color: '88,166,255' },
          { label: 'Calls Made', value: campaigns.reduce((a, c) => a + c.answeredCalls, 0).toLocaleString(), icon: Phone, color: '63,185,80' },
          { label: 'Conversions', value: campaigns.reduce((a, c) => a + c.convertedLeads, 0).toLocaleString(), icon: TrendingUp, color: '163,113,247' },
          { label: 'Talk Time', value: formatDuration(campaigns.reduce((a, c) => a + c.totalTalkTime, 0)), icon: Clock, color: '240,136,62' },
        ].map(m => (
          <div key={m.label} className="metric-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `rgba(${m.color},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${m.color},0.3)` }}>
                <m.icon size={14} color={`rgb(${m.color})`} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Campaign Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {campaigns.map(camp => {
          const style = STATUS_STYLE[camp.status];
          return (
            <motion.div
              key={camp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
              style={{ padding: 20 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `rgba(${camp.status === 'active' ? '63,185,80' : camp.status === 'paused' ? '240,136,62' : '88,166,255'},0.15)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid rgba(${camp.status === 'active' ? '63,185,80' : camp.status === 'paused' ? '240,136,62' : '88,166,255'},0.3)`,
                  }}>
                    <Target size={18} color={camp.status === 'active' ? 'var(--accent-green)' : camp.status === 'paused' ? 'var(--accent-orange)' : 'var(--accent-blue)'} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{camp.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                      {camp.dialerType} · {camp.timezone} · Started {camp.startDate}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className={`badge badge-${style.color}`}>{style.label}</span>
                  {camp.aiEnabled && <span className="badge badge-purple" style={{ fontSize: 9 }}>AI</span>}
                  {(camp.status === 'active' || camp.status === 'paused') && (
                    <button onClick={() => toggleStatus(camp)} style={{
                      padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                      background: camp.status === 'active' ? 'rgba(240,136,62,0.15)' : 'rgba(63,185,80,0.15)',
                      border: `1px solid ${camp.status === 'active' ? 'rgba(240,136,62,0.4)' : 'rgba(63,185,80,0.4)'}`,
                      color: camp.status === 'active' ? 'var(--accent-orange)' : 'var(--accent-green)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {camp.status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                      {camp.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                  )}
                  {camp.status === 'scheduled' && (
                    <button onClick={() => updateCampaign(camp.id, { status: 'active' })} style={{
                      padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                      background: 'rgba(63,185,80,0.15)', border: '1px solid rgba(63,185,80,0.4)',
                      color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <Play size={12} /> Launch
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="responsive-grid-6" style={{ marginBottom: 14 }}>
                {[
                  { label: 'Total Leads', value: camp.totalLeads.toLocaleString() },
                  { label: 'Contacted', value: camp.contactedLeads.toLocaleString() },
                  { label: 'Answered', value: camp.answeredCalls.toLocaleString() },
                  { label: 'Converted', value: camp.convertedLeads.toLocaleString() },
                  { label: 'CVR', value: `${camp.conversionRate}%` },
                  { label: 'Avg Duration', value: camp.avgCallDuration ? formatDuration(camp.avgCallDuration) : '—' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              {camp.status !== 'scheduled' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Campaign Progress</span>
                    <span style={{ color: 'var(--accent-blue)' }}>{camp.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div className="progress-fill" animate={{ width: `${camp.progress}%` }} transition={{ duration: 1 }} />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
