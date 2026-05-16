'use client';
import { useState } from 'react';
import { Settings, Shield, Bell, Key, Cpu, Phone, Layout, ChevronLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPanel() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: 'General', icon: Layout, desc: 'Workspace name, timezone, and branding.' },
    { id: 'SIP / Telephony', icon: Phone, desc: 'Trunks, caller IDs, and routing rules.' },
    { id: 'AI Configuration', icon: Cpu, desc: 'LLM prompts, voice models, and latency.' },
    { id: 'Notifications', icon: Bell, desc: 'Email, Slack, and webhook alerts.' },
    { id: 'Security', icon: Shield, desc: '2FA, password policies, and SSO.' },
    { id: 'API Keys', icon: Key, desc: 'Manage programmatic access tokens.' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${activeSection} settings saved successfully!`);
    setActiveSection(null);
  };

  if (activeSection) {
    return (
      <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
        <button onClick={() => setActiveSection(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
          <ChevronLeft size={16} /> Back to Settings
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{activeSection} Settings</h1>
        </div>

        <form onSubmit={handleSave} className="glass-card" style={{ padding: 24, maxWidth: 600 }}>
          {activeSection === 'General' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>WORKSPACE NAME</label>
                <input type="text" className="input-field" defaultValue="NexDial Enterprise" required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>PRIMARY TIMEZONE</label>
                <select className="input-field" defaultValue="America/New_York">
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>
            </div>
          )}
          {activeSection === 'SIP / Telephony' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>DEFAULT CALLER ID</label>
                <input type="text" className="input-field" defaultValue="+1 (800) 555-0199" required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>SIP TRUNK PROVIDER</label>
                <select className="input-field" defaultValue="twilio">
                  <option value="twilio">Twilio</option>
                  <option value="vonage">Vonage</option>
                  <option value="bandwidth">Bandwidth</option>
                  <option value="custom">Custom SIP URI</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>CALL RECORDING</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" defaultChecked /> <span style={{ fontSize: 13 }}>Always record inbound/outbound calls</span>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'AI Configuration' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>LLM ENGINE</label>
                <select className="input-field" defaultValue="gpt-4">
                  <option value="gpt-4">GPT-4 Turbo (OpenAI)</option>
                  <option value="claude-3">Claude 3 Opus (Anthropic)</option>
                  <option value="custom">Custom Endpoint</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>DEFAULT VOICE MODEL</label>
                <select className="input-field" defaultValue="eleven-labs">
                  <option value="eleven-labs">ElevenLabs - Premium</option>
                  <option value="playht">PlayHT - Conversational</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>INTERRUPTION LATENCY SENSITIVITY (ms)</label>
                <input type="number" className="input-field" defaultValue="400" />
              </div>
            </div>
          )}
          {activeSection === 'Notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>ALERT CHANNELS</label>
              {[
                { label: 'Email Alerts for Missed Calls', checked: true },
                { label: 'Slack Webhook for High AI Sentiment (Negative)', checked: true },
                { label: 'Daily SMS Digest', checked: false },
              ].map(n => (
                <div key={n.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" defaultChecked={n.checked} /> <span style={{ fontSize: 13 }}>{n.label}</span>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'Security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>AUTHENTICATION</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" defaultChecked /> <span style={{ fontSize: 13 }}>Enforce Two-Factor Authentication (2FA) for all agents</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>SESSION TIMEOUT</label>
                <select className="input-field" defaultValue="8h">
                  <option value="1h">1 Hour</option>
                  <option value="8h">8 Hours</option>
                  <option value="24h">24 Hours</option>
                </select>
              </div>
            </div>
          )}
          {activeSection === 'API Keys' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 12, background: 'rgba(255,123,114,0.1)', borderRadius: 8, border: '1px solid rgba(255,123,114,0.2)', color: 'var(--accent-red)', fontSize: 12, marginBottom: 8 }}>
                Never share your secret keys. Anyone with your keys has full access to your workspace.
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>PRODUCTION SECRET KEY</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="password" value="sk_live_1234567890abcdef" readOnly className="input-field" style={{ flex: 1, fontFamily: 'monospace' }} />
                  <button type="button" className="btn-secondary" onClick={() => toast.success('Key copied to clipboard!')}>Copy</button>
                </div>
              </div>
              <button type="button" className="btn-secondary" style={{ width: 'fit-content', marginTop: 8 }}>+ Generate New Key</button>
            </div>
          )}
          
          {!['General', 'SIP / Telephony', 'AI Configuration', 'Notifications', 'Security', 'API Keys'].includes(activeSection) && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Configuration panel for {activeSection} is currently being developed.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <button type="submit" className="btn-primary" style={{ padding: '8px 24px', fontSize: 13 }}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Platform Settings</h1>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Manage your workspace preferences, telephony routing, and AI models.</div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(88,166,255,0.1)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{section.id}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, marginBottom: 16, lineHeight: 1.5 }}>
                {section.desc}
              </div>
              <button onClick={() => setActiveSection(section.id)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                Configure →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
