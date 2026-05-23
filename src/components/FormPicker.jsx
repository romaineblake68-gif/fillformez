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
  return (
    <>
      {/* ── Available Forms ──────────────────────────────────────────── */}
      <section id="home-forms" className="px-4 pt-7 pb-2">
        <h2 className="text-black font-bold text-lg mb-1">Available Forms</h2>
        <p className="text-sm text-gray-400 mb-4">Choose a form to get started.</p>

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
