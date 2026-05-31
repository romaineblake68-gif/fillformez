import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

// Simplified Adult Renewal PDF — scanned image, no AcroForm fields.
// Text is overlaid using drawText() at fixed coordinates.
//
// CALIBRATION GUIDE
//   1. Complete the SR flow, download the PDF, open it.
//   2. Compare each text value against the printed field on the form.
//   3. Adjust row anchors in A{} / B{} first — this shifts the whole section.
//   4. Then adjust individual x offsets within FIELDS{} for horizontal alignment.
//   5. x=0 is LEFT edge, y=0 is BOTTOM edge — pdf-lib uses bottom-left origin.
//   6. Page size: 612 × 792 pts (US Letter).
//
// PHASE STATUS
//   Phase 1 (active):  Section A rows 1–8, Section B address + cell + email.
//   Phase 2 (active):  maiden surname, marriage particulars, mailing address.
//   Phase 3 (pending): home/work phone, emergency contacts, Sections C/D/F.

const TEMPLATE_PATH = '/simplified-adult-renewal.pdf'
const BLACK = rgb(0, 0, 0)

// ── Page 1 — Section A row anchors ───────────────────────────────────────────
// y = baseline of text from BOTTOM of page.
// Adjust these first — they shift whole rows together.

const A = {
  surname:      696, // APPROX row 1 — surname
  maiden:       677, // APPROX row 2 — previous/maiden surname   [Phase 2]
  givenNames:   658, // APPROX row 3 — first name  |  middle name
  dob:          638, // APPROX row 4 — DD  |  MM  |  YYYY
  birthPlace:   618, // APPROX row 5 — place of birth  |  country of birth
  occupation:   598, // APPROX row 6 — occupation
  features:     578, // APPROX row 7 — special visible features
  marital:      558, // APPROX row 8 — marital status
  spouseNames:  538, // APPROX row 9 — spouse surname  |  first name    [Phase 2]
  marriageDate: 518, // APPROX row 10 — marriage DD  |  MM  |  YYYY     [Phase 2]
  marriagePlace:498, // APPROX row 11 — place of marriage                [Phase 2]
}

// ── Page 1 — Section B row anchors ───────────────────────────────────────────
// NOTE: The photo / signature / thumbprint block sits between Sections A and B.
// Do NOT draw anything in the gap between A.marital (~558) and B.street (~310).

const B = {
  street:        310, // APPROX row 1 — permanent address (street / community)
  parish:        290, // APPROX row 2 — parish
  mailingStreet: 270, // APPROX row 3 — mailing address street             [Phase 2]
  mailingParish: 250, // APPROX row 4 — mailing parish                     [Phase 2]
  phones:        228, // APPROX row 5 — home  |  work  |  cell (3 columns)
  email:         208, // APPROX row 6 — email address
}

// ── Field coordinate table ────────────────────────────────────────────────────
// x = horizontal offset from left page edge.
// size = font size in pts (7–9).
// Fields disabled in Phase 1 are kept here so Phase 2 just un-comments draw calls.

