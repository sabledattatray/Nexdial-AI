import { Agent, Lead, Call, Campaign, DashboardMetrics, QueueEntry } from './types';
import { addDays, subDays, format, subHours, subMinutes } from 'date-fns';

const now = new Date();

export const mockAgents: Agent[] = [
  { id: 'a1', name: 'Sarah Mitchell', email: 'sarah@nexdial.ai', status: 'calling', extension: '1001', callsToday: 24, talkTime: 14400, breakTime: 900, team: 'Sales A', skills: ['sales', 'english'], avgHandleTime: 245, conversionRate: 18.5, currentCallId: 'c1', loginTime: format(subHours(now, 6), 'HH:mm') },
  { id: 'a2', name: 'James Rodriguez', email: 'james@nexdial.ai', status: 'active', extension: '1002', callsToday: 19, talkTime: 11200, breakTime: 600, team: 'Sales A', skills: ['sales', 'spanish'], avgHandleTime: 198, conversionRate: 22.1, loginTime: format(subHours(now, 5), 'HH:mm') },
  { id: 'a3', name: 'Emma Thompson', email: 'emma@nexdial.ai', status: 'idle', extension: '1003', callsToday: 31, talkTime: 16800, breakTime: 1200, team: 'Sales B', skills: ['support', 'english'], avgHandleTime: 312, conversionRate: 15.3, loginTime: format(subHours(now, 7), 'HH:mm') },
  { id: 'a4', name: 'Michael Chen', email: 'michael@nexdial.ai', status: 'busy', extension: '1004', callsToday: 16, talkTime: 9600, breakTime: 300, team: 'Sales B', skills: ['collections'], avgHandleTime: 425, conversionRate: 12.8, loginTime: format(subHours(now, 4), 'HH:mm') },
  { id: 'a5', name: 'Priya Sharma', email: 'priya@nexdial.ai', status: 'calling', extension: '1005', callsToday: 28, talkTime: 15600, breakTime: 750, team: 'Support', skills: ['support', 'hindi', 'english'], avgHandleTime: 278, conversionRate: 19.2, currentCallId: 'c2', loginTime: format(subHours(now, 6), 'HH:mm') },
  { id: 'a6', name: 'Alex Williams', email: 'alex@nexdial.ai', status: 'offline', extension: '1006', callsToday: 0, talkTime: 0, breakTime: 0, team: 'Sales A', skills: ['sales'], avgHandleTime: 215, conversionRate: 25.4, loginTime: undefined },
  { id: 'a7', name: 'Lisa Park', email: 'lisa@nexdial.ai', status: 'active', extension: '1007', callsToday: 22, talkTime: 12400, breakTime: 900, team: 'Support', skills: ['support', 'korean'], avgHandleTime: 189, conversionRate: 16.7, loginTime: format(subHours(now, 5), 'HH:mm') },
  { id: 'a8', name: 'David Brown', email: 'david@nexdial.ai', status: 'idle', extension: '1008', callsToday: 35, talkTime: 18200, breakTime: 1500, team: 'Sales B', skills: ['sales', 'collections'], avgHandleTime: 267, conversionRate: 20.9, loginTime: format(subHours(now, 8), 'HH:mm') },
];

