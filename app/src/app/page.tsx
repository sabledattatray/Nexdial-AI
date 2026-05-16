'use client';
import dynamic from 'next/dynamic';
import { useStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X, CheckCircle, ArrowRight, Shield, Cpu, Phone, BarChart3, Mail, Building, Users, Lock, FileText, Check, AlertCircle, Globe, Briefcase, GitBranch, Sun, Moon } from 'lucide-react';
import { GoogleOAuthProvider, useGoogleOneTapLogin, GoogleLogin } from '@react-oauth/google';

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

function LoginScreenContent() {
  const { login, theme, toggleTheme } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Landing page state
  const [showTerms, setShowTerms] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', message: '' });

  // Official Google One Tap Auto Login Hook
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      toast.success('Successfully logged in with Google One Tap!');
      login();
    },
    onError: () => {
      console.log('Google One Tap Login Failed');
    },
    use_fedcm_for_prompt: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your credentials');
      return;
    }
    toast.success('Authenticated successfully!');
    login();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) {
      toast.error('Please fill in your name and work email.');
      return;
    }
    toast.success('Thank you! Our enterprise sales team will contact you within 2 business hours.');
    setContactForm({ name: '', email: '', company: '', message: '' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ height: '100vh', width: '100vw', overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'fixed', inset: 0, zIndex: 9999 }} className={`grid-bg ${theme === 'light' ? 'light' : ''}`}>
      
      {/* Landing Navigation */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => scrollToSection('hero')}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #a371f7, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
            N
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>NexDial AI</span>
        </div>

        <nav className="hidden md:flex" style={{ gap: 28, alignItems: 'center', fontSize: 14, fontWeight: 500 }}>
          <button onClick={() => scrollToSection('about')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>About</button>
          <button onClick={() => scrollToSection('services')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Services</button>
          <button onClick={() => scrollToSection('contact')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Contact</button>
          <button onClick={() => setShowTerms(true)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Terms</button>
          <button onClick={() => setShowPolicy(true)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Privacy</button>
        </nav>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => scrollToSection('hero')} className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
            Sign In / Demo →
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" style={{ position: 'relative', padding: '60px 32px', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Professional Call Center Background Image (3-4 Agents Wearing Headsets Taking Calls) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundColor: theme === 'dark' ? '#080a0f' : '#f8fafc',
          backgroundImage: `url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: theme === 'dark' ? 'brightness(0.85) contrast(1.05)' : 'brightness(1) contrast(1.02)',
          opacity: 1,
          transition: 'all 0.5s ease'
        }} />
        {/* Ultra-Subtle Overlay: Preserves 100% Image Clarity while keeping Left Text Legible */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: theme === 'dark' 
            ? 'linear-gradient(90deg, rgba(8,10,15,0.85) 0%, rgba(8,10,15,0.35) 45%, rgba(8,10,15,0.15) 100%), linear-gradient(180deg, transparent 0%, transparent 80%, rgba(8,10,15,1) 100%)' 
            : 'linear-gradient(90deg, rgba(248,250,252,0.85) 0%, rgba(248,250,252,0.35) 45%, rgba(248,250,252,0.15) 100%), linear-gradient(180deg, transparent 0%, transparent 80%, rgba(248,250,252,1) 100%)',
          transition: 'all 0.5s ease'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <span className="badge badge-purple" style={{ marginBottom: 16, fontSize: 11 }}>🚀 NEXT-GEN TELEPHONY & AI COPILOT</span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: theme === 'light' ? '#000000' : 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 20 }}>
              Surgical AI Telephony for Enterprise Sales Teams.
            </h1>
            <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: theme === 'light' ? '#000000' : 'var(--text-secondary)', fontWeight: theme === 'light' ? 600 : 400, lineHeight: 1.6, marginBottom: 32 }}>
              Scale your outbound campaigns with predictive pacing algorithms, real-time AI sentiment analysis, and ultra-low latency WebRTC integrations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {[
                'Predictive & Power Dialing with SIP/Asterisk PBX integration',
                'Live Agent Whisper, Whisper Coaching, and Call Barging',
                'Omnichannel CRM with automated disposition tagging',
                'Sub-400ms AI Voice Copilot & Real-Time Sentiment Scoring',
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: theme === 'light' ? '#000000' : 'var(--text-primary)', fontWeight: theme === 'light' ? 700 : 500 }}>
                  <CheckCircle size={18} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => scrollToSection('services')} className="btn-secondary" style={{ padding: '12px 24px', fontSize: 14 }}>
                Explore Services
              </button>
              <button onClick={() => scrollToSection('contact')} className="btn-primary" style={{ padding: '12px 24px', fontSize: 14 }}>
                Contact Sales
              </button>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="glass-card mobile-login-card" style={{ width: '100%', maxWidth: 420, padding: 32, border: '1px solid rgba(88,166,255,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', background: 'var(--bg-card)' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700 }}>Access Workspace</h2>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Sign in to your enterprise tenant dashboard</div>
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

              <div style={{ display: 'flex', alignItems: 'center', marginBlock: 20 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ marginInline: 12, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <GoogleLogin
                  onSuccess={credentialResponse => { toast.success('Successfully logged in with Google!'); login(); }}
                  onError={() => toast.error('Google Login Failed')}
                  theme={theme === 'light' ? 'outline' : 'filled_black'}
                  use_fedcm_for_prompt={false}
                />
              </div>

              <div style={{ padding: '12px 16px', background: 'rgba(88,166,255,0.08)', borderRadius: 8, marginTop: 24, border: '1px solid rgba(88,166,255,0.15)', fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
                💡 <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>Demo Mode Active</span>: Enter any work email and password or use Google One Tap to instantly access the live platform.
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '80px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-blue" style={{ marginBottom: 12 }}>ARCHITECTURE & MISSION</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px' }}>About NexDial AI</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>
              Built for high-performance sales and BPO operations, NexDial AI bridges the gap between legacy SIP telephony and state-of-the-art Generative AI.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {[
              { title: 'Enterprise SIP/PBX Backbone', desc: 'Seamlessly connects with Asterisk PBX, Twilio, Vonage, and custom SIP trunks for crystal clear WebRTC audio streams.', icon: Phone },
              { title: 'Surgical AI Copilot', desc: 'Sub-400ms voice models provide live agent whispering, objection handling prompts, and automated CRM summaries.', icon: Cpu },
              { title: 'Omnichannel CRM Sync', desc: 'Bi-directional synchronization with Salesforce, HubSpot, and custom enterprise databases via secure webhooks.', icon: Building },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(88,166,255,0.1)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <item.icon size={24} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Lead Architect & Developer Profile */}
          <div className="glass-card" style={{ padding: 40, marginTop: 48, border: '1px solid rgba(88,166,255,0.3)', background: 'var(--bg-card)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(88,166,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #a371f7, #58a6ff)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, boxShadow: '0 12px 32px rgba(88,166,255,0.3)' }}>
                DS
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 800 }}>Datta Sable</h3>
                  <span className="badge badge-blue">Lead AI & Telephony Architect</span>
                  <span className="badge badge-purple">BI & Data Strategy Expert</span>
                </div>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                  Senior Software Engineer and Data Strategy Consultant specializing in enterprise Business Intelligence, Asterisk PBX WebRTC telephony, and ultra-low latency Generative AI Copilot architectures. Founder & Lead Developer of NexDial AI.
                </p>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, fontWeight: 600 }}>
                  <a href="https://dattasable.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Globe size={16} /> dattasable.com
                  </a>
                  <a href="https://linkedin.com/in/sabledattatray" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Briefcase size={16} /> LinkedIn
                  </a>
                  <a href="https://github.com/sabledattatray" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GitBranch size={16} /> GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '80px 32px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-purple" style={{ marginBottom: 12 }}>ENTERPRISE CAPABILITIES</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px' }}>Our Services & Modules</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>
              A fully integrated suite of tools designed to optimize every stage of your outbound calling campaigns.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {[
              { title: 'Predictive AI Dialer', desc: 'Intelligent pacing algorithms adjust dialing rates based on live agent availability and historical answer rates, eliminating idle time.', icon: Phone },
              { title: 'Live Monitor & Barging', desc: 'Supervisors can listen in real-time, whisper coaching advice directly to agents, or barge into active calls to close high-value deals.', icon: Users },
              { title: 'Surgical Lead Management', desc: 'Import CSV/Excel data, map custom fields, apply DNC filtering, and track lead scores with visual progress indicators.', icon: FileText },
              { title: 'Real-Time Analytics', desc: 'Granular hourly call volume charts, disposition breakdown pies, and custom CSV/JSON export capabilities for financial reporting.', icon: BarChart3 },
            ].map((srv, i) => (
              <div key={i} className="glass-card" style={{ padding: 32, borderTop: `2px solid ${i % 2 === 0 ? 'var(--accent-blue)' : 'var(--accent-purple)'}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(163,113,247,0.1)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <srv.icon size={20} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{srv.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '80px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>GET IN TOUCH</span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800 }}>Contact Enterprise Sales</h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8 }}>
              Ready to deploy NexDial AI in your organization? Reach out to our technical sales team.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="glass-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>FULL NAME *</label>
                <input type="text" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} placeholder="John Doe" className="input-field" style={{ fontSize: 13, padding: '10px 14px' }} required />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>WORK EMAIL *</label>
                <input type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="john@enterprise.com" className="input-field" style={{ fontSize: 13, padding: '10px 14px' }} required />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>COMPANY NAME & SIZE</label>
              <input type="text" value={contactForm.company} onChange={e => setContactForm({...contactForm, company: e.target.value})} placeholder="Acme Corp (50-200 employees)" className="input-field" style={{ fontSize: 13, padding: '10px 14px' }} />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>HOW CAN WE HELP?</label>
              <textarea value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} placeholder="Tell us about your telephony requirements, SIP trunk providers, and agent seat count..." className="input-field" style={{ fontSize: 13, padding: '10px 14px', height: 100, resize: 'none' }} />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, fontWeight: 600 }}>
              Submit Inquiry →
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg-primary)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #a371f7, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14 }}>
            N
          </div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>NexDial AI Platform</span>
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          © 2026 NexDial AI. Designed & Developed by <a href="https://dattasable.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Datta Sable</a>. All rights reserved.
        </div>

        <div style={{ display: 'flex', gap: 24, fontSize: 13, fontWeight: 500 }}>
          <button onClick={() => setShowTerms(true)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Terms of Service</button>
          <button onClick={() => setShowPolicy(true)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Privacy Policy</button>
        </div>
      </footer>

      {/* Terms Modal */}
      {showTerms && (
        <div className="modal-overlay" onClick={() => setShowTerms(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-box" style={{ width: 800, maxWidth: '95vw', maxHeight: '85vh', overflowY: 'auto', padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Terms of Service</h2>
              <button onClick={() => setShowTerms(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p><strong>1. Acceptance of Terms</strong><br />By accessing and using the NexDial AI platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
              <p><strong>2. Enterprise Telephony SLA & Usage</strong><br />NexDial AI provides high-availability SIP and WebRTC telephony routing. Clients are responsible for maintaining compliance with local dialing regulations, including TCPA and DNC registry requirements.</p>
              <p><strong>3. AI Copilot & Data Processing</strong><br />Our Generative AI voice models process call audio streams in real-time. Audio data is encrypted in transit and at rest, adhering to strict enterprise confidentiality standards.</p>
              <p><strong>4. Service Availability & Support</strong><br />Enterprise tenants receive 24/7 priority support and guaranteed 99.99% uptime for core telephony infrastructure.</p>
              <p><strong>5. Limitation of Liability</strong><br />In no event shall NexDial AI be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of the platform.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setShowTerms(false)} className="btn-primary" style={{ padding: '8px 24px', fontSize: 13 }}>I Understand</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPolicy && (
        <div className="modal-overlay" onClick={() => setShowPolicy(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-box" style={{ width: 800, maxWidth: '95vw', maxHeight: '85vh', overflowY: 'auto', padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Privacy Policy</h2>
              <button onClick={() => setShowPolicy(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p><strong>1. Information We Collect</strong><br />We collect account registration details, SIP trunk metadata, agent activity logs, and real-time audio streams required for AI sentiment analysis.</p>
              <p><strong>2. How We Use Your Data</strong><br />Data is used exclusively to route phone calls, train personalized AI acoustic models for your specific tenant, and provide granular business intelligence analytics.</p>
              <p><strong>3. Data Security & Encryption</strong><br />All WebRTC media streams are secured using SRTP (Secure Real-Time Transport Protocol) and TLS encryption. Database backups are encrypted using AES-256.</p>
              <p><strong>4. GDPR & CCPA Compliance</strong><br />You have the right to request access to, modification of, or deletion of your tenant's data at any time. Contact our Data Protection Officer for inquiries.</p>
              <p><strong>5. Third-Party Integrations</strong><br />We do not sell or share your data with third-party advertisers. Data shared with CRM providers (e.g., Salesforce) is governed by your specific OAuth authorization grants.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setShowPolicy(false)} className="btn-primary" style={{ padding: '8px 24px', fontSize: 13 }}>I Understand</button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

function LoginScreen() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "707439992057-j87plivvk29u7nq35l1j7sqdraoqhv5u.apps.googleusercontent.com"}>
      <LoginScreenContent />
    </GoogleOAuthProvider>
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
