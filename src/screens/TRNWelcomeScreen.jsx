import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const WELCOME_MSG =
  'Alright! I am going to help you fill out your Tax Registration Number application, step by step. Your TRN is a 9-digit number used when doing business with the government, banks, schools, and other institutions. Just listen, speak your answers, and tap to confirm. Take your time — there is no rush.'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export default function TRNWelcomeScreen({ onStart, onBack, onResume }) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const timer = setTimeout(() => speak(WELCOME_MSG), 600)
    return () => {
      clearTimeout(timer)
      stopSpeaking()
    }
  }, [])

  const replay = () => {
    stopSpeaking()
    setTimeout(() => speak(WELCOME_MSG), 80)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          aria-label="Back to home"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
        >
          <ChevronLeft />
        </button>

        <div className="flex-1 flex items-center justify-center gap-1">
          <span className="text-lg font-bold text-black">FillForm</span>
          <span
            className="text-lg font-bold text-white px-1.5 py-0.5 rounded-md leading-tight"
            style={{ background: '#16a34a' }}
          >
            EZ
          </span>
        </div>

        <div className="w-9" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">

        {/* Icon with pulse */}
        <div className="relative mb-8 flex items-center justify-center">
          <span
            className="absolute rounded-full animate-ping"
            style={{ width: 112, height: 112, background: '#16a34a', opacity: 0.08 }}
          />
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: '#f0fdf4' }}
          >
            <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="2" width="24" height="28" rx="3" fill="#16a34a" />
              <rect x="9" y="8" width="14" height="2" rx="1" fill="white" />
              <rect x="9" y="13" width="10" height="2" rx="1" fill="white" opacity="0.7" />
              <rect x="9" y="18" width="12" height="2" rx="1" fill="white" opacity="0.7" />
              <rect x="9" y="23" width="8" height="2" rx="1" fill="white" opacity="0.5" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-black font-bold text-2xl text-center leading-snug mb-3">
          TRN Application
        </h1>

        <p className="text-gray-500 text-base text-center leading-relaxed mb-2 px-2">
          Your <strong className="text-black">Tax Registration Number</strong> is a 9-digit
          number used to identify you with the government, banks, and schools.
        </p>
        <p className="text-gray-500 text-base text-center leading-relaxed mb-8 px-2">
          I will walk you through the form <strong className="text-black">one question at a time</strong>.
        </p>

        {/* Replay */}
        <button
          onClick={replay}
          className="flex items-center gap-2 font-semibold text-sm mb-8 px-4 py-2 rounded-xl active:opacity-70 transition-opacity"
          style={{ color: '#16a34a', background: '#f0fdf4' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#16a34a" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
          Play message again
        </button>

        {/* Start / Resume */}
        {onResume ? (
          <div className="w-full flex gap-3">
            <button
              onClick={onResume}
              className="flex-1 py-4 rounded-2xl font-bold text-white text-base shadow-md active:opacity-80 transition-opacity"
              style={{ background: '#16a34a' }}
            >
              Resume
            </button>
            <button
              onClick={onStart}
              className="flex-1 py-4 rounded-2xl font-semibold text-base border-2 active:opacity-80 transition-opacity"
              style={{ borderColor: '#16a34a', color: '#16a34a', background: 'white' }}
            >
              Start Fresh
            </button>
          </div>
        ) : (
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-md active:opacity-80 transition-opacity"
            style={{ background: '#16a34a' }}
          >
            Let's Get Started →
          </button>
        )}
      </div>
    </div>
  )
}
