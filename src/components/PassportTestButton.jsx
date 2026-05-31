// DEV-ONLY — Passport PDF quick-test button.
// Bypasses the full Passport flow and generates a filled PDF instantly
// using fixed test data designed to exercise known edge cases.
// Remove this file and its import/render in App.jsx before shipping.

import { useState } from 'react'

// ── What each field tests ─────────────────────────────────────────────────────
//   middleName         omitted  → empty optional comb field — boxes must stay visible
//   streetAddress      "Hampton District" → space stripped in comb: HAMPTONDISTIRCT (no blank box)
//   townParish         "St. Andrew" → space stripped in comb: ST.ANDREW
//   f1Surname          "Blackwood-Brown" → hyphenated surname — Section F must print it
//   f1MiddleName       omitted  → empty optional Section F comb field — boxes must stay visible
//   dPassportNumber    "A1234567" → collected in Section D
//   ePassportNumber    "A1234567" → must match dPassportNumber (reuse path)
// ─────────────────────────────────────────────────────────────────────────────

const TEST_ANSWERS = {
  aAnswers: {
    surname:            'Blake',
    firstName:          'Romaine',
    // middleName intentionally omitted — tests empty comb-box preservation
    occupation:         'Software Engineer',
    sex:                'Male',
    maritalStatus:      'Single',
    placeOfBirth:       'Kingston',
    birthDay:           '15',
    birthMonth:         'March',
    birthYear:          '1990',
    streetAddress:      'Hampton District',  // space → comb: HAMPTONDISTIRCT
    townParish:         'St. Andrew',         // space → comb: ST.ANDREW
    country:            'Jamaica',
    phoneAreaCode:      '876',
    phoneNumber:        '555-0101',
    emailAddress:       'romaine@example.com',
    motherFirstName:    'Joan',
    motherMaidenName:   'Brown',
    mailingAddressSame: 'Yes',
  },
  bAnswers: {},
  cAnswers: {},
  dAnswers: {
    dPassportNumber: 'A1234567',   // collected in Section D
    dIssueDay:       '10',
    dIssueMonth:     'June',
    dIssueYear:      '2019',
    dIssuePlace:     'Kingston',
    dPassportStatus: 'renewing',
  },
  ePassportNumber: 'A1234567',    // must match dPassportNumber — confirms reuse
  isFirstTime:     false,
  passportStatus:  'renewing',
  f1Answers: {
    f1Surname:      'Blackwood-Brown',  // hyphenated — Section F surname test
    f1FirstName:    'Marcus',
    // f1MiddleName intentionally omitted — tests empty comb-box preservation
    f1Address:      '14 Hope Road',
    f1Parish:       'St. Andrew',
    f1Country:      'Jamaica',
    f1Relationship: 'Brother',
    f1AreaCode:     '876',
    f1PhoneNumber:  '555-0201',
  },
  f2Answers: {
    f2Surname:      'Campbell',
    f2FirstName:    'Gloria',
    f2Address:      '7 Red Hills Road',
    f2Parish:       'St. Catherine',
    f2Country:      'Jamaica',
    f2Relationship: 'Mother',
    f2AreaCode:     '876',
    f2PhoneNumber:  '555-0202',
  },
}

export default function PassportTestButton() {
  const [busy, setBusy]   = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate() {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const { generatePassportPDF } = await import('../utils/pdfGenerator')
      const url = await generatePassportPDF(TEST_ANSWERS)
      window.open(url, '_blank')
    } catch (err) {
      console.error('[Passport Test] PDF generation failed:', err)
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{
        position:       'fixed',
        bottom:         135,
        right:          16,
        zIndex:         9999,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'flex-end',
        gap:            4,
      }}
    >
      <button
        onClick={handleGenerate}
        disabled={busy}
        aria-label="Generate Passport test PDF for dev testing"
        style={{
          background:    busy ? '#1e3a5f' : '#0d1b38',
          color:         'white',
          border:        'none',
          borderRadius:  10,
          padding:       '7px 13px',
          fontSize:      11,
          fontWeight:    700,
          lineHeight:    1.3,
          cursor:        busy ? 'wait' : 'pointer',
          boxShadow:     '0 2px 10px rgba(0,0,0,0.30)',
          letterSpacing: '0.02em',
          transition:    'background 0.15s',
          userSelect:    'none',
          whiteSpace:    'nowrap',
        }}
      >
        {busy ? 'Generating…' : '[DEV] Generate Passport Test PDF'}
      </button>
      {error && (
        <div
          style={{
            background:  '#fee2e2',
            color:       '#991b1b',
            borderRadius: 8,
            padding:     '4px 8px',
            fontSize:    11,
            maxWidth:    220,
            wordBreak:   'break-all',
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}
