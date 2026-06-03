import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const NOTICE_SPEECH =
  'Before we begin. The information in this section should be for the person the passport is for. ' +
  'If you are filling this out for your child, enter your child\'s name, date of birth, and other details.'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export default function SectionANoticeScreen({ onContinue, onBack }) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const timer = setTimeout(() => speak(NOTICE_SPEECH), 400)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
        >
          <ChevronLeft />
        </button>
        <p className="flex-1 text-xs font-semibold text-gray-400 text-center uppercase tracking-wide">
          Section A — Personal Information
        </p>
        <div className="w-9 h-9 flex-shrink-0" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ background: '#f0fdf4' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" />
          </svg>
        </div>
        <h2 className="text-black font-bold text-xl text-center leading-snug mb-4">
          Before we begin
        </h2>
        <p className="text-gray-600 text-base text-center leading-relaxed mb-8 px-2">
          The information in this section should be for the{' '}
          <strong className="text-black">person the passport is for</strong>.
          {' '}If you are filling this out for your child, enter your child's name, date of birth, and other details.
        </p>
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-md active:opacity-80 transition-opacity"
          style={{ background: '#16a34a' }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
