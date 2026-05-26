import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

// Driver's Licence Application Form DL1 — likely scanned (image-based).
// We inspect for AcroForm fields on every load; if found, we fill them directly.
// If none, we overlay text using drawText() at fixed coordinates.
//
// CALIBRATION GUIDE (overlay mode)
//   1. Place Drivers-Licence-Application-Form.pdf in the /public folder.
//   2. Complete the DL flow, download the PDF, open it.
//   3. Compare each text value against the printed field on the form.
//   4. Adjust row anchors in PI/PD/LH/DE objects — shifts whole rows at once.
//   5. Then fine-tune individual x values in FIELDS for horizontal alignment.
//   6. x=0 is LEFT edge, y=0 is BOTTOM edge (pdf-lib origin).
//   7. Page size: 612 × 792 pts (US Letter).

const TEMPLATE_PATH = '/Drivers-Licence-Application-Form.pdf'
const BLACK = rgb(0, 0, 0)

// ── Helpers ───────────────────────────────────────────────────────────────────

function ok(v) { return v && v !== '__SKIP__' && String(v).trim() !== '' }

function pad2(v) { return String(v || '').padStart(2, '0') }

const MONTH_NUM = {
  January: '01', February: '02', March: '03',
  April: '04',   May: '05',      June: '06',
  July: '07',    August: '08',   September: '09',
  October: '10', November: '11', December: '12',
}

// ── Row anchors ───────────────────────────────────────────────────────────────
// y = text baseline from BOTTOM of page. Adjust these first when calibrating.
// ALL VALUES APPROX — verify against the printed form.

const PI = {                    // Personal Information
  lastName:     680,            // APPROX row 1
  firstNames:   658,            // APPROX row 2
  phones:       635,            // APPROX row 3 — home | work | mobile (3 columns)
  email:        612,            // APPROX row 4
  trn:          590,            // APPROX row 5
  residence:    568,            // APPROX row 6 (can be long — use size 8)
}

const PD = {                    // Personal Details
  ageNextBirthday: 530,         // APPROX row 7
  dob:             508,         // APPROX row 8 — DD | MM | YYYY
  placeOfBirth:    486,         // APPROX row 9
  citizenship:     464,         // APPROX row 10
}

const LH = {                    // Licence History
  hasLicence:         428,      // APPROX row 11 — Yes/No text
  licenceAuthority:   406,      // APPROX row 12
  refused:            384,      // APPROX row 13 — Yes/No text
  refusedAuthority:   362,      // APPROX row 14
  refusedDate:        340,      // APPROX row 15
  suspended:          318,      // APPROX row 16 — Yes/No text
  suspendedAuthority: 296,      // APPROX row 17
}

const DE = {                    // Declaration
  readWriteEnglish:   260,      // APPROX row 18 — Yes/No text
}

// ── Field coordinate table ────────────────────────────────────────────────────
// All APPROX — calibrate after visual inspection.

const FIELDS = {
  lastName:           { x:  96, y: PI.lastName,          size: 9 }, // APPROX
  firstNames:         { x:  96, y: PI.firstNames,        size: 9 }, // APPROX

  // Three phone columns on same row
  homePhone:          { x:  96, y: PI.phones,            size: 8 }, // APPROX
  workPhone:          { x: 252, y: PI.phones,            size: 8 }, // APPROX
  mobilePhone:        { x: 416, y: PI.phones,            size: 8 }, // APPROX

  email:              { x:  96, y: PI.email,             size: 9 }, // APPROX
  trn:                { x:  96, y: PI.trn,               size: 9 }, // APPROX
  residence:          { x:  96, y: PI.residence,         size: 8 }, // APPROX — address can be long

  ageNextBirthday:    { x:  96, y: PD.ageNextBirthday,  size: 9 }, // APPROX
  birthDay:           { x:  96, y: PD.dob,              size: 9 }, // APPROX
  birthMonth:         { x: 148, y: PD.dob,              size: 9 }, // APPROX
  birthYear:          { x: 210, y: PD.dob,              size: 9 }, // APPROX
  placeOfBirth:       { x:  96, y: PD.placeOfBirth,     size: 9 }, // APPROX
  citizenship:        { x:  96, y: PD.citizenship,      size: 9 }, // APPROX

  hasLicence:         { x:  96, y: LH.hasLicence,       size: 9 }, // APPROX
  licenceAuthority:   { x:  96, y: LH.licenceAuthority, size: 9 }, // APPROX
  refused:            { x:  96, y: LH.refused,          size: 9 }, // APPROX
  refusedAuthority:   { x:  96, y: LH.refusedAuthority, size: 9 }, // APPROX
  refusedDate:        { x:  96, y: LH.refusedDate,      size: 9 }, // APPROX
  suspended:          { x:  96, y: LH.suspended,        size: 9 }, // APPROX
  suspendedAuthority: { x:  96, y: LH.suspendedAuthority, size: 9 }, // APPROX

  readWriteEnglish:   { x:  96, y: DE.readWriteEnglish, size: 9 }, // APPROX
}

// Draw helper — silently skips null/skip values.
function draw(page, field, value, font) {
  if (!ok(value)) return
  page.drawText(String(value).trim(), {
    x:    field.x,
    y:    field.y,
    size: field.size || 9,
    font,
    color: BLACK,
  })
}

