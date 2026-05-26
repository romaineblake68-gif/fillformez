// DEV-ONLY — Driver's Licence PDF overlay calibration tool.
// Bypasses the full DL flow and generates a filled PDF instantly
// using hardcoded realistic test values.
// Remove this file and its import from App.jsx before shipping.

import { useState } from 'react'

// Realistic long values so alignment limits are tested on every field.
const TEST_ANSWERS = {
  dlLastName:           'Bartholomew-Henderson',   // long hyphenated surname
  dlFirstNames:         'Christiana Evangeline',   // first + middle, moderate length

  dlHomePhone:          '876-927-4400',
  dlWorkPhone:          '876-754-8800',
  dlMobilePhone:        '876-555-1234',
  dlEmail:              'christiana.bartholomew@example.com',
  dlTRN:                '123-456-789',

  dlResidence:          '47 Mountainview Avenue, Lot 3, Portmore, St. Catherine',

  dlAgeNextBirthday:    '41',
  dlBirthDay:           '14',
  dlBirthMonth:         'November',
  dlBirthYear:          '1984',
  dlPlaceOfBirth:       'Kingston, Jamaica',
  dlCitizenship:        'Jamaican',

  dlHasLicence:         'Yes',
  dlLicenceAuthority:   'Jamaica',
  dlRefused:            'No',
  dlRefusedAuthority:   '__SKIP__',
  dlRefusedDate:        '__SKIP__',
  dlSuspended:          'No',
  dlSuspendedAuthority: '__SKIP__',

  dlReadWriteEnglish:   'Yes',
}

export default function DLTestButton() {
  const [busy, setBusy] = useState(false)

  async function handleGenerate() {
    if (busy) return
    setBusy(true)
    try {
      const { generateDLPDF } = await import('../utils/dlPdfGenerator')
      const url = await generateDLPDF(TEST_ANSWERS)
      const a = document.createElement('a')
      a.href = url
      a.download = 'DL-TEST-overlay.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[DL Test] PDF generation failed:', err)
      alert('DL test PDF failed — see console for details.')
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
        bottom:       120,
        right:        16,
        zIndex:       9999,
        background:   busy ? '#1e40af' : '#2563eb',
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
      aria-label="Generate DL test PDF for overlay calibration"
    >
      {busy ? 'Generating…' : '[DEV] DL Test PDF'}
    </button>
  )
}
