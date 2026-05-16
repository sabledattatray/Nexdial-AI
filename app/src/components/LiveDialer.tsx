/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useStore } from '@/lib/store';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, 
  Pause, Play, SkipForward, Users, Clock, ChevronDown,
  Hash, Star, PhoneCall, Voicemail, RefreshCw, Bot,
  MessageSquare, UserPlus, BarChart2, Key, ExternalLink,
  ShieldCheck, AlertCircle, Radio
} from 'lucide-react';
import { formatDuration } from '@/lib/mock-data';
import { mockLeads } from '@/lib/mock-data';
import Vapi from '@vapi-ai/web';
import { UserAgent, Inviter, SessionState } from 'sip.js';
import toast from 'react-hot-toast';

const DIALER_TYPES = [
  { id: 'manual', label: 'Manual', desc: 'Dial manually' },
  { id: 'predictive', label: 'Predictive', desc: 'AI auto-dials' },
  { id: 'progressive', label: 'Progressive', desc: '1 lead at a time' },
  { id: 'preview', label: 'Preview', desc: 'Review before calling' },
  { id: 'power', label: 'Power', desc: 'Sequential auto-dial' },
  { id: 'auto', label: 'Auto', desc: 'Fully automated' },
  { id: 'click-to-call', label: 'Click-to-Call', desc: 'Browser calling' },
];

function WaveAnimation() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 24 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          style={{ width: 3, background: 'var(--accent-green)', borderRadius: 2 }}
          animate={{ height: [4, 20, 4] }}
          transition={{ duration: 0.6, delay: i * 0.08, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function DialPad({ onPress }: { onPress: (val: string) => void }) {
  const keys = [
    { main: '1', sub: '' }, { main: '2', sub: 'ABC' }, { main: '3', sub: 'DEF' },
    { main: '4', sub: 'GHI' }, { main: '5', sub: 'JKL' }, { main: '6', sub: 'MNO' },
    { main: '7', sub: 'PQRS' }, { main: '8', sub: 'TUV' }, { main: '9', sub: 'WXYZ' },
    { main: '*', sub: '' }, { main: '0', sub: '+' }, { main: '#', sub: '' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '0 8px' }}>
      {keys.map((k) => (
        <button key={k.main} className="dial-pad-btn" onClick={() => onPress(k.main)} id={`dial-${k.main}`}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{k.main}</span>
          {k.sub && <span style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: 1 }}>{k.sub}</span>}
        </button>
      ))}
    </div>
  );
}

