import { useState } from 'react'
import { loadAnalytics } from '../utils/analytics'

// ── DEV-ONLY: Passport PDF quick-test panel ───────────────────────────────────
// Visible only in development (import.meta.env.DEV = false in production builds).
// To remove: delete DevPassportPanel and the {import.meta.env.DEV && ...} line below.

function DevPassportPanel() {
  const [loading, setLoading] = useState('')
  const [error, setError]     = useState(null)

  const run = async (variant) => {
    setLoading(variant)
    setError(null)
    try {
      const { runDevPassportTest } = await import('../utils/devPassportTestData.js')
      await runDevPassportTest(variant)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading('')
    }
  }

  return (
    <div
      className="mx-4 mb-4 rounded-2xl px-4 py-4"
      style={{ background: '#fefce8', border: '1.5px dashed #fbbf24' }}
    >
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#92400e' }}>
        DEV — Passport PDF Test
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => run('first-time')}
          disabled={!!loading}
          className="w-full py-3 rounded-xl font-bold text-sm active:opacity-70 disabled:opacity-50"
          style={{ background: '#fbbf24', color: '#1c1917' }}
        >
          {loading === 'first-time' ? 'Generating…' : '[DEV] Generate Passport Test PDF — First Time'}
        </button>
        <button
          onClick={() => run('renewal')}
          disabled={!!loading}
          className="w-full py-3 rounded-xl font-bold text-sm active:opacity-70 disabled:opacity-50"
          style={{ background: '#fbbf24', color: '#1c1917' }}
        >
          {loading === 'renewal' ? 'Generating…' : '[DEV] Generate Passport Test PDF — Renewal'}
        </button>
      </div>
      {error && (
        <p className="text-xs font-semibold mt-3 text-red-600 break-all">{error}</p>
      )}
    </div>
  )
}

// ── Admin analytics panel ─────────────────────────────────────────────────────
// Hidden behind a 5-tap on the version label. Admin/owner only.

function StatCard({ label, value, accent }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: accent === 'gold' ? '#fffbeb' : '#f0fdf4',
        border: `1px solid ${accent === 'gold' ? '#fcd34d' : '#bbf7d0'}`,
      }}
    >
      <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
      <p
        className="text-2xl font-bold"
        style={{ color: accent === 'gold' ? '#92400e' : '#16a34a' }}
      >
        {value}
      </p>
    </div>
  )
}

function AnalyticsPanel({ onClose }) {
  const { appOpens, formStarts, formCompletions } = loadAnalytics()

  const countByType = (arr, type) => arr.filter(e => e.formType === type).length
  const resumedCount = formStarts.filter(e => e.resumed).length
  const completionRate = formStarts.length > 0
    ? Math.round((formCompletions.length / formStarts.length) * 100)
    : 0

  const FORM_TYPES = [
    { label: 'Passport',            id: 'passport'           },
    { label: 'TRN',                 id: 'trn'                },
    { label: 'NIS',                 id: 'nis'                },
    { label: 'Simplified Renewal',  id: 'simplified-renewal' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(13,27,56,0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl px-6 pt-5 pb-10 bg-white overflow-y-auto"
        style={{ maxWidth: 430, maxHeight: '88dvh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1.5 rounded-full mx-auto mb-5 bg-gray-200" />

        <h2 className="font-bold text-xl mb-0.5" style={{ color: '#0d1b38' }}>
          App Analytics
        </h2>
        <p className="text-xs text-gray-400 mb-5">Admin only · Stored locally on this device</p>

        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard label="App Opens"      value={appOpens.length}       />
          <StatCard label="Forms Started"  value={formStarts.length}     />
          <StatCard label="Completions"    value={formCompletions.length}/>
          <StatCard label="Completion Rate" value={`${completionRate}%`} accent="gold" />
        </div>

        {/* By form type */}
        <p className="font-bold text-sm text-gray-700 mb-3">By Form Type</p>
        <div className="flex flex-col gap-2 mb-6">
          {FORM_TYPES.map(({ label, id }) => {
            const starts      = countByType(formStarts,      id)
            const completions = countByType(formCompletions, id)
            return (
              <div
                key={id}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white"
                style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1.5px solid #f0fdf4' }}
              >
                <p className="font-bold text-sm text-black">{label}</p>
                <div className="flex gap-5 text-xs">
                  <span className="text-gray-500">
                    <span className="font-bold text-black">{starts}</span> started
                  </span>
                  <span className="text-gray-500">
                    <span className="font-bold text-black">{completions}</span> done
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Resume behaviour */}
        <p className="font-bold text-sm text-gray-700 mb-3">Session Behaviour</p>
        <div
          className="flex flex-col gap-2 px-4 py-4 rounded-2xl mb-7 bg-white"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1.5px solid #f0fdf4' }}
        >
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Resumed from saved draft</span>
            <span className="font-bold text-black">{resumedCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Started fresh</span>
            <span className="font-bold text-black">{formStarts.length - resumedCount}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-bold text-white text-base active:opacity-80"
          style={{ background: '#16a34a' }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ── WalletScreen ──────────────────────────────────────────────────────────────

export default function WalletScreen() {
  const [adminTaps, setAdminTaps]   = useState(0)
  const [showAdmin, setShowAdmin]   = useState(false)

  const handleVersionTap = () => {
    const next = adminTaps + 1
    if (next >= 5) {
      setShowAdmin(true)
      setAdminTaps(0)
    } else {
      setAdminTaps(next)
    }
  }

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

      {/* DEV-ONLY: Passport PDF test panel — not visible in production */}
      {import.meta.env.DEV && <DevPassportPanel />}

      {/* Hidden admin trigger — tap 5× to open analytics */}
      <button
        onClick={handleVersionTap}
        className="mt-auto py-6 w-full text-center"
        aria-hidden="true"
      >
        <span className="text-xs text-gray-300 select-none">FillFormEZ v1.0</span>
      </button>

      {showAdmin && <AnalyticsPanel onClose={() => setShowAdmin(false)} />}
    </div>
  )
}
