import { useState, useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import { SECTION_A_QUESTIONS, SECTION_A_BASE_COUNT, SKIP } from '../data/passportFlow'
import { MIC_PROMPT, SKIP_LABEL, TYPING_TIP, NEARLY_DONE_MSG, NEARLY_DONE_PCT } from '../utils/messages'
import { normalizeTranscript } from '../utils/normalizeTranscript'
import { isMuted, persistMute } from '../utils/muteState'

// ── Inline icons ──────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="white">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
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

function MutedSpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#6b7280" />
      <line x1="23" y1="9" x2="17" y2="15" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="9" x2="23" y2="15" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
    </svg>
  )
}

function SendIcon({ active }) {
  const c = active ? 'white' : '#9ca3af'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <line x1="22" y1="2" x2="11" y2="13" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill={c} />
    </svg>
  )
}

// ── Text fallback input (always visible below the mic) ────────────────────────

function TextFallback({ onSubmit }) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (trimmed) {
      onSubmit(trimmed)
      setText('')
    }
  }

  return (
    <div className="w-full mt-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-300 font-medium">or type below</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <div
        className="flex items-center rounded-2xl overflow-hidden border-2 transition-colors"
        style={{ borderColor: text ? '#16a34a' : '#e5e7eb' }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Type your answer here"
          className="flex-1 px-4 py-3.5 text-base bg-white outline-none text-black placeholder-gray-300"
        />
        <button
          onClick={handleSubmit}
          aria-label="Submit typed answer"
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center mr-1 rounded-xl transition-colors"
          style={{ background: text.trim() ? '#16a34a' : '#f3f4f6' }}
        >
          <SendIcon active={!!text.trim()} />
        </button>
      </div>
      <p className="text-xs font-semibold text-center mt-1.5" style={{ color: '#f59e0b' }}>
        {TYPING_TIP}
      </p>
    </div>
  )
}

// ── Hint bottom sheet ─────────────────────────────────────────────────────────

function HintSheet({ hint, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-[430px] mx-auto px-6 pt-5 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5 bg-gray-200" />
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: '#f0fdf4' }}
        >
          <HelpIcon />
        </div>
        <p className="text-black font-bold text-lg mb-3">What this means</p>
        <p className="text-gray-600 text-base leading-relaxed">{hint}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full py-4 rounded-2xl font-bold text-white text-base active:opacity-80"
          style={{ background: '#16a34a' }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}

// ── Yes/No buttons ────────────────────────────────────────────────────────────

function YesNoButtons({ onSelect }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={() => onSelect('Yes')}
        className="w-full py-6 rounded-2xl font-bold text-xl active:scale-95 transition-transform"
        style={{ background: '#16a34a', color: 'white' }}
      >
        Yes
      </button>
      <button
        onClick={() => onSelect('No')}
        className="w-full py-6 rounded-2xl font-bold text-xl active:scale-95 transition-transform border-2"
        style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}
      >
        No
      </button>
    </div>
  )
}

// ── Choice grid ───────────────────────────────────────────────────────────────