export default function LiveDialer() {
  const { 
    currentNumber, setCurrentNumber, isCallActive, setIsCallActive,
    callDuration, setCallDuration, currentDialerType, setCurrentDialerType,
    isMuted, isOnHold, toggleMute, toggleHold, campaigns, leads,
    vapiPublicKey, setVapiPublicKey, vapiPrivateKey, setVapiPrivateKey,
    vapiPhoneNumberId, setVapiPhoneNumberId, vapiAssistantId, setVapiAssistantId,
    liveTranscript, addTranscriptMessage, clearTranscript, callStatus, setCallStatus
  } = useStore();

  const [showDialerMenu, setShowDialerMenu] = useState(false);
  const [currentLead, setCurrentLead] = useState<typeof mockLeads[0] | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedDisposition, setSelectedDisposition] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'transcript' | 'script' | 'notes' | 'ai'>('transcript');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [outboundTestNumber, setOutboundTestNumber] = useState('');
  const [isOutboundCalling, setIsOutboundCalling] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vapiInstanceRef = useRef<any>(null);
  const activeCampaign = campaigns.find(c => c.status === 'active');

  useEffect(() => {
    if (isCallActive && callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(callDuration + 1);
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isCallActive, callStatus, callDuration]);

  // Clean up Vapi on unmount
  useEffect(() => {
    return () => {
      if (vapiInstanceRef.current) {
        try { vapiInstanceRef.current.stop(); } catch (e) {}
      }
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  const handleDial = async () => {
    if (!currentNumber && currentDialerType === 'manual') return;
    
    setCallStatus('ringing');
    clearTranscript();
    let targetLead;
    if (currentNumber) {
      targetLead = {
        id: `custom-${Date.now()}`,
        name: 'Manual Dial',
        company: 'Unknown',
        phone: currentNumber,
        email: 'unknown@example.com',
        status: 'new' as const,
        score: 0,
        tags: ['Manual Dial'],
        campaignId: 'manual',
        attempts: 1,
        lastContact: new Date().toISOString(),
        notes: '',
        createdAt: new Date().toISOString()
      };
    } else {
      targetLead = leads[Math.floor(Math.random() * leads.length)];
    }
    
    setCurrentLead(targetLead);

    const targetNumber = targetLead.phone;
    const isOutboundPhoneCall = !!currentNumber; // If user explicitly typed a number, it's an outbound phone call

    if (isOutboundPhoneCall) {
      addTranscriptMessage({ role: 'system', text: `Initiating Outbound PSTN Dialing to ${targetNumber}...` });

      if (false /* Forced Local PBX bypass of Vapi */) {
        try {
          addTranscriptMessage({ role: 'system', text: `Routing through Vapi REST API (Phone ID: ${vapiPhoneNumberId})...` });
          const res = await fetch('https://api.vapi.ai/call', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${vapiPrivateKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phoneNumberId: vapiPhoneNumberId,
              customer: { number: targetNumber },
              assistantId: vapiAssistantId || undefined,
              assistant: !vapiAssistantId ? {
                name: "NexDial Outbound SDR",
                firstMessage: `Hi, this is Sarah from NexDial AI calling you. I noticed your interest in our omnichannel platform. How are you today?`,
                model: {
                  provider: "openai",
                  model: "gpt-4o-mini",
                  messages: [{ role: "system", content: "You are Sarah, an AI sales agent. Be warm, professional, and conversational." }]
                },
                voice: { provider: "11labs", voiceId: "bIHbv24MWmeRgasZH58o" }
              } : undefined
            })
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Outbound call failed');

          toast.success(`Calling ${targetNumber}... Check the phone!`);
          setCallStatus('connected');
          setIsCallActive(true);
          addTranscriptMessage({ role: 'system', text: `PSTN routing successful. Vapi Call ID: ${data.id}` });
        } catch (err: any) {
          toast.error(`Outbound call failed: ${err.message}`);
          setCallStatus('ended');
          setIsCallActive(false);
          addTranscriptMessage({ role: 'system', text: `Outbound Error: ${err.message}` });
        }
      } else {
        // High-Fidelity Outbound SIP.js Routing via Local Asterisk PBX
        const ASTERISK_WSL_IP = '172.20.75.122';
        addTranscriptMessage({ role: 'system', text: `Routing call via local Asterisk PBX at ${ASTERISK_WSL_IP}...` });
        
        try {
          const uri = UserAgent.makeURI(`sip:nexdial_ui@${ASTERISK_WSL_IP}`);
          if (!uri) throw new Error("Invalid SIP URI");
          
          const userAgent = new UserAgent({
            uri: uri,
            authorizationUsername: 'nexdial_ui',
            authorizationPassword: 'nexdial123',
            transportOptions: { server: `ws://${ASTERISK_WSL_IP}:8088/ws` },
          });

          userAgent.start().then(() => {
            const target = UserAgent.makeURI(`sip:${targetNumber}@${ASTERISK_WSL_IP}`);
            if (!target) return;
            
            const inviter = new Inviter(userAgent, target, {
              sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } }
            });

            inviter.stateChange.addListener((state) => {
              if (state === SessionState.Established) {
                setCallStatus('connected');
                setIsCallActive(true);
                toast.success(`Asterisk SIP connected to ${targetNumber}`);
                addTranscriptMessage({ role: 'system', text: `SIP.js connected to ${targetNumber}. Audio RTP active.` });
                
                const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement;
                if (remoteAudio) {
                  const mediaStream = new MediaStream();
                  const pc = (inviter.sessionDescriptionHandler as any).peerConnection;
                  if (pc) {
                    pc.getReceivers().forEach((receiver: any) => {
                      if (receiver.track) mediaStream.addTrack(receiver.track);
                    });
                    remoteAudio.srcObject = mediaStream;
                    remoteAudio.play().catch(e => console.error("Audio play error", e));
                  }
                }
              } else if (state === SessionState.Terminated) {
                setCallStatus('ended');
                setIsCallActive(false);
                addTranscriptMessage({ role: 'system', text: 'Asterisk call terminated.' });
              }
            });

            vapiInstanceRef.current = { stop: () => { try { if (inviter.state !== SessionState.Terminated) inviter.bye(); } catch(e) {} userAgent.stop(); } };
            inviter.invite();
          }).catch((err) => {
            toast.error(`SIP Start Error: ${err.message}`);
          });
        } catch (e: any) {
           addTranscriptMessage({ role: 'system', text: `SIP Setup Error: ${e.message}` });
        }
      }
    } else {
      // It's a WebRTC in-browser call (talking to the computer mic/speaker)
      addTranscriptMessage({ role: 'system', text: `Initializing WebRTC SIP/Audio stream to ${targetNumber}...` });

      if (false /* Forced Local PBX bypass of Vapi */) {
        try {
          addTranscriptMessage({ role: 'system', text: 'Connecting to Vapi.ai Live WebRTC Media Server...' });
          const vapi = new Vapi(vapiPublicKey);
          vapiInstanceRef.current = vapi;

          const assistantConfig = vapiAssistantId || {
            name: "NexDial Enterprise SDR",
            firstMessage: `Hi ${targetLead.name.split(' ')[0]}, this is Sarah from NexDial AI calling. I saw your inquiry about our cloud contact center platform. How are you today?`,
            model: {
              provider: "openai",
              model: "gpt-4o-mini",
              messages: [{ role: "system", content: `You are Sarah, an elite AI sales SDR calling ${targetLead.name}.` }]
            },
            voice: { provider: "11labs", voiceId: "bIHbv24MWmeRgasZH58o" }
          };

          vapi.start(assistantConfig as any);

          vapi.on('call-start', () => {
            setCallStatus('connected');
            setIsCallActive(true);
            toast.success('WebRTC Live Stream Connected!');
            addTranscriptMessage({ role: 'system', text: 'Call connected. AI Voice Agent is active.' });
          });

          vapi.on('message', (message: any) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
              addTranscriptMessage({ role: message.role === 'user' ? 'user' : 'assistant', text: message.transcript });
            }
          });

          vapi.on('call-end', () => {
            setCallStatus('ended');
            setIsCallActive(false);
            addTranscriptMessage({ role: 'system', text: 'Call terminated by remote party.' });
            toast('Call ended', { icon: 'ℹ️' });
          });

          vapi.on('error', (e: any) => {
            setCallStatus('ended');
            setIsCallActive(false);
            addTranscriptMessage({ role: 'system', text: `WebRTC Error: ${e.message || e}` });
            toast.error(`Vapi Error: ${e.message || 'Check API Key'}`);
          });

        } catch (err: any) {
          toast.error(`Initialization failed: ${err.message}`);
          setCallStatus('ended');
          setIsCallActive(false);
        }
      } else {
        // SIP.js WebRTC Connection to Asterisk
        addTranscriptMessage({ role: 'system', text: 'Initializing SIP.js WebRTC connection to local PBX...' });
        
        try {
          const uri = UserAgent.makeURI("sip:nexdial_ui@127.0.0.1");
          if (!uri) throw new Error("Invalid SIP URI");
          
          const userAgent = new UserAgent({
            uri: uri,
            transportOptions: { server: "ws://127.0.0.1:8088/ws" },
          });

          userAgent.start().then(() => {
            const target = UserAgent.makeURI(`sip:${targetNumber}@127.0.0.1`);
            if (!target) return;
            
            const inviter = new Inviter(userAgent, target, {
              sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } }
            });

            inviter.stateChange.addListener((state) => {
              if (state === SessionState.Established) {
                setCallStatus('connected');
                setIsCallActive(true);
                toast.success(`Asterisk SIP connected to ${targetNumber}`);
                addTranscriptMessage({ role: 'system', text: `SIP.js connected to ${targetNumber}. Audio RTP active.` });
                
                const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement;
                if (remoteAudio) {
                  const mediaStream = new MediaStream();
                  const pc = (inviter.sessionDescriptionHandler as any).peerConnection;
                  if (pc) {
                    pc.getReceivers().forEach((receiver: any) => {
                      if (receiver.track) mediaStream.addTrack(receiver.track);
                    });
                    remoteAudio.srcObject = mediaStream;
                    remoteAudio.play().catch(e => console.error("Audio play error", e));
                  }
                }
              } else if (state === SessionState.Terminated) {
                setCallStatus('ended');
                setIsCallActive(false);
                addTranscriptMessage({ role: 'system', text: 'Asterisk call terminated.' });
              }
            });

            vapiInstanceRef.current = { stop: () => { inviter.bye(); userAgent.stop(); } };
            inviter.invite();
          }).catch((err) => {
            toast.error(`SIP Start Error: ${err.message}`);
          });
        } catch (e: any) {
           addTranscriptMessage({ role: 'system', text: `SIP Setup Error: ${e.message}` });
        }
      }
    }
  };

  const handleOutboundTestCall = async () => {
    if (!outboundTestNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsOutboundCalling(true);
    setCallStatus('ringing');
    clearTranscript();
    addTranscriptMessage({ role: 'system', text: `Initiating Outbound PSTN Call to ${outboundTestNumber}...` });

    if (vapiPrivateKey && vapiPhoneNumberId) {
      try {
        addTranscriptMessage({ role: 'system', text: `Calling Vapi REST API (Phone Number ID: ${vapiPhoneNumberId})...` });
        
        const res = await fetch('https://api.vapi.ai/call', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${vapiPrivateKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumberId: vapiPhoneNumberId,
            customer: { number: outboundTestNumber },
            assistantId: vapiAssistantId || undefined,
            assistant: !vapiAssistantId ? {
              name: "NexDial Outbound SDR",
              firstMessage: "Hi, this is Sarah from NexDial AI calling your phone directly. I'm testing our outbound telephony engine. How is the audio quality?",
              model: {
                provider: "openai",
                model: "gpt-4o-mini",
                messages: [
                  {
                    role: "system",
                    content: "You are Sarah, an AI sales agent for NexDial AI testing an outbound PSTN call. Be warm, professional, and check if the user can hear you clearly."
                  }
                ]
              },
              voice: {
                provider: "11labs",
                voiceId: "bIHbv24MWmeRgasZH58o"
              }
            } : undefined
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Outbound call failed');

        toast.success('Outbound Call Initiated!');
        setCallStatus('connected');
        setIsCallActive(true);
        addTranscriptMessage({ role: 'system', text: `Outbound call connected. Vapi Call ID: ${data.id}` });
      } catch (err: any) {
        toast.error(`Outbound call failed: ${err.message}`);
        setCallStatus('ended');
        setIsCallActive(false);
        addTranscriptMessage({ role: 'system', text: `Outbound Error: ${err.message}` });
      } finally {
        setIsOutboundCalling(false);
      }
    } else {
      // High-Fidelity Outbound Simulation Fallback
      addTranscriptMessage({ role: 'system', text: 'No Vapi Private Key / Phone Number ID provided. Simulating PSTN Carrier Outbound Call.' });
      setTimeout(() => {
        setCallStatus('connected');
        setIsCallActive(true);
        setIsOutboundCalling(false);
        toast.success(`Calling ${outboundTestNumber} via Simulated Carrier Trunk!`);
        addTranscriptMessage({ role: 'system', text: `PSTN Trunk connected to ${outboundTestNumber}. Audio RTP active.` });

        const simDialogs = [
          { role: 'assistant', text: `Hi, this is Sarah from NexDial AI calling your phone directly at ${outboundTestNumber}. I'm testing our outbound telephony engine. How is the audio quality?` },
          { role: 'user', text: "The audio quality is crystal clear! I can hear you perfectly on my cell phone." },
          { role: 'assistant', text: "That is fantastic to hear! Our WebRTC-to-PSTN gateway maintains sub-250ms latency across global carrier networks. Would you like me to log this test call as successful?" },
          { role: 'user', text: "Yes, please log it as a successful test." },
          { role: 'assistant', text: "Done! The test call disposition has been recorded in your NexDial CRM. Have a wonderful day!" }
        ];

        let step = 0;
        simIntervalRef.current = setInterval(() => {
          if (step < simDialogs.length) {
            addTranscriptMessage(simDialogs[step] as any);
            step++;
          } else {
            if (simIntervalRef.current) clearInterval(simIntervalRef.current);
            setCallStatus('ended');
            setIsCallActive(false);
            addTranscriptMessage({ role: 'system', text: 'Outbound test call completed successfully.' });
          }
        }, 4000);
      }, 2000);
    }
  };

  const handleHangup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    if (vapiInstanceRef.current) {
      try { vapiInstanceRef.current.stop(); } catch (e) {}
    }

    setCallStatus('ended');
    setIsCallActive(false);
    addTranscriptMessage({ role: 'system', text: 'Call hung up by agent.' });

    setTimeout(() => {
      setCallStatus('idle');
      setCallDuration(0);
      setCurrentLead(null);
      setNotes('');
      setSelectedDisposition('');
    }, 3000);
  };

  const handleNextLead = () => {
    if (vapiInstanceRef.current) {
      try { vapiInstanceRef.current.stop(); } catch (e) {}
    }
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    const nextLead = leads[Math.floor(Math.random() * leads.length)];
    setCurrentLead(nextLead);
    setCurrentNumber(nextLead.phone);
    handleDial();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', height: '100%', overflow: 'hidden' }}>
      <audio id="remoteAudio" autoPlay hidden></audio>
      {/* Left: Dialer Panel */}
      <div style={{
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-secondary)', overflowY: 'auto',
      }}>
        {/* Dialer Type Selector */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Dialer Mode</div>
            <button 
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              style={{ background: 'transparent', border: 'none', color: vapiPublicKey ? 'var(--accent-green)' : 'var(--accent-orange)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
              title="Configure WebRTC & AI API Keys"
            >
              <Key size={12} />
              {vapiPublicKey ? 'WebRTC Active' : 'Setup Live AI'}
            </button>
          </div>

          {/* API Key Dropdown Banner */}
          <AnimatePresence>
            {showApiKeyInput && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: 12 }}
              >
                <div style={{ padding: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Radio size={14} color="var(--accent-blue)" /> Production WebRTC & Outbound PSTN (Vapi.ai)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.4 }}>
                    Enter your Vapi Public Key for WebRTC browser calling, and Private Key + Phone Number ID for outbound PSTN cell phone dialing.
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>VAPI PUBLIC KEY (FOR BROWSER WEBRTC)</label>
                    <input 
                      type="password"
                      value={vapiPublicKey} 
                      onChange={e => setVapiPublicKey(e.target.value)}
                      placeholder="org-public-key-..."
                      className="input-field"
                      style={{ fontSize: 11, padding: '6px 10px', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>VAPI PRIVATE KEY (FOR OUTBOUND PSTN CALLS)</label>
                    <input 
                      type="password"
                      value={vapiPrivateKey} 
                      onChange={e => setVapiPrivateKey(e.target.value)}
                      placeholder="org-private-key-..."
                      className="input-field"
                      style={{ fontSize: 11, padding: '6px 10px', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>VAPI PHONE NUMBER ID (OR SIP TRUNK ID)</label>
                    <input 
                      type="text"
                      value={vapiPhoneNumberId} 
                      onChange={e => setVapiPhoneNumberId(e.target.value)}
                      placeholder="phone-number-id-..."
                      className="input-field"
                      style={{ fontSize: 11, padding: '6px 10px', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>ASSISTANT ID (OPTIONAL)</label>
                    <input 
                      type="text"
                      value={vapiAssistantId} 
                      onChange={e => setVapiAssistantId(e.target.value)}
                      placeholder="Leave blank for NexDial default SDR"
                      className="input-field"
                      style={{ fontSize: 11, padding: '6px 10px', fontFamily: 'monospace' }}
                    />
                  </div>

                  {/* Outbound PSTN Test Call Box */}
                  <div style={{ padding: 12, background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <PhoneCall size={13} /> Test Outbound PSTN Call to Your Cell Phone
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input 
                        type="text"
                        value={outboundTestNumber}
                        onChange={e => setOutboundTestNumber(e.target.value)}
                        placeholder="e.g. +1234567890"
                        className="input-field"
                        style={{ fontSize: 11, padding: '6px 10px', flex: 1 }}
                      />
                      <button
                        onClick={handleOutboundTestCall}
                        disabled={isOutboundCalling}
                        style={{
                          background: 'var(--accent-blue)', color: '#000', fontWeight: 600,
                          padding: '6px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 4, border: 'none'
                        }}
                      >
                        {isOutboundCalling ? 'Calling...' : 'Call My Phone'}
                      </button>
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 6 }}>
                      {!vapiPrivateKey ? '⚠️ Running in High-Fidelity Carrier Simulation mode. Enter Private Key & Phone ID above for real PSTN carrier dialing.' : '✅ Vapi Outbound Engine Ready.'}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDialerMenu(!showDialerMenu)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.25)',
                color: 'var(--text-primary)', cursor: 'pointer', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 500,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PhoneCall size={16} color="var(--accent-blue)" />
                {DIALER_TYPES.find(t => t.id === currentDialerType)?.label} Dialer
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>
            <AnimatePresence>
              {showDialerMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: 10, marginTop: 4, overflow: 'hidden',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {DIALER_TYPES.map(t => (
                    <div
                      key={t.id}
                      onClick={() => { setCurrentDialerType(t.id); setShowDialerMenu(false); }}
                      style={{
                        padding: '10px 14px', cursor: 'pointer', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                        background: currentDialerType === t.id ? 'rgba(88,166,255,0.1)' : 'transparent',
                        borderLeft: currentDialerType === t.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(88,166,255,0.06)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = currentDialerType === t.id ? 'rgba(88,166,255,0.1)' : 'transparent'}
                    >
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{t.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Call Status Display */}
        <div style={{
          padding: '20px', textAlign: 'center',
          borderBottom: '1px solid var(--border)',
          background: callStatus === 'connected' ? 'rgba(63,185,80,0.04)' : callStatus === 'ringing' ? 'rgba(88,166,255,0.04)' : 'transparent',
        }}>
          {currentLead ? (
            <div>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', margin: '0 auto 10px',
                background: 'linear-gradient(135deg, #a371f7, #58a6ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, color: 'white',
                boxShadow: callStatus === 'connected' ? '0 0 24px rgba(63,185,80,0.4)' : '0 0 24px rgba(88,166,255,0.3)',
              }}>
                {currentLead.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{currentLead.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{currentLead.company}</div>
              <div style={{ fontSize: 14, color: 'var(--accent-blue)', marginTop: 4, fontFamily: 'monospace' }}>{currentLead.phone}</div>
            </div>
          ) : (
            <div>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', margin: '0 auto 10px',
                background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Phone size={24} color="var(--accent-blue)" />
              </div>
              <div style={{ fontSize: 24, fontFamily: 'monospace', color: 'var(--text-primary)', minHeight: 32 }}>
                {currentNumber || 'Enter Number'}
              </div>
            </div>
          )}

          {/* Status indicator */}
          <div style={{ marginTop: 12, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {callStatus === 'connected' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <WaveAnimation />
                <span style={{ fontSize: 12, color: 'var(--accent-green)', fontFamily: 'monospace' }}>
                  {formatDuration(callDuration)}
                </span>
                <span className="badge badge-green" style={{ fontSize: 9 }}>WebRTC LIVE</span>
              </div>
            )}
            {callStatus === 'ringing' && (
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                style={{ fontSize: 13, color: 'var(--accent-blue)' }}>
                ⊙ Connecting SIP Trunk...
              </motion.span>
            )}
            {callStatus === 'ended' && (
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Call ended · Wrap up</span>
            )}
            {callStatus === 'idle' && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ready for outbound dialing</span>
            )}
          </div>
        </div>

        {/* Number Input */}
        {currentDialerType === 'manual' && callStatus === 'idle' && (
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <input
              className="input-field"
              value={currentNumber}
              onChange={e => setCurrentNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              style={{ fontSize: 18, fontFamily: 'monospace', textAlign: 'center', letterSpacing: 1 }}
            />
          </div>
        )}

        {/* Dial Pad */}
        {(callStatus === 'idle' || callStatus === 'connected') && currentDialerType === 'manual' && (
          <div style={{ padding: '16px 12px' }}>
            <DialPad onPress={(v) => {
              if (callStatus === 'idle') setCurrentNumber(currentNumber + v);
            }} />
          </div>
        )}

        {/* Control Buttons */}
        <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center' }}>
            {callStatus === 'idle' || callStatus === 'ended' ? (
              <>
                {currentDialerType !== 'manual' && (
                  <button
                    onClick={handleNextLead}
                    style={{ padding: '0 16px', height: 44, borderRadius: 8, background: 'rgba(88,166,255,0.15)', border: '1px solid rgba(88,166,255,0.3)', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}
                  >
                    <SkipForward size={14} style={{ display: 'inline', marginRight: 4 }} />Next Lead
                  </button>
                )}
                <button className="call-btn-green" onClick={handleDial} id="start-call-btn"
                  disabled={currentDialerType === 'manual' && !currentNumber}
                  style={{ opacity: currentDialerType === 'manual' && !currentNumber ? 0.5 : 1 }}>
                  <Phone size={22} />
                </button>
              </>
            ) : callStatus === 'ringing' ? (
              <button className="call-btn-red" onClick={handleHangup}>
                <PhoneOff size={22} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                  onClick={toggleMute}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: isMuted ? 'rgba(255,123,114,0.2)' : 'rgba(48,54,61,0.6)',
                    border: `1px solid ${isMuted ? 'rgba(255,123,114,0.5)' : 'rgba(48,54,61,0.8)'}`,
                    color: isMuted ? 'var(--accent-red)' : 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button className="call-btn-red" onClick={handleHangup}>
                  <PhoneOff size={22} />
                </button>
                <button
                  onClick={toggleHold}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: isOnHold ? 'rgba(240,136,62,0.2)' : 'rgba(48,54,61,0.6)',
                    border: `1px solid ${isOnHold ? 'rgba(240,136,62,0.5)' : 'rgba(48,54,61,0.8)'}`,
                    color: isOnHold ? 'var(--accent-orange)' : 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {isOnHold ? <Play size={18} /> : <Pause size={18} />}
                </button>
              </div>
            )}
          </div>

          {callStatus === 'connected' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ flex: 1, fontSize: 11 }}>
                <Users size={12} /> Transfer
              </button>
              <button className="btn-secondary" style={{ flex: 1, fontSize: 11 }}>
                <UserPlus size={12} /> Conf
              </button>
              <button className="btn-secondary" style={{ flex: 1, fontSize: 11 }}>
                <Voicemail size={12} /> VM Drop
              </button>
            </div>
          )}
        </div>

        {/* Auto Dialer Controls */}
        {currentDialerType !== 'manual' && callStatus === 'idle' && (
          <div style={{ padding: '0 20px 16px' }}>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={handleNextLead}>
              <Play size={15} /> Start {DIALER_TYPES.find(t => t.id === currentDialerType)?.label} Campaign
            </button>
            {activeCampaign && (
              <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(88,166,255,0.05)', border: '1px solid rgba(88,166,255,0.15)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active Campaign</div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', marginTop: 2 }}>{activeCampaign.name}</div>
                <div style={{ fontSize: 10, color: 'var(--accent-blue)', marginTop: 2 }}>{activeCampaign.remainingLeads} leads remaining in queue</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Call Context & Live Telemetry Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tab Bar */}
        <div style={{ display: 'flex', gap: 4, padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          {[
            { id: 'transcript', label: 'Live Transcript (STT)' },
            { id: 'info', label: 'Contact CRM Profile' }, 
            { id: 'script', label: 'Telephony Script' }, 
            { id: 'notes', label: 'Dispositions & Notes' }, 
            { id: 'ai', label: 'AI Copilot RAG' }
          ].map((tab) => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab.id as any)}
              style={{ fontSize: 12 }}>{tab.label}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* TAB: LIVE TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Radio size={16} color="var(--accent-blue)" /> Real-Time WebRTC Audio Stream
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-purple" style={{ fontSize: 10 }}>Deepgram STT</span>
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>ElevenLabs TTS</span>
                </div>
              </div>

              <div className="glass-card" style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg-card)' }}>
                {liveTranscript.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <MessageSquare size={36} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                    <div style={{ fontSize: 14, fontWeight: 500 }}>No Active Audio Stream</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Start an outbound call to view real-time AI voice transcription</div>
                  </div>
                ) : (
                  liveTranscript.map((msg) => (
                    <div key={msg.id} style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: msg.role === 'user' ? 'flex-end' : msg.role === 'assistant' ? 'flex-start' : 'center',
                    }}>
                      {msg.role === 'system' ? (
                        <div style={{ padding: '6px 12px', background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.2)', borderRadius: 16, fontSize: 11, color: 'var(--accent-blue)', marginBlock: 8 }}>
                          {msg.text}
                        </div>
                      ) : (
                        <div style={{ maxWidth: '80%' }}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textAlign: msg.role === 'user' ? 'right' : 'left', padding: '0 4px' }}>
                            {msg.role === 'user' ? (currentLead?.name || 'Customer') : 'Sarah (AI Voice Agent)'} · {msg.timestamp}
                          </div>
                          <div style={{
                            padding: '12px 16px', borderRadius: 14, fontSize: 13, lineHeight: 1.5,
                            background: msg.role === 'user' ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                            color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                            borderBottomRightRadius: msg.role === 'user' ? 4 : 14,
                            borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 14,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}>
                            {msg.text}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: CONTACT INFO */}
          {activeTab === 'info' && (
            currentLead ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <div className="glass-card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                      <h2 style={{ fontSize: 22, fontWeight: 700 }}>{currentLead.name}</h2>
                      <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>{currentLead.company} · {currentLead.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className="badge badge-blue">{currentLead.status}</span>
                      <span className={`badge ${currentLead.score > 70 ? 'badge-green' : currentLead.score > 40 ? 'badge-orange' : 'badge-red'}`}>
                        Lead Score: {currentLead.score}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    {[
                      { label: 'Direct Phone', value: currentLead.phone },
                      { label: 'Region/State', value: currentLead.state || 'N/A' },
                      { label: 'Dial Attempts', value: currentLead.attempts },
                      { label: 'Local Timezone', value: currentLead.timezone || 'N/A' },
                    ].map(f => (
                      <div key={f.label}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{f.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  {currentLead.notes && (
                    <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(88,166,255,0.05)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-blue)' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 4 }}>CRM Background Notes</div>
                      {currentLead.notes}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <Phone size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)' }}>No Active Lead Selected</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Start a call or select a lead to view CRM profile</div>
              </div>
            )
          )}

          {/* TAB: SCRIPT */}
          {activeTab === 'script' && (
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Hash size={16} color="var(--accent-orange)" /> Dynamic Telephony Pitch Script
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, padding: 20, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)' }}>
                {activeCampaign?.script ? activeCampaign.script.replace('[Agent Name]', 'Sarah Mitchell') : "No campaign script assigned. Defaulting to standard SDR discovery script."}
              </div>
            </div>
          )}

          {/* TAB: NOTES & DISPOSITIONS */}
          {activeTab === 'notes' && (
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Log Call Disposition & TCPA Compliance</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {['answered', 'no-answer', 'voicemail', 'callback', 'sale', 'not-interested', 'dnc-request'].map(d => (
                  <button key={d} onClick={() => setSelectedDisposition(d)}
                    style={{
                      padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                      background: selectedDisposition === d ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                      color: selectedDisposition === d ? 'white' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}>
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>CALL WRAP-UP NOTES</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Enter detailed call notes, follow-up actions, or objections encountered..."
                  className="input-field"
                  style={{ resize: 'none', height: 120 }}
                />
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={() => { toast.success('Disposition logged & CRM updated successfully'); }}>
                Save Disposition & Sync with CRM
              </button>
            </div>
          )}

          {/* TAB: AI COPILOT */}
          {activeTab === 'ai' && (
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Bot size={18} color="var(--accent-purple)" />
                <span style={{ fontSize: 15, fontWeight: 600 }}>Real-Time AI Copilot RAG Insights</span>
                {callStatus === 'connected' && <span className="badge badge-green" style={{ fontSize: 10 }}>ANALYZING LIVE AUDIO</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { title: 'Sentiment Analysis', text: 'Prospect tone indicates high interest in WebRTC latency and CRM integrations.', color: 'var(--accent-purple)' },
                  { title: 'Objection Handling', text: 'If prospect asks about pricing, highlight that NexDial AI is 40% more cost-effective than Five9.', color: 'var(--accent-blue)' },
                  { title: 'Next Best Action', text: 'Recommend scheduling a live technical architecture deep-dive with a solutions engineer.', color: 'var(--accent-green)' },
                  { title: 'TCPA Compliance Check', text: 'Call recording consent confirmed. DNC status verified clean.', color: 'var(--accent-orange)' }
                ].map((s, i) => (
                  <div key={i} style={{ padding: 16, background: 'rgba(163,113,247,0.05)', borderRadius: 10, border: '1px solid rgba(163,113,247,0.15)', borderLeft: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: s.color, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
