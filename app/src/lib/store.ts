'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io, Socket } from 'socket.io-client';
import { Agent, Call, Campaign, Lead, DashboardMetrics, QueueEntry } from './types';
import { mockAgents, mockCalls, mockCampaigns, mockLeads, mockDashboard, mockQueue } from './mock-data';

interface AppState {
  // Authentication & Admin Profile
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  login: () => void;
  logout: () => void;
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  adminName: string;
  setAdminName: (name: string) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // Agents
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  archiveAgent: (id: string) => void;
  updateAgentStatus: (id: string, status: Agent['status']) => void;

  // Calls
  calls: Call[];
  activeCalls: Call[];
  setCalls: (calls: Call[]) => void;
  addCall: (call: Call) => void;

  // Campaigns
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  setCampaigns: (campaigns: Campaign[]) => void;
  setActiveCampaign: (c: Campaign | null) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;

  // Leads
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  addLeads: (leads: Lead[]) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;

  // Dashboard
  metrics: DashboardMetrics;
  setMetrics: (m: DashboardMetrics) => void;

  // Queue
  queue: QueueEntry[];
  setQueue: (q: QueueEntry[]) => void;

  // Dialer
  currentNumber: string;
  setCurrentNumber: (n: string) => void;
  isCallActive: boolean;
  callDuration: number;
  setIsCallActive: (v: boolean) => void;
  setCallDuration: (v: number) => void;
  currentDialerType: string;
  setCurrentDialerType: (t: string) => void;
  isMuted: boolean;
  isOnHold: boolean;
  toggleMute: () => void;
  toggleHold: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  clearNotification: (id: string) => void;

  // Upload
  uploadedLeads: Lead[];
  setUploadedLeads: (l: Lead[]) => void;

  // Production Telephony & AI Settings
  vapiPublicKey: string;
  setVapiPublicKey: (key: string) => void;
  vapiPrivateKey: string;
  setVapiPrivateKey: (key: string) => void;
  vapiPhoneNumberId: string;
  setVapiPhoneNumberId: (id: string) => void;
  vapiAssistantId: string;
  setVapiAssistantId: (id: string) => void;
  sipTrunkUrl: string;
  setSipTrunkUrl: (url: string) => void;
  openAiApiKey: string;
  setOpenAiApiKey: (key: string) => void;

  // Live Call Telemetry & Transcription
  liveTranscript: Array<{ id: string; role: 'user' | 'assistant' | 'system'; text: string; timestamp: string }>;
  addTranscriptMessage: (msg: { role: 'user' | 'assistant' | 'system'; text: string }) => void;
  clearTranscript: () => void;
  callStatus: 'idle' | 'ringing' | 'connected' | 'ended';
  setCallStatus: (status: 'idle' | 'ringing' | 'connected' | 'ended') => void;

