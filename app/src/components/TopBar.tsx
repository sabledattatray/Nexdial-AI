'use client';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { Bell, Search, Command, Settings, HelpCircle, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Command Center',
  dialer: 'Live Dialer',
  campaigns: 'Campaigns',
  leads: 'Leads & CRM',
  agents: 'Agents',
  monitoring: 'Live Monitor',
  whatsapp: 'WhatsApp',
  recordings: 'Recordings',
  reports: 'Reports & Analytics',
  ai: 'AI Copilot',
  upload: 'Import Leads',
  settings: 'Settings',
  billing: 'Billing',
  admin: 'Admin Panel',
};

export default function TopBar() {
  const { activeTab, metrics, theme, toggleTheme, toggleSidebar } = useStore();
  const [showSearch, setShowSearch] = useState(false);
  const [notifications] = useState([
    { id: 1, text: '3 callbacks scheduled for next 30 min', type: 'info', time: '2m ago' },
    { id: 2, text: 'Campaign "Q2 Sales Blitz" hit 70%', type: 'success', time: '15m ago' },
    { id: 3, text: 'Agent Sarah has 25% above avg CVR', type: 'success', time: '1h ago' },
  ]);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header style={{
      height: 60, borderBottom: '1px solid var(--border)',
      background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', paddingInline: 20,
      justifyContent: 'space-between', flexShrink: 0, position: 'relative', zIndex: 10,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button 
          onClick={toggleSidebar} 
          className="topbar-btn md:hidden" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Toggle Menu"
        >
          <Command size={15} color="var(--text-secondary)" />
        </button>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
          {PAGE_TITLES[activeTab] || 'NexDial AI'}
        </h2>
        {activeTab === 'dialer' && (
          <span className="badge badge-green" style={{ fontSize: 9 }}>
            <span className="live-indicator" style={{ width: 5, height: 5 }} />LIVE
          </span>
        )}
      </div>

      {/* Center: Search */}
      <div className="hidden sm:block" style={{ flex: 1, maxWidth: 400, margin: '0 20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input-field"
            placeholder="Search leads, agents, campaigns..."
            style={{ paddingLeft: 32, fontSize: 13, paddingRight: 60 }}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          />
          <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <kbd style={{ fontSize: 9, padding: '1px 4px', background: 'rgba(48,54,61,0.8)', borderRadius: 3, color: 'var(--text-muted)', fontFamily: 'monospace' }}>⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Live stats */}
        <div className="hidden sm:flex" style={{ gap: 12, padding: '4px 12px', background: 'rgba(88,166,255,0.06)', borderRadius: 8, border: '1px solid rgba(88,166,255,0.15)', fontSize: 11 }}>
          <span style={{ color: 'var(--accent-green)' }}>● {metrics.activeCalls} live</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ color: 'var(--text-secondary)' }}>{metrics.activeAgents + metrics.busyAgents} agents</span>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="topbar-btn"
          >
            <Bell size={15} color="var(--text-secondary)" />
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 7, height: 7,
              borderRadius: '50%', background: 'var(--accent-red)',
              border: '1.5px solid var(--bg-primary)',
            }} />
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ position: 'absolute', right: 0, top: '110%', width: 300, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  Notifications
                  <span style={{ fontSize: 10, color: 'var(--accent-blue)', cursor: 'pointer' }}>Mark all read</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(48,54,61,0.3)', fontSize: 12 }}>
                    <div style={{ color: 'var(--text-primary)', marginBottom: 2 }}>{n.text}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{n.time}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={toggleTheme} className="topbar-btn" title="Toggle Theme">
          {theme === 'dark' ? <Sun size={15} color="var(--text-secondary)" /> : <Moon size={15} color="var(--text-secondary)" />}
        </button>
        <button className="topbar-btn">
          <HelpCircle size={15} color="var(--text-secondary)" />
        </button>
      </div>
    </header>
  );
}
