import { PDFDocument, PDFName, PDFString, PDFTextField, StandardFonts, rgb } from 'pdf-lib'

const MONTH_NUM = {
  January: '01', February: '02', March: '03',
  April: '04',   May: '05',      June: '06',
  July: '07',    August: '08',   September: '09',
  October: '10', November: '11', December: '12',
}

function pad2(v) { return String(v || '').padStart(2, '0') }
function ok(v) { return v && v !== '__SKIP__' && String(v).trim() !== '' }

// Date comb format: YYYYMMDD (8 chars)
function fmtDateComb(day, month, year) {
  if (!day || !month || !year) return null
  return `${year}${MONTH_NUM[month] || pad2(month)}${pad2(day)}`
}

// Year-only for Voter's ID date fields (MaxLen=4)
function fmtYear(year) {
  return ok(year) ? String(year).trim() : null
}

// Fill a text field with black 8pt text.
// Overrides the field's DA string directly so any blue DA in the original PDF
// is replaced unconditionally before setText() is called.
function setText(form, name, value) {
  if (!ok(value)) return
  try {
    const field = form.getTextField(name)
    // Force black text — set DA on the acroField dict directly so the
    // original form's blue DA cannot survive into the generated appearance.
    field.acroField.dict.set(
      PDFName.of('DA'),
      PDFString.of('/Helvetica 8 Tf 0 0 0 rg'),
    )
    field.setText(String(value).trim())
  } catch (e) {
    console.warn('[TRN] setText failed:', name, e.message)
  }
}

function selectDropdown(form, name, value) {
  if (!ok(value)) return
  try { form.getDropdown(name).select(String(value).trim()) }
  catch (e) { console.warn('[TRN] selectDropdown failed:', name, e.message) }
}

// Select one checkbox option by widget index.
//
// pdf-lib's acroField.setValue() validates that the value equals widget[0]'s
// on-value — it throws InvalidAcroFieldValueError for any other widget.
// We bypass this by setting the 'V' key directly on the acroField dict, then
// also setting each widget's appearance state so PDF readers that don't use
// the AP stream still render correctly.
//
// form.updateFieldAppearances() (called after all checkOption calls) reads 'V'
// and regenerates the AP streams, making the correct widget appear checked.
function checkOption(form, name, targetIndex) {
  try {
    const cb      = form.getCheckBox(name)
    const widgets = cb.acroField.getWidgets()
    const onValue = widgets[targetIndex]?.getOnValue()

    if (!onValue) {
      // Single-widget or no on-value — fall back to standard .check()
      cb.check()
      return
    }

    // Set the field value directly (bypasses the single-widget-only validation)
    cb.acroField.dict.set(PDFName.of('V'), onValue)

    // Also set each widget's AS so readers that check AS before AP work too
    widgets.forEach((widget, i) => {
      widget.setAppearanceState(i === targetIndex ? onValue : PDFName.of('Off'))
    })
  } catch (e) {
    console.warn('[TRN] checkOption failed:', name, targetIndex, e.message)
  }
}

// ── Tax office answer → exact dropdown string in the PDF ─────────────────────
// Dropdown "21" options confirmed via field inspection:
// Constant Spring Revenue Centre | Kings Street Revenue Centre |
// Mandeville Revenue Centre | Montego Bay Revenue Centre | Annotto Bay |
// Black River | Cross Roads | Falmouth | Lucea | May Pen | Morant Bay |
// Old Harbour | Port Antonio | Portmore | Savanna-la-mar | Spanish Town |
// St. Ann's Bay | ...
const TAX_OFFICE_DROPDOWN = {
  'Kingston — Constant Spring':    'Constant Spring Revenue Centre',
  'Kingston — Half Way Tree':      'Kings Street Revenue Centre',
  'Kingston — May Pen Road':       'Kings Street Revenue Centre',
  'St. Andrew — Cross Roads':      'Cross Roads',
  'St. Andrew — Portmore':         'Portmore',
  'St. Thomas — Morant Bay':       'Morant Bay',
  'Portland — Port Antonio':       'Port Antonio',
  'St. Mary — Annotto Bay':        'Annotto Bay',
  "St. Ann — St. Ann's Bay":       "St. Ann's Bay",
  'Trelawny — Falmouth':           'Falmouth',
  'St. James — Montego Bay':       'Montego Bay Revenue Centre',
  'Hanover — Lucea':               'Lucea',
  'Westmoreland — Savanna-la-Mar': 'Savanna-la-mar',
  'St. Elizabeth — Black River':   'Black River',
  'St. Elizabeth — Santa Cruz':    'Santa Cruz',
  'Manchester — Mandeville':       'Mandeville Revenue Centre',
  'Clarendon — May Pen':           'May Pen',
  'St. Catherine — Spanish Town':  'Spanish Town',
  'St. Catherine — Old Harbour':   'Old Harbour',
}

