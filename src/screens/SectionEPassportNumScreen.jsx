import { useState, useEffect, useRef } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const QUESTION_SPEECH =
  'What is your passport number? The letter A has already been filled in for you. Please type just the digits that follow. You will find the full number on the photo page of your passport.'

const DIGIT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

// Speak each character individually: letters by letter name, digits as words.
// Hyphens are stripped so TTS never says "minus".
function buildReadback(num) {
  return String(num)
    .toUpperCase()
    .split('')
    .filter(c => /[A-Z0-9]/.test(c))
    .map(c => /\d/.test(c) ? DIGIT_WORDS[parseInt(c, 10)] : c)
    .join(' ')
}

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

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function SectionEPassportNumScreen({ onConfirm, onBack }) {
  // 'A' is always the fixed first character — user types only the digits after it
  const [value, setValue] = useState('A')
  const [phase, setPhase] = useState('entry') // 'entry' | 'confirming'
  const inputRef = useRef(null)
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(QUESTION_SPEECH)
      setTimeout(() => inputRef.current?.focus(), 600)
    }, 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const replay = () => {
    stopSpeaking()
    setTimeout(() => speak(QUESTION_SPEECH), 80)
  }

  const handleChange = (e) => {
    let v = e.target.value.toUpperCase()
    // Always enforce the 'A' prefix — if the user deletes it, restore it
    if (!v.startsWith('A')) v = 'A' + v
    setValue(v)
  }

  // Has the user typed at least one digit after 'A'?
  const hasDigits = value.trim().length > 1

  const handleSubmit = () => {
    if (!hasDigits) return
    const trimmed = value.trim().replace(/-/g, '')
    setPhase('confirming')
    stopSpeaking()
    const readback = buildReadback(trimmed)
    setTimeout(() => speak(`Your passport number is: ${readback}. Is that correct?`), 300)
  }

  const handleConfirmYes = () => {
    // Strip any stray hyphens before saving
    onConfirm(value.trim().replace(/-/g, ''))
  }

  const handleConfirmNo = () => {
    setPhase('entry')
    stopSpeaking()
    setTimeout(() => speak(QUESTION_SPEECH), 200)
    setTimeout(() => inputRef.current?.focus(), 400)
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
          Section E — Declaration
        </p>
        <button
          onClick={replay}
          aria-label="Read question aloud"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
          style={{ background: '#eef4fd' }}
        >
          <SpeakerIcon />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="px-4 pt-3 pb-2 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Passport number</span>
          <span className="text-xs font-bold" style={{ color: '#1a6fe8' }}>Section E</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: '50%', background: '#1a6fe8' }} />
        </div>
      </div>

      {/* Main body */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-6 overflow-y-auto">

        <h2 className="text-black font-bold text-2xl leading-snug text-center mb-3">
          What is your passport number?
        </h2>
        <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
          You will find this on the photo page of your passport.
        </p>

        {phase === 'entry' ? (
          <>
            {/* Input — 'A' is pre-filled and always kept */}
            <div
              className="w-full rounded-2xl border-2 overflow-hidden transition-colors mb-2"
              style={{ borderColor: hasDigits ? '#1a6fe8' : '#e5e7eb' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className="w-full px-5 py-5 text-xl font-bold text-center tracking-widest bg-white outline-none text-black"
              />
            </div>

            <p className="text-xs text-gray-300 text-center mb-10">
              The letter A is already there — type the digits that follow
            </p>

            <button
              onClick={handleSubmit}
              disabled={!hasDigits}
              className="w-full py-4 rounded-2xl font-bold text-base shadow-sm transition-opacity active:opacity-80"
              style={{
                background: hasDigits ? '#1a6fe8' : '#e5e7eb',
                color: hasDigits ? 'white' : '#9ca3af',
              }}
            >
              Confirm →
            </button>
          </>
        ) : (
          /* Confirmation phase — read-back and verify */
          <div className="flex flex-col items-center gap-5 w-full">
            <div
              className="w-full rounded-2xl px-5 py-6 text-center"
              style={{ background: '#eef4fd' }}
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Your passport number
              </p>
              <p className="text-3xl font-bold text-black tracking-widest">
                {value.trim().replace(/-/g, '')}
              </p>
            </div>

            <p className="text-black font-semibold text-lg text-center">
              Is this correct?
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleConfirmNo}
                className="flex-1 py-4 rounded-2xl font-bold text-base border-2 border-gray-200 text-gray-600 bg-white active:bg-gray-50 transition-colors"
              >
                No, re-enter
              </button>
              <button
                onClick={handleConfirmYes}
                className="flex-1 py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 active:opacity-80"
                style={{ background: '#1a6fe8' }}
              >
                <CheckIcon />
                Yes!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
