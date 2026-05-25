// DEV-ONLY — Simplified Renewal PDF overlay calibration tool.
// Bypasses the full SR flow and generates a filled PDF instantly
// using hardcoded realistic test values.
// Remove this file and its import from App.jsx before shipping.

import { useState } from 'react'

// Realistic long values so alignment limits are tested on every field.
const TEST_ANSWERS = {
  // Section A — Personal Information
  srSurname:         'Bartholomew-Henderson',   // long hyphenated surname
  srFirstName:       'Christiana',
  srMiddleName:      'Evangeline',
  srBirthDay:        '14',
  srBirthMonth:      'November',
  srBirthYear:       '1985',
  srPlaceOfBirth:    'Kingston',
  srCountryOfBirth:  'Jamaica',
  srOccupation:      'Administrative Assistant', // two words, moderate length
  srVisibleFeatures: 'Scar above left eyebrow, birthmark on right forearm', // long
  srMaritalStatus:   'Single',

  // Section B — Contact Information
  srStreetAddress:   '47 Mountainview Avenue, Lot 3', // long address
  srTownParish:      'St. Andrew',
  srCellPhone:       '876-555-1234',
  srEmail:           'christiana.bartholomew@example.com', // long email

  // Phase 2 fields — not drawn yet, included so the generator doesn't error
  srHasMaiden:       'No',
  srMaidenSurname:   '__SKIP__',
  srHasMiddle:       'Yes',
  srMailingSame:     'Yes',
  srMailingStreet:   '__SKIP__',
  srMailingParish:   '__SKIP__',
  srHomePhone:       '__SKIP__',
  srWorkPhone:       '__SKIP__',
  srContact1Surname: 'Thompson',
  srContact1FirstName: 'Marcia',
  srContact1Relationship: 'Sister',
  srContact1Phone:   '876-444-5678',
  srContact1Address: '__SKIP__',
  srContact2Surname: '__SKIP__',
  srHeadCovering:    'No',
  srReligion:        '__SKIP__',
  srPassportNumber:  'A1234567',
  srIssueDay:        '03',
  srIssueMonth:      'June',
  srIssueYear:       '2019',
  srIssuePlace:      'Kingston',
  srTRN:             '__SKIP__',
  srNIS:             '__SKIP__',
}

export default function SRTestButton() {
  const [busy, setBusy] = useState(false)

  async function handleGenerate() {
    if (busy) return
    setBusy(true)
    try {
      const { generateSimplifiedRenewalPDF } = await import('../utils/simplifiedRenewalPdfGenerator')
      const url = await generateSimplifiedRenewalPDF(TEST_ANSWERS)
      const a = document.createElement('a')
      a.href = url
      a.download = 'SR-TEST-overlay.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[SR Test] PDF generation failed:', err)
      alert('SR test PDF failed — see console.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={busy}
      style={{
        position:     'fixed',
        bottom:       80,
        right:        16,
        zIndex:       9999,
        background:   busy ? '#b45309' : '#d97706',
        color:        'white',
        border:       'none',
        borderRadius: 10,
        padding:      '7px 13px',
        fontSize:     11,
        fontWeight:   700,
        lineHeight:   1.3,
        cursor:       busy ? 'wait' : 'pointer',
        boxShadow:    '0 2px 10px rgba(0,0,0,0.30)',
        letterSpacing: '0.02em',
        transition:   'background 0.15s',
        userSelect:   'none',
      }}
      aria-label="Generate SR test PDF for overlay calibration"
    >
      {busy ? 'Generating…' : '[DEV] SR Test PDF'}
    </button>
  )
}