// Preferred contact method → CheckBox "12" widget index
// Confirmed PDF widget order: [0]=Phone call [1]=Fax [2]=Email [3]=SMS [4]=Mail
const CONTACT_IDX = {
  'Phone call': 0,
  'Fax':        1,
  'Email':      2,
  'SMS':        3,
  'Mail':       4,
}

// ID type → widget index for CheckBox "18" and field suffix (n = idRow + 1)
// Confirmed widget order from field inspection:
//   CheckBox "18" widgets=5 [0]=/1 [1]=/2 [2]=/3 [3]=/4 [4]=/5
//   Row 0 → Driver's Licence  → suffix 1 → 18_DocNumber1, 18_IssueDate1 (comb 8), 18_ExpiryDate1 (comb 8)
//   Row 1 → Passport          → suffix 2 → 18_DocNumber2, 18_IssueDate2 (comb 8), 18_ExpiryDate2 (comb 8)
//   Row 2 → Elector Reg. ID   → suffix 3 → 18_DocNumber3, 18_IssueDate3 (comb 4), 18_ExpiryDate3 (comb 4)
//   Row 3 → Birth Certificate  → suffix 4 → 18_DocNumber4, 18_Country_of_Issue4 (no date fields)
//   Row 4 → Other ID          → suffix 5 → 18_DocNumber5, 18_IssueDate5 (comb 8), 18_ExpiryDate5 (comb 8)
const ID_ROW = {
  "Driver's Licence":        0,
  'Passport':                1,
  'Elector Registration ID': 2,
  'Birth Certificate':       3,
  'Other ID':                4,
}

// ── Main generator ────────────────────────────────────────────────────────────

