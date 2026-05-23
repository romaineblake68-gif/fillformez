function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-JM', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function HistoryScreen({ completedForms = [] }) {
  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h2 className="text-xl font-bold" style={{ color: '#0d1b38' }}>Form History</h2>
        <p className="text-sm text-gray-400 mt-0.5">Your completed applications</p>
      </div>

      {/* List or empty state */}
      {completedForms.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: '#f0fdf4' }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p className="font-bold text-gray-800 text-lg text-center">
            No completed forms yet
          </p>
          <p className="text-sm text-gray-400 text-center mt-2 leading-relaxed">
            Once you finish a form application, it will appear here.
          </p>
        </div>
      ) : (
        <div className="flex-1 px-4 flex flex-col gap-3 pb-6">
          {completedForms.map((form, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 shadow-sm"
              style={{ background: '#f8fdf9', border: '1.5px solid #bbf7d0' }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base" style={{ color: '#0d1b38' }}>{form.name}</p>
                  {form.applicantName && (
                    <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>
                      {form.applicantName}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(form.completedAt)}</p>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#dcfce7' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <button
                className="w-full py-2.5 rounded-xl font-semibold text-sm active:opacity-80 transition-opacity"
                style={{ background: '#f0fdf4', color: '#16a34a' }}
              >
                View Summary
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
