import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

/**
 * Shows an informational message (auto-spoken) with a single Continue button.
 * Used for form-type announcements in the routing flow.
 *
 * Props:
 *   title       – small header label
 *   icon        – JSX element (optional, defaults to info circle)
 *   message     – main text, auto-spoken on mount
 *   subtext     – smaller explanatory text below message
 *   buttonLabel – Continue button text (default: "Continue")
 *   onContinue  – called when button is tapped
 *   onBack      – called when back is tapped
 */
export default function InfoScreen({
  title = 'Passport Application',
  icon,
  message,
  subtext,
  buttonLabel = 'Continue',
  onContinue,
  onBack,
}) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const text = subtext ? `${message} ${subtext}` : message
    const timer = setTimeout(() => speak(text), 500)
    return () => {
      clearTimeout(timer)
      stopSpeaking()
    }
  }, [message])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
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
        <div className="w-9" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: '#eef4fd' }}
        >
          {icon ?? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="2" width="16" height="20" rx="3" fill="#1a6fe8" opacity="0.9" />
              <rect x="8" y="7" width="8" height="1.5" rx="0.75" fill="white" />
              <rect x="8" y="10.5" width="6" height="1.5" rx="0.75" fill="white" opacity="0.7" />
              <rect x="8" y="14" width="7" height="1.5" rx="0.75" fill="white" opacity="0.7" />
              <circle cx="18" cy="18" r="5" fill="#22c55e" />
              <path d="M15.5 18l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Message */}
        <h1 className="text-black font-bold text-2xl leading-snug text-center mb-4 px-2">
          {message}
        </h1>

        {subtext && (
          <p className="text-gray-500 text-base leading-relaxed text-center mb-6 px-2">
            {subtext}
          </p>
        )}

        {/* Continue */}
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-bold text-white text-base mt-4 active:opacity-80 transition-opacity shadow-sm"
          style={{ background: '#1a6fe8' }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
