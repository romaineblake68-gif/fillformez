function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function Row({ icon, label, value, onPress, danger }) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3.5 px-4 py-4 active:bg-gray-50 transition-colors text-left"
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: danger ? '#fff1f1' : '#f0fdf4' }}
      >
        {icon(danger)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
          {label}
        </p>
        {value && (
          <p className="text-sm font-semibold mt-0.5 truncate" style={{ color: '#0d1b38' }}>{value}</p>
        )}
      </div>
      {!danger && <ChevronRight />}
    </button>
  )
}

export default function ProfileScreen() {
  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* Avatar + name area */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-md"
          style={{ background: 'linear-gradient(135deg, #16a34a 0%, #0d3b1e 100%)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <p className="font-bold text-lg" style={{ color: '#0d1b38' }}>My Account</p>
      </div>

      {/* Divider */}
      <div className="h-2" style={{ background: '#f0fdf4' }} />

      {/* Account section */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 pt-4 pb-1">
          Account
        </p>

        <Row
          icon={() => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.6 19.79 19.79 0 0 1 1.61 3 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          )}
          label="Phone Number"
          value="Not set"
          onPress={() => {}}
        />

        <div style={{ height: 1, background: '#f0fdf4', marginLeft: '3.5rem' }} />

        <Row
          icon={() => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
          label="Security"
          value="Change PIN"
          onPress={() => {}}
        />
      </div>

      {/* Divider */}
      <div className="h-2 mt-2" style={{ background: '#f0fdf4' }} />

      {/* Logout */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 pt-4 pb-1">
          Session
        </p>
        <Row
          danger
          icon={() => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
          label="Log out"
          onPress={() => {}}
        />
      </div>

      {/* App version footer */}
      <div className="flex-1 flex items-end justify-center pb-6 pt-4">
        <p className="text-xs text-gray-300 font-medium">FillFormEZ v1.0</p>
      </div>
    </div>
  )
}