export async function generateTRNPDF(answers) {
  const res = await fetch('/trn_form1_01082016.pdf')
  if (!res.ok) throw new Error(`Could not load TRN form: ${res.status}`)
  const srcBytes = await res.arrayBuffer()

  const pdfDoc = await PDFDocument.load(srcBytes, { ignoreEncryption: true })
  const form   = pdfDoc.getForm()

  // ── Field inspection log (DevTools console) ────────────────────────────────
  const allFields = form.getFields()
  console.group(
    `%c[FillFormEasy] TRN — ${allFields.length} fields`,
    'color:#1a6fe8;font-weight:bold;font-size:13px'
  )
  console.log('All field names:', allFields.map(f => f.getName()))
  allFields.forEach(f => {
    const type = f.constructor.name
    const name = f.getName()
    if (type === 'PDFTextField') {
      let maxLen = '—'; let isCombed = false
      try { const ml = f.acroField.dict.lookup(PDFName.of('MaxLen')); if (ml) maxLen = ml.asNumber() } catch {}
      try { isCombed = f.isCombed() } catch {}
      console.log(`  TextField  "${name}"${isCombed ? ' [COMB]' : ''}${maxLen !== '—' ? ` MaxLen=${maxLen}` : ''}`)
    } else if (type === 'PDFCheckBox') {
      const widgets = f.acroField.getWidgets()
      const onVals = widgets.map((w, i) => {
        try { return `[${i}]=${w.getOnValue()?.encodedName ?? '?'}` } catch { return `[${i}]=?` }
      })
      console.log(`  CheckBox   "${name}" (${widgets.length} widgets) ${onVals.join(' ')}`)
    } else if (type === 'PDFDropdown') {
      let opts = []; try { opts = f.getOptions() } catch {}
      console.log(`  Dropdown   "${name}" [${opts.join(' | ')}]`)
    } else {
      console.log(`  ${type} "${name}"`)
    }
  })
  console.groupEnd()
  // ── End inspection ─────────────────────────────────────────────────────────

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 1 — Fill all text fields and dropdowns
  // ════════════════════════════════════════════════════════════════════════════

  // ── Current legal name ────────────────────────────────────────────────────
  setText(form, '1L_Name', answers.lastName)
  setText(form, '1F_Name', answers.firstName)
  if (answers.hasMiddleName === 'Yes') setText(form, '1M_Name', answers.middleName)

  // ── Name at birth (only if last name changed) ─────────────────────────────
  if (answers.sameBirthLastName === 'No') {
    setText(form, '2L_Name', answers.birthLastName)
    setText(form, '2F_Name', answers.firstName)
    if (answers.hasMiddleName === 'Yes') setText(form, '2M_Name', answers.middleName)
    if (answers.nameChangeReason === 'Other') setText(form, '3text', answers.nameChangeReason)
  }

  // ── DOB — COMB field "6", format YYYYMMDD ─────────────────────────────────
  const dobComb = fmtDateComb(answers.birthDay, answers.birthMonth, answers.birthYear)
  if (dobComb) setText(form, '6', dobComb)

  // ── Place of birth ─────────────────────────────────────────────────────────
  if (answers.birthCountry === 'Jamaica') {
    selectDropdown(form, '8', answers.birthParish)
    try { form.getDropdown('8').acroField.dict.set(PDFName.of('DA'), PDFString.of('/Helvetica 8 Tf 0 0 0 rg')) } catch {}
    setText(form, '9', answers.birthTown)
  } else {
    setText(form, '7text', answers.birthCountryName) // "Other - Specify" country
    setText(form, '9', answers.birthCityAbroad)
  }

  // ── Nationality write-in (non-Jamaican only) ──────────────────────────────
  if (answers.nationality === 'Other') {
    setText(form, '10text', answers.nationalityOther)
  }

  // ── Occupation ────────────────────────────────────────────────────────────
  setText(form, '16', answers.occupation)

  // NIS number is drawn directly on the page in Phase 4 for precise Y placement.

  // ── Phone numbers / email (Section 11) ───────────────────────────────────
  if (ok(answers.cellPhone))          setText(form, '11a_Cell', answers.cellPhone)
  if (ok(answers.homePhone))          setText(form, '11a_Home', answers.homePhone)
  if (answers.hasWorkPhone === 'Yes') setText(form, '11a_Work', answers.workPhone)
  if (answers.hasEmail === 'Yes')     setText(form, '11c_Email', answers.email)

  // ── Preferred contact telephone number (Section 12) ──────────────────────
  // 12a = "State tel. no" beside Phone call option
  // Fill with cell phone if available, otherwise home phone
  const preferredPhone = ok(answers.cellPhone) ? answers.cellPhone : answers.homePhone
  if (ok(preferredPhone)) setText(form, '12a', preferredPhone)

  // ── Home address (Section 13a) ─────────────────────────────────────────────
  // 13a_1=district  13a_3=street  13a_5=P.O.Box  13a_6=parish  13a_7=postal  13a_8=country
  setText(form, '13a_1', answers.homeDistrict)
  setText(form, '13a_3', answers.homeStreet)
  if (answers.hasPoBox === 'Yes') setText(form, '13a_5', answers.poBox)
  setText(form, '13a_6', answers.homeParish)
  if (ok(answers.homePostalCode)) setText(form, '13a_7', answers.homePostalCode)
  setText(form, '13a_8', answers.homeCountry || 'Jamaica')

  // ── Mailing address (Section 13b, only if different) ─────────────────────
  if (answers.mailingAddressSame === 'No') {
    setText(form, '13b_1', answers.mailingDistrict)
    setText(form, '13b_3', answers.mailingStreet)
    setText(form, '13b_6', answers.mailingParish)
    if (ok(answers.mailingPostalCode)) setText(form, '13b_7', answers.mailingPostalCode)
    setText(form, '13b_8', answers.mailingCountry || 'Jamaica')
  }

  // ── Mother's name (Section 14) ────────────────────────────────────────────
  setText(form, '14F_Name',      answers.motherFirstName)
  if (answers.motherHasMiddleName === 'Yes') setText(form, '14M_Name', answers.motherMiddleName)
  setText(form, '14Maiden_Name', answers.motherMaidenName)

  // ── Spouse's name (Section 15, only if ever married) ─────────────────────
  if (['Married', 'Divorced', 'Widowed'].includes(answers.maritalStatus)) {
    setText(form, '15F_Name', answers.spouseFirstName)
    if (answers.spouseHasMiddleName === 'Yes') setText(form, '15M_Name', answers.spouseMiddleName)
    setText(form, '15L_Name', answers.spouseLastName)
  }

  // ── Employer / Business name (Section 20) ─────────────────────────────────
  if (answers.hasBusiness === 'Yes') setText(form, '20', answers.businessName)

  // ── Tax collection office (Dropdown 21) ───────────────────────────────────
  if (ok(answers.taxOffice)) {
    const dropVal = TAX_OFFICE_DROPDOWN[answers.taxOffice]
    if (dropVal) {
      selectDropdown(form, '21', dropVal)
      try { form.getDropdown('21').acroField.dict.set(PDFName.of('DA'), PDFString.of('/Helvetica 8 Tf 0 0 0 rg')) } catch {}
    }
  }

  // ── ID document (Section 18) ───────────────────────────────────────────────
  // ID_ROW maps ID type → widget index AND field suffix (n = idRow + 1)
  const idRow = ID_ROW[answers.idType]
  if (idRow !== undefined) {
    const n = idRow + 1  // field suffix 1–5

    setText(form, `18_DocNumber${n}`, answers.idNumber)

    if (idRow === 2) {
      // Elector Registration ID — year-only date fields (MaxLen=4)
      const issYr = fmtYear(answers.idIssueYear)
      if (issYr) setText(form, `18_IssueDate${n}`, issYr)
      if (answers.idHasExpiry === 'Yes') {
        const expYr = fmtYear(answers.idExpiryYear)
        if (expYr) setText(form, `18_ExpiryDate${n}`, expYr)
      }
    } else if (idRow === 3) {
      // Birth Certificate — no date fields in the PDF; country only
      setText(form, `18_Country_of_Issue${n}`, answers.idCountryOfIssue || 'Jamaica')
    } else {
      // Driver's Licence (0) / Passport (1) / Other (4) — YYYYMMDD comb dates
      const issDate = fmtDateComb(answers.idIssueDay, answers.idIssueMonth, answers.idIssueYear)
      if (issDate) setText(form, `18_IssueDate${n}`, issDate)
      if (answers.idHasExpiry === 'Yes') {
        const expDate = fmtDateComb(answers.idExpiryDay, answers.idExpiryMonth, answers.idExpiryYear)
        if (expDate) setText(form, `18_ExpiryDate${n}`, expDate)
      }
      setText(form, `18_Country_of_Issue${n}`, answers.idCountryOfIssue || 'Jamaica')
      if (idRow === 4) setText(form, '18_text5', 'Other')
    }
  }

  // ── Representative / Agent (only if applying on behalf of someone) ─────────
  if (answers.fillingForSomeoneElse === 'Yes') {
    setText(form, 'RepType',      answers.agentRelationship)
    setText(form, 'RepTRN',       answers.agentTRN)
    setText(form, 'RepName',      answers.agentFullName)
    setText(form, 'RepNameCOPY',  answers.agentFullName)
    const applicantName = [answers.firstName, answers.lastName].filter(ok).join(' ')
    setText(form, 'ApplcntName',  applicantName)
  }

  // ── Application date (auto) ───────────────────────────────────────────────
  const today = new Date().toLocaleDateString('en-JM', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
  setText(form, 'ApplicationDate', today)

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 2 — Set all checkbox values
  //
  // checkOption() sets the 'V' key directly on the acroField dict and also
  // sets each widget's AS (appearance state).
  //
  // form.updateFieldAppearances() in Phase 3 reads 'V' and regenerates AP
  // streams accordingly. This order (set values → updateFieldAppearances) is
  // critical: reversing it resets our selections.
  // ════════════════════════════════════════════════════════════════════════════

  // Application type: [0]=First time (/Yes), [1]=Update (/No)
  checkOption(form, 'Check Box1', answers.firstTime === 'Yes, first time' ? 0 : 1)

  // Name change reason: [0]=Adoption, [1]=Marriage, [2]=Deed Poll, [3]=Other
  if (answers.sameBirthLastName === 'No' && ok(answers.nameChangeReason)) {
    const CHANGE_IDX = { Adoption: 0, Marriage: 1, 'Deed Poll': 2, Other: 3 }
    const ci = CHANGE_IDX[answers.nameChangeReason]
    if (ci !== undefined) checkOption(form, '3', ci)
  }

  // Sex: [0]=Male, [1]=Female
  if (answers.sex === 'Male')   checkOption(form, '4', 0)
  if (answers.sex === 'Female') checkOption(form, '4', 1)

  // Marital status: [0]=Single, [1]=Married, [2]=Divorced, [3]=Widowed
  const MS_IDX = { Single: 0, Married: 1, Divorced: 2, Widowed: 3 }
  if (answers.maritalStatus && MS_IDX[answers.maritalStatus] !== undefined) {
    checkOption(form, '5', MS_IDX[answers.maritalStatus])
  }

  // Country of birth: [0]=Jamaica, [1]=Abroad
  checkOption(form, '7', answers.birthCountry === 'Jamaica' ? 0 : 1)

  // Nationality: [0]=Jamaican, [1]=Other
  if (answers.nationality === 'Jamaican')   checkOption(form, '10', 0)
  else if (answers.nationality === 'Other') checkOption(form, '10', 1)

  // Preferred contact: [0]=Phone call, [1]=Fax, [2]=SMS, [3]=Email, [4]=Mail
  if (ok(answers.contactMethod)) {
    const cidx = CONTACT_IDX[answers.contactMethod]
    if (cidx !== undefined) checkOption(form, '12', cidx)
  }

  // ID type: widget index matches ID_ROW value
  // [0]=Driver's Licence, [1]=Passport, [2]=Elector ID, [3]=Birth Cert, [4]=Other
  if (idRow !== undefined) checkOption(form, '18', idRow)

  // Business / Trade (Section 19): [0]=Yes, [1]=No
  checkOption(form, '19', answers.hasBusiness === 'Yes' ? 0 : 1)

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 3 — Bake all field appearances
  // Reads 'V' for checkboxes and DA string for text fields to generate AP streams.
  // Must run after all values are set (Phases 1 & 2).
  // ════════════════════════════════════════════════════════════════════════════
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  form.getFields().forEach(field => {
    if (field.constructor.name === 'PDFTextField') {
      field.updateAppearances(helvetica)
    }
  })
  // Force black tick marks on every checkbox.
  // Set DA at both the acroField level AND each widget level so any per-widget
  // DA in the original PDF cannot override the colour we want.
  // Then call updateAppearances() to regenerate the AP streams in black.
  form.getFields().forEach(field => {
    if (field.constructor.name === 'PDFCheckBox') {
      const blackDA = PDFString.of('/ZaDb 0 Tf 0 0 0 rg')
      field.acroField.dict.set(PDFName.of('DA'), blackDA)
      field.acroField.getWidgets().forEach(widget => {
        try { widget.dict.set(PDFName.of('DA'), blackDA) } catch {}
      })
      try { field.updateAppearances() } catch {}
    }
  })

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 4 — Comb field character drawing
  //
  // Whitelist: ONLY these fields ever get rectangles and characters drawn.
  // Every other field in the form is skipped, no exceptions.
  // ════════════════════════════════════════════════════════════════════════════
  const COMB_FIELDS = new Set([
    '6',
    '18_IssueDate1', '18_IssueDate2', '18_IssueDate3', '18_IssueDate5',
    '18_ExpiryDate1', '18_ExpiryDate2', '18_ExpiryDate3', '18_ExpiryDate5',
  ])

  const pages = pdfDoc.getPages()

  // Map every widget annotation dict → page index
  const widgetPage = new Map()
  pages.forEach((page, pi) => {
    try {
      const annots = page.node.Annots()
      if (!annots) return
      for (let i = 0; i < annots.size(); i++) {
        try {
          const dict = pdfDoc.context.lookup(annots.get(i))
          if (dict) widgetPage.set(dict, pi)
        } catch {}
      }
    } catch {}
  })

  // ── NIS number — drawn directly at a controlled Y position ──────────────────
  // Using direct page drawing (not setText) lets us place the text below the
  // in-field "NIS Number" label rather than at pdf-lib's default top baseline.
  if (answers.hasNIS === 'Yes' && ok(answers.nisNumber)) {
    try {
      const nisField = form.getTextField('17')
      const nisWidget = nisField.acroField.getWidgets()[0]
      if (nisWidget) {
        const pi   = widgetPage.get(nisWidget.dict) ?? 0
        const page = pages[pi]
        const rect = nisWidget.getRectangle()
        page.drawText(String(answers.nisNumber).trim(), {
          x: rect.x + 4,
          y: rect.y + 3,
          size: 7,
          font: helvetica,
          color: rgb(0, 0, 0),
        })
        try { nisWidget.dict.delete(PDFName.of('AP')) } catch {}
        try { nisWidget.dict.delete(PDFName.of('MK')) } catch {}
      }
    } catch (e) { console.warn('[TRN] NIS draw:', e.message) }
  }

  const FONT_SIZE = 8

  form.getFields().forEach(field => {
    // Whitelist check — skip anything not in the approved set
    if (!COMB_FIELDS.has(field.getName())) return

    const maxLen = field.getMaxLength?.() ?? 0
    if (!maxLen) return

    // Skip if the field has no value — draw nothing on empty comb cells
    let value
    try { value = field.getText() } catch { return }
    if (!value || !value.trim()) return
    const str = value.trim()

    field.acroField.getWidgets().forEach(widget => {
      const pi   = widgetPage.get(widget.dict) ?? 0
      const page = pages[pi]
      const rect = widget.getRectangle()
      const cellW = rect.width / maxLen

      // Draw each character centred in its cell
      ;[...str].forEach((ch, i) => {
        if (i >= maxLen) return
        const charW = helvetica.widthOfTextAtSize(ch, FONT_SIZE)
        const x = rect.x + i * cellW + (cellW - charW) / 2
        const y = rect.y + (rect.height - FONT_SIZE) / 2
        try {
          page.drawText(ch, { x, y, size: FONT_SIZE, font: helvetica, color: rgb(0, 0, 0) })
        } catch {}
      })

      // Strip form appearance so flatten() doesn't paint a second layer
      try { widget.dict.delete(PDFName.of('AP')) } catch {}
      try { widget.dict.delete(PDFName.of('MK')) } catch {}
    })

    // Clear field value so the widget renders nothing when flattened
    try { field.setText('') } catch {}
  })

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE 5 — Flatten and return blob URL
  // ════════════════════════════════════════════════════════════════════════════

  form.flatten()

  const bytes = await pdfDoc.save()
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
}
