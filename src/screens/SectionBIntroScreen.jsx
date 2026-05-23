import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const INTRO_MSG =
  'Now we are moving into the next section. This section is about your marriage. It must be filled out by anyone who is married now or was ever married before — even if the marriage ended. Have your marriage certificate ready if you can, it will make this easier.'

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

export default function SectionBIntroScreen({ onContinue, onBack }) {
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
            style={{ background: '#eef4fd' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#1a6fe8" opacity="0.15" stroke="#1a6fe8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Section label */}
        <div className="flex justify-center mb-4">
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: '#eef4fd', color: '#1a6fe8' }}
          >
            Section B
          </span>
        </div>

        <h2 className="text-black font-bold text-2xl text-center leading-snug mb-5">
          Marriage Information
        </h2>

        {/* Info card */}
        <div
          className="w-full rounded-2xl px-5 py-5 mb-6"
          style={{ background: '#f8faff', border: '1.5px solid #dce9fa' }}
        >
          <p className="text-gray-700 text-base leading-relaxed mb-3">
            This section must be filled out by <strong className="text-black">anyone who is married now or was ever married before</strong> — even if the marriage ended.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Have your <strong className="text-black">marriage certificate</strong> ready if you can — it will make this easier.
          </p>
        </div>

        {/* What you'll need */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            We will ask you about
          </p>
          {[
            'Date of your marriage',
            'Where you got married',
            "Your spouse's first name and surname",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 mb-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#1a6fe8' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-gray-700 text-sm">{item}</p>
            </div>
          ))}
        </div>

        {/* Continue button */}
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