const FIELDS = {

  // ── Section A ──────────────────────────────────────────────────────────────
  surname:          { x:  96, y: A.surname,      size: 9  }, // APPROX
  maiden:           { x:  96, y: A.maiden,        size: 9  }, // APPROX
  firstName:        { x:  96, y: A.givenNames,   size: 9  }, // APPROX
  middleName:       { x: 318, y: A.givenNames,   size: 9  }, // APPROX — right column

  birthDay:         { x:  96, y: A.dob,          size: 8  }, // APPROX
  birthMonth:       { x: 148, y: A.dob,          size: 8  }, // APPROX
  birthYear:        { x: 210, y: A.dob,          size: 8  }, // APPROX

  placeOfBirth:     { x:  96, y: A.birthPlace,   size: 9  }, // APPROX
  countryOfBirth:   { x: 350, y: A.birthPlace,   size: 9  }, // APPROX — right column

  occupation:       { x:  96, y: A.occupation,   size: 9  }, // APPROX
  visibleFeatures:  { x:  96, y: A.features,     size: 7  }, // APPROX — small; can be long
  maritalStatus:    { x:  96, y: A.marital,       size: 9  }, // APPROX

  // Marriage particulars — conditional on marital status
  spouseSurname:    { x:  96, y: A.spouseNames,  size: 9  }, // APPROX
  spouseFirstName:  { x: 318, y: A.spouseNames,  size: 9  }, // APPROX
  marriageDay:      { x:  96, y: A.marriageDate, size: 8  }, // APPROX
  marriageMonth:    { x: 148, y: A.marriageDate, size: 8  }, // APPROX
  marriageYear:     { x: 210, y: A.marriageDate, size: 8  }, // APPROX
  marriagePlace:    { x:  96, y: A.marriagePlace,size: 9  }, // APPROX

  // ── Section B ──────────────────────────────────────────────────────────────
  streetAddress:    { x:  96, y: B.street,        size: 9  }, // APPROX
  townParish:       { x:  96, y: B.parish,         size: 9  }, // APPROX

  // Mailing address — conditional on srMailingSame !== 'Yes'
  mailingStreet:    { x:  96, y: B.mailingStreet, size: 9  }, // APPROX
  mailingParish:    { x:  96, y: B.mailingParish, size: 9  }, // APPROX

  // Phones — three columns on same row
  // homePhone:      { x:  96, y: B.phones,         size: 8  }, // Phase 2
  // workPhone:      { x: 258, y: B.phones,          size: 8  }, // Phase 2
  cellPhone:        { x: 420, y: B.phones,          size: 8  }, // APPROX

  email:            { x:  96, y: B.email,           size: 9, noUpper: true }, // APPROX

  // ── Page 2 — all sections disabled for Phase 1 calibration ────────────────
  // Uncomment in Phase 2 after Page 1 coordinates are confirmed.

  // Emergency Contact 1
  // contact1Surname:      { page: 1, x:  96, y: 718, size: 9 },
  // contact1FirstName:    { page: 1, x: 340, y: 718, size: 9 },
  // contact1Relationship: { page: 1, x:  96, y: 697, size: 9 },
  // contact1Phone:        { page: 1, x:  96, y: 676, size: 9 },
  // contact1Address:      { page: 1, x:  96, y: 655, size: 9 },

  // Emergency Contact 2
  // contact2Surname:      { page: 1, x:  96, y: 622, size: 9 },
  // contact2FirstName:    { page: 1, x: 340, y: 622, size: 9 },
  // contact2Relationship: { page: 1, x:  96, y: 601, size: 9 },
  // contact2Phone:        { page: 1, x:  96, y: 580, size: 9 },
  // contact2Address:      { page: 1, x:  96, y: 559, size: 9 },

  // Section C — Current Passport
  // passportNumber: { page: 1, x:  96, y: 524, size: 9 },
  // issueDay:       { page: 1, x:  96, y: 503, size: 8 },
  // issueMonth:     { page: 1, x: 148, y: 503, size: 8 },
  // issueYear:      { page: 1, x: 210, y: 503, size: 8 },
  // issuePlace:     { page: 1, x: 360, y: 503, size: 9 },

  // Section D — Religion
  // religion:       { page: 1, x:  96, y: 468, size: 9 },

  // Section F — Supplementary Information
  // trn:            { page: 1, x:  96, y: 390, size: 9 },
  // nis:            { page: 1, x:  96, y: 369, size: 9 },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ok(v) { return v && v !== '__SKIP__' && String(v).trim() !== '' }

function pad2(v) { return String(v || '').padStart(2, '0') }

const MONTH_NUM = {
  January: '01', February: '02', March: '03',
  April: '04',   May: '05',      June: '06',
  July: '07',    August: '08',   September: '09',
  October: '10', November: '11', December: '12',
}

function draw(page, field, value, font) {
  if (!ok(value)) return
  const str = String(value).trim()
  page.drawText(field.noUpper ? str : str.toUpperCase(), {
    x:     field.x,
    y:     field.y,
    size:  field.size || 9,
    font,
    color: BLACK,
  })
}

// ── Phase 1 overlay — Page 1 only ────────────────────────────────────────────

function overlayPage1(p1, a, font) {

  // Section A — Personal Information
  draw(p1, FIELDS.surname,         a.srSurname,       font)
  draw(p1, FIELDS.maiden,          a.srMaidenSurname, font)
  draw(p1, FIELDS.firstName,       a.srFirstName,     font)
  draw(p1, FIELDS.middleName,      a.srMiddleName,    font)

  draw(p1, FIELDS.birthDay,   pad2(a.srBirthDay),                          font)
  draw(p1, FIELDS.birthMonth, MONTH_NUM[a.srBirthMonth] || a.srBirthMonth, font)
  draw(p1, FIELDS.birthYear,  a.srBirthYear,                               font)

  draw(p1, FIELDS.placeOfBirth,   a.srPlaceOfBirth,    font)
  draw(p1, FIELDS.countryOfBirth, a.srCountryOfBirth,  font)
  draw(p1, FIELDS.occupation,     a.srOccupation,      font)
  draw(p1, FIELDS.visibleFeatures,a.srVisibleFeatures, font)
  draw(p1, FIELDS.maritalStatus,  a.srMaritalStatus,   font)
  // Marriage particulars — only drawn when answered (ok() skips undefined / __SKIP__)
  draw(p1, FIELDS.spouseSurname,   a.srSpouseSurname,   font)
  draw(p1, FIELDS.spouseFirstName, a.srSpouseFirstName, font)
  draw(p1, FIELDS.marriageDay,   pad2(a.srMarriageDay),                            font)
  draw(p1, FIELDS.marriageMonth, MONTH_NUM[a.srMarriageMonth] || a.srMarriageMonth, font)
  draw(p1, FIELDS.marriageYear,  a.srMarriageYear,                                 font)
  draw(p1, FIELDS.marriagePlace,   a.srMarriagePlace,   font)

  // Section B — Contact Information
  draw(p1, FIELDS.streetAddress, a.srStreetAddress, font)
  draw(p1, FIELDS.townParish,    a.srTownParish,    font)
  // Mailing address — only drawn when srMailingSame !== 'Yes' (ok() skips undefined / __SKIP__)
  draw(p1, FIELDS.mailingStreet, a.srMailingStreet, font)
  draw(p1, FIELDS.mailingParish, a.srMailingParish, font)
  // home/work phone — Phase 3
  draw(p1, FIELDS.cellPhone,     a.srCellPhone,     font)
  draw(p1, FIELDS.email,         a.srEmail,         font)
}

// ── Entry point ───────────────────────────────────────────────────────────────

export async function generateSimplifiedRenewalPDF(answers) {
  const response = await fetch(TEMPLATE_PATH)
  if (!response.ok) {
    throw new Error(`[SR PDF] Could not load template (${response.status}): ${TEMPLATE_PATH}`)
  }
  const pdfBytes = await response.arrayBuffer()

  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
  const font   = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const pages  = pdfDoc.getPages()

  overlayPage1(pages[0], answers, font)
  // overlayPage2(pages[1], answers, font)  // Phase 2

  const outBytes = await pdfDoc.save()
  const blob = new Blob([outBytes], { type: 'application/pdf' })
  return URL.createObjectURL(blob)
}
