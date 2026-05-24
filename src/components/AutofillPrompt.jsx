function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export default function AutofillPrompt({ onUseProfile, onStartFresh, onBack }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
        >
          <ChevronLeft />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-0.5">
            <span className="text-sm font-bold text-black leading-none">FillForm</span>
            <span
              className="text-sm font-bold text-white px-1 py-0.5 rounded leading-none"
              style={{ background: '#16a34a' }}
            >EZ</span>
          </div>
        </div>
        <div className="w-9" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center px-6 pt-12 pb-8">

        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #16a34a 0%, #0d3b1e 100%)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h2 className="font-bold text-2xl text-center mb-3" style={{ color: '#0d1b38' }}>
          Profile Found
        </h2>
        <p className="text-base text-gray-500 text-center leading-relaxed mb-10">
          Would you like to use your saved profile to fill in common details like your name and date of birth?
        </p>

        {/* Info card */}
        <div
          className="w-full rounded-2xl px-5 py-4 mb-8"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: '#15803d' }}>What gets pre-filled:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Full name, date of birth, sex</li>
            <li>• Phone number, occupation</li>
          </ul>
          <p className="text-xs text-gray-400 mt-3">You can review and change any answer before it is saved to your form.</p>
        </div>

        {/* Buttons */}
        <button
          onClick={onUseProfile}
          className="w-full py-5 rounded-2xl font-bold text-white text-lg mb-3 active:opacity-80 transition-opacity"
          style={{ background: '#16a34a' }}
        >
          Use Saved Info
        </button>
        <button
          onClick={onStartFresh}
          className="w-full py-5 rounded-2xl font-bold text-lg border-2 active:bg-gray-50 transition-colors"
          style={{ borderColor: '#e5e7eb', color: '#374151' }}
        >
          Start Fresh
        </button>

      </div>
    </div>
  )
}
