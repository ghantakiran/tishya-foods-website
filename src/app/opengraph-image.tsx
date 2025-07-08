import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Tishya Foods - ProNatural Protein Rich Foods'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginRight: 20,
            }}
          >
            🌱
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#10b981',
            }}
          >
            Tishya Foods
          </div>
        </div>
        
        <div
          style={{
            fontSize: 32,
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.2,
          }}
        >
          ProNatural Protein Rich Foods
        </div>
        
        <div
          style={{
            fontSize: 24,
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: 900,
            marginTop: 20,
            lineHeight: 1.3,
          }}
        >
          Where nature's goodness is lovingly crafted into wholesome foods
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            fontSize: 20,
            color: '#4b5563',
          }}
        >
          tishyafoods.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}