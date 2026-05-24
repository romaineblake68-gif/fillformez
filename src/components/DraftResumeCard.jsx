export default function DraftResumeCard({ formName, pct, savedAtLabel, onResume }) {
  return (
    <section className="px-4 pt-4 pb-2">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
      >
        <div className="px-4 pt-4 pb-3 flex items-center gap-3">

          {/* Document icon */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#16a34a' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-black font-bold text-base leading-snug">{formName}</p>

            {/* Progress bar — only shown if pct is available */}
            {pct != null && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#bbf7d0' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: '#16a34a' }}
                  />
                </div>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: '#16a34a' }}>
                  {pct}%
                </span>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-1">
              {pct != null ? 'In progress' : 'Draft saved'}
              {savedAtLabel ? ` · ${savedAtLabel}` : ''}
            </p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={onResume}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-white active:opacity-80 transition-opacity"
            style={{ background: '#16a34a' }}
          >
            Resume
          </button>
        </div>
      </div>
    </section>
  )
}
