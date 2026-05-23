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

function WarningIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#f97316" opacity="0.15" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Reusable important-notice screen.
 *
 * Props:
 *   speechText  – full text spoken aloud on mount
 *   title       – bold heading shown on screen
 *   lines       – string[] — each string is a separate paragraph in the body
 *   highlights  – optional string[] — key phrases to bold (simple substring match)
 *   buttonLabel – label for the continue button (default "Got it")
 *   onContinue  – called when the button is tapped
 *   onBack      – if provided, shows a back chevron in the header
 */
export default function NoticeScreen({
  speechText,
  title,
  lines = [],
  buttonLabel = 'Got it',
  onContinue,
  onBack,
}) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const timer = setTimeout(() => speak(speechText), 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const replay = () => {
    stopSpeaking()
    setTimeout(() => speak(speechText), 80)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Go back"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
          >
            <ChevronLeft />
          </button>
        ) : (
          <div className="w-9 flex-shrink-0" />
        )}
        <p className="flex-1 text-xs font-semibold text-gray-400 text-center uppercase tracking-wide">
          Important Notice
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

      {/* Body — content at top, button pinned to bottom */}
      <div className="flex-1 flex flex-col px-5 pt-4 pb-6 overflow-y-auto">

        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: '#fff7ed' }}
          >
            <WarningIcon />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-black font-bold text-xl text-center leading-snug mb-5 px-2">
          {title}
        </h2>

        {/* Content lines */}
        <div
          className="w-full rounded-2xl px-5 py-5 flex flex-col gap-4"
          style={{ background: '#fff7ed', border: '1.5px solid #fed7aa' }}
        >
          {lines.map((line, i) => (
            <p key={i} className="text-gray-800 text-base leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        {/* Got it button — pushed to the bottom of the screen */}
        <button
          onClick={onContinue}
          className="mt-auto pt-6 w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm active:opacity-80 transition-opacity"
          style={{ background: '#1a6fe8' }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