export const mockLeads: Lead[] = Array.from({ length: 50 }, (_, i) => ({
  id: `l${i + 1}`,
  name: ['John Smith', 'Maria Garcia', 'Robert Johnson', 'Jennifer Davis', 'William Wilson', 'Patricia Moore', 'Charles Taylor', 'Linda Anderson', 'Thomas Jackson', 'Barbara Harris'][i % 10],
  phone: `+1 (${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
  email: `lead${i + 1}@example.com`,
  company: ['TechCorp', 'Retail Inc', 'Healthcare LLC', 'Finance Group', 'Real Estate Co'][i % 5],
  status: (['new', 'contacted', 'qualified', 'not-interested', 'callback', 'converted'] as const)[i % 6],
  score: Math.floor(Math.random() * 100),
  tags: [['hot', 'warm', 'cold'][i % 3]],
  campaignId: `camp${(i % 3) + 1}`,
  attempts: Math.floor(Math.random() * 5),
  lastContact: i % 3 === 0 ? format(subDays(now, Math.floor(Math.random() * 7)), 'yyyy-MM-dd') : undefined,
  nextCallback: i % 4 === 0 ? format(addDays(now, Math.floor(Math.random() * 3) + 1), 'yyyy-MM-dd HH:mm') : undefined,
  notes: i % 3 === 0 ? 'Interested in premium plan, follow up next week.' : '',
  timezone: 'America/New_York',
  state: ['California', 'New York', 'Texas', 'Florida', 'Illinois'][i % 5],
  createdAt: format(subDays(now, Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
}));

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp1', name: 'Q2 Sales Blitz', status: 'active', dialerType: 'predictive',
    totalLeads: 1240, contactedLeads: 867, remainingLeads: 373, answeredCalls: 523,
    convertedLeads: 97, startDate: format(subDays(now, 14), 'yyyy-MM-dd'), endDate: format(addDays(now, 7), 'yyyy-MM-dd'),
    agents: ['a1', 'a2', 'a3'], maxAttempts: 5, callsPerAgent: 3, timezone: 'America/New_York',
    dncEnabled: true, aiEnabled: true, progress: 70, conversionRate: 18.5, avgCallDuration: 245,
    totalTalkTime: 128275, description: 'Q2 outbound sales campaign targeting SMB segment',
    script: 'Hi, this is [Agent Name] calling from NexDial AI. I\'m reaching out about our premium call center solution...',
  },
  {
    id: 'camp2', name: 'Insurance Renewal', status: 'active', dialerType: 'progressive',
    totalLeads: 850, contactedLeads: 412, remainingLeads: 438, answeredCalls: 298,
    convertedLeads: 54, startDate: format(subDays(now, 7), 'yyyy-MM-dd'),
    agents: ['a4', 'a5'], maxAttempts: 3, callsPerAgent: 2, timezone: 'America/Chicago',
    dncEnabled: true, aiEnabled: true, progress: 48, conversionRate: 18.1, avgCallDuration: 312,
    totalTalkTime: 93024, description: 'Annual insurance renewal outreach',
  },
  {
    id: 'camp3', name: 'Customer Survey', status: 'paused', dialerType: 'auto',
    totalLeads: 500, contactedLeads: 223, remainingLeads: 277, answeredCalls: 187,
    convertedLeads: 0, startDate: format(subDays(now, 5), 'yyyy-MM-dd'),
    agents: ['a7', 'a8'], maxAttempts: 2, callsPerAgent: 2, timezone: 'America/Los_Angeles',
    dncEnabled: false, aiEnabled: false, progress: 44, conversionRate: 0, avgCallDuration: 180,
    totalTalkTime: 33660,
  },
  {
    id: 'camp4', name: 'New Product Launch', status: 'scheduled', dialerType: 'power',
    totalLeads: 2000, contactedLeads: 0, remainingLeads: 2000, answeredCalls: 0,
    convertedLeads: 0, startDate: format(addDays(now, 2), 'yyyy-MM-dd'),
    agents: [], maxAttempts: 4, callsPerAgent: 3, timezone: 'America/New_York',
    dncEnabled: true, aiEnabled: true, progress: 0, conversionRate: 0, avgCallDuration: 0,
    totalTalkTime: 0,
  },
];

export const mockCalls: Call[] = Array.from({ length: 30 }, (_, i) => ({
  id: `call${i + 1}`,
  agentId: mockAgents[i % 8].id,
  agentName: mockAgents[i % 8].name,
  leadName: mockLeads[i].name,
  phone: mockLeads[i].phone,
  status: (['connected', 'ended', 'ended', 'ended', 'missed', 'voicemail', 'no-answer'] as const)[i % 7],
  direction: i % 5 === 0 ? 'inbound' : 'outbound',
  startTime: format(subMinutes(now, Math.floor(Math.random() * 480)), 'yyyy-MM-dd HH:mm:ss'),
  endTime: i % 7 !== 0 ? format(subMinutes(now, Math.floor(Math.random() * 60)), 'yyyy-MM-dd HH:mm:ss') : undefined,
  duration: i % 7 !== 0 ? Math.floor(Math.random() * 600 + 30) : undefined,
  campaignId: `camp${(i % 3) + 1}`,
  campaignName: ['Q2 Sales Blitz', 'Insurance Renewal', 'Customer Survey'][i % 3],
  disposition: (['answered', 'no-answer', 'voicemail', 'callback', 'sale', 'not-interested'] as const)[i % 6],
  sentiment: (['positive', 'neutral', 'negative'] as const)[i % 3],
  aiScore: Math.floor(Math.random() * 100),
}));

export const mockDashboard: DashboardMetrics = {
  totalCalls: 1847,
  activeCalls: 12,
  waitingCalls: 3,
  answeredCalls: 1523,
  missedCalls: 187,
  activeAgents: 5,
  idleAgents: 2,
  busyAgents: 1,
  offlineAgents: 1,
  activeCampaigns: 2,
  avgHandleTime: 258,
  avgWaitTime: 24,
  serviceLevel: 87.4,
  callsPerHour: 214,
  conversionRate: 18.3,
  revenue: 48720,
  aiInsights: [
    'Peak calling hours: 10-11am & 2-3pm today',
    'Agent Sarah has 25% above avg conversion rate',
    'Campaign "Q2 Sales Blitz" approaching 70% completion',
    '3 callbacks scheduled within the next 30 minutes',
    'Lead score > 80 contacts showing 40% higher pickup rate',
  ],
};

export const mockQueue: QueueEntry[] = [
  { id: 'q1', callerName: 'Tom Wilson', phone: '+1 (555) 234-5678', waitTime: 45, priority: 'high', skill: 'sales' },
  { id: 'q2', callerName: 'Unknown', phone: '+1 (555) 876-5432', waitTime: 23, priority: 'medium', skill: 'support' },
  { id: 'q3', callerName: 'Rachel Kim', phone: '+1 (555) 345-6789', waitTime: 12, priority: 'low' },
];

export function generateHourlyData() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    calls: i >= 8 && i <= 20 ? Math.floor(Math.random() * 150 + 30) : Math.floor(Math.random() * 20),
    answered: i >= 8 && i <= 20 ? Math.floor(Math.random() * 120 + 25) : Math.floor(Math.random() * 15),
    conversions: i >= 8 && i <= 20 ? Math.floor(Math.random() * 25 + 3) : Math.floor(Math.random() * 3),
  }));
}

export function generateWeeklyData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    calls: Math.floor(Math.random() * 800 + 200),
    conversions: Math.floor(Math.random() * 150 + 20),
    revenue: Math.floor(Math.random() * 15000 + 3000),
  }));
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}
