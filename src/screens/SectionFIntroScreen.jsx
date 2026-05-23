import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const INTRO_MSG =
  'This next section is for two emergency contact people. These are people we can reach out to if we have any questions about your application. They are not authorized to pick up your passport — they are just contacts. Choose two people you trust — family, friends, anyone who knows you.'

const TIP_MSG =
  'Both contacts are required. You cannot leave either one blank. Make sure you tell these people that their name is on your form.'

const FULL_SPEECH = INTRO_MSG + ' ' + TIP_MSG

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

export default function SectionFIntroScreen({ onContinue, onBack }) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const timer = setTimeout(() => speak(FULL_SPEECH), 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const replay = () => {
    stopSpeaking()
    setTimeout(() => speak(FULL_SPEECH), 80)
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
            style={{ background: '#fff1f2' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="#e11d48" strokeWidth="2" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Section label */}
        <div className="flex justify-center mb-4">
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: '#fff1f2', color: '#e11d48' }}
          >
            Section F
          </span>
        </div>

        <h2 className="text-black font-bold text-2xl text-center leading-snug mb-5">
          Emergency Contacts
        </h2>

        {/* Main info */}
        <div
          className="w-full rounded-2xl px-5 py-5 mb-4"
          style={{ background: '#fff1f2', border: '1.5px solid #fecdd3' }}
        >
          <p className="text-gray-800 text-base leading-relaxed">
            We need <strong className="text-black">two people</strong> we can contact if we have any questions about your application. They are <strong className="text-black">not authorized to pick up your passport</strong> — they are just contacts. Choose people you trust — family, friends, anyone who knows you.
          </p>
        </div>

        {/* Important tip box */}
        <div
          className="w-full rounded-2xl px-5 py-4 mb-8 flex items-start gap-3"
          style={{ background: '#fff7ed', border: '1.5px solid #fed7aa' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#f97316" opacity="0.15" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div>
            <p className="text-gray-800 text-sm font-semibold mb-1">Important</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Both contacts are required. You cannot leave either one blank. Make sure you <strong className="text-black">tell these people that their name is on your form</strong>.
            </p>
          </div>
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
