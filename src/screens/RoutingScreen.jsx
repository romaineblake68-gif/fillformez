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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#16a34a" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/**
 * Generic routing screen used for all step-branching decisions:
 *   FirstOrRenewal, RenewalAge, RenewalName, SectionCRouting, SectionDStatus
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
          style={{ background: '#f0fdf4' }}
        >
          <SpeakerIcon />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-center px-5 py-8">

        {/* Question card */}
        <div
          className="w-full rounded-2xl px-5 py-6 mb-7"
          style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
        >
          <h1 className="font-bold text-xl leading-snug text-center" style={{ color: '#0d1b38' }}>
            {question}
          </h1>
          {note && (
            <p className="text-gray-500 text-sm text-center leading-relaxed mt-3 px-1">
              {note}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className={layout === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
          {buttons.map((btn, i) => {
            const isPrimary = btn.style === 'primary' || i === 0
            return (
              <button
                key={btn.value}
                onClick={() => onSelect(btn.value)}
                className="w-full px-4 py-5 rounded-2xl font-bold text-base active:scale-95 transition-transform text-center"
                style={
                  isPrimary
                    ? {
                        background:  '#16a34a',
                        color:       'white',
                        boxShadow:   '0 2px 8px rgba(22,163,74,0.20)',
                      }
                    : {
                        background:  'white',
                        color:       '#0d1b38',
                        border:      '2px solid #0d1b38',
                      }
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
