import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#1d1d1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f4f4f2',
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}
    >
      V
    </div>,
    { width: 32, height: 32 }
  )
}
