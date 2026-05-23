import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const WELCOME_MSG =
  'Alright! I am going to help you fill out your passport form, step by step. Just listen, speak your answer, and tap to confirm. Take your time — there is no rush. Let us get started.'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export default function WelcomeScreen({ onStart, onBack }) {
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

        {/* Pulsing speaker illustration */}
        <div className="relative mb-8 flex items-center justify-center">
          <span
            className="absolute rounded-full animate-ping"
            style={{ width: 112, height: 112, background: '#16a34a', opacity: 0.08 }}
          />
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: '#f0fdf4' }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#16a34a" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-black font-bold text-2xl text-center leading-snug mb-3">
          Welcome to FillFormEZ
        </h1>

        <p className="text-gray-500 text-base text-center leading-relaxed mb-2 px-2">
          I will walk you through your passport application <strong className="text-black">one step at a time</strong>.
        </p>
        <p className="text-gray-500 text-base text-center leading-relaxed mb-8 px-2">
          Just <strong className="text-black">listen</strong>, speak your answer, and <strong className="text-black">tap to confirm</strong>.
        </p>

        {/* Replay button */}
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

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-md active:opacity-80 transition-opacity"
          style={{ background: '#16a34a' }}
        >
          Let's Get Started →
        </button>
      </div>
    </div>
  )
}