  // Live Server Synchronization & REST API Actions
  socket: Socket | null;
  initSocket: (tenantId: string, userId?: string) => void;
  fetchCampaigns: (tenantId: string) => Promise<void>;
  createCampaign: (tenantId: string, name: string, dialerType: string) => Promise<void>;
  fetchLeads: (tenantId: string, campaignId?: string) => Promise<void>;
  importLeads: (tenantId: string, leads: any[]) => Promise<void>;
  updateLeadStatus: (tenantId: string, leadId: string, status: any, disposition?: string) => Promise<void>;
  broadcastAgentStatus: (tenantId: string, userId: string, status: any) => void;
  broadcastCallStarted: (tenantId: string, callId: string, leadId: string, agentName: string, phone: string) => void;
  broadcastTranscript: (tenantId: string, callId: string, role: string, text: string) => void;
  executeSupervisorCommand: (tenantId: string, callId: string, command: 'whisper' | 'barge' | 'disconnect', supervisorId: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: string;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
  isAuthenticated: true,
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  adminEmail: 'sabledattatray@gmail.com',
  setAdminEmail: (email) => set({ adminEmail: email }),
  adminName: 'Datta Sable',
  setAdminName: (name) => set({ adminName: name }),

  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  theme: 'dark',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  agents: mockAgents,
  setAgents: (agents) => set({ agents }),
  addAgent: (agent) => set((s) => ({ agents: [agent, ...s.agents] })),
  archiveAgent: (id) => set((s) => ({ agents: s.agents.filter(a => a.id !== id) })),
  updateAgentStatus: (id, status) =>
    set((s) => ({ agents: s.agents.map(a => a.id === id ? { ...a, status } : a) })),

  calls: mockCalls,
  activeCalls: mockCalls.filter(c => c.status === 'connected'),
  setCalls: (calls) => set({ calls }),
  addCall: (call) => set((s) => ({ calls: [call, ...s.calls], activeCalls: call.status === 'connected' ? [call, ...s.activeCalls] : s.activeCalls })),

  campaigns: mockCampaigns,
  activeCampaign: null,
  setCampaigns: (campaigns) => set({ campaigns }),
  setActiveCampaign: (c) => set({ activeCampaign: c }),
  updateCampaign: (id, updates) =>
    set((s) => ({ campaigns: s.campaigns.map(c => c.id === id ? { ...c, ...updates } : c) })),

  leads: mockLeads,
  setLeads: (leads) => set({ leads }),
  addLeads: (leads) => set((s) => ({ leads: [...leads, ...s.leads] })),
  updateLead: (id, updates) =>
    set((s) => ({ leads: s.leads.map(l => l.id === id ? { ...l, ...updates } : l) })),

  metrics: mockDashboard,
  setMetrics: (metrics) => set({ metrics }),

  queue: mockQueue,
  setQueue: (queue) => set({ queue }),

  currentNumber: '',
  setCurrentNumber: (n) => set({ currentNumber: n }),
  isCallActive: false,
  callDuration: 0,
  setIsCallActive: (v) => set({ isCallActive: v }),
  setCallDuration: (v) => set({ callDuration: v }),
  currentDialerType: 'manual',
  setCurrentDialerType: (t) => set({ currentDialerType: t }),
  isMuted: false,
  isOnHold: false,
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleHold: () => set((s) => ({ isOnHold: !s.isOnHold })),

  notifications: [],
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications.slice(0, 9)] })),
  clearNotification: (id) => set((s) => ({ notifications: s.notifications.filter(n => n.id !== id) })),

  uploadedLeads: [],
  setUploadedLeads: (l) => set({ uploadedLeads: l }),

  vapiPublicKey: '',
  setVapiPublicKey: (key) => set({ vapiPublicKey: key }),
  vapiPrivateKey: '',
  setVapiPrivateKey: (key) => set({ vapiPrivateKey: key }),
  vapiPhoneNumberId: '',
  setVapiPhoneNumberId: (id) => set({ vapiPhoneNumberId: id }),
  vapiAssistantId: '',
  setVapiAssistantId: (id) => set({ vapiAssistantId: id }),
  sipTrunkUrl: '',
  setSipTrunkUrl: (url) => set({ sipTrunkUrl: url }),
  openAiApiKey: '',
  setOpenAiApiKey: (key) => set({ openAiApiKey: key }),

  liveTranscript: [],
  addTranscriptMessage: (msg) => set((s) => ({
    liveTranscript: [...s.liveTranscript, { id: Math.random().toString(36).substring(7), ...msg, timestamp: new Date().toLocaleTimeString() }]
  })),
  clearTranscript: () => set({ liveTranscript: [] }),
  callStatus: 'idle',
  setCallStatus: (status) => set({ callStatus: status }),

  socket: null,
  initSocket: (tenantId, userId) => {
    const s = io('http://localhost:3001');
    s.on('connect', () => {
      s.emit('subscribe-tenant', { tenantId, userId });
    });
    s.on('agent-status-updated', (data: any) => {
      set((state) => ({
        agents: state.agents.map(a => a.id === data.userId ? { ...a, status: data.status } : a)
      }));
    });
    s.on('live-call-started', (data: any) => {
      const newCall: Call = {
        id: data.callId || Math.random().toString(36).substring(7),
        agentId: data.agentName ? 'a1' : 'ai-sdr',
        agentName: data.agentName || 'AI SDR',
        leadName: data.phone || 'Live Lead',
        phone: data.phone || '+15550000000',
        status: 'connected',
        direction: 'outbound',
        startTime: new Date().toISOString(),
        duration: 1,
        sentiment: 'neutral'
      };
      set((state) => ({
        calls: [newCall, ...state.calls],
        activeCalls: [newCall, ...state.activeCalls]
      }));
    });
    s.on('live-transcript-update', (data: any) => {
      set((state) => ({
        liveTranscript: [...state.liveTranscript, {
          id: Math.random().toString(36).substring(7),
          role: data.role as any,
          text: data.text,
          timestamp: new Date().toLocaleTimeString()
        }]
      }));
    });
    s.on('execute-supervisor-command', (data: any) => {
      if (data.command === 'disconnect') {
        set({ callStatus: 'ended', isCallActive: false });
      }
    });
    set({ socket: s });
  },

  fetchCampaigns: async (tenantId) => {
    // Simulated fetch (using mock data already populated)
    return;
  },

  createCampaign: async (tenantId, name, dialerType) => {
    try {
      const newCamp: Campaign = {
        id: `camp-${Date.now()}`,
        name: name,
        status: 'active',
        dialerType: (dialerType || 'predictive') as any,
        totalLeads: 0,
        contactedLeads: 0,
        remainingLeads: 0,
        answeredCalls: 0,
        convertedLeads: 0,
        startDate: new Date().toISOString().split('T')[0],
        agents: [],
        maxAttempts: 3,
        callsPerAgent: 2,
        timezone: 'America/New_York',
        dncEnabled: true,
        aiEnabled: true,
        progress: 0,
        conversionRate: 0,
        avgCallDuration: 0,
        totalTalkTime: 0
      };
      set((state) => ({ campaigns: [newCamp, ...state.campaigns] }));
    } catch (e) { console.error('Create campaign error:', e); }
  },

  fetchLeads: async (tenantId, campaignId) => {
    // Simulated fetch (using mock data already populated)
    return;
  },

  importLeads: async (tenantId, importedLeads) => {
    try {
      set((s) => ({
        leads: [
          ...importedLeads.map((l: any, i: number) => ({
            id: `imported-${Date.now()}-${i}`,
            name: l.name || l.firstName + ' ' + l.lastName,
            phone: l.phone,
            email: l.email || '',
            company: l.company || '',
            status: 'new' as const,
            score: Math.floor(Math.random() * 40) + 60,
            tags: ['imported'],
            campaignId: 'camp1',
            attempts: 0,
            notes: '',
            createdAt: new Date().toISOString().split('T')[0]
          })),
          ...s.leads
        ]
      }));
    } catch (e) { console.error('Import leads error:', e); }
  },

  updateLeadStatus: async (tenantId, leadId, status, disposition) => {
    try {
      set((state) => ({ 
        leads: state.leads.map(l => l.id === leadId ? { ...l, status: status as any, disposition: disposition as any } : l) 
      }));
    } catch (e) { console.error('Update lead status error:', e); }
  },

  broadcastAgentStatus: (tenantId, userId, status) => {
    set((state) => {
      if (state.socket) {
        state.socket.emit('agent-status-change', { tenantId, userId, status });
      }
      return { agents: state.agents.map(a => a.id === userId ? { ...a, status } : a) };
    });
  },

  broadcastCallStarted: (tenantId, callId, leadId, agentName, phone) => {
    set((state) => {
      if (state.socket) {
        state.socket.emit('call-started', { tenantId, callId, leadId, agentName, phone });
      }
      return state;
    });
  },

  broadcastTranscript: (tenantId, callId, role, text) => {
    set((state) => {
      if (state.socket) {
        state.socket.emit('transcript-message', { tenantId, callId, role, text, timestamp: new Date().toISOString() });
      }
      return state;
    });
  },

  executeSupervisorCommand: (tenantId, callId, command, supervisorId) => {
    set((state) => {
      if (state.socket) {
        state.socket.emit('supervisor-command', { tenantId, callId, command, supervisorId });
      }
      return state;
    });
  }
    }),
    {
      name: 'nexdial-store',
      partialize: (state) => ({ 
        agents: state.agents, 
        theme: state.theme, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
