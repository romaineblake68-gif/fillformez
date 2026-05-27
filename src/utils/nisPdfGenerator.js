import { PDFDocument, PDFName, PDFString, StandardFonts, rgb } from 'pdf-lib'

const MONTH_NUM = {
  January: '01', February: '02', March: '03',
  April: '04',   May: '05',      June: '06',
  July: '07',    August: '08',   September: '09',
  October: '10', November: '11', December: '12',
}

function pad2(v) { return String(v || '').padStart(2, '0') }
function ok(v) { return v && v !== '__SKIP__' && String(v).trim() !== '' }

function capitalizeName(str) {
  if (!str) return str
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Date fields in this PDF expect YYYY-MM-DD
function fmtDate(day, month, year) {
  if (!day || !month || !year) return null
  return `${year}-${MONTH_NUM[month] || pad2(month)}-${pad2(day)}`
}

const NO_UPPERCASE = new Set(['Email Address'])

// Fill a text field with black 8pt text.
// Overrides the DA string directly so any coloured DA from the original PDF
// cannot survive into the generated appearance.
function setText(form, name, value) {
  if (!ok(value)) return
  try {
    const field = form.getTextField(name)
    field.acroField.dict.set(
      PDFName.of('DA'),
      PDFString.of('/Helvetica 8 Tf 0 0 0 rg'),
    )
    const str = String(value).trim()
    field.setText(NO_UPPERCASE.has(name) ? str : str.toUpperCase())
  } catch (e) {
    console.warn('[NIS] setText failed:', name, e.message)
  }
}

// Tick a single-widget checkbox by name.
// Every NIS checkbox is an independent single-widget field — no multi-widget
// group — so plain .check() is correct and sufficient.
function checkBox(form, name) {
  try {
    form.getCheckBox(name).check()
  } catch (e) {
    console.warn('[NIS] checkBox failed:', name, e.message)
  }
}

// ── Main generator ────────────────────────────────────────────────────────────

export async function generateNISPDF(answers) {
  const res = await fetch('/R2_Individual_Registration_Form.pdf')
  if (!res.ok) throw new Error(`Could not load NIS form: ${res.status}`)
  const srcBytes = await res.arrayBuffer()

  const pdfDoc = await PDFDocument.load(srcBytes, { ignoreEncryption: true })
  const form   = pdfDoc.getForm()

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 1 — Fill all text fields
  // ════════════════════════════════════════════════════════════════════════════

  // ── Personal name ─────────────────────────────────────────────────────────
  setText(form, 'Last Name',   capitalizeName(answers.lastName))
  setText(form, 'First Name',  capitalizeName(answers.firstName))
  if (answers.hasMiddleName === 'Yes')
    setText(form, 'Middle Names', capitalizeName(answers.middleName))
  if (answers.hasMaidenName === 'Yes')
    setText(form, 'Maiden Name if applicable', capitalizeName(answers.maidenName))
  if (answers.hasOtherNames === 'Yes' && ok(answers.otherNames))
    setText(form, 'State all other names including maiden name that you have been known by and submit Deed Poll if applicable', capitalizeName(answers.otherNames))

  // ── Date of birth ─────────────────────────────────────────────────────────
  const dob = fmtDate(answers.birthDay, answers.birthMonth, answers.birthYear)
  if (dob) setText(form, 'Date1_af_date', dob)

  // ── Place of birth ────────────────────────────────────────────────────────
  setText(form, 'Text18', answers.birthParish || answers.birthProvince)
  setText(form, 'Text17', answers.birthCountry === 'Jamaica' ? 'Jamaica' : answers.birthCountryName)

  // ── Previous IDs ──────────────────────────────────────────────────────────
  if (ok(answers.prevNIS))   setText(form, 'Previous National Insurance No', answers.prevNIS)
  if (ok(answers.trnNumber)) setText(form, '7 Taxpayer Registration Number', answers.trnNumber)

  // ── Spouse / union details ─────────────────────────────────────────────────
  const hasSpouse = answers.maritalStatus === 'Married'
  if (hasSpouse) {
    setText(form, 'Last Name_2',  capitalizeName(answers.spouseLastName))
    setText(form, 'First Name_2', capitalizeName(answers.spouseFirstName))
    if (answers.spouseHasMiddle === 'Yes')
      setText(form, 'Middle Names_2', capitalizeName(answers.spouseMiddleName))
    if (ok(answers.spouseMaidenName))
      setText(form, 'Maiden Name of Spouse If applicable', capitalizeName(answers.spouseMaidenName))

    const marriageDate = fmtDate(answers.marriageDay, answers.marriageMonth, answers.marriageYear)
    if (marriageDate) setText(form, 'Date24_af_date', marriageDate)

    const spouseDOB = fmtDate(answers.spouseBirthDay, answers.spouseBirthMonth, answers.spouseBirthYear)
    if (spouseDOB) setText(form, 'Date25_af_date', spouseDOB)
  }

  // ── Home address — 3 lines ─────────────────────────────────────────────────
  setText(form, '12 1', answers.homeDistrict)
  if (answers.hasHomeStreet === 'Yes' && ok(answers.homeStreet))
    setText(form, '12 2', answers.homeStreet)
  const homeParishLine = [answers.homeParish, answers.homeCountry || 'Jamaica'].filter(ok).join(', ')
  if (ok(homeParishLine)) setText(form, '12 3', homeParishLine)

  // ── Mailing address — 3 lines (only if different from home) ───────────────
  if (answers.mailingAddressSame === 'No') {
    setText(form, '13 Mailing Address if different from home address 1', answers.mailingDistrict)
    if (answers.hasMailingStreet === 'Yes' && ok(answers.mailingStreet))
      setText(form, '13 Mailing Address if different from home address 2', answers.mailingStreet)
    const mailParishLine = [answers.mailingParish, answers.mailingCountry || 'Jamaica'].filter(ok).join(', ')
    if (ok(mailParishLine))
      setText(form, '13 Mailing Address if different from home address 3', mailParishLine)
  }

  // ── Contact details ────────────────────────────────────────────────────────
  if (answers.hasEmail === 'Yes' && ok(answers.email))
    setText(form, 'Email Address', answers.email)
  if (ok(answers.homePhone))   setText(form, 'Contact Numbers', answers.homePhone)
  if (ok(answers.cellPhone))   setText(form, 'Mobile',          answers.cellPhone)
  if (answers.hasWorkPhone === 'Yes' && ok(answers.workPhone))
    setText(form, 'Work', answers.workPhone)

  // ── Father's details ───────────────────────────────────────────────────────
  if (ok(answers.fatherLastName))  setText(form, 'Last Name_3',   capitalizeName(answers.fatherLastName))
  if (ok(answers.fatherFirstName)) setText(form, 'First Name_3',  capitalizeName(answers.fatherFirstName))
  if (answers.fatherHasMiddle === 'Yes')
    setText(form, 'Middle Names_3', capitalizeName(answers.fatherMiddleName))

  // ── Mother's details ───────────────────────────────────────────────────────
  setText(form, 'Last Name_4',        capitalizeName(answers.motherLastName))
  setText(form, 'First Name_4',       capitalizeName(answers.motherFirstName))
  if (answers.motherHasMiddle === 'Yes')
    setText(form, 'Middle Names_4',   capitalizeName(answers.motherMiddleName))
  if (ok(answers.motherMaidenName))
    setText(form, 'Mothers Maiden Name', capitalizeName(answers.motherMaidenName))

  // ── Employment ─────────────────────────────────────────────────────────────
  if (['Self-Employed', 'Employed', 'Domestic'].includes(answers.employmentType))
    setText(form, 'Occupation', answers.occupation)
  if (answers.employmentType === 'Employed') {
    setText(form, 'Name of Employer',     capitalizeName(answers.employerName))
    if (ok(answers.employerAddress))   setText(form, 'Address of Employer',    answers.employerAddress)
    if (ok(answers.employerRefNumber)) setText(form, 'Employers Reference No', answers.employerRefNumber)
    if (ok(answers.industryType))      setText(form, 'Type of Industry',       answers.industryType)
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 2 — Tick checkboxes
  // ════════════════════════════════════════════════════════════════════════════

  // Title (Mr / Miss / Mrs only have PDF checkboxes; Ms / Dr have none)
  if (answers.title === 'Mr')   checkBox(form, 'Check Box2')
  if (answers.title === 'Miss') checkBox(form, 'Check Box3')
  if (answers.title === 'Mrs')  checkBox(form, 'Check Box4')

  // Sex
  if (answers.sex === 'Male')   checkBox(form, 'Check Box5')
  if (answers.sex === 'Female') checkBox(form, 'Check Box6')

  // Country of birth
  if (answers.birthCountry === 'Jamaica')         checkBox(form, 'Check Box7')
  if (answers.birthCountry === 'Another country') checkBox(form, 'Check Box8')

  // Marital status — force all five Off first (PDF ships with one pre-checked),
  // then tick only the correct one.
  const allMaritalBoxes = ['Check Box7', 'Check Box8', 'Check Box9', 'Check Box10', 'Check Box11']
  allMaritalBoxes.forEach(name => {
    try {
      const cb = form.getCheckBox(name)
      cb.acroField.dict.set(PDFName.of('V'),  PDFName.of('Off'))
      cb.acroField.dict.set(PDFName.of('AS'), PDFName.of('Off'))
    } catch (e) {}
  })
  const maritalMap = {
    'Single':           'Check Box7',
    'Common-Law Union': 'Check Box8',
    'Married':          'Check Box9',
    'Widowed':          'Check Box10',
    'Divorced':         'Check Box11',
  }
  const maritalBox = maritalMap[answers.maritalStatus]
  if (maritalBox) checkBox(form, maritalBox)

  // Spouse title (only if married / common-law; only Mr / Miss / Mrs in PDF)
  if (hasSpouse) {
    if (answers.spouseTitle === 'Mr')   checkBox(form, 'Check Box14')
    if (answers.spouseTitle === 'Miss') checkBox(form, 'Check Box17')
    if (answers.spouseTitle === 'Mrs')  checkBox(form, 'Check Box18')
  }

  // Employment type
  if (answers.employmentType === 'Self-Employed') checkBox(form, 'Check Box19')
  if (answers.employmentType === 'Employed')      checkBox(form, 'Check Box20')
  if (answers.employmentType === 'Domestic')      checkBox(form, 'Check Box21')
  if (answers.employmentType === 'Student')       checkBox(form, 'Check Box22')
  if (answers.employmentType === 'Unemployed')    checkBox(form, 'Check Box23')

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 3 — Bake all field appearances
  // ════════════════════════════════════════════════════════════════════════════
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  form.getFields().forEach(field => {
    if (field.constructor.name === 'PDFTextField') {
      field.updateAppearances(helvetica)
    }
  })
  // Force black tick marks — ZaDb is the dingbat font used for check marks
  form.getFields().forEach(field => {
    if (field.constructor.name === 'PDFCheckBox') {
      field.acroField.dict.set(PDFName.of('DA'), PDFString.of('/ZaDb 0 Tf 0 0 0 rg'))
      try { field.updateAppearances() } catch {}
    }
  })

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 4 — Flatten and return blob URL
  // ════════════════════════════════════════════════════════════════════════════
  form.flatten()

  const bytes = await pdfDoc.save()
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
}
