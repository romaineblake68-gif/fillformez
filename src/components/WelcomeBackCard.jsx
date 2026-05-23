const CIRC = 56.55

export default function WelcomeBackCard({ progressLabel, progressPct, stepNum, stepOf, savedAtLabel, onResume, onStartFresh }) {
  return (
    <section className="px-4 pt-7 pb-2">
      <h2 className="text-black font-bold text-lg mb-1">Continue where you left off</h2>
      <p className="text-sm text-gray-400 mb-3 leading-snug">
        Pick up right where you stopped. We saved your progress.
      </p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
      >
        <div className="px-4 pt-4 pb-3 flex items-center gap-3">

          {/* Green progress ring */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#16a34a' }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              <circle
                cx="12" cy="12" r="9"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progressPct / 100)}
                transform="rotate(-90 12 12)"
              />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-black font-bold text-base leading-snug">Passport Application</p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#bbf7d0' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progressPct}%`, background: '#16a34a' }}
                />
              </div>
              <span className="text-xs font-bold flex-shrink-0" style={{ color: '#16a34a' }}>
                {progressPct}%
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {stepNum != null ? `Step ${stepNum} of ${stepOf} — ` : ''}{progressLabel} · {savedAtLabel}
            </p>
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={onResume}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white active:opacity-80 transition-opacity"
            style={{ background: '#16a34a' }}
          >
            Resume Form
          </button>
          <button
            onClick={onStartFresh}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-white text-gray-600 active:bg-gray-50 transition-colors"
            style={{ border: '1.5px solid #bbf7d0' }}
          >
            Start Fresh
          </button>
        </div>
      </div>
    </section>
  )
}
