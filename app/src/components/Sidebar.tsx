'use client';
import { useStore } from '@/lib/store';
import { 
  LayoutDashboard, Phone, Users, Target, BarChart3, Settings, 
  MessageSquare, Mic, Zap, ChevronRight, Bell, Search,
  PhoneCall, Radio, FileText, Shield, CreditCard, 
  Headphones, Activity, Upload, Download, Bot, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { id: 'dialer', icon: Phone, label: 'Live Dialer', badge: '●' },
  { id: 'campaigns', icon: Target, label: 'Campaigns', badge: '2' },
  { id: 'leads', icon: Users, label: 'Leads & CRM', badge: null },
  { id: 'agents', icon: Headphones, label: 'Agents', badge: null },
  { id: 'monitoring', icon: Activity, label: 'Live Monitor', badge: null },
  { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp', badge: '5' },
  { id: 'recordings', icon: Mic, label: 'Recordings', badge: null },
  { id: 'reports', icon: BarChart3, label: 'Reports', badge: null },
  { id: 'ai', icon: Bot, label: 'AI Copilot', badge: null },
  { id: 'upload', icon: Upload, label: 'Import Leads', badge: null },
];

const bottomItems = [
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
  { id: 'admin', icon: Shield, label: 'Admin Panel' },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, metrics, agents, logout } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const activeCalls = metrics.activeCalls;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="sidebar relative flex-shrink-0"
      style={{ overflow: 'hidden' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: 'var(--border)', height: 60 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #58a6ff, #a371f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(88,166,255,0.4)',
        }}>
          <PhoneCall size={16} color="white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>NexDial</div>
              <div style={{ fontSize: 10, color: 'var(--accent-blue)', fontWeight: 500 }}>AI PLATFORM</div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: 'auto', color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}
        >
          <motion.div animate={{ rotate: collapsed ? 0 : 180 }}>
            <ChevronRight size={14} />
          </motion.div>
        </button>
      </div>

      {/* Live stats bar */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'rgba(88,166,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="live-indicator" />
                <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{activeCalls} Live</span>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                {agents.filter(a => a.status === 'active' || a.status === 'calling').length} agents online
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 16px' : '9px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2,
                background: isActive ? 'rgba(88,166,255,0.12)' : 'transparent',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(88,166,255,0.06)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: 2, background: 'var(--accent-blue)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={16} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                    style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && item.badge && (
                <span style={{
                  fontSize: item.badge === '●' ? 8 : 10,
                  padding: item.badge === '●' ? '0' : '1px 6px',
                  borderRadius: 10, background: item.badge === '●' ? 'var(--accent-green)' : 'rgba(88,166,255,0.2)',
                  color: item.badge === '●' ? 'transparent' : 'var(--accent-blue)',
                  boxShadow: item.badge === '●' ? '0 0 6px rgba(63,185,80,0.8)' : 'none',
                  width: item.badge === '●' ? 8 : 'auto',
                  height: item.badge === '●' ? 8 : 'auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: item.badge === '●' ? 'pulse-glow 1.5s infinite' : 'none',
                }}>
                  {item.badge !== '●' ? item.badge : ''}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 2,
                background: isActive ? 'rgba(88,166,255,0.12)' : 'transparent',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}

        {/* User profile & Logout */}
        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <AnimatePresence>
            {!collapsed ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px',
                  borderRadius: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #a371f7, #58a6ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'white',
                }}>SA</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Super Admin</div>
                  <div style={{ fontSize: 10, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span className="live-indicator" style={{ width: 5, height: 5 }} />Online
                  </div>
                </div>
                <button 
                  onClick={() => { toast.success('Logged out successfully'); logout(); }}
                  style={{
                    background: 'transparent', border: 'none', padding: 6,
                    color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-red)'; e.currentTarget.style.background = 'rgba(255,123,114,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                  title="Log Out"
                >
                  <LogOut size={15} />
                </button>
              </motion.div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => { toast.success('Logged out successfully'); logout(); }}
                style={{
                  width: '100%', height: 40, borderRadius: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--accent-red)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Log Out"
              >
                <LogOut size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
