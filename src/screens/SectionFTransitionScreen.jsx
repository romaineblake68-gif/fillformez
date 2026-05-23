import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const TRANSITION_SPEECH =
  'Well done! You have finished the first contact. Now let us add the second emergency contact.'

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#1a6fe8" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#1a6fe8" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export default function SectionFTransitionScreen({ onContinue }) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const timer = setTimeout(() => speak(TRANSITION_SPEECH), 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const replay = () => {
    stopSpeaking()
    setTimeout(() => speak(TRANSITION_SPEECH), 80)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="w-9 h-9 flex-shrink-0" />
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">

        {/* Icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-md"
          style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-black font-bold text-2xl text-center leading-snug mb-3">
          Contact 1 Complete!
        </h2>
        <p className="text-gray-500 text-base text-center leading-relaxed mb-10 px-2">
          Now let's add the <strong className="text-black">second emergency contact</strong>.
        </p>

        {/* Progress indicator */}
        <div
          className="w-full rounded-2xl px-5 py-4 mb-8"
          style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#16a34a' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-black font-semibold text-sm">Contact 1 — Done</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#bbf7d0' }}
            >
              <span className="text-sm font-bold" style={{ color: '#16a34a' }}>2</span>
            </div>
            <p className="text-gray-500 text-sm">Contact 2 — Up next</p>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm active:opacity-80 transition-opacity"
          style={{ background: '#1a6fe8' }}
        >
          Add second contact →
        </button>
      </div>
    </div>
  )
}
