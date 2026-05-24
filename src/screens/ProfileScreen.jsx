import { useState } from 'react'

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 pt-5 pb-2">
      {children}
    </p>
  )
}

function Divider() {
  return <div style={{ height: 1, background: '#f0fdf4', marginLeft: '4rem' }} />
}

function BlockDivider() {
  return <div className="h-2" style={{ background: '#f0fdf4' }} />
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function Row({ icon, label, value, onPress, danger, badge }) {
  return (
    <button
      onClick={onPress ?? (() => {})}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 active:bg-gray-50 transition-colors text-left"
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: danger ? '#fff1f1' : '#f0fdf4' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
          {label}
        </p>
        {badge ? (
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm font-bold" style={{ color: '#0d1b38' }}>{value}</p>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#fef9c3', color: '#854d0e' }}
            >
              {badge}
            </span>
          </div>
        ) : value ? (
          <p className="text-sm font-semibold mt-0.5 truncate" style={{ color: '#0d1b38' }}>{value}</p>
        ) : (
          <p className="text-sm mt-0.5 truncate" style={{ color: '#d1d5db' }}>Not set</p>
        )}
      </div>
      {!danger && <ChevronRight />}
    </button>
  )
}

// ── SVG icons ────────────────────────────────────────────────────────────────

const icons = {
  person: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.6 19.79 19.79 0 0 1 1.61 3 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  idCard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2" />
      <line x1="13" y1="10" x2="19" y2="10" />
      <line x1="13" y1="14" x2="17" y2="14" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  passport: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="18" height="20" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <line x1="7" y1="17" x2="17" y2="17" />
      <line x1="7" y1="20" x2="13" y2="20" />
    </svg>
  ),
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  mapPin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
}

// ── Coming-soon modal ────────────────────────────────────────────────────────

function ComingSoonModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(13,27,56,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl px-6 pt-6 pb-10"
        style={{ background: '#fff', maxWidth: 430 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: '#f0fdf4' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <p className="font-bold text-lg text-center mb-2" style={{ color: '#0d1b38' }}>
          Coming Soon
        </p>
        <p className="text-sm text-center leading-relaxed mb-6" style={{ color: '#6b7280' }}>
          Profile editing is coming soon. For now, you can still complete forms normally.
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-bold text-white text-base active:opacity-80 transition-opacity"
          style={{ background: '#16a34a' }}
        >
          OK, got it
        </button>
      </div>
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [showModal, setShowModal] = useState(false)
  const comingSoon = () => setShowModal(true)

  return (
    <div className="flex flex-col min-h-full bg-white pb-8">

      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}

      {/* Avatar + heading */}
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
        <p className="font-bold text-lg" style={{ color: '#0d1b38' }}>My Profile</p>
        <p className="text-xs text-gray-400 mt-0.5">FillFormEZ</p>
      </div>

      {/* Privacy note */}
      <div
        className="mx-4 mb-2 rounded-2xl px-4 py-3 flex items-start gap-2.5"
        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: '#15803d' }}>
          Your profile details will help FillFormEZ fill future forms faster.
        </p>
      </div>

      <BlockDivider />

      {/* 1. Personal Details */}
      <div>
        <SectionLabel>Personal Details</SectionLabel>
        <Row icon={icons.person}   label="Full Name"     value={null} onPress={comingSoon} />
        <Divider />
        <Row icon={icons.calendar} label="Date of Birth" value={null} onPress={comingSoon} />
        <Divider />
        <Row icon={icons.phone}    label="Phone Number"  value={null} onPress={comingSoon} />
        <Divider />
        <Row icon={icons.mail}     label="Email Address" value={null} onPress={comingSoon} />
      </div>

      <BlockDivider />

      {/* 2. Saved IDs */}
      <div>
        <SectionLabel>Saved IDs</SectionLabel>
        <Row icon={icons.idCard}   label="TRN Number"      value={null} onPress={comingSoon} />
        <Divider />
        <Row icon={icons.shield}   label="NIS Number"      value={null} onPress={comingSoon} />
        <Divider />
        <Row icon={icons.passport} label="Passport Number" value={null} onPress={comingSoon} />
      </div>

      <BlockDivider />

      {/* 3. Addresses */}
      <div>
        <SectionLabel>Addresses</SectionLabel>
        <Row icon={icons.home}   label="Home Address"    value={null} onPress={comingSoon} />
        <Divider />
        <Row icon={icons.mapPin} label="Mailing Address" value={null} onPress={comingSoon} />
      </div>

      <BlockDivider />

      {/* 4. Account */}
      <div>
        <SectionLabel>Account</SectionLabel>
        <Row
          icon={icons.star}
          label="Plan"
          value="Free Testing Mode"
          badge="Active"
        />
        <Divider />
        <Row icon={icons.lock} label="Security" value="Change PIN" onPress={comingSoon} />
      </div>

      <BlockDivider />

      {/* 5. Session */}
      <div>
        <SectionLabel>Session</SectionLabel>
        <Row icon={icons.logout} label="Log out" danger onPress={comingSoon} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center pt-6">
        <p className="text-xs font-medium" style={{ color: '#d1d5db' }}>FillFormEZ v1.0</p>
      </div>

    </div>
  )
}
