import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const INTRO_MSG =
  'This next section is your official declaration. You are confirming that all the information you have given is correct. This is an important legal statement.'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#1a6fe8" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#1a6fe8" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export default function SectionEIntroScreen({ onContinue, onBack }) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const timer = setTimeout(() => speak(INTRO_MSG), 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const replay = () => {
    stopSpeaking()
    setTimeout(() => speak(INTRO_MSG), 80)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
        >
          <ChevronLeft />
        </button>
        <p className="flex-1 text-xs font-semibold text-gray-400 text-center uppercase tracking-wide">
          Passport Application
        </p>
        <button
          onClick={replay}
          aria-label="Replay message"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
          style={{ background: '#eef4fd' }}
        >
          <SpeakerIcon />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-5 pt-8 pb-8 overflow-y-auto">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: '#f0fdfa' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="14 2 14 8 20 8" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="13" x2="8" y2="13" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="17" x2="8" y2="17" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
              <polyline points="10 9 9 9 8 9" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Section label */}
        <div className="flex justify-center mb-4">
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: '#f0fdfa', color: '#0d9488' }}
          >
            Section E
          </span>
        </div>

        <h2 className="text-black font-bold text-2xl text-center leading-snug mb-5">
          Declaration of Applicant
        </h2>

        {/* Info card */}
        <div
          className="w-full rounded-2xl px-5 py-5 mb-6"
          style={{ background: '#f0fdfa', border: '1.5px solid #99f6e4' }}
        >
          <p className="text-gray-800 text-base leading-relaxed mb-3">
            You are about to make your <strong className="text-black">official declaration</strong> — confirming that all the information you have given is correct.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            This is an important legal statement. Take a moment to make sure everything you have said so far is accurate.
          </p>
        </div>

        {/* What's next */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            In this section
          </p>
          {[
            'Confirm your declaration statement',
            'Review the signature rules',
            'You will sign at the office — not at home',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 mb-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#0d9488' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-gray-700 text-sm">{item}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm active:opacity-80 transition-opacity"
          style={{ background: '#1a6fe8' }}
        >
          Ready, let's go →
        </button>
      </div>
    </div>
  )
}
