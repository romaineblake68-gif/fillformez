import { PDFDocument, PDFName, PDFTextField, StandardFonts, rgb } from 'pdf-lib'
import { SKIP } from '../data/passportFlow'

const MONTH_NUM = {
  January: '01', February: '02', March: '03',
  April: '04',   May: '05',      June: '06',
  July: '07',    August: '08',   September: '09',
  October: '10', November: '11', December: '12',
}

function pad2(val) { return String(val || '').padStart(2, '0') }

function fmtDate(day, month, year) {
  if (!day || !month || !year) return null
  return `${pad2(day)}/${MONTH_NUM[month] || pad2(month)}/${year}`
}

// For 8-cell comb date fields (DDMMYYYY) — no slashes, fits MaxLen exactly
function fmtDateComb(day, month, year) {
  if (!day || !month || !year) return null
  return `${pad2(day)}${MONTH_NUM[month] || pad2(month)}${year}`
}

function ok(val) { return val && val !== SKIP && String(val).trim() !== '' }

// ── Helpers ────────────────────────────────────────────────────────────────────

const NO_UPPERCASE = new Set(['Email_Address'])

function setText(form, name, value) {
  if (!ok(value)) return
  try {
    const str = String(value).trim()
    form.getTextField(name).setText(NO_UPPERCASE.has(name) ? str : str.toUpperCase())
  } catch (e) {
    console.warn('[FillFormEasy] setText failed:', name, e.message)
  }
}

// For radio groups whose options are unique strings (Sex, Marital Status)
function selectRadio(form, groupName, value) {
  if (!value) return
  try {
    form.getRadioGroup(groupName).select(String(value))
  } catch (e) {
    console.warn('[FillFormEasy] selectRadio failed:', groupName, e.message)
  }
}

// For radio groups where all options are "Yes" — must select by widget index
function selectRadioByIndex(form, groupName, targetIndex) {
  try {
    const widgets = form.getRadioGroup(groupName).acroField.getWidgets()
    widgets.forEach((widget, i) => {
      const onVal = widget.getOnValue()
      widget.setAppearanceState(i === targetIndex ? onVal : PDFName.of('Off'))
    })
  } catch (e) {
    console.warn('[FillFormEasy] selectRadioByIndex failed:', groupName, e.message)
  }
}

// Fill a long string across multiple numbered text fields (field1, field2, …)
function setTextSplit(form, baseName, count, value) {
  if (!ok(value)) return
  const str = String(value).trim()
  const chunkSize = Math.ceil(str.length / count)
  for (let i = 0; i < count; i++) {
    const chunk = str.slice(i * chunkSize, (i + 1) * chunkSize)
    if (chunk) setText(form, `${baseName}${i + 1}`, chunk)
  }
}

// ── Core generator ─────────────────────────────────────────────────────────────

