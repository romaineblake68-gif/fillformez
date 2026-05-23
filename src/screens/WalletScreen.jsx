export default function WalletScreen() {
  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* Balance card */}
      <div
        className="mx-4 mt-6 mb-5 rounded-3xl p-6 flex flex-col items-center shadow-md"
        style={{ background: 'linear-gradient(135deg, #0d1b38 0%, #0d2d50 100%)' }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#FFD100', opacity: 0.9 }}>
          Available Balance
        </p>
        <p className="text-4xl font-bold text-white mt-1 tracking-tight">$0.00</p>
        <p className="text-sm font-medium mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Jamaican Dollars
        </p>
      </div>

      {/* Action buttons */}
      <div className="px-4 flex flex-col gap-3 mb-6">
        <button
          className="w-full py-4 rounded-2xl font-bold text-white text-base active:opacity-80 transition-opacity flex items-center justify-center gap-2.5 shadow-sm"
          style={{ background: '#16a34a' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="3" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Top Up with Card
        </button>

        <button
          className="w-full py-4 rounded-2xl font-bold text-base active:opacity-80 transition-opacity flex items-center justify-center gap-2.5 border-2"
          style={{ color: '#0d1b38', borderColor: '#0d1b38', background: '#fff' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          Enter Voucher Code
        </button>
      </div>

      {/* Transaction history */}
      <div className="px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Transaction History
        </p>

        <div
          className="rounded-2xl flex flex-col items-center justify-center py-12 px-6"
          style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
            style={{ background: '#dcfce7' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <p className="font-bold text-gray-800 text-base text-center">No transactions yet</p>
          <p className="text-sm text-gray-400 text-center mt-1">
            Top up your wallet to get started
          </p>
        </div>
      </div>
    </div>
  )
}
