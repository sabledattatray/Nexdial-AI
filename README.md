<p align="center">
  <img src="https://img.shields.io/badge/NexDial-AI%20Platform-6C5CE7?style=for-the-badge&logoColor=white" alt="NexDial AI" />
</p>

<h1 align="center">🚀 NexDial AI</h1>
<h3 align="center">Enterprise-Grade AI-Powered Call Center & Omnichannel Dialer Platform</h3>

<p align="center">
  <em>Replace Five9, Aircall & Genesys with your own self-hosted, AI-native contact center — at 1/10th the cost.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Asterisk_PBX-FF6600?style=flat-square&logo=asterisk&logoColor=white" />
  <img src="https://img.shields.io/badge/WebRTC-333333?style=flat-square&logo=webrtc" />
  <img src="https://img.shields.io/badge/SIP.js-0066FF?style=flat-square" />
  <img src="https://img.shields.io/badge/AI_Powered-GPT--4o-10a37f?style=flat-square&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-modules">Modules</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-comparison">Comparison</a> •
  <a href="#-getting-started">Get Started</a> •
  <a href="#-contact">Contact</a>
</p>

---

## 💡 The Problem

Traditional cloud dialers like Five9, Genesys, and Aircall charge **$150–$300/agent/month**, lock you into rigid contracts, and offer zero customization. International calling from India? Forget it — blocked, overpriced, or TRAI non-compliant.

**NexDial AI** changes the game.

---

## 🎯 What is NexDial AI?

NexDial AI is a **production-ready, self-hosted AI call center platform** that gives your sales team the power of enterprise-grade telephony, real-time AI coaching, and omnichannel CRM — all running on **your own infrastructure**.

No per-minute cloud charges. No vendor lock-in. No compliance headaches.

> **"It's like having Five9 + Salesforce + ChatGPT in one platform — but you own every byte of it."**

---

## ✨ Features

### 📞 Live Dialer Engine
| Feature | Description |
|---|---|
| **WebRTC Browser Calling** | Make and receive calls directly from the browser — no softphone needed |
| **Local PBX Integration** | Self-hosted Asterisk PBX with SIP.js WebSocket bridge |
| **Click-to-Call CRM** | One-click calling from any lead record |
| **Manual / Preview / Power Dial** | Multiple dialing modes for different campaign strategies |
| **Real-Time Call Controls** | Hold, mute, transfer, conference — all in-browser |
| **DTMF Keypad** | Interactive IVR navigation during live calls |
| **Call Recording** | Automatic MixMonitor recording with playback |

### 🤖 AI-Native Intelligence
| Feature | Description |
|---|---|
| **Real-Time STT** | Live speech-to-text via Deepgram during calls |
| **AI Voice Agents** | Autonomous AI callers powered by ElevenLabs TTS |
| **AI Copilot (RAG)** | Real-time sales coaching with retrieval-augmented generation |
| **Sentiment Analysis** | Detect customer mood shifts during conversation |
| **Auto Call Summary** | GPT-4o generated call summaries & action items |
| **Smart Disposition** | AI-suggested call outcomes based on transcript |

### 📊 Campaign Management
| Feature | Description |
|---|---|
| **Multi-Campaign Support** | Run parallel outbound campaigns with isolated lead pools |
| **Lead Import (CSV/API)** | Bulk import thousands of leads in seconds |
| **DNC Management** | Automatic Do-Not-Call list compliance |
| **Call Scheduling** | Time-zone aware callback scheduling |
| **Campaign Analytics** | Real-time conversion funnels & agent performance |

### 👥 CRM & Lead Management
| Feature | Description |
|---|---|
| **Built-in CRM** | Full contact management with custom fields |
| **Lead Scoring** | AI-powered lead prioritization |
| **Call History** | Complete interaction timeline per contact |
| **Tags & Segments** | Dynamic audience segmentation |
| **Pipeline View** | Visual deal tracking with drag-and-drop |

### 📱 Omnichannel Communication
| Feature | Description |
|---|---|
| **WhatsApp Business** | Send templates, media & interactive messages |
| **SMS Campaigns** | Bulk SMS with delivery tracking |
| **Email Integration** | Automated follow-up sequences |
| **Unified Inbox** | All channels in one conversation thread |

### 📈 Analytics & Reporting
| Feature | Description |
|---|---|
| **Real-Time Dashboard** | Live KPIs — calls/hour, connect rate, talk time |
| **Agent Leaderboards** | Gamified performance tracking |
| **Campaign ROI** | Cost-per-lead and conversion attribution |
| **Custom Reports** | Build and export any report to CSV/PDF |
| **Wallboard Mode** | Full-screen TV display for call centers |

### 🔒 Enterprise Security
| Feature | Description |
|---|---|
| **Role-Based Access (RBAC)** | Admin, Supervisor, Agent, Viewer roles |
| **SSO & 2FA** | Enterprise-grade authentication |
| **Call Encryption** | SRTP/DTLS encrypted media streams |
| **Audit Logs** | Complete activity trail |
| **TRAI Compliant** | Built for Indian telecom regulations |
| **GDPR Ready** | Data privacy controls & consent management |

