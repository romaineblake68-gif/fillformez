function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-JM', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatSavedAt(ts) {
  if (!ts) return null
  const diffMs = Date.now() - ts
  const mins = Math.floor(diffMs / 60000)
  if (mins < 2) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Infer icon type from form id or name string
function resolveIconType(idOrName = '') {
  const s = idOrName.toLowerCase()
  if (s === 'passport' || s.includes('passport')) return 'passport'
  if (s === 'trn' || s.includes('trn')) return 'trn'
  return 'nis'
}

function FormIcon({ type }) {
  if (type === 'passport') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="2" width="18" height="20" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <line x1="7" y1="16" x2="17" y2="16" />
        <line x1="7" y1="19" x2="13" y2="19" />
      </svg>
    )
  }
  if (type === 'trn') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
        <line x1="14" y1="15" x2="16" y2="15" />
      </svg>
    )
  }
  // NIS / generic document
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function InProgressCard({ form, onResume }) {
  const iconType = resolveIconType(form.id)
  const savedAtLabel = formatSavedAt(form.savedAt)

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#fff', border: '1.5px solid #bbf7d0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
    >
      {/* Title row */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#f0fdf4' }}
        >
          <FormIcon type={iconType} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-base leading-snug" style={{ color: '#0d1b38' }}>
              {form.name}
            </p>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#fef9c3', color: '#854d0e' }}
            >
              In Progress
            </span>
          </div>
          {form.label && (
            <p className="text-xs text-gray-400 mt-0.5">{form.label}</p>
          )}
          {savedAtLabel && (
            <p className="text-xs text-gray-400 mt-0.5">Saved {savedAtLabel}</p>
          )}
        </div>
      </div>

      {/* Progress bar — shown for all forms when pct is available */}
      {form.pct != null && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs font-bold" style={{ color: '#16a34a' }}>{form.pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${form.pct}%`,
                background: 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Resume button */}
      <button
        onClick={() => onResume?.(form.id)}
        className="w-full py-3 rounded-xl font-bold text-sm text-white active:opacity-80 transition-opacity flex items-center justify-center gap-2"
        style={{ background: '#16a34a' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Resume
      </button>
    </div>
  )
}

function CompletedCard({ form }) {
  const iconType = resolveIconType(form.name)

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#f8fdf9', border: '1.5px solid #bbf7d0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#dcfce7' }}
        >
          <FormIcon type={iconType} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-base leading-snug" style={{ color: '#0d1b38' }}>{form.name}</p>
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: '#dcfce7' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-xs font-bold" style={{ color: '#15803d' }}>Completed</span>
            </div>
          </div>
          {form.applicantName && (
            <p className="text-sm font-semibold mt-0.5" style={{ color: '#16a34a' }}>{form.applicantName}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(form.completedAt)}</p>
        </div>
      </div>

      <button
        className="w-full py-2.5 rounded-xl font-semibold text-sm active:opacity-80 transition-opacity"
        style={{ background: '#f0fdf4', color: '#16a34a' }}
      >
        View Summary
      </button>
    </div>
  )
}

export default function HistoryScreen({
  completedForms = [],
  inProgressForms = [],
  onResume,
  onStartForm,
}) {
  const hasAnything = completedForms.length > 0 || inProgressForms.length > 0

  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <h2 className="text-xl font-bold" style={{ color: '#0d1b38' }}>Form History</h2>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          Your forms are saved on this device.
        </p>
      </div>

      {!hasAnything ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ background: '#f0fdf4' }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p className="font-bold text-gray-800 text-xl text-center">No forms yet</p>
          <p className="text-sm text-gray-400 text-center mt-2 leading-relaxed" style={{ maxWidth: 260 }}>
            Your completed and in-progress forms will appear here.
          </p>
          <button
            onClick={onStartForm}
            className="mt-8 px-8 py-3.5 rounded-2xl font-bold text-white text-sm active:opacity-80 transition-opacity shadow-sm"
            style={{ background: '#16a34a' }}
          >
            Start a Form
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-8">

          {/* In Progress section */}
          {inProgressForms.length > 0 && (
            <div className="mt-4 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                In Progress
              </p>
              <div className="flex flex-col gap-3">
                {inProgressForms.map(form => (
                  <InProgressCard key={form.id} form={form} onResume={onResume} />
                ))}
              </div>
            </div>
          )}

          {/* Completed section */}
          {completedForms.length > 0 && (
            <div className={`${inProgressForms.length > 0 ? '' : 'mt-4 '}mb-5`}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Completed
              </p>
              <div className="flex flex-col gap-3">
                {completedForms.map((form, i) => (
                  <CompletedCard key={i} form={form} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
