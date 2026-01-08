import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Foundation Exclusive - Premium NFT Collections';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          backgroundImage: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Foundation Logo */}
        <div style={{ display: 'flex', marginBottom: '40px' }}>
          <svg
            viewBox="0 0 98 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="280"
            height="95"
          >
            <path
              clipRule="evenodd"
              d="m64.8935 16.456c0 9.0884-7.3676 16.456-16.456 16.456s-16.456-7.3676-16.456-16.456c0-9.08839 7.3676-16.456 16.456-16.456s16.456 7.36761 16.456 16.456zm-47.9911-14.88859c.3016-.52241 1.0556-.52241 1.3572 0l16.7962 29.09189c.3017.5224-.0754 1.1754-.6786 1.1754h-33.592412c-.603231 0-.980249-.653-.678634-1.1754zm51.7119-.588048c-.8655 0-1.5672.701678-1.5672 1.567238v27.8185c0 .8656.7017 1.5673 1.5672 1.5673h27.8185c.8656 0 1.5673-.7017 1.5673-1.5673v-27.8185c0-.86556-.7017-1.567238-1.5673-1.567238z"
              fill="#8B5CF6"
              fillRule="evenodd"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          Foundation Exclusive
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#A1A1AA',
            marginBottom: '40px',
          }}
        >
          Premium NFT Collections
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#8B5CF6',
            gap: '20px',
          }}
        >
          <span>Discover</span>
          <span style={{ color: '#A1A1AA' }}>•</span>
          <span>Create</span>
          <span style={{ color: '#A1A1AA' }}>•</span>
          <span>Collect</span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            width: '400px',
            height: '4px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}