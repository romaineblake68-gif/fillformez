import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const WELCOME_MSG =
  'Alright! I am going to help you fill out your National Insurance Scheme registration, step by step. Your N I S number gives you access to retirement and health benefits. Just listen, speak your answers, and tap to confirm. Take your time — there is no rush.'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export default function NISWelcomeScreen({ onStart, onBack, onResume }) {
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
            {/* Shield / NIS card icon */}
            <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 3L5 7v9c0 6.5 4.7 12.6 11 14 6.3-1.4 11-7.5 11-14V7L16 3z"
                fill="#16a34a"
              />
              <path
                d="M16 3L5 7v9c0 6.5 4.7 12.6 11 14 6.3-1.4 11-7.5 11-14V7L16 3z"
                fill="url(#shieldGrad)"
                opacity="0.15"
              />
              <polyline
                points="11 16 14.5 19.5 21 13"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <defs>
                <linearGradient id="shieldGrad" x1="16" y1="3" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="white" />
                  <stop offset="1" stopColor="#16a34a" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-black font-bold text-2xl text-center leading-snug mb-3">
          NIS Registration
        </h1>

        <p className="text-gray-500 text-base text-center leading-relaxed mb-2 px-2">
          Your <strong className="text-black">National Insurance Scheme</strong> number is used
          for retirement and health benefits.
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
