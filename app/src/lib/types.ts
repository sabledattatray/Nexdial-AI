export type AgentStatus = 'active' | 'busy' | 'idle' | 'offline' | 'calling';
export type CallStatus = 'connected' | 'ringing' | 'ended' | 'missed' | 'voicemail' | 'no-answer';
export type CampaignStatus = 'active' | 'paused' | 'completed' | 'scheduled' | 'draft';
export type DialerType = 'predictive' | 'progressive' | 'preview' | 'power' | 'auto' | 'manual' | 'click-to-call';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'not-interested' | 'callback' | 'converted' | 'dnc';
export type DispositionType = 'answered' | 'no-answer' | 'voicemail' | 'busy' | 'callback' | 'sale' | 'not-interested' | 'dnc';

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: AgentStatus;
  extension: string;
  callsToday: number;
  talkTime: number; // seconds
  breakTime: number;
  team: string;
  skills: string[];
  avgHandleTime: number;
  conversionRate: number;
  currentCallId?: string;
  loginTime?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  status: LeadStatus;
  score: number;
  tags: string[];
  assignedTo?: string;
  campaignId: string;
  attempts: number;
  lastContact?: string;
  nextCallback?: string;
  notes: string;
  customFields?: Record<string, string>;
  timezone?: string;
  state?: string;
  disposition?: DispositionType;
  createdAt: string;
}

export interface Call {
  id: string;
  agentId: string;
  agentName: string;
  leadId?: string;
  leadName: string;
  phone: string;
  status: CallStatus;
  direction: 'inbound' | 'outbound';
  startTime: string;
  endTime?: string;
  duration?: number; // seconds
  campaignId?: string;
  campaignName?: string;
  disposition?: DispositionType;
  recording?: string;
  notes?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  aiScore?: number;
  transferredTo?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  dialerType: DialerType;
  totalLeads: number;
  contactedLeads: number;
  remainingLeads: number;
  answeredCalls: number;
  convertedLeads: number;
  startDate: string;
  endDate?: string;
  scheduledTime?: string;
  agents: string[];
  maxAttempts: number;
  callsPerAgent: number;
  timezone: string;
  dncEnabled: boolean;
  aiEnabled: boolean;
  script?: string;
  progress: number;
  conversionRate: number;
  avgCallDuration: number;
  totalTalkTime: number;
  description?: string;
}

export interface DashboardMetrics {
  totalCalls: number;
  activeCalls: number;
  waitingCalls: number;
  answeredCalls: number;
  missedCalls: number;
  activeAgents: number;
  idleAgents: number;
  busyAgents: number;
  offlineAgents: number;
  activeCampaigns: number;
  avgHandleTime: number;
  avgWaitTime: number;
  serviceLevel: number;
  callsPerHour: number;
  conversionRate: number;
  revenue: number;
  aiInsights: string[];
}

export interface Report {
  id: string;
  name: string;
  type: 'call' | 'agent' | 'campaign' | 'disposition' | 'financial';
  dateRange: { start: string; end: string };
  data: Record<string, unknown>[];
  createdAt: string;
}

export interface QueueEntry {
  id: string;
  callerName: string;
  phone: string;
  waitTime: number;
  priority: 'low' | 'medium' | 'high';
  skill?: string;
}
