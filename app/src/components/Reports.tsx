'use client';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Filter, Calendar, BarChart3, FileText,
  TrendingUp, Phone, Users, Clock, ArrowUpRight,
  ChevronDown, RefreshCw, FileSpreadsheet, Table
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { generateHourlyData, generateWeeklyData, formatDuration, formatCurrency } from '@/lib/mock-data';
import { format, subDays } from 'date-fns';

// Generate report data
const hourly = generateHourlyData();
const weekly = generateWeeklyData();
const agentData = [
  { name: 'Sarah M.', calls: 24, talkTime: 240, conversions: 4, avgScore: 87 },
  { name: 'James R.', calls: 19, talkTime: 186, conversions: 5, avgScore: 91 },
  { name: 'Emma T.', calls: 31, talkTime: 320, conversions: 3, avgScore: 78 },
  { name: 'Michael C.', calls: 16, talkTime: 192, conversions: 2, avgScore: 72 },
  { name: 'Priya S.', calls: 28, talkTime: 268, conversions: 6, avgScore: 88 },
  { name: 'David B.', calls: 35, talkTime: 385, conversions: 7, avgScore: 93 },
];

const dispositionReport = [
  { disposition: 'Sale / Converted', count: 97, pct: '6.4%', revenue: '$29,100' },
  { disposition: 'Callback Scheduled', count: 234, pct: '15.5%', revenue: '—' },
  { disposition: 'Answered - No Sale', count: 615, pct: '40.7%', revenue: '—' },
  { disposition: 'Voicemail Left', count: 187, pct: '12.4%', revenue: '—' },
  { disposition: 'No Answer', count: 283, pct: '18.7%', revenue: '—' },
  { disposition: 'Busy', count: 67, pct: '4.4%', revenue: '—' },
  { disposition: 'DNC Added', count: 23, pct: '1.5%', revenue: '—' },
  { disposition: 'Wrong Number', count: 41, pct: '2.7%', revenue: '—' },
];

