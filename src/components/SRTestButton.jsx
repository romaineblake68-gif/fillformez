// DEV-ONLY — Simplified Renewal PDF overlay calibration tool.
// Bypasses the full SR flow and generates a filled PDF instantly
// using hardcoded realistic test values.
// Remove this file and its import from App.jsx before shipping.

import { useState } from 'react'

// Realistic long values so alignment limits are tested on every field.
const TEST_ANSWERS = {
  // Section A — Personal Information
  srSurname:         'Bartholomew-Henderson',   // long hyphenated surname
  srHasMaiden:       'Yes',
  srMaidenSurname:   'Wilson',                  // maiden surname — now drawn
  srFirstName:       'Christiana',
  srHasMiddle:       'Yes',
  srMiddleName:      'Evangeline',
  srBirthDay:        '14',
  srBirthMonth:      'November',
  srBirthYear:       '1985',
  srPlaceOfBirth:    'Kingston',
  srCountryOfBirth:  'Jamaica',
  srOccupation:      'Administrative Assistant',
  srVisibleFeatures: 'Scar above left eyebrow, birthmark on right forearm', // long
  srMaritalStatus:   'Married',                 // triggers marriage particulars block
  srSpouseSurname:   'Morrison',
  srSpouseFirstName: 'Daniel',
  srMarriageDay:     '12',
  srMarriageMonth:   'August',                  // → drawn as "08" via MONTH_NUM
  srMarriageYear:    '2010',
  srMarriagePlace:   'Kingston, Jamaica',       // two-part place to test length

  // Section B — Contact Information
  srStreetAddress:   '47 Mountainview Avenue, Lot 3', // long address
  srTownParish:      'St. Andrew',
  srMailingSame:     'No',                      // triggers mailing address block
  srMailingStreet:   '14 Dunrobin Crescent',    // different mailing address
  srMailingParish:   'St. Andrew',
  srCellPhone:       '876-555-1234',
  srHomePhone:       '__SKIP__',                // Phase 3 — not drawn yet
  srWorkPhone:       '__SKIP__',                // Phase 3 — not drawn yet
  srEmail:           'christiana.bartholomew@example.com', // long email

  // Phase 3 fields — not drawn yet
  srContact1Surname:      'Thompson',
  srContact1FirstName:    'Marcia',
  srContact1Relationship: 'Sister',
  srContact1Phone:        '876-444-5678',
  srContact1Address:      '__SKIP__',
  srContact2Surname:      '__SKIP__',
  srContact2FirstName:    '__SKIP__',
  srContact2Relationship: '__SKIP__',
  srContact2Phone:        '__SKIP__',
  srContact2Address:      '__SKIP__',
  srHeadCovering:         'No',
  srReligion:             '__SKIP__',
  srPassportNumber:       'A1234567',
  srIssueDay:             '03',
  srIssueMonth:           'June',
  srIssueYear:            '2019',
  srIssuePlace:           'Kingston',
  srTRN:                  '__SKIP__',
  srNIS:                  '__SKIP__',
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
