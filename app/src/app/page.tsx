'use client';
import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Lazy load heavy components
const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });
const LiveDialer = dynamic(() => import('@/components/LiveDialer'), { ssr: false });
const Campaigns = dynamic(() => import('@/components/Campaigns'), { ssr: false });
const LeadsCRM = dynamic(() => import('@/components/LeadsCRM'), { ssr: false });
const AgentsList = dynamic(() => import('@/components/AgentsList'), { ssr: false });
const LiveMonitor = dynamic(() => import('@/components/LiveMonitor'), { ssr: false });
const WhatsApp = dynamic(() => import('@/components/WhatsApp'), { ssr: false });
const Recordings = dynamic(() => import('@/components/Recordings'), { ssr: false });
const Reports = dynamic(() => import('@/components/Reports'), { ssr: false });
const AICopilot = dynamic(() => import('@/components/AICopilot'), { ssr: false });

const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false });

function AdminPanel() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Super Admin Panel</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Tenants', value: '24', color: '88,166,255' },
          { label: 'Active Agents', value: '186', color: '63,185,80' },
          { label: 'Monthly Revenue', value: '$48.7K', color: '163,113,247' },
          { label: 'System Uptime', value: '99.97%', color: '63,185,80' },
        ].map(m => (
          <div key={m.label} className="metric-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: `rgb(${m.color})` }}>{m.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Tenant Management</div>
        <table className="data-table">
          <thead><tr><th>Tenant</th><th>Plan</th><th>Agents</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {['Acme Corp', 'TechSales Inc', 'BPO Global', 'CallMaster LLC'].map((t, i) => (
              <tr key={t}>
                <td style={{ fontWeight: 500, fontSize: 12 }}>{t}</td>
                <td><span className="badge badge-purple" style={{ fontSize: 10 }}>{['Enterprise', 'Growth', 'Starter', 'White Label'][i]}</span></td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{[48, 24, 12, 86][i]}</td>
                <td><span className="badge badge-green" style={{ fontSize: 10 }}>Active</span></td>
                <td><button style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(88,166,255,0.1)', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: 11 }}>Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BillingPanel() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Billing & Subscription</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { plan: 'Starter', price: '$49/mo', agents: '5 agents', calls: '5,000 calls' },
          { plan: 'Growth', price: '$149/mo', agents: '20 agents', calls: '25,000 calls', popular: true },
          { plan: 'Enterprise', price: 'Custom', agents: 'Unlimited', calls: 'Unlimited' },
        ].map(plan => (
          <div key={plan.plan} className="glass-card" style={{ padding: 24, textAlign: 'center', border: plan.popular ? '1px solid rgba(88,166,255,0.5)' : undefined }}>
            {plan.popular && <span className="badge badge-blue" style={{ marginBottom: 8 }}>Most Popular</span>}
            <div style={{ fontSize: 18, fontWeight: 700 }}>{plan.plan}</div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-blue)', marginBlock: 8 }}>{plan.price}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{plan.agents}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{plan.calls}</div>
            <button className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center' }}>
              {plan.popular ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const componentMap: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  dialer: LiveDialer,
  campaigns: Campaigns,
  leads: LeadsCRM,
  upload: LeadsCRM,
  agents: AgentsList,
  monitoring: LiveMonitor,
  whatsapp: WhatsApp,
  recordings: Recordings,
  reports: Reports,
  ai: AICopilot,
  settings: SettingsPanel,
  admin: AdminPanel,
  billing: BillingPanel,
};

function LoginScreen() {
  const { login, theme } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your credentials');
      return;
    }
    toast.success('Authenticated successfully!');
    login();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'fixed', inset: 0, zIndex: 9999 }} className={`grid-bg ${theme === 'light' ? 'light' : ''}`}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ width: 420, padding: 32, border: '1px solid rgba(88,166,255,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', background: 'var(--bg-card)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #a371f7, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontWeight: 800, fontSize: 22 }}>
            N
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Welcome to NexDial AI</h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Enterprise Live Telephony & AI Copilot Platform</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>WORK EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" className="input-field" style={{ fontSize: 13, padding: '10px 14px' }} required />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>PASSWORD</label>
              <a href="#" style={{ fontSize: 11, color: 'var(--accent-blue)', textDecoration: 'none' }}>Forgot password?</a>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••" className="input-field" style={{ fontSize: 13, padding: '10px 14px' }} required />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, fontWeight: 600, marginTop: 8 }}>
            Sign In to Workspace →
          </button>
        </form>

        <div style={{ padding: '12px 16px', background: 'rgba(88,166,255,0.08)', borderRadius: 8, marginTop: 24, border: '1px solid rgba(88,166,255,0.15)', fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
          💡 <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>Demo Mode Active</span>: Enter any work email and password to instantly access the live platform.
        </div>
      </motion.div>
    </div>
  );
}

export default function Page() {
  const { activeTab, theme, isAuthenticated } = useStore();
  const ActiveComponent = componentMap[activeTab] || Dashboard;

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="bottom-right" toastOptions={{
          style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontSize: 13 },
        }} />
        <LoginScreen />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} className={`grid-bg ${theme === 'light' ? 'light' : ''}`}>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontSize: 13 },
      }} />
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <main style={{ flex: 1, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              style={{ height: '100%' }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
