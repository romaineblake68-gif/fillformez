import { useState, useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

// ── Card descriptions (spoken when tapping a card's speaker icon) ─────────────
const CARD_SPEECH = {
  regular:
    'This is the Regular Passport Application Form. It is for everyone — first time applicants and renewals. It requires certification by a certifying official.',
  simplified:
    'This is the Simplified Adult Renewal Form. It is shorter and does not require a certifying official. You only qualify if your last passport was issued when you were 18 or older and nothing has changed since then.',
}

// ── Auto-speak messages by routing reason ─────────────────────────────────────
const AUTO_SPEECH = {
  'first-time':
    'Since this is your first passport, you will need the Regular Passport Application Form. Do not worry — I will walk you through every step.',
  'was-minor':
    'Since you were under 18 when your last passport was issued, you still need the Regular Passport Application Form.',
  'name-changed':
    'Since your name or marital status has changed, you will need the Regular Passport Application Form.',
  'qualifies-simplified':
    'Good news! You qualify for the Simplified Adult Renewal Form, which is shorter and does not require a certifying official. You can also choose to use the Regular Form if you prefer. Tap the speaker icon on each card to hear more.',
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function SpeakerIcon({ color = '#1a6fe8', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// ── Form card ─────────────────────────────────────────────────────────────────

function FormCard({ type, title, description, icon, isSelected, isDisabled, onSelect, onPlayDescription }) {
  return (
    <div
      className="flex-1 flex flex-col rounded-2xl p-3.5 text-left relative border-2 transition-all"
      style={{
        borderColor: isDisabled ? '#e5e7eb' : isSelected ? '#1a6fe8' : '#e5e7eb',
        background: isDisabled ? '#f9fafb' : isSelected ? '#eef4fd' : '#ffffff',
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      {/* Speaker icon — top right, always tappable */}
      <button
        onClick={(e) => { e.stopPropagation(); onPlayDescription() }}
        aria-label={`Hear about the ${title}`}
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center active:opacity-70"
        style={{ background: isDisabled ? '#f3f4f6' : '#eef4fd' }}
      >
        <SpeakerIcon color={isDisabled ? '#9ca3af' : '#1a6fe8'} size={14} />
      </button>

      {/* Tap target for card selection (covers everything except speaker button) */}
      <button
        onClick={isDisabled ? undefined : onSelect}
        disabled={isDisabled}
        className="flex flex-col items-start text-left w-full"
        style={{ cursor: isDisabled ? 'default' : 'pointer' }}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ background: isDisabled ? '#d1d5db' : type === 'regular' ? '#1a6fe8' : '#22c55e' }}
        >
          {icon}
        </div>

        <p
          className="font-bold text-sm leading-snug pr-6"
          style={{ color: isDisabled ? '#9ca3af' : '#111827' }}
        >
          {title}
        </p>

        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{description}</p>

        {/* Status badge */}
        <div className="mt-3">
          {isDisabled ? (
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 rounded-lg px-2 py-1">
              Does not apply
            </span>
          ) : isSelected ? (
            <span className="text-xs font-bold" style={{ color: '#1a6fe8' }}>
              ✓ Selected
            </span>
          ) : (
            <span className="text-xs text-gray-300">Tap to select</span>
          )}
        </div>
      </button>
    </div>
  )
}

// ── Main FormTypeScreen ───────────────────────────────────────────────────────

export default function FormTypeScreen({ qualifiesSimplified, reason, onSelect, onBack }) {
  const [selected, setSelected] = useState(qualifiesSimplified ? 'simplified' : 'regular')
  const { speak, stopSpeaking } = useSpeech()

  // Auto-speak the routing reason on mount
  useEffect(() => {
    const msg = AUTO_SPEECH[reason] ?? AUTO_SPEECH['first-time']
    const timer = setTimeout(() => speak(msg), 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [reason])

  const replayAuto = () => {
    stopSpeaking()
    const msg = AUTO_SPEECH[reason] ?? AUTO_SPEECH['first-time']
    setTimeout(() => speak(msg), 80)
  }

  const playCardDesc = (type) => {
    stopSpeaking()
    setTimeout(() => speak(CARD_SPEECH[type]), 80)
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
          onClick={replayAuto}
          aria-label="Replay message"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
          style={{ background: '#eef4fd' }}
        >
          <SpeakerIcon />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-4 pt-6 pb-8 overflow-y-auto">

        <h2 className="text-black font-bold text-xl text-center mb-2">
          Here are your form options
        </h2>
        <p className="text-gray-500 text-sm text-center leading-relaxed mb-6 px-2">
          {qualifiesSimplified
            ? 'You qualify for the Simplified Form, but you can also choose the Regular Form.'
            : 'Based on your answers, you will use the Regular Form.'}
        </p>

        {/* Two cards side by side */}
        <div className="flex gap-3 mb-3">
          <FormCard
            type="regular"
            title="Regular Passport Application Form"
            description="For everyone — first time and renewals"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="2" width="18" height="20" rx="3" fill="white" opacity="0.9" />
                <rect x="7" y="7" width="10" height="1.5" rx="0.75" fill="#1a6fe8" />
                <rect x="7" y="10.5" width="7" height="1.5" rx="0.75" fill="#1a6fe8" opacity="0.6" />
                <rect x="7" y="14" width="8" height="1.5" rx="0.75" fill="#1a6fe8" opacity="0.6" />
              </svg>
            }
            isSelected={selected === 'regular'}
            isDisabled={false}
            onSelect={() => setSelected('regular')}
            onPlayDescription={() => playCardDesc('regular')}
          />

          <FormCard
            type="simplified"
            title="Simplified Adult Renewal Form"
            description="Shorter — no certifying official needed"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="2" width="18" height="20" rx="3" fill="white" opacity="0.9" />
                <polyline points="7 13 10 16 17 9" stroke={qualifiesSimplified ? '#22c55e' : '#9ca3af'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            isSelected={selected === 'simplified'}
            isDisabled={!qualifiesSimplified}
            onSelect={() => setSelected('simplified')}
            onPlayDescription={() => playCardDesc('simplified')}
          />
        </div>

        {/* Tap hint */}
        <p className="text-xs text-gray-300 text-center mb-8">
          Tap the 🔊 speaker icon on a card to hear more about that form
        </p>

        {/* Continue button */}
        <button
          onClick={() => onSelect(selected)}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm active:opacity-80 transition-opacity"
          style={{ background: '#1a6fe8' }}
        >
          Continue with {selected === 'simplified' ? 'Simplified' : 'Regular'} Form →
        </button>
      </div>
    </div>
  )
}