function ChoiceGrid({ options, onSelect, speak }) {
  const cols = options.length <= 2 ? 'grid-cols-1' : options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
  const py = options.length > 4 ? 'py-4' : 'py-6'
  const textSize = options.length > 4 ? 'text-sm' : 'text-lg'

  const handleTap = (opt) => {
    speak?.(opt)
    onSelect(opt)
  }

  return (
    <div className={`grid ${cols} gap-2.5 w-full`}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => handleTap(opt)}
          className={`${py} ${textSize} rounded-2xl font-bold active:scale-95 transition-transform text-center`}
          style={{ background: '#16a34a', color: 'white' }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ── Confirmation card ─────────────────────────────────────────────────────────

function ConfirmCard({ value, onChange, onYes, onNo, hint, savedHint }) {
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="w-full rounded-2xl px-5 pt-5 pb-4 text-center" style={{ background: '#f0fdf4' }}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your answer</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full text-3xl font-bold text-black leading-tight text-center bg-transparent outline-none"
          style={{
            borderBottom: '2px solid #bbf7d0',
            paddingBottom: 4,
            wordBreak: 'break-word',
          }}
          autoCapitalize="words"
          autoCorrect="off"
          spellCheck={false}
        />
        <p className="text-xs text-gray-400 mt-2">Tap to edit spelling</p>
        {savedHint && (
          <p className="text-xs font-semibold mt-3 rounded-lg px-3 py-2" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
            {savedHint}
          </p>
        )}
        {hint && (
          <p className="text-xs font-semibold mt-3 rounded-lg px-3 py-2" style={{ background: '#fffbeb', color: '#92400e' }}>
            {hint}
          </p>
        )}
      </div>
      <p className="text-black font-semibold text-lg text-center">Is this correct?</p>
      <div className="flex gap-3 w-full">
        <button
          onClick={onNo}
          className="flex-1 py-4 rounded-2xl font-bold text-base border-2 border-gray-200 text-gray-600 bg-white active:bg-gray-50 transition-colors"
        >
          No, redo
        </button>
        <button
          onClick={onYes}
          className="flex-1 py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 active:opacity-80"
          style={{ background: '#16a34a' }}
        >
          <CheckIcon />
          Yes!
        </button>
      </div>
    </div>
  )
}

// ── Main QuestionScreen ───────────────────────────────────────────────────────

export default function QuestionScreen({ questionId, questions = SECTION_A_QUESTIONS, baseCount = SECTION_A_BASE_COUNT, onAnswer, onBack, onHome, answers = {} }) {
  const question = questions[questionId]
  // Spoken text may differ from displayed text (e.g. "N I S" vs "NIS").
  const qSpeech = question.speechText ?? question.text

  const [phase, setPhase] = useState('question') // 'question' | 'recording' | 'confirming'
  const [transcript, setTranscript] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [micError, setMicError] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [redoCount, setRedoCount] = useState(0)
  const [mutedState, setMutedState] = useState(() => isMuted())
  const [nameCorrected, setNameCorrected] = useState(false)
  const [preFilledHint, setPreFilledHint] = useState(false)

  const {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    isListening,
    isSpeechRecognitionSupported,
  } = useSpeech()

  // ── Mute toggle ───────────────────────────────────────────────────────────

  const toggleMute = () => {
    const next = !mutedState
    persistMute(next)
    setMutedState(next)
    if (next) {
      stopSpeaking()
    } else {
      setTimeout(() => speak(qSpeech), 100)
    }
  }

  // ── Shared helper: transition to confirming and optionally speak it ────────

  const goToConfirming = (text, shouldSpeak) => {
    stopSpeaking()
    setValidationError(null)
    const value = question.transform === 'titleCase'
      ? text.replace(/\b\w/g, c => c.toUpperCase())
      : text
    setTranscript(value)
    setPhase('confirming')
    if (shouldSpeak) {
      const spokenText = question.toSpeech ? question.toSpeech(value) : value
      setTimeout(() => speak(`You said: ${spokenText}. Is this correct?`), 350)
    }
  }

  // ── Reset and auto-speak when question changes ────────────────────────────

  useEffect(() => {
    setMicError(null)
    setShowHint(false)
    setValidationError(null)
    setRedoCount(0)
    setNameCorrected(false)

    // Profile autofill: if this question already has an answer pre-loaded from the
    // user's saved profile, jump straight to confirming so they can review it.
    const prefilled = answers[question.id]
    if (prefilled && prefilled !== SKIP) {
      const value = question.transform === 'titleCase'
        ? prefilled.replace(/\b\w/g, c => c.toUpperCase())
        : prefilled
      setPreFilledHint(true)
      setPhase('confirming')
      setTranscript(value)
      const spokenText = question.toSpeech ? question.toSpeech(value) : value
      const timer = setTimeout(
        () => speak(`${qSpeech}. I have ${spokenText} for you. Is that correct?`),
        550,
      )
      return () => { clearTimeout(timer); stopSpeaking(); stopListening() }
    }

    setPreFilledHint(false)

    if (question.defaultValue) {
      // Pre-fill confirming with default value; speak a different message
      setPhase('confirming')
      setTranscript(question.defaultValue)
      const msg = `${qSpeech}. I have filled in ${question.defaultValue} for you. Is that correct?`
      const timer = setTimeout(() => speak(msg), 550)
      return () => { clearTimeout(timer); stopSpeaking(); stopListening() }
    }

    setPhase('question')
    setTranscript('')
    const timer = setTimeout(() => speak(qSpeech), 550)
    return () => { clearTimeout(timer); stopSpeaking(); stopListening() }
  }, [question.id])

  // ── Voice recording ───────────────────────────────────────────────────────

  const handleMicPress = () => {
    if (isListening) {
      stopListening()
      setPhase('question')
      return
    }
    stopSpeaking()
    setMicError(null)
    setPhase('recording')

    startListening(
      (text) => {
        const normalized = normalizeTranscript(text, question)
        const isNameQ = /name|surname/i.test(question.id)
        setNameCorrected(isNameQ && normalized.toLowerCase() !== text.toLowerCase().trim())
        goToConfirming(normalized, true)
      },
      (err) => {
        setPhase('question')
        if (err === 'not-allowed') setMicError('Microphone access was denied. Please allow it in your browser settings.')
        else if (err === 'no-speech') setMicError('No speech detected. Please tap the mic and try again.')
        else if (err === 'not-supported') setMicError('Voice input works best in Google Chrome. Please open this app in Chrome.')
        else setMicError('Could not hear you clearly. Please try again.')
      },
    )
  }

  // ── Choice / yesno / typed text selection ────────────────────────────────

  const handleChoiceSelect = (option) => {
    setNameCorrected(false)
    goToConfirming(option, true)
  }

  const handleTypedSubmit = (text) => {
    setNameCorrected(false)
    goToConfirming(text, true)
  }

  // ── Confirmation ─────────────────────────────────────────────────────────

  const handleConfirmYes = () => {
    if (question.validate) {
      const err = question.validate(transcript)
      if (err) {
        setValidationError(err)
        return
      }
    }
    onAnswer(question.id, transcript)
  }

  const handleConfirmNo = () => {
    setValidationError(null)
    setNameCorrected(false)
    setPreFilledHint(false)
    setRedoCount(c => c + 1)
    setPhase('question')
    setTranscript('')
    setTimeout(() => speak(qSpeech), 200)
  }

  // ── Skip ─────────────────────────────────────────────────────────────────

  const handleSkip = () => onAnswer(question.id, SKIP)

  // ── Replay question ───────────────────────────────────────────────────────

  const handleReplay = () => {
    stopSpeaking()
    setTimeout(() => speak(qSpeech), 80)
  }

  // ── Hint ─────────────────────────────────────────────────────────────────

  const handleShowHint = () => {
    if (!question.hint) return
    setShowHint(true)
    speak(question.hintSpeech ?? question.hint)
  }

  const handleCloseHint = () => {
    stopSpeaking()
    setShowHint(false)
    setTimeout(() => speak(qSpeech), 200)
  }

  // ── Progress ──────────────────────────────────────────────────────────────

  const progressPct = (question.base / baseCount) * 100

  // ── Render ────────────────────────────────────────────────────────────────

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

        {onHome ? (
          <button
            onClick={onHome}
            aria-label="Return to home"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 active:opacity-60 transition-opacity"
          >
            <div className="flex items-center gap-0.5">
              <span className="text-sm font-bold text-black leading-none">FillForm</span>
              <span
                className="text-sm font-bold text-white px-1 py-0.5 rounded leading-none"
                style={{ background: '#16a34a' }}
              >EZ</span>
            </div>
            <span className="text-xs text-gray-400 leading-tight truncate max-w-full px-1">
              {question.section}
            </span>
          </button>
        ) : (
          <p className="flex-1 text-xs font-semibold text-gray-400 text-center leading-tight px-1 truncate">
            {question.section}
          </p>
        )}

        <button
          onClick={toggleMute}
          aria-label={mutedState ? 'Unmute audio' : 'Mute audio'}
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
          style={{ background: mutedState ? '#f3f4f6' : '#f0fdf4' }}
        >
          {mutedState ? <MutedSpeakerIcon /> : <SpeakerIcon />}
        </button>

        <button
          onClick={handleReplay}
          aria-label="Read question aloud"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
          style={{ background: '#f0fdf4' }}
        >
          <SpeakerIcon />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3 pb-2 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">
            Question {question.base} of {baseCount}
          </span>
          <span className="text-xs font-bold" style={{ color: '#16a34a' }}>
            {progressPct >= NEARLY_DONE_PCT ? NEARLY_DONE_MSG : `${Math.round(progressPct)}% complete`}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: '#16a34a' }}
          />
        </div>
      </div>

      {/* Main body */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-4 overflow-y-auto">

        {/* Question text */}
        <h2 className="text-black font-bold text-2xl leading-snug text-center mb-8">
          {question.text}
        </h2>

        {/* ── VOICE: idle ───────────────────────────────────────────────── */}
        {phase === 'question' && question.type === 'voice' && (
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Mic button */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full opacity-10"
                style={{ width: 140, height: 140, background: '#16a34a' }}
              />
              <button
                onClick={handleMicPress}
                aria-label="Tap to speak your answer"
                className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                style={{ background: '#16a34a' }}
              >
                <MicIcon />
              </button>
            </div>
            <p className="text-gray-400 text-base font-medium">{MIC_PROMPT}</p>

            {!isSpeechRecognitionSupported && (
              <p className="text-amber-600 text-sm text-center bg-amber-50 rounded-xl px-4 py-3 w-full">
                Voice input works best in Google Chrome. Please open this app in Chrome.
              </p>
            )}
            {micError && (
              <p className="text-red-500 text-sm text-center bg-red-50 rounded-xl px-4 py-3 w-full">
                {micError}
              </p>
            )}

            {redoCount >= 2 && (
              <p className="text-sm text-center font-semibold rounded-xl px-4 py-3 w-full" style={{ background: '#fffbeb', color: '#92400e' }}>
                Looks like the mic is not catching that clearly. You can type the correct spelling below.
              </p>
            )}

            {/* Text fallback — always visible */}
            <TextFallback key={question.id} onSubmit={handleTypedSubmit} />

            {question.canSkip && (
              <button
                onClick={handleSkip}
                className="text-gray-400 font-semibold text-sm underline underline-offset-2 active:opacity-60 mt-1"
              >
                {SKIP_LABEL}
              </button>
            )}
          </div>
        )}

        {/* ── VOICE: recording ─────────────────────────────────────────── */}
        {phase === 'recording' && (
          <div className="flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center">
              <span
                className="absolute rounded-full animate-ping"
                style={{ width: 140, height: 140, background: '#16a34a', opacity: 0.12 }}
              />
              <span
                className="absolute rounded-full animate-ping"
                style={{ width: 116, height: 116, background: '#16a34a', opacity: 0.18, animationDelay: '0.15s' }}
              />
              <button
                onClick={handleMicPress}
                aria-label="Stop recording"
                className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
                style={{ background: '#16a34a' }}
              >
                <div className="w-9 h-9 rounded-xl bg-white" />
              </button>
            </div>
            <p className="text-base font-bold animate-pulse" style={{ color: '#16a34a' }}>
              Listening…
            </p>
            <p className="text-gray-400 text-sm">Tap the button to stop</p>
          </div>
        )}

        {/* ── YES/NO buttons ────────────────────────────────────────────── */}
        {phase === 'question' && question.type === 'yesno' && (
          <YesNoButtons onSelect={handleChoiceSelect} />
        )}

        {/* ── CHOICE grid ───────────────────────────────────────────────── */}
        {phase === 'question' && question.type === 'choice' && (
          <ChoiceGrid
            options={question.getOptions ? question.getOptions(answers) : question.options}
            onSelect={handleChoiceSelect}
            speak={speak}
          />
        )}

        {/* ── CONFIRMING ───────────────────────────────────────────────── */}
        {phase === 'confirming' && (
          <>
            <ConfirmCard
              value={transcript}
              onChange={setTranscript}
              onYes={handleConfirmYes}
              onNo={handleConfirmNo}
              hint={nameCorrected ? 'Mic may not have caught the name clearly. Please check the spelling.' : undefined}
              savedHint={preFilledHint ? 'From your saved profile. Tap to change if needed.' : undefined}
            />
            {validationError && (
              <div className="mt-4 px-4 py-3 rounded-xl text-sm font-semibold text-center" style={{ background: '#fef2f2', color: '#dc2626' }}>
                {validationError}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer: "What does this mean?" — hidden during confirming or when no hint */}
      {phase !== 'confirming' && question.hint && (
        <div className="px-5 pb-8 pt-2 bg-white">
          <button
            onClick={handleShowHint}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm active:opacity-80 transition-opacity"
            style={{ background: '#1e293b', color: '#FFD700' }}
          >
            <HelpIcon />
            What does this mean?
          </button>
        </div>
      )}

      {/* Hint sheet */}
      {showHint && <HintSheet hint={question.hint} onClose={handleCloseHint} />}
    </div>
  )
}