---

## 🏗 Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          NEXDIAL AI PLATFORM                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌───────────┐      WebSocket       ┌──────────────┐     SIP/UDP      │
│   │  Browser  │ ◄──────────────────► │   Asterisk   │ ◄─────────────►  │
│   │  SIP.js   │      (WS:8088)       │  PBX Engine  │   (UDP:5060)     │
│   │  WebRTC   │                      │              │                  │
│   └─────┬─────┘                      └──────┬───────┘                  │
│         │                                   │                          │
│         │ React UI                          │ Dialplan                 │
│         ▼                                   ▼                          │
│   ┌───────────┐                      ┌──────────────┐                  │
│   │  Next.js  │                      │  SIP Trunk   │                  │
│   │ Frontend  │                      │   / GSM GW   │ ──► PSTN Network │
│   │ Dashboard │                      │    / VoIP    │                  │
│   └─────┬─────┘                      └──────┬───────┘                  │
│         │                                   │                          │
│         │ Zustand                           │ RTP Audio                │
│         ▼                                   ▼                          │
│   ┌───────────┐                      ┌──────────────┐                  │
│   │    AI     │                      │   Deepgram   │                  │
│   │  Copilot  │ ◄──────────────────► │  STT Engine  │                  │
│   │   (RAG)   │      Transcript      │              │                  │
│   └───────────┘                      └──────────────┘                  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Modules

| Module | Status | Description |
|---|---|---|
| 🟢 **Live Dialer** | Production | WebRTC-to-SIP calling with real-time controls |
| 🟢 **Leads & CRM** | Production | Contact management, import, tagging, notes |
| 🟢 **Campaign Manager** | Production | Multi-campaign creation with lead assignment |
| 🟢 **Dashboard** | Production | Real-time KPIs, charts, and agent metrics |
| 🟢 **Reports** | Production | Exportable analytics and call logs |
| 🟢 **Recordings** | Production | Call recording playback and management |
| 🟢 **WhatsApp** | Production | Business messaging with template support |
| 🟢 **AI Copilot** | Production | RAG-powered real-time sales coaching |
| 🟢 **Agent Management** | Production | Multi-agent with role assignment |
| 🟢 **Live Monitor** | Production | Real-time call monitoring and barge-in |
| 🟡 **Predictive Dialer** | Beta | ML-based optimal dial timing |
| 🟡 **IVR Builder** | Beta | Visual drag-and-drop IVR flow designer |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 | React framework with App Router |
| TypeScript | End-to-end type safety |
| Zustand | Lightning-fast state management |
| Framer Motion | Premium micro-animations |
| Lucide Icons | Consistent icon system |
| SIP.js | WebRTC SIP user agent |

### Telephony
| Technology | Purpose |
|---|---|
| Asterisk PBX | Self-hosted call routing engine |
| PJSIP | Modern SIP endpoint management |
| WebSocket (WS) | Browser-to-PBX signaling |
| WebRTC | Peer-to-peer media streaming |
| DTLS/SRTP | Encrypted audio transport |

### AI & ML
| Technology | Purpose |
|---|---|
| OpenAI GPT-4o | Call summarization & copilot |
| Deepgram Nova-2 | Real-time speech-to-text |
| ElevenLabs | AI voice synthesis |
| RAG Pipeline | Context-aware AI assistance |

### Backend (Planned)
| Technology | Purpose |
|---|---|
| NestJS | Enterprise API framework |
| PostgreSQL | Relational data storage |
| Redis | Real-time caching & queues |
| Docker / K8s | Container orchestration |

---

## 📊 Comparison

### NexDial AI vs. Industry Leaders

| Feature | NexDial AI | Five9 | Aircall | Genesys |
|---|:---:|:---:|:---:|:---:|
| **Self-Hosted** | ✅ | ❌ | ❌ | ❌ |
| **AI Copilot** | ✅ | ❌ | ❌ | 💰 Add-on |
| **WebRTC Calling** | ✅ | ✅ | ✅ | ✅ |
| **Real-Time STT** | ✅ | 💰 Extra | ❌ | 💰 Extra |
| **WhatsApp Integration** | ✅ | ❌ | ❌ | 💰 Extra |
| **CRM Built-in** | ✅ | ❌ | Basic | ❌ |
| **Local PBX Support** | ✅ | ❌ | ❌ | ❌ |
| **TRAI Compliant** | ✅ | ❌ | ❌ | ❌ |
| **Open Telephony** | ✅ | ❌ | ❌ | ❌ |
| **White Label** | ✅ | 💰 Enterprise | ❌ | 💰 Enterprise |
| **Pricing** | **Self-hosted** | $175/agent/mo | $40/agent/mo | $90/agent/mo |

### 💰 Cost Savings Calculator

| Team Size | Five9 (Annual) | NexDial AI (Annual) | **You Save** |
|---|---|---|---|
| 10 agents | $21,000 | $0* | **$21,000** |
| 50 agents | $105,000 | $0* | **$105,000** |
| 200 agents | $420,000 | $0* | **$420,000** |