// ── AcroForm fill — used if the PDF ever gains fillable fields ────────────────

function setText(form, name, value, font) {
  if (!ok(value)) return
  try {
    const field = form.getTextField(name)
    field.setText(String(value).trim())
    if (font) field.updateAppearances(font)
  } catch {
    console.warn(`[DL PDF] AcroForm field not found: "${name}"`)
  }
}

function fillAcroForm(form, answers, font) {
  const a = answers
  const dob = [pad2(a.dlBirthDay), MONTH_NUM[a.dlBirthMonth] || a.dlBirthMonth, a.dlBirthYear]
    .filter(Boolean).join('/')

  setText(form, 'Last Name',            a.dlLastName,         font)
  setText(form, 'First and Middle Names', a.dlFirstNames,     font)
  setText(form, 'Home Phone',           a.dlHomePhone,        font)
  setText(form, 'Work Phone',           a.dlWorkPhone,        font)
  setText(form, 'Mobile',               a.dlMobilePhone,      font)
  setText(form, 'Email',                a.dlEmail,            font)
  setText(form, 'TRN',                  a.dlTRN,              font)
  setText(form, 'Place of Residence',   a.dlResidence,        font)
  setText(form, 'Age Next Birthday',    a.dlAgeNextBirthday,  font)
  setText(form, 'Date of Birth',        dob,                  font)
  setText(form, 'Place of Birth',       a.dlPlaceOfBirth,     font)
  setText(form, 'Citizenship',          a.dlCitizenship,      font)
  setText(form, 'Licence Issued',       a.dlHasLicence,       font)
  setText(form, 'Licensing Authority',  a.dlLicenceAuthority, font)
  setText(form, 'Refused',              a.dlRefused,          font)
  setText(form, 'Refused Authority',    a.dlRefusedAuthority, font)
  setText(form, 'Refused Date',         a.dlRefusedDate,      font)
  setText(form, 'Suspended',            a.dlSuspended,        font)
  setText(form, 'Suspended Authority',  a.dlSuspendedAuthority, font)
  setText(form, 'Read Write English',   a.dlReadWriteEnglish, font)
}

// ── Overlay — used when PDF has no AcroForm fields ───────────────────────────

function overlayAnswers(page, answers, font) {
  const a = answers

  draw(page, FIELDS.lastName,   a.dlLastName,   font)
  draw(page, FIELDS.firstNames, a.dlFirstNames, font)

  draw(page, FIELDS.homePhone,   a.dlHomePhone,   font)
  draw(page, FIELDS.workPhone,   a.dlWorkPhone,   font)
  draw(page, FIELDS.mobilePhone, a.dlMobilePhone, font)

  draw(page, FIELDS.email,     a.dlEmail,     font)
  draw(page, FIELDS.trn,       a.dlTRN,       font)
  draw(page, FIELDS.residence, a.dlResidence, font)

  draw(page, FIELDS.ageNextBirthday, a.dlAgeNextBirthday, font)
  draw(page, FIELDS.birthDay,   pad2(a.dlBirthDay),                          font)
  draw(page, FIELDS.birthMonth, MONTH_NUM[a.dlBirthMonth] || a.dlBirthMonth, font)
  draw(page, FIELDS.birthYear,  a.dlBirthYear,                               font)
  draw(page, FIELDS.placeOfBirth, a.dlPlaceOfBirth, font)
  draw(page, FIELDS.citizenship,  a.dlCitizenship,  font)

  draw(page, FIELDS.hasLicence,       a.dlHasLicence,         font)
  draw(page, FIELDS.licenceAuthority, a.dlLicenceAuthority,   font)
  draw(page, FIELDS.refused,          a.dlRefused,            font)
  draw(page, FIELDS.refusedAuthority, a.dlRefusedAuthority,   font)
  draw(page, FIELDS.refusedDate,      a.dlRefusedDate,        font)
  draw(page, FIELDS.suspended,        a.dlSuspended,          font)
  draw(page, FIELDS.suspendedAuthority, a.dlSuspendedAuthority, font)

  draw(page, FIELDS.readWriteEnglish, a.dlReadWriteEnglish, font)
}

// ── Entry point ───────────────────────────────────────────────────────────────

export async function generateDLPDF(answers) {
  const response = await fetch(TEMPLATE_PATH)
  if (!response.ok) {
    throw new Error(`[DL PDF] Could not load template (${response.status}): ${TEMPLATE_PATH}`)
  }
  const pdfBytes = await response.arrayBuffer()

  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
  const font   = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const form   = pdfDoc.getForm()
  const pages  = pdfDoc.getPages()

  const fields = form.getFields()
  if (fields.length > 0) {
    console.info(`[DL PDF] ${fields.length} AcroForm field(s) found — filling directly.`)
    fields.forEach(f => console.info(`  ${f.constructor.name}: "${f.getName()}"`))
    fillAcroForm(form, answers, font)
    try { form.flatten() } catch (e) {
      console.warn('[DL PDF] flatten() failed — returning unflatted PDF:', e.message)
    }
  } else {
    console.info('[DL PDF] No AcroForm fields — using drawText overlay.')
    overlayAnswers(pages[0], answers, font)
  }

  const outBytes = await pdfDoc.save()
  const blob = new Blob([outBytes], { type: 'application/pdf' })
  return URL.createObjectURL(blob)
}
