import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'NexDial AI — Enterprise Call Center Platform';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 100px',
          backgroundColor: '#080a0f',
          backgroundImage: `url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Dark Slate Overlay for moody enterprise aesthetic */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(8,10,15,0.92) 0%, rgba(8,10,15,0.7) 50%, rgba(8,10,15,0.3) 100%)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, maxWidth: 850 }}>
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 24px',
              background: 'linear-gradient(135deg, rgba(163,113,247,0.2), rgba(88,166,255,0.2))',
              border: '1px solid rgba(163,113,247,0.4)',
              borderRadius: 30,
              color: '#c084fc',
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 28,
              letterSpacing: '1px',
            }}
          >
            🚀 NEXT-GEN TELEPHONY & AI COPILOT
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: 24,
            }}
          >
            Surgical AI Telephony for Enterprise Sales Teams.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 24,
              color: '#94a3b8',
              lineHeight: 1.5,
              marginBottom: 40,
              fontWeight: 500,
            }}
          >
            Scale your outbound campaigns with predictive pacing algorithms, real-time AI sentiment analysis, and ultra-low latency WebRTC integrations.
          </p>

          {/* Bullet Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Predictive & Power Dialing with SIP/Asterisk PBX integration',
              'Sub-400ms AI Voice Copilot & Real-Time Sentiment Scoring',
            ].map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 20, color: '#e2e8f0', fontWeight: 600 }}>
                <div style={{ width: 24, height: 24, borderRadius: 12, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080a0f', fontSize: 14, fontWeight: 800 }}>✓</div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Watermark / Logo at bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #a371f7, #58a6ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 24,
              paddingLeft: 16,
              paddingTop: 8,
            }}
          >
            N
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>NexDial AI</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