export async function generatePassportPDF({
  aAnswers    = {},
  bAnswers    = {},
  cAnswers    = {},
  dAnswers    = {},
  ePassportNumber = '',
  isFirstTime = null,
  passportStatus  = 'renewing',
  f1Answers   = {},
  f2Answers   = {},
}) {
  const res = await fetch('/Jamaica-Passport-Application-Compressed.pdf')
  if (!res.ok) throw new Error(`Could not load passport form: ${res.status}`)
  const srcBytes = await res.arrayBuffer()

  const pdfDoc = await PDFDocument.load(srcBytes, { ignoreEncryption: true })
  const form = pdfDoc.getForm()

  // ── Full field inspection — open browser DevTools console to read this ───────
  const allFields = form.getFields()
  console.group(
    `%c[FillFormEasy] FIELD INSPECTION — ${allFields.length} fields`,
    'color:#1a6fe8;font-weight:bold;font-size:13px'
  )

  allFields.forEach(f => {
    const type = f.constructor.name  // PDFTextField | PDFRadioGroup | PDFCheckBox | …
    const name = f.getName()

    if (type === 'PDFTextField') {
      let maxLen = '—'
      let isCombed = false
      try {
        const ml = f.acroField.dict.lookup(PDFName.of('MaxLen'))
        if (ml) maxLen = ml.asNumber()
      } catch {}
      try { isCombed = f.isCombed() } catch {}

      const combTag  = isCombed ? ' [COMB]' : ''
      const maxTag   = maxLen !== '—' ? ` MaxLen=${maxLen}` : ''
      console.log(`  TextField      "${name}"${combTag}${maxTag}`)

    } else if (type === 'PDFRadioGroup') {
      let optionValues = []
      try {
        const widgets = f.acroField.getWidgets()
        optionValues = widgets.map((w, i) => {
          let onVal = '?'
          try { onVal = w.getOnValue()?.encodedName ?? w.getOnValue()?.decodeText?.() ?? String(w.getOnValue()) } catch {}
          return `[${i}]=${onVal}`
        })
      } catch {}
      console.log(`  RadioGroup     "${name}" options: ${optionValues.join(', ')}`)

    } else if (type === 'PDFCheckBox') {
      let onVal = '?'
      try {
        const widgets = f.acroField.getWidgets()
        onVal = widgets[0]?.getOnValue()?.encodedName ?? '?'
      } catch {}
      console.log(`  CheckBox       "${name}" onValue=${onVal}`)

    } else {
      console.log(`  ${type.padEnd(14)} "${name}"`)
    }
  })

  console.groupEnd()
  // ── End inspection ────────────────────────────────────────────────────────────

  // ── Section A — Personal Information ──────────────────────────────────────

  setText(form, 'Applicant_Surname',        aAnswers.surname)
  setText(form, 'Applicant_Firstname',      aAnswers.firstName)
  setText(form, 'Applicant_Middle_Name',    aAnswers.middleName)
  setText(form, 'Applicant_Maiden_Surname', aAnswers.maidenSurname)
  setText(form, 'Applicant_Previous_Name',  aAnswers.previousName)

  // Profession: fill first row; only overflow to second row if text is too long
  const occupation = aAnswers.occupation ? String(aAnswers.occupation).trim() : ''
  if (occupation) {
    const maxRow = 13
    setText(form, 'Profession',  occupation.slice(0, maxRow))
    if (occupation.length > maxRow) {
      setText(form, 'Profession1', occupation.slice(maxRow))
    }
  }

  // Sex — options "0" = Male, "1" = Female
  if (aAnswers.sex === 'Male')   selectRadio(form, 'Sex', '0')
  if (aAnswers.sex === 'Female') selectRadio(form, 'Sex', '1')

  // Marital Status — on-values are numeric strings "0"…"3" (no /Opt array in PDF).
  // selectRadio() updates the field /V so updateFieldAppearances() honours the selection.
  // selectRadioByIndex() only sets /AS and gets wiped by updateFieldAppearances.
  // Physical left-to-right order: Single=0, Divorced=1, Married=2, Widowed=3
  const MS_VAL = { Single: '0', Divorced: '1', Married: '2', Widowed: '3' }
  if (aAnswers.maritalStatus && MS_VAL[aAnswers.maritalStatus] !== undefined) {
    selectRadio(form, 'Marital Status', MS_VAL[aAnswers.maritalStatus])
  }

  setText(form, 'Applicant_Place_of_Birth', aAnswers.placeOfBirth)
  setText(form, 'Applicant_Date_of_Birth',
    fmtDate(aAnswers.birthDay, aAnswers.birthMonth, aAnswers.birthYear))

  setText(form, 'Applicant_Mother_First_Name',  aAnswers.motherFirstName)
  setText(form, 'Applicant_Mother_Maiden_Name', aAnswers.motherMaidenName)

  // Permanent address — all three row-pairs are comb fields (MaxLen 17 each row).
  // Delete MaxLen so pdf-lib stops treating them as combs; we draw manually below.
  ;[
    'Applicant_Permanent_Address', 'Applicant_Permanent_Address1',
    'Applicant_Permanent_Town',    'Applicant_Permanent_Town1',
  ].forEach(name => {
    try { form.getTextField(name).acroField.dict.delete(PDFName.of('MaxLen')) } catch {}
  })
  const permStreet = [aAnswers.streetAddress, aAnswers.postOffice].filter(ok).join(', ')
  const permTown   = aAnswers.townParish
  // permStreet and permTown are drawn manually in the comb rendering section below
  setText(form, 'Applicant_Permanent_Country', aAnswers.country || 'Jamaica')

  if (aAnswers.mailingAddressSame === 'No') {
    setText(form, 'Applicant_Mailing_Address',         aAnswers.mailingStreet)
    setText(form, 'Applicant_Mailing_Town',
      [aAnswers.mailingTownCommunity, aAnswers.mailingTownParish].filter(ok).join(', '))
    setText(form, 'Applicant_Mailing_Country',          aAnswers.mailingCountry)
    setText(form, 'Applicant_Mailing_Address_Zip_Code', aAnswers.mailingPostalCode)
  }

  // Residential phone — area code + number combined
  const phone = [aAnswers.phoneAreaCode, aAnswers.phoneNumber].filter(ok).join('-')
  setText(form, 'Residential_Phone_Number', phone)

  setText(form, 'Email_Address', aAnswers.emailAddress)

  // ── Section B — Marriage Information ──────────────────────────────────────

  // Hoisted so the rendering section below can draw it in comb boxes
  let marriagePlaceFull = ''
  if (ok(bAnswers.marriageDay)) {
    setText(form, 'Applicant_Date_of_Marriage',
      fmtDate(bAnswers.marriageDay, bAnswers.marriageMonth, bAnswers.marriageYear))
    marriagePlaceFull = [bAnswers.marriagePlace, bAnswers.marriageParish].filter(ok).join(', ')
    // Applicant_Place_of_Marriage is a comb field (MaxLen 14) — drawn manually below
    ;['Applicant_Place_of_Marriage', 'Applicant_Place_of_Marriage1'].forEach(name => {
      try { form.getTextField(name).acroField.dict.delete(PDFName.of('MaxLen')) } catch {}
    })
    setText(form, 'Applicant_Marriage_Country',   bAnswers.marriageCountry || 'Jamaica')
    setText(form, 'Spouse_Name',     bAnswers.spouseFirstName)
    setText(form, 'Spouse_Sur_Name', bAnswers.spouseSurname)
  }

  // ── Section C — Parental Consent ──────────────────────────────────────────

  if (ok(cAnswers.guardianSurname)) {
    setText(form, 'Applicant_Parent_SurName',   cAnswers.guardianSurname)
    setText(form, 'Applicant_Parent_Firstname',  cAnswers.guardianFirstName)
    setText(form, 'Applicant_Parent_Middlename', cAnswers.guardianMiddleName)
    setText(form, 'Applicant_Parent_relation',   cAnswers.relationship)

    // Auto-fill declaration name field: "I (name) the (Relationship) of (Minor's Name)"
    const parentFullName = [
      cAnswers.guardianFirstName,
      cAnswers.guardianMiddleName,
      cAnswers.guardianSurname,
    ].filter(ok).join(' ')
    setText(form, 'Applicant_Parent_Name', parentFullName)

    // Child name: first + last combined
    const childFullName = [cAnswers.childFirstName, cAnswers.childLastName].filter(ok).join(' ')
    setText(form, 'minor_name', childFullName)

    // Relation_to_minor — direct dict write.
    // Field has /Opt[(Yes)(Yes)(Yes)] so pdf-lib select() rejects numeric on-values → silently fails.
    // Kids [128,123,118] → x=[91,288,496] → Mother/Father/Legal Guardian, AP/N keys "0"/"1"/"2".
    // Write /V on parent and /AS on each widget directly, reading each widget's own on-value.
    const REL_IDX = { Mother: 0, Father: 1, 'Legal Guardian': 2 }
    const relIdx = REL_IDX[cAnswers.relationship]
    if (relIdx !== undefined) {
      try {
        const relAcro = form.getRadioGroup('Relation_to_minor').acroField
        const relWidgets = relAcro.getWidgets()
        relWidgets.forEach((w, i) => {
          const onVal = w.getOnValue()
          if (i === relIdx && onVal) {
            relAcro.dict.set(PDFName.of('V'), onVal)
            w.dict.set(PDFName.of('AS'), onVal)
          } else {
            w.dict.set(PDFName.of('AS'), PDFName.of('Off'))
          }
        })
      } catch (e) {
        console.warn('[PDF] Relation_to_minor:', e.message)
      }
    }
  }

  // ── Section D — Most Recent Passport ──────────────────────────────────────

  if (ok(dAnswers.dPassportNumber)) {
    setText(form, 'Recent_Passport_Number', dAnswers.dPassportNumber)
  }

  const dDate = fmtDate(dAnswers.dIssueDay, dAnswers.dIssueMonth, dAnswers.dIssueYear)
  if (dDate) setText(form, 'Recent_Passport_Issue_Date', dDate)

  setText(form, 'Recent_Passport_Issue_Place', dAnswers.dIssuePlace)

  // Fields below are only relevant for lost / stolen / damaged — leave blank for renewal
  if (dAnswers.dPassportStatus !== 'renewing') {
    const dLossDate = fmtDate(dAnswers.dLossDay, dAnswers.dLossMonth, dAnswers.dLossYear)
    if (dLossDate) setText(form, 'Recent_Passport_Loss_Date', dLossDate)

    setText(form, 'Passport_Stolen_Sur_Name',   dAnswers.dPrevSurname)
    setText(form, 'Passport_Stolen_First_Name',  dAnswers.dPrevFirstName)
    setText(form, 'Passport_Stolen_Middle_Name', dAnswers.dPrevMiddleName)
    setText(form, 'Place_of_Passport_loss',      dAnswers.dWhereLostStolen)

    const circumstances = dAnswers.dDescriptionLostStolen || dAnswers.dDescriptionDamaged
    if (ok(circumstances)) {
      setTextSplit(form, 'Circumstances_of_passport_loss', 3, circumstances)
    }
  }

  // ── Section E — Declaration ────────────────────────────────────────────────

  // Declaration radio — /Opt[(Yes)(Yes)(Yes)], so selectRadio() rejects numeric on-values.
  // Kids [89,84,79] → y=[187,160,131] top-to-bottom → first-time / renewal / lost-stolen-damaged.
  // On-values confirmed from AP/N dict keys: "0"=first-time, "1"=renewal, "2"=lost/stolen/damaged.
  // Direct dict write (same pattern as Relation_to_minor fix).
  const declIdx = isFirstTime ? 0 : passportStatus === 'renewing' ? 1 : 2
  try {
    const declAcro = form.getRadioGroup('Declaration').acroField
    const declWidgets = declAcro.getWidgets()
    declWidgets.forEach((w, i) => {
      const onVal = w.getOnValue()
      if (i === declIdx && onVal) {
        declAcro.dict.set(PDFName.of('V'), onVal)
        w.dict.set(PDFName.of('AS'), onVal)
      } else {
        w.dict.set(PDFName.of('AS'), PDFName.of('Off'))
      }
    })
  } catch (e) {
    console.warn('[PDF] Declaration:', e.message)
  }
  if (passportStatus === 'renewing' && ok(ePassportNumber)) {
    setText(form, 'Travel_Document_Number', ePassportNumber)
  }

  // ── Section F — Emergency Contacts ────────────────────────────────────────

  setText(form, 'Emergency_First_Contact_Surname',    f1Answers.f1Surname)
  setText(form, 'Emergency_First_Contact_Firstname',  f1Answers.f1FirstName)
  setText(form, 'Emergency_First_Contact_Middlename', f1Answers.f1MiddleName)
  // Street field = street/community + P.O. Box combined; town field = parish only.
  // Address comb fields have MaxLen 17 — delete it so manual rendering can overflow to row 2.
  const f1Street = [f1Answers.f1Address, f1Answers.f1PostOffice].filter(ok).join(', ')
  let f1Town = f1Answers.f1Parish === 'Outside Jamaica'
    ? f1Answers.f1CityAbroad
    : f1Answers.f1Parish
  ;['Emergency_First_Contact_Address1', 'Emergency_First_Contact_Address2',
    'Emergency_First_Contact_Town1',   'Emergency_First_Contact_Town2'].forEach(name => {
    try { form.getTextField(name).acroField.dict.delete(PDFName.of('MaxLen')) } catch {}
  })
  setText(form, 'Emergency_First_Contact_Country',    f1Answers.f1Country || 'Jamaica')
  setText(form, 'Emergency_First_Contact_Relation',   f1Answers.f1Relationship)
  const f1Phone = [f1Answers.f1AreaCode, f1Answers.f1PhoneNumber].filter(ok).join('-')
  setText(form, 'Emergency_First_Contact_Phone_Number', f1Phone)

  setText(form, 'Emergency_Second_Contact_Surname',    f2Answers.f2Surname)
  setText(form, 'Emergency_Second_Contact_Firstname',  f2Answers.f2FirstName)
  setText(form, 'Emergency_Second_Contact_Middlename', f2Answers.f2MiddleName)
  const f2Street = [f2Answers.f2Address, f2Answers.f2PostOffice].filter(ok).join(', ')
  let f2Town = f2Answers.f2Parish === 'Outside Jamaica'
    ? f2Answers.f2CityAbroad
    : f2Answers.f2Parish
  ;['Emergency_Second_Contact_Address1', 'Emergency_Second_Contact_Address2',
    'Emergency_Second_Contact_Town1',   'Emergency_Second_Contact_Town2'].forEach(name => {
    try { form.getTextField(name).acroField.dict.delete(PDFName.of('MaxLen')) } catch {}
  })
  setText(form, 'Emergency_Second_Contact_Country',    f2Answers.f2Country || 'Jamaica')
  setText(form, 'Emergency_Second_Contact_Relation',   f2Answers.f2Relationship)
  const f2Phone = [f2Answers.f2AreaCode, f2Answers.f2PhoneNumber].filter(ok).join('-')
  setText(form, 'Emergency_Second_Contact_Phone_Number', f2Phone)

  // ── Coordinate-based comb field rendering ────────────────────────────────────
  // Build a map: widget PDFDict → page index by scanning each page's /Annots.
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const pages = pdfDoc.getPages()

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

  // ── Street Number and Street Name — manual two-row comb rendering ───────────
  // Applicant_Permanent_Address / Address1 each have 17 boxes (MaxLen 17).
  if (ok(permStreet)) {
    const STREET_ROW_LEN = 17
    const FONT_SIZE_STREET = 9
    const sStr = String(permStreet).trim().toUpperCase()
    const streetRows = [
      { name: 'Applicant_Permanent_Address',  text: sStr.slice(0, STREET_ROW_LEN) },
      { name: 'Applicant_Permanent_Address1', text: sStr.slice(STREET_ROW_LEN, STREET_ROW_LEN * 2) },
    ]
    streetRows.forEach(({ name, text }) => {
      try {
        const field = form.getTextField(name)
        const widget = field.acroField.getWidgets()[0]
        if (!widget) return
        const pi = widgetPage.get(widget.dict) ?? 0
        const page = pages[pi]
        const rect = widget.getRectangle()
        const cellW = rect.width / STREET_ROW_LEN

        for (let i = 0; i < STREET_ROW_LEN; i++) {
          page.drawRectangle({
            x: rect.x + i * cellW, y: rect.y,
            width: cellW, height: rect.height,
            borderColor: rgb(0, 0, 0), borderWidth: 0.5,
          })
        }

        ;[...text].forEach((ch, i) => {
          if (i >= STREET_ROW_LEN) return
          const charW = helvetica.widthOfTextAtSize(ch, FONT_SIZE_STREET)
          const x = rect.x + i * cellW + (cellW - charW) / 2
          const y = rect.y + (rect.height - FONT_SIZE_STREET) / 2
          try { page.drawText(ch, { x, y, size: FONT_SIZE_STREET, font: helvetica, color: rgb(0, 0, 0) }) } catch {}
        })

        try { widget.dict.delete(PDFName.of('MK')) } catch {}
        try { widget.dict.delete(PDFName.of('AP')) } catch {}
      } catch {}
    })
  }

  // ── Town, City and Parish — manual two-row comb rendering ───────────────────
  // Each row field has 17 boxes. Characters overflow from row 1 to row 2.
  // We draw borders + chars directly on the page and strip AP so flatten()
  // removes the annotation without painting text over the form.
  if (ok(permTown)) {
    const TOWN_ROW_LEN = 17
    const str = String(permTown).trim().toUpperCase()
    const FONT_SIZE_TOWN = 9
    const townRows = [
      { name: 'Applicant_Permanent_Town',  text: str.slice(0, TOWN_ROW_LEN) },
      { name: 'Applicant_Permanent_Town1', text: str.slice(TOWN_ROW_LEN, TOWN_ROW_LEN * 2) },
    ]
    townRows.forEach(({ name, text }) => {
      try {
        const field = form.getTextField(name)
        const widget = field.acroField.getWidgets()[0]
        if (!widget) return
        const pi = widgetPage.get(widget.dict) ?? 0
        const page = pages[pi]
        const rect = widget.getRectangle()
        const cellW = rect.width / TOWN_ROW_LEN

        for (let i = 0; i < TOWN_ROW_LEN; i++) {
          page.drawRectangle({
            x: rect.x + i * cellW, y: rect.y,
            width: cellW, height: rect.height,
            borderColor: rgb(0, 0, 0), borderWidth: 0.5,
          })
        }

        ;[...text].forEach((ch, i) => {
          if (i >= TOWN_ROW_LEN) return
          const charW = helvetica.widthOfTextAtSize(ch, FONT_SIZE_TOWN)
          const x = rect.x + i * cellW + (cellW - charW) / 2
          const y = rect.y + (rect.height - FONT_SIZE_TOWN) / 2
          try { page.drawText(ch, { x, y, size: FONT_SIZE_TOWN, font: helvetica, color: rgb(0, 0, 0) }) } catch {}
        })

        try { widget.dict.delete(PDFName.of('MK')) } catch {}
        try { widget.dict.delete(PDFName.of('AP')) } catch {}
      } catch {}
    })
  }

  // ── Place of Marriage — manual two-row comb rendering ───────────────────────
  // Each row field has 14 boxes (MaxLen 14). Characters overflow row 1 → row 2.
  if (ok(marriagePlaceFull)) {
    const MARRIAGE_ROW_LEN = 14
    const mStr = String(marriagePlaceFull).trim()
    const FONT_SIZE_M = 9
    const marriageRows = [
      { name: 'Applicant_Place_of_Marriage',  text: mStr.slice(0, MARRIAGE_ROW_LEN) },
      { name: 'Applicant_Place_of_Marriage1', text: mStr.slice(MARRIAGE_ROW_LEN, MARRIAGE_ROW_LEN * 2) },
    ]
    marriageRows.forEach(({ name, text }) => {
      try {
        const field = form.getTextField(name)
        const widget = field.acroField.getWidgets()[0]
        if (!widget) return
        const pi = widgetPage.get(widget.dict) ?? 0
        const page = pages[pi]
        const rect = widget.getRectangle()
        const cellW = rect.width / MARRIAGE_ROW_LEN

        for (let i = 0; i < MARRIAGE_ROW_LEN; i++) {
          page.drawRectangle({
            x: rect.x + i * cellW, y: rect.y,
            width: cellW, height: rect.height,
            borderColor: rgb(0, 0, 0), borderWidth: 0.5,
          })
        }

        ;[...text].forEach((ch, i) => {
          if (i >= MARRIAGE_ROW_LEN) return
          const charW = helvetica.widthOfTextAtSize(ch, FONT_SIZE_M)
          const x = rect.x + i * cellW + (cellW - charW) / 2
          const y = rect.y + (rect.height - FONT_SIZE_M) / 2
          try { page.drawText(ch, { x, y, size: FONT_SIZE_M, font: helvetica, color: rgb(0, 0, 0) }) } catch {}
        })

        try { widget.dict.delete(PDFName.of('MK')) } catch {}
        try { widget.dict.delete(PDFName.of('AP')) } catch {}
      } catch {}
    })
  }

  // ── Emergency Contact Town — manual two-row comb rendering (MaxLen 17 per row) ─
  const CONTACT_TOWN_ROW_LEN = 17
  const FONT_SIZE_CT = 9
  ;[
    { town: f1Town, rows: ['Emergency_First_Contact_Town1',  'Emergency_First_Contact_Town2'] },
    { town: f2Town, rows: ['Emergency_Second_Contact_Town1', 'Emergency_Second_Contact_Town2'] },
  ].forEach(({ town, rows }) => {
    if (!ok(town)) return
    const ctStr = String(town).trim().toUpperCase()
    rows.forEach((name, ri) => {
      try {
        const field = form.getTextField(name)
        const widget = field.acroField.getWidgets()[0]
        if (!widget) return
        const pi = widgetPage.get(widget.dict) ?? 0
        const page = pages[pi]
        const rect = widget.getRectangle()
        const text = ctStr.slice(ri * CONTACT_TOWN_ROW_LEN, (ri + 1) * CONTACT_TOWN_ROW_LEN)
        const cellW = rect.width / CONTACT_TOWN_ROW_LEN

        for (let i = 0; i < CONTACT_TOWN_ROW_LEN; i++) {
          page.drawRectangle({
            x: rect.x + i * cellW, y: rect.y,
            width: cellW, height: rect.height,
            borderColor: rgb(0, 0, 0), borderWidth: 0.5,
          })
        }

        ;[...text].forEach((ch, i) => {
          if (i >= CONTACT_TOWN_ROW_LEN) return
          const charW = helvetica.widthOfTextAtSize(ch, FONT_SIZE_CT)
          const x = rect.x + i * cellW + (cellW - charW) / 2
          const y = rect.y + (rect.height - FONT_SIZE_CT) / 2
          try { page.drawText(ch, { x, y, size: FONT_SIZE_CT, font: helvetica, color: rgb(0, 0, 0) }) } catch {}
        })

        try { widget.dict.delete(PDFName.of('MK')) } catch {}
        try { widget.dict.delete(PDFName.of('AP')) } catch {}
      } catch {}
    })
  })

  // ── Emergency Contact Address — manual two-row comb rendering (MaxLen 17 per row) ─
  // Field naming follows the 1-indexed Town pattern (Town1/Town2), not the applicant
  // Address pattern (Address/Address1). Address1 = row 1, Address2 = row 2.
  const CONTACT_ADDR_ROW_LEN = 17
  const FONT_SIZE_CA = 9
  ;[
    { street: f1Street, rows: ['Emergency_First_Contact_Address1',  'Emergency_First_Contact_Address2'] },
    { street: f2Street, rows: ['Emergency_Second_Contact_Address1', 'Emergency_Second_Contact_Address2'] },
  ].forEach(({ street, rows }) => {
    if (!ok(street)) return
    const caStr = String(street).trim().toUpperCase()
    rows.forEach((name, ri) => {
      try {
        const field = form.getTextField(name)
        const widget = field.acroField.getWidgets()[0]
        if (!widget) return
        const pi = widgetPage.get(widget.dict) ?? 0
        const page = pages[pi]
        const rect = widget.getRectangle()
        const text = caStr.slice(ri * CONTACT_ADDR_ROW_LEN, (ri + 1) * CONTACT_ADDR_ROW_LEN)
        const cellW = rect.width / CONTACT_ADDR_ROW_LEN

        for (let i = 0; i < CONTACT_ADDR_ROW_LEN; i++) {
          page.drawRectangle({
            x: rect.x + i * cellW, y: rect.y,
            width: cellW, height: rect.height,
            borderColor: rgb(0, 0, 0), borderWidth: 0.5,
          })
        }

        ;[...text].forEach((ch, i) => {
          if (i >= CONTACT_ADDR_ROW_LEN) return
          const charW = helvetica.widthOfTextAtSize(ch, FONT_SIZE_CA)
          const x = rect.x + i * cellW + (cellW - charW) / 2
          const y = rect.y + (rect.height - FONT_SIZE_CA) / 2
          try { page.drawText(ch, { x, y, size: FONT_SIZE_CA, font: helvetica, color: rgb(0, 0, 0) }) } catch {}
        })

        try { widget.dict.delete(PDFName.of('MK')) } catch {}
        try { widget.dict.delete(PDFName.of('AP')) } catch {}
      } catch {}
    })
  })

  // For every comb text field:
  //   1. Draw each cell border as a permanent rectangle on the page
  //   2. Draw each character centred inside its cell
  //   3. Clear the field value, strip MK + AP, so flatten() removes the
  //      annotation without painting any appearance over the drawn borders.
  const FONT_SIZE = 9
  form.getFields().forEach(field => {
    if (!(field instanceof PDFTextField) || !field.isCombed()) return

    let value
    try { value = field.getText() } catch { return }
    if (!value) return
    const str = value.trim()
    if (!str) return

    let maxLen = str.length
    try {
      const ml = field.acroField.dict.lookup(PDFName.of('MaxLen'))
      if (ml) maxLen = ml.asNumber()
    } catch {}

    field.acroField.getWidgets().forEach(widget => {
      const pi = widgetPage.get(widget.dict) ?? 0
      const page = pages[pi]
      const rect = widget.getRectangle()
      const cellW = rect.width / maxLen

      // ── Draw permanent cell borders ──────────────────────────────────────
      for (let i = 0; i < maxLen; i++) {
        page.drawRectangle({
          x: rect.x + i * cellW,
          y: rect.y,
          width: cellW,
          height: rect.height,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5,
        })
      }

      // ── Draw each character centred in its cell ──────────────────────────
      ;[...str].forEach((ch, i) => {
        if (i >= maxLen) return
        const charW = helvetica.widthOfTextAtSize(ch, FONT_SIZE)
        const x = rect.x + i * cellW + (cellW - charW) / 2
        const y = rect.y + (rect.height - FONT_SIZE) / 2
        try {
          page.drawText(ch, { x, y, size: FONT_SIZE, font: helvetica, color: rgb(0, 0, 0) })
        } catch {}
      })

      // ── Strip MK + AP so flatten() removes this annotation silently ──────
      try { widget.dict.delete(PDFName.of('MK')) } catch {}
      try { widget.dict.delete(PDFName.of('AP')) } catch {}
    })

    try { field.setText('') } catch {}
  })

  // Strip MK (background fill) from every non-comb text field widget so that
  // updateFieldAppearances() generates no white rectangle — which would otherwise
  // paint over the PDF's existing box and grid lines when flatten() runs.
  form.getFields().forEach(field => {
    if (!(field instanceof PDFTextField) || field.isCombed()) return
    field.acroField.getWidgets().forEach(widget => {
      try { widget.dict.delete(PDFName.of('MK')) } catch {}
    })
  })

  // Bake non-comb field values into permanent page content.
  // Comb fields have no AP so flatten() removes their annotations without drawing.
  form.updateFieldAppearances(helvetica)
  form.flatten()

  // ── Save and return blob URL ───────────────────────────────────────────────

  const outBytes = await pdfDoc.save()
  const blob = new Blob([outBytes], { type: 'application/pdf' })
  return URL.createObjectURL(blob)
}