function exportCSV(data: Record<string, unknown>[], filename: string) {
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${filename}.csv`; a.click();
}

function exportJSON(data: unknown[], filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${filename}.json`; a.click();
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <div style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: p.color }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: p.color, display: 'inline-block' }} />
            {p.name}: <strong>{p.value.toLocaleString()}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { calls, agents, campaigns, metrics } = useStore();
  const [activeReport, setActiveReport] = useState('overview');
  const [dateRange, setDateRange] = useState('today');

  const reportTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'calls', label: 'Call Report' },
    { id: 'agents', label: 'Agent Report' },
    { id: 'campaigns', label: 'Campaign Report' },
    { id: 'dispositions', label: 'Dispositions' },
    { id: 'financial', label: 'Financial' },
  ];

  const handleExportAll = (format: 'csv' | 'json' | 'pdf') => {
    if (format === 'csv') exportCSV(agentData, 'nexdial-report');
    if (format === 'json') exportJSON(agentData, 'nexdial-report');
    if (format === 'pdf') alert('PDF export — requires PDF library integration in production');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Reports & Analytics</h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>Comprehensive call center insights</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Date Range */}
          <select className="input-field" style={{ width: 140, fontSize: 12 }} value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          {/* Export Buttons */}
          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => handleExportAll('csv')}>
            <Download size={13} /> CSV
          </button>
          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => handleExportAll('json')}>
            <Download size={13} /> JSON
          </button>
          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => handleExportAll('pdf')}>
            <FileText size={13} /> PDF
          </button>
          <button className="btn-primary" style={{ fontSize: 12 }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', gap: 2, flexShrink: 0 }}>
        {reportTabs.map(tab => (
          <button key={tab.id} className={`tab-btn ${activeReport === tab.id ? 'active' : ''}`}
            onClick={() => setActiveReport(tab.id)} style={{ fontSize: 12, borderRadius: '6px 6px 0 0' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mobile-p-4" style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

        {activeReport === 'overview' && (
          <div>
            {/* KPI Summary */}
            <div className="responsive-grid-5" style={{ marginBottom: 20 }}>
              {[
                { label: 'Total Calls', value: metrics.totalCalls.toLocaleString(), icon: Phone, color: '88,166,255', change: '+12%' },
                { label: 'Answered', value: metrics.answeredCalls.toLocaleString(), icon: Phone, color: '63,185,80', change: '+5%' },
                { label: 'Service Level', value: `${metrics.serviceLevel}%`, icon: TrendingUp, color: '163,113,247', change: '+2%' },
                { label: 'Avg Handle Time', value: formatDuration(metrics.avgHandleTime), icon: Clock, color: '240,136,62', change: '-5%' },
                { label: 'Revenue', value: formatCurrency(metrics.revenue), icon: TrendingUp, color: '63,185,80', change: '+18%' },
              ].map(kpi => (
                <div key={kpi.label} className="metric-card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {kpi.label}
                    <span style={{ color: kpi.change.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-red)' }}>{kpi.change}</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace' }}>{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="responsive-grid-2" style={{ marginBottom: 20 }}>
              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Calls & Conversions (Hourly)</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={hourly}>
                    <defs>
                      <linearGradient id="rCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#58a6ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.4)" />
                    <XAxis dataKey="hour" tick={{ fill: '#8b949e', fontSize: 10 }} interval={4} />
                    <YAxis tick={{ fill: '#8b949e', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="calls" stroke="#58a6ff" fill="url(#rCalls)" name="Calls" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#3fb950" strokeWidth={2} name="Conversions" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Weekly Performance</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.4)" />
                    <XAxis dataKey="day" tick={{ fill: '#8b949e', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#8b949e', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#8b949e' }} />
                    <Bar dataKey="calls" fill="rgba(88,166,255,0.7)" radius={[3,3,0,0]} name="Calls" />
                    <Bar dataKey="conversions" fill="rgba(63,185,80,0.7)" radius={[3,3,0,0]} name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'agents' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => exportCSV(agentData, 'agent-report')}>
                <Download size={13} /> Export Agent Report
              </button>
            </div>
            <div className="glass-card" style={{ overflow: 'auto' }}>
              <div className="table-wrapper">
                <table className="data-table">
                <thead>
                  <tr>
                    <th>Agent</th><th>Calls Today</th><th>Talk Time</th>
                    <th>Conversions</th><th>CVR %</th><th>Avg AI Score</th><th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {agentData.map(agent => {
                    const cvr = ((agent.conversions / agent.calls) * 100).toFixed(1);
                    return (
                      <tr key={agent.name}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #a371f7, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span style={{ fontWeight: 500 }}>{agent.name}</span>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>{agent.calls}</td>
                        <td>{formatDuration(agent.talkTime * 60)}</td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--accent-green)' }}>{agent.conversions}</td>
                        <td>
                          <span className={`badge badge-${+cvr > 20 ? 'green' : +cvr > 15 ? 'orange' : 'red'}`}>{cvr}%</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div className="progress-bar" style={{ flex: 1 }}>
                              <div className="progress-fill" style={{ width: `${agent.avgScore}%`, background: agent.avgScore > 85 ? '#3fb950' : '#f0883e' }} />
                            </div>
                            <span style={{ fontSize: 11, fontFamily: 'monospace' }}>{agent.avgScore}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${agent.avgScore > 85 ? 'green' : agent.avgScore > 75 ? 'orange' : 'red'}`}>
                            {agent.avgScore > 85 ? 'Excellent' : agent.avgScore > 75 ? 'Good' : 'Needs Improvement'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>

            <div className="glass-card" style={{ padding: 20, marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Agent Call Volume Comparison</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={agentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.4)" />
                  <XAxis dataKey="name" tick={{ fill: '#8b949e', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#8b949e', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="calls" fill="rgba(88,166,255,0.7)" radius={[3,3,0,0]} name="Calls" />
                  <Bar dataKey="conversions" fill="rgba(63,185,80,0.7)" radius={[3,3,0,0]} name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeReport === 'dispositions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => exportCSV(dispositionReport, 'disposition-report')}>
                <Download size={13} /> Export
              </button>
            </div>
            <div className="glass-card" style={{ overflow: 'auto' }}>
              <div className="table-wrapper">
                <table className="data-table">
                <thead>
                  <tr><th>Disposition</th><th>Count</th><th>Percentage</th><th>Revenue</th></tr>
                </thead>
                <tbody>
                  {dispositionReport.map(d => (
                    <tr key={d.disposition}>
                      <td style={{ fontWeight: 500 }}>{d.disposition}</td>
                      <td style={{ fontFamily: 'monospace' }}>{d.count}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: d.pct, background: d.disposition.includes('Sale') ? '#3fb950' : '#58a6ff' }} />
                          </div>
                          <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{d.pct}</span>
                        </div>
                      </td>
                      <td style={{ color: d.revenue !== '—' ? 'var(--accent-green)' : 'var(--text-muted)' }}>{d.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'calls' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => exportCSV(calls.slice(0,20).map(c => ({
                id: c.id, agent: c.agentName, lead: c.leadName, phone: c.phone,
                status: c.status, direction: c.direction, duration: c.duration || 0,
                start: c.startTime, disposition: c.disposition || ''
              })), 'call-report')}>
                <Download size={13} /> Export Call Log
              </button>
            </div>
            <div className="glass-card" style={{ overflow: 'auto' }}>
              <div className="table-wrapper">
                <table className="data-table">
                <thead>
                  <tr>
                    <th>Call ID</th><th>Agent</th><th>Lead / Phone</th><th>Direction</th>
                    <th>Status</th><th>Duration</th><th>Campaign</th><th>Disposition</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.slice(0, 20).map(call => (
                    <tr key={call.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{call.id}</td>
                      <td style={{ fontSize: 12 }}>{call.agentName}</td>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{call.leadName}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{call.phone}</div>
                      </td>
                      <td><span className={`badge badge-${call.direction === 'inbound' ? 'purple' : 'blue'}`} style={{ fontSize: 10 }}>{call.direction}</span></td>
                      <td><span className={`badge badge-${call.status === 'connected' ? 'green' : call.status === 'ended' ? 'gray' : 'orange'}`} style={{ fontSize: 10 }}>{call.status}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{call.duration ? formatDuration(call.duration) : '—'}</td>
                      <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{call.campaignName || '—'}</td>
                      <td><span className={`badge badge-${call.disposition === 'sale' ? 'green' : call.disposition === 'no-answer' ? 'orange' : 'gray'}`} style={{ fontSize: 10 }}>{call.disposition || '—'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'financial' && (
          <div>
            <div className="responsive-grid-3" style={{ marginBottom: 20 }}>
              {[
                { label: 'Revenue Today', value: formatCurrency(metrics.revenue), change: '+18%', color: 'green' },
                { label: 'Revenue This Week', value: formatCurrency(metrics.revenue * 5.2), change: '+12%', color: 'green' },
                { label: 'Revenue This Month', value: formatCurrency(metrics.revenue * 22), change: '+9%', color: 'green' },
              ].map(m => (
                <div key={m.label} className="metric-card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-green)' }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--accent-green)', marginTop: 4 }}>↑ {m.change} vs last period</div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Revenue Trend</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weekly.map(d => ({ ...d, revenue: d.revenue }))}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3fb950" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3fb950" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.4)" />
                  <XAxis dataKey="day" tick={{ fill: '#8b949e', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#8b949e', fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => [formatCurrency(Number(v) || 0), 'Revenue']} contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3fb950" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(activeReport === 'campaigns') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => exportCSV(
                campaigns.map(c => ({ name: c.name, status: c.status, totalLeads: c.totalLeads, answered: c.answeredCalls, converted: c.convertedLeads, cvr: `${c.conversionRate}%` })),
                'campaign-report'
              )}>
                <Download size={13} /> Export
              </button>
            </div>
            <div className="glass-card" style={{ overflow: 'auto' }}>
              <div className="table-wrapper">
                <table className="data-table">
                <thead>
                  <tr><th>Campaign</th><th>Type</th><th>Status</th><th>Total Leads</th><th>Contacted</th><th>Answered</th><th>Converted</th><th>CVR</th><th>Progress</th></tr>
                </thead>
                <tbody>
                  {campaigns.map(camp => (
                    <tr key={camp.id}>
                      <td style={{ fontWeight: 500 }}>{camp.name}</td>
                      <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{camp.dialerType}</span></td>
                      <td><span className={`badge badge-${camp.status === 'active' ? 'green' : camp.status === 'paused' ? 'orange' : 'gray'}`} style={{ fontSize: 10 }}>{camp.status}</span></td>
                      <td style={{ fontFamily: 'monospace' }}>{camp.totalLeads.toLocaleString()}</td>
                      <td style={{ fontFamily: 'monospace' }}>{camp.contactedLeads.toLocaleString()}</td>
                      <td style={{ fontFamily: 'monospace' }}>{camp.answeredCalls.toLocaleString()}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--accent-green)' }}>{camp.convertedLeads.toLocaleString()}</td>
                      <td><span className="badge badge-green" style={{ fontSize: 10 }}>{camp.conversionRate}%</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div className="progress-bar" style={{ width: 60 }}>
                            <div className="progress-fill" style={{ width: `${camp.progress}%` }} />
                          </div>
                          <span style={{ fontSize: 11, fontFamily: 'monospace' }}>{camp.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