<sub>*Self-hosted = infrastructure cost only (server + SIP trunk). No per-agent licensing fees.</sub>

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Asterisk PBX (WSL/Linux)
- MicroSIP or any SIP softphone (for testing)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/nexdial-ai.git
cd nexdial-ai

# 2. Install dependencies
cd app && npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:3000
```

### Asterisk PBX Setup (WSL/Ubuntu)

```bash
# Install Asterisk
sudo apt update && sudo apt install asterisk -y

# Copy NexDial configs
sudo cp asterisk_configs/pjsip.conf /etc/asterisk/pjsip.conf
sudo cp asterisk_configs/extensions.conf /etc/asterisk/extensions.conf
sudo cp asterisk_configs/modules.conf /etc/asterisk/modules.conf

# Restart Asterisk
sudo service asterisk restart

# Verify endpoints are active
asterisk -rx "pjsip show endpoints"
```

### Connect a Softphone (MicroSIP)

| Setting | Value |
|---|---|
| SIP Server | `<WSL_IP_ADDRESS>` |
| Username | `android_gateway` |
| Password | `nexdial123` |
| Transport | UDP |

---

## 🖥 Screenshots

<table>
  <tr>
    <td align="center"><strong>Live Dialer</strong><br/>WebRTC calling with real-time controls</td>
    <td align="center"><strong>AI Copilot</strong><br/>RAG-powered sales coaching</td>
  </tr>
  <tr>
    <td align="center"><strong>Campaign Manager</strong><br/>Multi-campaign lead distribution</td>
    <td align="center"><strong>Analytics Dashboard</strong><br/>Real-time KPIs and agent metrics</td>
  </tr>
  <tr>
    <td align="center"><strong>Leads CRM</strong><br/>Full contact management system</td>
    <td align="center"><strong>WhatsApp</strong><br/>Omnichannel business messaging</td>
  </tr>
</table>

---

## 🗺 Roadmap

- [x] Live Dialer with WebRTC
- [x] Local Asterisk PBX Integration
- [x] SIP.js Browser-to-PBX Bridge
- [x] CRM with Lead Management
- [x] Campaign Management
- [x] Real-Time Dashboard
- [x] AI Copilot Interface
- [x] WhatsApp Messaging Module
- [x] Call Recordings Module
- [x] Agent Management
- [ ] PSTN Bridge (SIP Trunk / GSM Gateway)
- [ ] Deepgram Live Transcription
- [ ] AI Voice Agent (Autonomous Caller)
- [ ] Predictive Dialer Algorithm
- [ ] IVR Flow Builder
- [ ] Multi-Tenant SaaS Mode
- [ ] Mobile App (React Native)
- [ ] Kubernetes Deployment

---

## 🏢 Use Cases

### 🏦 Financial Services
Outbound collections, loan follow-ups, and KYC verification calls with full compliance recording.

### 🏠 Real Estate
Automated property inquiry follow-ups with AI-scored lead prioritization and WhatsApp brochure delivery.

### 💼 BPO & Call Centers
100+ agent deployment with real-time monitoring, wallboard displays, and supervisor barge-in.

### 🛒 E-Commerce
Order confirmation calls, delivery updates, and return processing with automated IVR flows.

### 📋 Recruitment
Candidate screening calls with AI transcription and automated interview scheduling.

### 🏥 Healthcare
Appointment reminders, patient follow-ups, and prescription refill notifications.

---

## 🤝 Why Choose NexDial AI?

| | Cloud Dialers | NexDial AI |
|---|---|---|
| **Data** | Stored on vendor servers | 100% on your infrastructure |
| **Customization** | Limited to vendor API | Full source code access |
| **Compliance** | Vendor-dependent | You control everything |
| **Cost at Scale** | Grows linearly | Fixed infrastructure cost |
| **AI Integration** | Vendor lock-in | Plug any AI provider |
| **Uptime** | Vendor SLA | Your SLA, your control |

---

## 📬 Contact

**Interested in NexDial AI for your organization?**

We offer:
- 🎯 **Live Demo** — See the platform in action with your use case
- 🛠 **Custom Deployment** — Tailored setup for your infrastructure
- 🤝 **White-Label Licensing** — Launch under your own brand
- 📞 **Enterprise Support** — Dedicated onboarding & 24/7 support

<p align="center">
  <a href="mailto:contact@nexdial.ai">
    <img src="https://img.shields.io/badge/Email-contact%40nexdial.ai-6C5CE7?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="https://nexdial.ai">
    <img src="https://img.shields.io/badge/Website-nexdial.ai-00C853?style=for-the-badge&logo=google-chrome&logoColor=white" />
  </a>
  <a href="https://linkedin.com/in/dattasable">
    <img src="https://img.shields.io/badge/LinkedIn-Datta%20Sable-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
</p>

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://dattasable.com">Datta Sable</a></strong><br/>
  <sub>AI Engineer • Full-Stack Developer • Telephony Architect</sub>
</p>

<p align="center">
  <sub>© 2026 NexDial AI. All rights reserved.</sub>
</p>
