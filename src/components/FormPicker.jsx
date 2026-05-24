import { useState } from 'react'

// ── How It Works modal ────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    heading: 'Speak or type your answers',
    body: 'Each question appears one at a time. You can tap the microphone and say your answer, or type it yourself.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2" fill="none" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    heading: 'Check your answers before printing',
    body: 'After every answer you get a chance to confirm it or change it. Nothing is saved until you say it is correct.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    heading: 'FillFormEZ does not submit forms online',
    body: 'When you finish, you print or download the completed form and take it to the office yourself. FillFormEZ does not send it anywhere.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    ),
  },
  {
    heading: 'Your progress is saved automatically',
    body: 'If you stop halfway, your answers are saved on your phone. Come back anytime and continue from where you left off.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
  },
]

function HowItWorksModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(13,27,56,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl px-6 pt-5 pb-10 bg-white overflow-y-auto"
        style={{ maxWidth: 430, maxHeight: '85dvh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1.5 rounded-full mx-auto mb-5 bg-gray-200" />

        <h2 className="font-bold text-xl mb-1" style={{ color: '#0d1b38' }}>How FillFormEZ works</h2>
        <p className="text-sm text-gray-400 mb-5">Simple. Private. Step by step.</p>

        <div className="flex flex-col gap-4 mb-7">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.heading}
              className="flex items-start gap-4 px-4 py-4 rounded-2xl"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'white' }}
              >
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-black leading-snug">{item.heading}</p>
                <p className="text-gray-500 text-sm mt-0.5 leading-snug">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-bold text-white text-base active:opacity-80"
          style={{ background: '#16a34a' }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}

const DIFFICULTY = {
  Easy:   { bg: '#dcfce7', color: '#15803d' },
  Medium: { bg: '#fef9c3', color: '#854d0e' },
}

const FORMS = [
  {
    id: 'passport',
    title: 'Passport Application',
    description: 'Apply for a Jamaican passport or renew your current one.',
    difficulty: 'Medium',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="2" width="24" height="28" rx="3" fill="#16a34a" />
        <circle cx="16" cy="13" r="5" fill="white" />
        <rect x="9" y="21" width="14" height="2" rx="1" fill="white" opacity="0.8" />
        <rect x="11" y="24.5" width="10" height="1.5" rx="0.75" fill="white" opacity="0.55" />
      </svg>
    ),
  },
  {
    id: 'trn',
    title: 'TRN Application',
    description: 'Get your Tax Registration Number (TRN) easily.',
    difficulty: 'Easy',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="2" width="24" height="28" rx="3" fill="#16a34a" />
        <rect x="9" y="8" width="14" height="2" rx="1" fill="white" />
        <rect x="9" y="13" width="10" height="2" rx="1" fill="white" opacity="0.75" />
        <rect x="9" y="18" width="12" height="2" rx="1" fill="white" opacity="0.75" />
        <rect x="9" y="23" width="8" height="2" rx="1" fill="white" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'nis',
    title: 'NIS Registration',
    description: 'Register for the National Insurance Scheme.',
    difficulty: 'Medium',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="2" width="24" height="28" rx="3" fill="#16a34a" />
        <path d="M16 7 L21 12 L16 17 L11 12 Z" fill="white" opacity="0.95" />
        <rect x="10" y="19.5" width="12" height="2" rx="1" fill="white" opacity="0.8" />
        <rect x="12" y="23" width="8" height="1.5" rx="0.75" fill="white" opacity="0.55" />
      </svg>
    ),
  },
]

const BENEFITS = [
  {
    title: 'Simple explanations',
    desc: 'We use everyday language you understand.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Step-by-step guidance',
    desc: 'One question at a time. No stress.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'Less confusion',
    desc: 'Clear help so you make fewer mistakes.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
      </svg>
    ),
  },
  {
    title: 'Save progress & continue later',
    desc: 'Your progress is saved automatically.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
  },
  {
    title: 'Works on your phone',
    desc: 'Anywhere, anytime. Mobile friendly.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
      </svg>
    ),
  },
]

export default function FormPicker({ onSelect }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  return (
    <>
      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}

      {/* ── Available Forms ──────────────────────────────────────────── */}
      <section id="home-forms" className="px-4 pt-7 pb-2">

        {/* Section header row */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-black font-bold text-lg">Available Forms</h2>
          <button
            onClick={() => setShowHowItWorks(true)}
            className="text-xs font-semibold active:opacity-60 transition-opacity"
            style={{ color: '#16a34a' }}
          >
            How it works
          </button>
        </div>

        {/* Privacy trust strip */}
        <div className="flex items-start gap-2 mb-4">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-xs text-gray-400 leading-snug">
            Your information stays on your phone unless you choose to share or print it.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FORMS.map((form) => {
            const diff = DIFFICULTY[form.difficulty]
            return (
              <button
                key={form.id}
                onClick={() => onSelect?.(form.id)}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left bg-white active:scale-98 transition-all"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1.5px solid #f0fdf4' }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#f0fdf4' }}
                >
                  {form.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base text-black leading-snug">{form.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5 leading-snug">{form.description}</p>
                  <span
                    className="inline-block mt-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: diff.bg, color: diff.color }}
                  >
                    {form.difficulty}
                  </span>
                </div>

                {/* Arrow */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────── */}
      <section id="home-benefits" className="px-4 pt-8 pb-4">
        <h2 className="text-black font-bold text-lg mb-1">Why people use FillFormEZ</h2>
        <p className="text-sm text-gray-400 mb-4">Simple help for every step of the process.</p>

        <div className="flex flex-col gap-3">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-4 px-4 py-4 rounded-2xl bg-white"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1.5px solid #f0fdf4' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#f0fdf4' }}
              >
                {b.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-black">{b.title}</p>
                <p className="text-gray-400 text-sm mt-0.5 leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom trust line ────────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-8 text-center">
        <p className="text-gray-500 text-sm font-medium leading-relaxed">
          No big words. No pressure.
          <br />
          Just simple help, step by step.
        </p>
        <p className="text-xs font-semibold mt-2" style={{ color: '#16a34a' }}>
          Built for Jamaicans. By Jamaicans.
        </p>
      </div>
    </>
  )
}
