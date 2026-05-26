import { useState, useEffect } from 'react'
import { loadProfile, saveProfile } from '../utils/profileStorage'

// ── Layout helpers ────────────────────────────────────────────────────────────

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
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#fef9c3', color: '#854d0e' }}>
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
  briefcase: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  trash: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
}

// ── Edit sheet (generic bottom sheet) ────────────────────────────────────────

function EditSheet({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-[430px] mx-auto px-6 pt-5 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5 bg-gray-200" />
        <p className="font-bold text-lg mb-5" style={{ color: '#0d1b38' }}>{title}</p>
        {children}
      </div>
    </div>
  )
}

function FieldInput({ label, value, onChange, placeholder = '', type = 'text', autoCapitalize = 'words' }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        autoCorrect="off"
        spellCheck={false}
        className="w-full rounded-xl px-4 py-3 text-base font-semibold text-black outline-none border-2"
        style={{ borderColor: '#bbf7d0', background: '#fafffe' }}
      />
    </div>
  )
}

function SexPicker({ value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Sex</label>
      <div className="flex gap-3">
        {['Male', 'Female'].map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="flex-1 py-3 rounded-xl font-bold text-base border-2 transition-colors"
            style={{
              borderColor: value === opt ? '#16a34a' : '#e5e7eb',
              background: value === opt ? '#f0fdf4' : '#fff',
              color: value === opt ? '#16a34a' : '#6b7280',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function SaveCancelButtons({ onSave, onCancel }) {
  return (
    <div className="flex gap-3 mt-2">
      <button
        onClick={onCancel}
        className="flex-1 py-4 rounded-2xl font-bold border-2 border-gray-200 text-gray-600 active:bg-gray-50"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="flex-1 py-4 rounded-2xl font-bold text-white active:opacity-80"
        style={{ background: '#16a34a' }}
      >
        Save
      </button>
    </div>
  )
}

// ── Confirm clear modal ───────────────────────────────────────────────────────

function ConfirmClearAllModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: 'rgba(13,27,56,0.55)' }}
      onClick={onCancel}
    >
      <div
        className="w-full rounded-t-3xl px-6 pt-6 pb-10"
        style={{ background: '#fff', maxWidth: 430 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#fef2f2' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
        </div>
        <p className="font-bold text-lg text-center mb-2" style={{ color: '#0d1b38' }}>Clear All My Data?</p>
        <p className="text-sm text-center leading-relaxed mb-6 px-2" style={{ color: '#6b7280' }}>
          This will permanently erase your profile, all saved drafts, form history, and analytics from this device. This cannot be undone.
        </p>
        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-2xl font-bold text-white text-base mb-3 active:opacity-80"
          style={{ background: '#ef4444' }}
        >
          Yes, Delete Everything
        </button>
        <button
          onClick={onCancel}
          className="w-full py-4 rounded-2xl font-bold text-base border-2 border-gray-200 text-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Helper: build display strings ─────────────────────────────────────────────

function fullName(p) {
  return [p.firstName, p.middleName, p.surname].filter(Boolean).join(' ') || null
}

function dob(p) {
  return [p.birthDay, p.birthMonth, p.birthYear].filter(Boolean).join(' ') || null
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ProfileScreen({ onClearAll }) {
  const [profile, setProfile] = useState(() => loadProfile())
  const [sheet, setSheet] = useState(null) // which edit sheet is open
  const [draft, setDraft] = useState({})
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  useEffect(() => {
    setProfile(loadProfile())
  }, [])

  const openSheet = (name) => {
    setDraft({ ...profile })
    setSheet(name)
  }

  const closeSheet = () => setSheet(null)

  const commitDraft = () => {
    const updated = { ...draft }
    setProfile(updated)
    saveProfile(updated)
    setSheet(null)
  }

  const updateDraft = (key, value) => setDraft(d => ({ ...d, [key]: value }))

  const handleClearAll = () => {
    setShowClearConfirm(false)
    if (onClearAll) onClearAll()
  }

  return (
    <div className="flex flex-col min-h-full bg-white pb-8">

      {/* ── Edit sheets ── */}

      {sheet === 'name' && (
        <EditSheet title="Full Name" onClose={closeSheet}>
          <FieldInput label="First Name" value={draft.firstName} onChange={v => updateDraft('firstName', v)} placeholder="e.g. Keisha" />
          <FieldInput label="Middle Name (optional)" value={draft.middleName} onChange={v => updateDraft('middleName', v)} placeholder="e.g. Ann" />
          <FieldInput label="Surname" value={draft.surname} onChange={v => updateDraft('surname', v)} placeholder="e.g. Williams" />
          <SaveCancelButtons onSave={commitDraft} onCancel={closeSheet} />
        </EditSheet>
      )}

      {sheet === 'dob' && (
        <EditSheet title="Date of Birth" onClose={closeSheet}>
          <FieldInput label="Day" value={draft.birthDay} onChange={v => updateDraft('birthDay', v)} placeholder="e.g. 15" type="tel" autoCapitalize="none" />
          <FieldInput label="Month" value={draft.birthMonth} onChange={v => updateDraft('birthMonth', v)} placeholder="e.g. March" />
          <FieldInput label="Year" value={draft.birthYear} onChange={v => updateDraft('birthYear', v)} placeholder="e.g. 1990" type="tel" autoCapitalize="none" />
          <SaveCancelButtons onSave={commitDraft} onCancel={closeSheet} />
        </EditSheet>
      )}

      {sheet === 'sex' && (
        <EditSheet title="Sex" onClose={closeSheet}>
          <SexPicker value={draft.sex} onChange={v => updateDraft('sex', v)} />
          <SaveCancelButtons onSave={commitDraft} onCancel={closeSheet} />
        </EditSheet>
      )}

      {sheet === 'phone' && (
        <EditSheet title="Phone Number" onClose={closeSheet}>
          <FieldInput label="Cell Phone" value={draft.cellPhone} onChange={v => updateDraft('cellPhone', v)} placeholder="e.g. 876-555-1234" type="tel" autoCapitalize="none" />
          <FieldInput label="Email Address (optional)" value={draft.email} onChange={v => updateDraft('email', v)} placeholder="e.g. keisha@email.com" type="email" autoCapitalize="none" />
          <SaveCancelButtons onSave={commitDraft} onCancel={closeSheet} />
        </EditSheet>
      )}

      {sheet === 'trn' && (
        <EditSheet title="TRN Number" onClose={closeSheet}>
          <FieldInput label="Tax Registration Number" value={draft.trn} onChange={v => updateDraft('trn', v)} placeholder="e.g. 123-456-789" type="tel" autoCapitalize="none" />
          <SaveCancelButtons onSave={commitDraft} onCancel={closeSheet} />
        </EditSheet>
      )}

      {sheet === 'nis' && (
        <EditSheet title="NIS Number" onClose={closeSheet}>
          <FieldInput label="National Insurance Scheme Number" value={draft.nis} onChange={v => updateDraft('nis', v)} placeholder="e.g. A123456" autoCapitalize="characters" />
          <SaveCancelButtons onSave={commitDraft} onCancel={closeSheet} />
        </EditSheet>
      )}

      {sheet === 'passport' && (
        <EditSheet title="Passport Number" onClose={closeSheet}>
          <FieldInput label="Passport Number" value={draft.passportNumber} onChange={v => updateDraft('passportNumber', v)} placeholder="e.g. A1234567" autoCapitalize="characters" />
          <SaveCancelButtons onSave={commitDraft} onCancel={closeSheet} />
        </EditSheet>
      )}

      {sheet === 'occupation' && (
        <EditSheet title="Occupation" onClose={closeSheet}>
          <FieldInput label="Occupation" value={draft.occupation} onChange={v => updateDraft('occupation', v)} placeholder="e.g. Teacher, Nurse, Driver" />
          <SaveCancelButtons onSave={commitDraft} onCancel={closeSheet} />
        </EditSheet>
      )}

      {showClearConfirm && (
        <ConfirmClearAllModal
          onConfirm={handleClearAll}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}

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
          Saved on this device only. FillFormEZ never sends your profile to any server.
        </p>
      </div>

      <BlockDivider />

      {/* 1. Personal Details */}
      <div>
        <SectionLabel>Personal Details</SectionLabel>
        <Row icon={icons.person}   label="Full Name"     value={fullName(profile)} onPress={() => openSheet('name')} />
        <Divider />
        <Row icon={icons.calendar} label="Date of Birth" value={dob(profile)}       onPress={() => openSheet('dob')} />
        <Divider />
        <Row icon={icons.person}   label="Sex"           value={profile.sex || null} onPress={() => openSheet('sex')} />
        <Divider />
        <Row icon={icons.briefcase} label="Occupation"   value={profile.occupation || null} onPress={() => openSheet('occupation')} />
        <Divider />
        <Row icon={icons.phone}    label="Phone / Email" value={profile.cellPhone || null} onPress={() => openSheet('phone')} />
      </div>

      <BlockDivider />

      {/* 2. Saved IDs */}
      <div>
        <SectionLabel>Saved IDs</SectionLabel>
        <Row icon={icons.idCard}   label="TRN Number"      value={profile.trn || null}            onPress={() => openSheet('trn')} />
        <Divider />
        <Row icon={icons.shield}   label="NIS Number"      value={profile.nis || null}            onPress={() => openSheet('nis')} />
        <Divider />
        <Row icon={icons.passport} label="Passport Number" value={profile.passportNumber || null} onPress={() => openSheet('passport')} />
      </div>

      <BlockDivider />

      {/* 3. Account */}
      <div>
        <SectionLabel>Account</SectionLabel>
        <Row
          icon={icons.star}
          label="Plan"
          value="Free Testing Mode"
          badge="Active"
        />
        <Divider />
        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 active:bg-red-50 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#fff1f1' }}>
            {icons.trash}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>Privacy</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: '#ef4444' }}>Clear All My Data</p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center pt-6">
        <p className="text-xs font-medium" style={{ color: '#d1d5db' }}>FillFormEZ v1.0</p>
      </div>

    </div>
  )
}
