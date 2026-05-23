import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

export default function ForWhomScreen({ onSelect, onBack }) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const timer = setTimeout(
      () => speak('Is this passport application for you, or for someone else?'),
      500,
    )
    return () => {
      clearTimeout(timer)
      stopSpeaking()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div
        className="flex items-center px-4 py-4"
        style={{ background: 'linear-gradient(135deg, #1a6fe8 0%, #1557c0 100%)' }}
      >
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white active:bg-white/30 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex-1 text-center">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Passport Application</p>
        </div>

        {/* Spacer to balance back button */}
        <div className="w-9" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Illustration */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
          style={{ background: '#eef4fd' }}
        >
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
            {/* Person 1 */}
            <circle cx="22" cy="20" r="9" fill="#1a6fe8" opacity="0.9" />
            <path d="M4 52c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="#1a6fe8" opacity="0.9" />
            {/* Person 2 (slightly offset, lighter) */}
            <circle cx="42" cy="20" r="9" fill="#1a6fe8" opacity="0.4" />
            <path d="M24 52c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="#1a6fe8" opacity="0.4" />
          </svg>
        </div>

        {/* Question */}
        <h1 className="text-black font-bold text-2xl leading-snug text-center mb-2">
          Is this application for you, or for someone else?
        </h1>
        <p className="text-gray-400 text-sm text-center mb-10">
          Tap the option that applies
        </p>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => onSelect('self')}
            className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl text-left active:scale-95 transition-transform shadow-sm"
            style={{ background: '#1a6fe8' }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">For me</p>
              <p className="text-white/70 text-sm">I am applying for myself</p>
            </div>
            <svg className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <button
            onClick={() => onSelect('other')}
            className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl text-left active:scale-95 transition-transform border-2"
            style={{ borderColor: '#1a6fe8', background: '#eef4fd' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#dce9fa' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a6fe8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg leading-tight" style={{ color: '#1a6fe8' }}>For someone else</p>
              <p className="text-gray-400 text-sm">I am applying on behalf of another person</p>
            </div>
            <svg className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a6fe8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
