'use client';
import { useStore } from '@/lib/store';
import { formatDuration, formatCurrency, generateHourlyData, generateWeeklyData } from '@/lib/mock-data';
import { 
  Phone, PhoneOff, PhoneMissed, Users, TrendingUp, Activity,
  Clock, Zap, Target, BarChart3, ArrowUpRight, ArrowDownRight,
  Headphones, Radio, AlertCircle, ChevronRight, Bot
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const hourlyData = generateHourlyData();
const weeklyData = generateWeeklyData();

const dispositionData = [
  { name: 'Answered', value: 1523, color: '#3fb950' },
  { name: 'Voicemail', value: 187, color: '#58a6ff' },
  { name: 'No Answer', value: 124, color: '#f0883e' },
  { name: 'Busy', value: 67, color: '#a371f7' },
  { name: 'Missed', value: 89, color: '#ff7b72' },
];

function MetricCard({ title, value, sub, icon: Icon, color, trend, trendValue }: {
  title: string; value: string | number; sub?: string; icon: React.ElementType;
  color: string; trend?: 'up' | 'down'; trendValue?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="metric-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `rgba(${color}, 0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid rgba(${color}, 0.3)`,
        }}>
          <Icon size={18} color={`rgb(${color})`} />
        </div>
        {trend && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 2, fontSize: 11,
            color: trend === 'up' ? 'var(--accent-green)' : 'var(--accent-red)',
          }}>
            {trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trendValue}
          </div>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'JetBrains Mono, monospace' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '10px 14px', fontSize: 12,
      }}>
        <div style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: p.color }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: p.color, display: 'inline-block' }} />
            {p.name}: <strong>{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { metrics, agents, campaigns, calls, queue, setActiveTab, fetchCampaigns, fetchLeads } = useStore();

  const agentStatusCounts = useMemo(() => ({
    calling: agents.filter(a => a.status === 'calling').length,
    active: agents.filter(a => a.status === 'active').length,
    idle: agents.filter(a => a.status === 'idle').length,
    busy: agents.filter(a => a.status === 'busy').length,
    offline: agents.filter(a => a.status === 'offline').length,
  }), [agents]);

  const recentCalls = calls.slice(0, 6);

  return (
    <div className="mobile-p-4" style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
            Command Center
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-indicator" />
            Live — {new Date().toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => { fetchCampaigns('tenant-nexdial-enterprise'); fetchLeads('tenant-nexdial-enterprise'); }}>
            <Activity size={13} /> Refresh
          </button>
          <button className="btn-primary" style={{ fontSize: 12 }} onClick={() => setActiveTab('dialer')}>
            <Radio size={13} /> Go Live
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <MetricCard title="Total Calls Today" value={metrics.totalCalls.toLocaleString()} icon={Phone} color="88,166,255" trend="up" trendValue="+12%" sub="vs yesterday" />
        <MetricCard title="Active Calls" value={metrics.activeCalls} icon={Phone} color="63,185,80" sub={`${queue.length} in queue`} />
        <MetricCard title="Answered Calls" value={metrics.answeredCalls.toLocaleString()} icon={Headphones} color="63,185,80" trend="up" trendValue="+5%" />
        <MetricCard title="Missed / No-Ans" value={metrics.missedCalls} icon={PhoneMissed} color="255,123,114" trend="down" trendValue="-8%" />
        <MetricCard title="Active Agents" value={`${agentStatusCounts.calling + agentStatusCounts.active}/${agents.length}`} icon={Users} color="163,113,247" sub={`${agentStatusCounts.idle} idle`} />
        <MetricCard title="Service Level" value={`${metrics.serviceLevel}%`} icon={Target} color="240,136,62" trend="up" trendValue="+2.1%" sub="Target: 90%" />
        <MetricCard title="Avg Handle Time" value={formatDuration(metrics.avgHandleTime)} icon={Clock} color="88,166,255" sub="Target: <4m" />
        <MetricCard title="Revenue Today" value={formatCurrency(metrics.revenue)} icon={TrendingUp} color="63,185,80" trend="up" trendValue="+18%" />
      </div>

      {/* Charts Row */}
      <div className="responsive-grid-charts" style={{ marginBottom: 20 }}>
        {/* Hourly Calls */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="section-header">
            <span className="section-title">Calls Per Hour</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Today</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#58a6ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="answeredGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3fb950" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3fb950" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.4)" />
              <XAxis dataKey="hour" tick={{ fill: '#8b949e', fontSize: 10 }} tickLine={false} interval={3} />
              <YAxis tick={{ fill: '#8b949e', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="calls" stroke="#58a6ff" fill="url(#callsGrad)" strokeWidth={2} name="Total Calls" />
              <Area type="monotone" dataKey="answered" stroke="#3fb950" fill="url(#answeredGrad)" strokeWidth={2} name="Answered" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Performance */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="section-header">
            <span className="section-title">Weekly Performance</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.4)" />
              <XAxis dataKey="day" tick={{ fill: '#8b949e', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#8b949e', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calls" fill="rgba(88,166,255,0.6)" radius={[3, 3, 0, 0]} name="Calls" />
              <Bar dataKey="conversions" fill="rgba(63,185,80,0.7)" radius={[3, 3, 0, 0]} name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Disposition Pie */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="section-header">
            <span className="section-title">Dispositions</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={dispositionData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {dispositionData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [v, '']} contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {dispositionData.map((d) => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: 'inline-block' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                </div>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="responsive-grid-3">
        {/* Live Agents */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="section-header">
            <span className="section-title">Agent Status</span>
            <span style={{ fontSize: 11, color: 'var(--accent-blue)', cursor: 'pointer' }} onClick={() => setActiveTab('agents')}>View All</span>
          </div>
          {agents.slice(0, 5).map(agent => (
            <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #a371f7, #58a6ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0, position: 'relative',
              }}>
                {agent.name.split(' ').map(n => n[0]).join('')}
                <span className={`status-${agent.status}`} style={{
                  position: 'absolute', bottom: 0, right: 0, width: 9, height: 9,
                  borderRadius: '50%', border: '2px solid var(--bg-secondary)',
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{agent.callsToday} calls · {formatDuration(agent.talkTime)}</div>
              </div>
              <span className={`badge badge-${agent.status === 'calling' ? 'blue' : agent.status === 'active' ? 'green' : agent.status === 'idle' ? 'gray' : agent.status === 'busy' ? 'orange' : 'gray'}`} style={{ fontSize: 10 }}>
                {agent.status}
              </span>
            </div>
          ))}
        </div>

        {/* Active Campaigns */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div className="section-header">
            <span className="section-title">Active Campaigns</span>
          </div>
          {campaigns.filter(c => c.status === 'active').map(camp => (
            <div key={camp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{camp.name}</span>
                <span style={{ fontSize: 11, color: 'var(--accent-blue)' }}>{camp.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${camp.progress}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10, color: 'var(--text-muted)' }}>
                <span>{camp.contactedLeads.toLocaleString()} / {camp.totalLeads.toLocaleString()} leads</span>
                <span>{camp.conversionRate}% CVR</span>
              </div>
            </div>
          ))}
          {campaigns.filter(c => c.status === 'scheduled').map(camp => (
            <div key={camp.id} style={{ padding: '8px 12px', background: 'rgba(163,113,247,0.05)', border: '1px solid rgba(163,113,247,0.2)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--accent-purple)' }}>⏰ Scheduled</div>
              <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 2 }}>{camp.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{camp.totalLeads.toLocaleString()} leads ready</div>
            </div>
          ))}
        </div>

        {/* AI Insights + Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Queue */}
          <div className="glass-card" style={{ padding: 16 }}>
            <div className="section-header">
              <span className="section-title" style={{ fontSize: 13 }}>Call Queue</span>
              <span className="badge badge-orange">{queue.length}</span>
            </div>
            {queue.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 12 }}>
                <div>
                  <div style={{ color: 'var(--text-primary)' }}>{item.callerName}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: item.waitTime > 30 ? 'var(--accent-red)' : 'var(--accent-orange)', fontSize: 11, fontFamily: 'monospace' }}>
                    {item.waitTime}s
                  </div>
                  <span className={`badge badge-${item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'gray'}`} style={{ fontSize: 9 }}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          <div className="glass-card" style={{ padding: 16, flex: 1 }}>
            <div className="section-header">
              <span className="section-title" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Bot size={14} color="var(--accent-purple)" /> AI Insights
              </span>
            </div>
            {metrics.aiInsights.map((insight, i) => (
              <div key={i} style={{
                padding: '6px 10px', marginBottom: 5, borderRadius: 6,
                background: 'rgba(163,113,247,0.05)', border: '1px solid rgba(163,113,247,0.15)',
                fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4,
              }}>
                <span style={{ color: 'var(--accent-purple)', marginRight: 4 }}>▸</span>{insight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
