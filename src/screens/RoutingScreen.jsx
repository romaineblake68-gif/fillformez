import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

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

/**
 * Generic routing screen used for all step-branching decisions:
 *   ForWhom, FirstOrRenewal, RenewalAge, RenewalName, FormChoice, SectionBRouting
 *
 * Props:
 *   title      – small label at top (e.g. "Passport Application")
 *   question   – large text, auto-spoken on mount
 *   note       – optional smaller explanatory text
 *   buttons    – [{ label, value, style?: 'primary'|'secondary' }]
 *   layout     – 'stack' (default, full-width stacked) | 'grid' (2-column)
 *   onSelect   – (value) => void
 *   onBack     – () => void
 */
export default function RoutingScreen({
  title = 'Passport Application',
  question,
  note,
  buttons,
  layout = 'stack',
  onSelect,
  onBack,
}) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const text = note ? `${question}. ${note}` : question
    const timer = setTimeout(() => speak(text), 500)
    return () => {
      clearTimeout(timer)
      stopSpeaking()
    }
  }, [question])

  const replay = () => {
    stopSpeaking()
    const text = note ? `${question}. ${note}` : question
    setTimeout(() => speak(text), 80)
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
          {title}
        </p>

        <button
          onClick={replay}
          aria-label="Replay question"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
          style={{ background: '#eef4fd' }}
        >
          <SpeakerIcon />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-center px-5 py-8">
        {/* Question */}
        <h1 className="text-black font-bold text-2xl leading-snug text-center mb-4 px-1">
          {question}
        </h1>

        {note && (
          <p className="text-gray-500 text-base text-center leading-relaxed mb-6 px-2">
            {note}
          </p>
        )}

        <div className={['mt-4', layout === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'].join(' ')}>
          {buttons.map((btn, i) => {
            const isPrimary = btn.style === 'primary' || i === 0
            return (
              <button
                key={btn.value}
                onClick={() => onSelect(btn.value)}
                className="px-4 py-5 rounded-2xl font-bold text-base active:scale-95 transition-transform text-center"
                style={
                  isPrimary
                    ? { background: '#1a6fe8', color: 'white' }
                    : { background: '#eef4fd', color: '#1a6fe8', border: '2px solid #dce9fa' }
                }
              >
                {btn.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
