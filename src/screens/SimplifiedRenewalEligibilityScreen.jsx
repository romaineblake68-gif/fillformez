import { useState } from 'react'
import { useSpeech } from '../hooks/useSpeech'

// ── Eligibility conditions from PICA instruction sheet ────────────────────────
// All 7 must pass for the simplified adult renewal form to apply.

const CHECKS = [
  {
    id: 'age',
    question: 'When you applied for your current passport, were you 18 years old or older?',
    hint: 'You must have been an adult (18+) at the time of your last application.',
    passOn: 'Yes',
    failMessage: 'You need to use the Regular Passport Application Form because you were under 18 when your current passport was issued.',
  },
  {
    id: 'sameDetails',
    question: 'Is your name, date of birth, and place of birth exactly the same now as on your current passport?',
    hint: 'Even a small difference — like a middle name that was added — means you cannot use this form.',
    passOn: 'Yes',
    failMessage: 'Your details have changed. You need to use the Regular Passport Application Form.',
  },
  {
    id: 'issuedAfter2001',
    question: 'Was your current passport issued after September 2001 and is it a 10-year passport?',
    hint: 'Look at your passport to check the issue date and the validity period.',
    passOn: 'Yes',
    failMessage: 'Your passport was issued before October 2001 or does not have 10-year validity. You need the Regular Passport Application Form.',
  },
  {
    id: 'timing',
    question: 'Is your passport valid for one year or less — or has it been expired for less than two years?',
    hint: 'This form can only be used when your passport is about to expire or just recently expired.',
    passOn: 'Yes',
    failMessage: 'Your passport still has more than one year of validity. You should wait until it is closer to expiry before renewing.',
  },
  {
    id: 'notDamaged',
    question: 'Is your passport in good condition — not damaged, torn, or written on?',
    passOn: 'Yes',
    failMessage: 'Because your passport is damaged, you need to use the Regular Passport Application Form.',
  },
  {
    id: 'notLostStolen',
    question: 'Has your passport always been in your possession — it was never lost or stolen?',
    passOn: 'Yes',
    failMessage: 'Because your passport was reported lost or stolen, you must use the Regular Passport Application Form.',
  },
  {
    id: 'sameMaritalStatus',
    question: 'Has your marital status stayed the same since your current passport was issued?',
    hint: 'For example, if you were single on your last passport and you are now married, your status changed.',
    passOn: 'Yes',
    failMessage: 'Your marital status has changed. You need to use the Regular Passport Application Form.',
  },
]

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ShieldCheck() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

// ── Not-eligible card ─────────────────────────────────────────────────────────

function NotEligibleCard({ message, onRegular, onBack }) {
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: '#fef2f2' }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-xl text-black mb-2">This form is not for you</h2>
        <p className="text-gray-500 text-sm leading-relaxed px-2">{message}</p>
      </div>

      <div
        className="w-full rounded-2xl px-4 py-4 flex items-start gap-3"
        style={{ background: '#fffbeb', border: '1.5px solid #fcd34d' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" />
        </svg>
        <p className="text-sm leading-relaxed" style={{ color: '#92400e' }}>
          FillFormEZ will guide you through the Regular Passport Application instead.
        </p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <button
          onClick={onRegular}
          className="w-full py-4 rounded-2xl font-bold text-white text-base active:opacity-80"
          style={{ background: '#16a34a' }}
        >
          Continue with Regular Form
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 font-semibold text-sm text-center active:opacity-60"
          style={{ color: '#6b7280' }}
        >
          Go Back
        </button>
      </div>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function SimplifiedRenewalEligibilityScreen({ onEligible, onNotEligible, onBack }) {
  const [step, setStep]           = useState(0)
  const [failMessage, setFailMessage] = useState(null)
  const { speak, stopSpeaking }   = useSpeech()

  const check = CHECKS[step]
  const progress = ((step) / CHECKS.length) * 100

  const handleAnswer = (ans) => {
    stopSpeaking()
    if (ans !== check.passOn) {
      setFailMessage(check.failMessage)
      setTimeout(() => speak(check.failMessage), 300)
      return
    }
    if (step === CHECKS.length - 1) {
      setTimeout(() => speak('Great news — you qualify for the Simplified Adult Renewal Form. Let us get started.'), 300)
      setTimeout(() => onEligible(), 1800)
    } else {
      setStep(s => s + 1)
      const next = CHECKS[step + 1]
      setTimeout(() => speak(next.question), 400)
    }
  }

  const handleBack = () => {
    stopSpeaking()
    if (failMessage) { setFailMessage(null); return }
    if (step === 0) { onBack(); return }
    setStep(s => s - 1)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
        >
          <ChevronLeft />
        </button>
        <p className="flex-1 text-xs font-semibold text-gray-400 text-center uppercase tracking-wide">
          Check Eligibility
        </p>
        <div className="w-9" />
      </div>

      {/* Progress bar */}
      {!failMessage && (
        <div className="px-4 pt-3 pb-1 bg-white">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-400">
              Question {step + 1} of {CHECKS.length}
            </span>
            <span className="text-xs font-bold" style={{ color: '#16a34a' }}>
              {Math.round(progress)}% checked
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: '#16a34a' }}
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-8 overflow-y-auto">

        {failMessage ? (
          <NotEligibleCard
            message={failMessage}
            onRegular={onNotEligible}
            onBack={() => { setFailMessage(null) }}
          />
        ) : (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}
              >
                <ShieldCheck />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-black font-bold text-xl text-center leading-snug mb-4">
              {check.question}
            </h2>

            {/* Hint */}
            {check.hint && (
              <div
                className="rounded-2xl px-4 py-3 mb-6"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <p className="text-sm text-gray-500 leading-relaxed text-center">{check.hint}</p>
              </div>
            )}

            {/* Yes / No */}
            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                onClick={() => handleAnswer('Yes')}
                className="w-full py-5 rounded-2xl font-bold text-xl text-white active:scale-95 transition-transform"
                style={{ background: '#16a34a' }}
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer('No')}
                className="w-full py-5 rounded-2xl font-bold text-xl border-2 active:scale-95 transition-transform"
                style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
