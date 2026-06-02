export default function TopNavBar() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
      {/* Logo + tagline */}
      <div className="flex flex-col gap-0">
        <div className="flex items-center gap-0.5">
          <span className="text-xl font-bold text-black">Fill</span>
          <span className="text-xl font-bold text-black">Form</span>
          <span
            className="text-xl font-bold text-white px-1.5 py-0.5 rounded-md leading-tight"
            style={{ backgroundColor: '#16a34a' }}
          >
            EZ
          </span>
        </div>
        <p className="text-xs font-semibold leading-none mt-0.5" style={{ color: '#16a34a' }}>
          Making forms easier for everyone.
        </p>
      </div>

      {/* Notification bell */}
      <button
        aria-label="Notifications"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
    </header>
  )
}
