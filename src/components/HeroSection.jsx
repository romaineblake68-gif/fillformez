const TRUST_BADGES = [
  { icon: '🔒', label: 'Secure' },
  { icon: '🔐', label: 'Private' },
  { icon: '🇯🇲', label: 'Jamaican friendly' },
]

export default function HeroSection({ onGetStarted }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section style={{ background: 'linear-gradient(160deg, #0d1b38 0%, #0d3b1e 100%)' }}>

      {/* ── Hero text ─────────────────────────────────────────────────── */}
      <div className="px-5 pt-10 pb-8 flex flex-col items-center text-center">

        <h1 className="text-white font-bold leading-tight mb-4 px-1" style={{ fontSize: '27px', lineHeight: 1.25 }}>
          Government forms made easier for{' '}
          <span style={{ color: '#FFD100' }}>Jamaicans</span>
        </h1>

        <p className="leading-relaxed mb-7 px-2" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '15px' }}>
          FillFormEZ helps you complete forms step by step using simple language and guided questions.
        </p>

        {/* CTA buttons */}
        <div className="w-full flex flex-col gap-3 mb-5">
          <button
            onClick={() => scrollTo('home-forms')}
            className="w-full py-4 rounded-2xl font-bold text-base shadow-lg active:scale-95 transition-transform"
            style={{ background: '#FFD100', color: '#0d1b38' }}
          >
            Start a Form
          </button>
          <button
            onClick={() => scrollTo('home-benefits')}
            className="w-full py-3.5 rounded-2xl font-semibold text-base text-white active:bg-white/10 transition-colors"
            style={{ border: '2px solid rgba(255,255,255,0.35)' }}
          >
            See How It Works
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {TRUST_BADGES.map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.82)' }}
            >
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── App preview card ──────────────────────────────────────────── */}
      <div className="px-5 pb-8 flex flex-col items-center">
        <div
          className="w-full rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.45)' }}
        >
          {/* Progress header strip */}
          <div className="px-5 pt-4 pb-4" style={{ background: '#0d1b38' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Passport Application
              </span>
              <span className="text-xs font-bold" style={{ color: '#22c55e' }}>25% complete</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <div className="h-full rounded-full" style={{ width: '25%', background: '#22c55e' }} />
            </div>
          </div>

          {/* Question content */}
          <div className="px-5 py-5 bg-white">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9ca3af' }}>
              Question 3 of 12
            </p>
            <p className="font-bold text-black leading-snug mb-4" style={{ fontSize: '18px' }}>
              What is your first name?
            </p>

            {/* Answer card */}
            <div
              className="rounded-xl px-4 py-3 mb-4"
              style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
            >
              <p className="text-xs font-semibold text-gray-400 mb-0.5">You said</p>
              <p className="font-bold text-black" style={{ fontSize: '22px' }}>Michael</p>
            </div>

            {/* Yes / Redo buttons */}
            <div className="flex gap-2 mb-4">
              <button
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-1.5"
                style={{ background: '#16a34a' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Yes!
              </button>
              <button className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-gray-500 bg-gray-100">
                No, redo
              </button>
            </div>

            {/* Labels */}
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-400">One question at a time</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: '#16a34a' }}>You've got this! 🎉</p>
            </div>
          </div>
        </div>

        {/* Yuh Got This badge */}
        <div
          className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm"
          style={{ background: '#FFD100', color: '#0d1b38' }}
        >
          🇯🇲 Yuh Got This!
        </div>
      </div>

    </section>
  )
}
