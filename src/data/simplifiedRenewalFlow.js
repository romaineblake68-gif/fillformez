import { PARISHES } from './jamaicanLocations'

export const SKIP = '__SKIP__'

export const SR_START = 'srSurname'
export const SR_BASE_COUNT = 23

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MARRIED_STATUSES = new Set(['Married', 'Divorced', 'Widowed', 'Separated'])

// ── Validation helpers ────────────────────────────────────────────────────────

function validateDay(v) {
  const n = parseInt(v, 10)
  if (!v || isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
  return null
}
function validateYear4(v) {
  const n = parseInt(v, 10)
  if (!v || isNaN(n) || n < 1900 || n > new Date().getFullYear())
    return 'Please enter a valid 4-digit year.'
  return null
}
function validatePhone(v) {
  if (!v) return null
  const digits = v.replace(/\D/g, '')
  if (digits.length < 7) return 'Please enter at least 7 digits.'
  return null
}
function validatePassportNum(v) {
  if (!v) return null
  const clean = v.toUpperCase().replace(/\s/g, '')
  if (clean.length < 5 || clean.length > 12) return 'Passport numbers are usually 7 to 9 characters.'
  return null
}

// ── Questions ─────────────────────────────────────────────────────────────────
// Sections and field order match the Simplified Adult Renewal form exactly.
//
// Section A — surname → maiden name → given names → DOB → place of birth →
//             country of birth → occupation → visible features →
//             marital status → marriage particulars (if ever married)
// Section B — permanent address → mailing address (if different) → phones →
//             email → emergency contact 1 → emergency contact 2
// Section C — passport number → date of issue → place of issue
// Section D — head covering for religious reasons (conditional)
// Section E — declaration reminder only — no questions asked
// Section F — supplementary information (TRN, NIS — both optional)
// Section G — office use only — NEVER ask

export const SR_QUESTIONS = {

  // ── A: Surname ────────────────────────────────────────────────────────────
  srSurname: {
    id: 'srSurname', base: 1, section: 'Section A — Personal Information',
    text: 'What is your surname (last name)?',
    hint: 'This must match exactly as it appears on your current passport.',
    hintSpeech: 'This must be exactly the same as the surname on your current passport.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srHasMaiden',
  },

  srHasMaiden: {
    id: 'srHasMaiden', base: 1, isSubQ: true, section: 'Section A — Personal Information',
    text: 'Do you have a previous or maiden surname?',
    hint: 'A maiden name is the surname you had before marriage.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'srMaidenSurname' : 'srFirstName',
  },

  srMaidenSurname: {
    id: 'srMaidenSurname', base: 1, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What is your previous or maiden surname?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srFirstName',
  },

  // ── A: Given names ────────────────────────────────────────────────────────
  srFirstName: {
    id: 'srFirstName', base: 2, section: 'Section A — Personal Information',
    text: 'What is your first name?',
    hint: 'This must match exactly as it appears on your current passport.',
    hintSpeech: 'This must be exactly the same as the first name on your current passport.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srHasMiddle',
  },

  srHasMiddle: {
    id: 'srHasMiddle', base: 2, isSubQ: true, section: 'Section A — Personal Information',
    text: 'Do you have a middle name?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'srMiddleName' : 'srBirthDay',
  },

  srMiddleName: {
    id: 'srMiddleName', base: 2, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What is your middle name?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srBirthDay',
  },

  // ── A: Date of birth ──────────────────────────────────────────────────────
  srBirthDay: {
    id: 'srBirthDay', base: 3, section: 'Section A — Personal Information',
    text: 'What day were you born? (just the number)',
    hint: 'For example — if you were born on the 3rd, say "three".',
    type: 'voice',
    validate: validateDay,
    next: () => 'srBirthMonth',
  },

  srBirthMonth: {
    id: 'srBirthMonth', base: 3, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What month were you born in?',
    type: 'choice',
    options: MONTHS,
    next: () => 'srBirthYear',
  },

  srBirthYear: {
    id: 'srBirthYear', base: 3, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What year were you born? (four digits)',
    hint: 'Enter the full four-digit year. For example: 1985.',
    type: 'voice',
    validate: validateYear4,
    next: () => 'srPlaceOfBirth',
  },

  // ── A: Place and country of birth ─────────────────────────────────────────
  srPlaceOfBirth: {
    id: 'srPlaceOfBirth', base: 4, section: 'Section A — Personal Information',
    text: 'What parish or town were you born in?',
    hint: 'This must match exactly what is written on your current passport.',
    hintSpeech: 'This must be exactly the same as the place of birth on your current passport.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srCountryOfBirth',
  },

  srCountryOfBirth: {
    id: 'srCountryOfBirth', base: 4, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What country were you born in?',
    hint: 'For most applicants this will be Jamaica.',
    type: 'voice',
    transform: 'titleCase',
    defaultValue: 'Jamaica',
    next: () => 'srOccupation',
  },

  // ── A: Occupation ─────────────────────────────────────────────────────────
  srOccupation: {
    id: 'srOccupation', base: 5, section: 'Section A — Personal Information',
    text: 'What is your occupation or profession?',
    hint: 'Say what you do for work. For example: teacher, nurse, farmer, student.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srVisibleFeatures',
  },

  // ── A: Special visible features ───────────────────────────────────────────
  srVisibleFeatures: {
    id: 'srVisibleFeatures', base: 6, section: 'Section A — Personal Information',
    text: 'Do you have any special visible features or distinguishing marks?',
    hint: 'For example: scar on left cheek, birthmark on forehead, or your height if notable. Tap Skip if none.',
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'srMaritalStatus',
  },

  // ── A: Marital status + marriage particulars ──────────────────────────────
  srMaritalStatus: {
    id: 'srMaritalStatus', base: 7, section: 'Section A — Personal Information',
    text: 'What is your marital status?',
    hint: 'Choose the option that applies to you today.',
    type: 'choice',
    options: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'],
    next: (ans) => MARRIED_STATUSES.has(ans) ? 'srSpouseSurname' : 'srStreetAddress',
  },

  srSpouseSurname: {
    id: 'srSpouseSurname', base: 7, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What is the surname of your spouse or former spouse?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srSpouseFirstName',
  },

  srSpouseFirstName: {
    id: 'srSpouseFirstName', base: 7, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What is their first name?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srMarriageDay',
  },

  srMarriageDay: {
    id: 'srMarriageDay', base: 7, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What day was the marriage? (just the number)',
    type: 'voice',
    validate: validateDay,
    next: () => 'srMarriageMonth',
  },

  srMarriageMonth: {
    id: 'srMarriageMonth', base: 7, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What month was the marriage?',
    type: 'choice',
    options: MONTHS,
    next: () => 'srMarriageYear',
  },

  srMarriageYear: {
    id: 'srMarriageYear', base: 7, isSubQ: true, section: 'Section A — Personal Information',
    text: 'What year was the marriage? (four digits)',
    type: 'voice',
    validate: validateYear4,
    next: () => 'srMarriagePlace',
  },

  srMarriagePlace: {
    id: 'srMarriagePlace', base: 7, isSubQ: true, section: 'Section A — Personal Information',
    text: 'Where did the marriage take place? (town, parish, or country)',
    hint: 'For example: Kingston, Jamaica — or New York, USA.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srStreetAddress',
  },

  // ── B: Permanent address ──────────────────────────────────────────────────
  srStreetAddress: {
    id: 'srStreetAddress', base: 8, section: 'Section B — Contact Information',
    text: 'What is your permanent home address? (house number and street or community)',
    hint: 'For example: 14 Main Street, or Lot 7 Green Acres.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srTownParish',
  },

  srTownParish: {
    id: 'srTownParish', base: 8, isSubQ: true, section: 'Section B — Contact Information',
    text: 'Which parish do you live in?',
    type: 'choice',
    options: PARISHES,
    next: () => 'srMailingSame',
  },

  // ── B: Mailing address ────────────────────────────────────────────────────
  srMailingSame: {
    id: 'srMailingSame', base: 9, section: 'Section B — Contact Information',
    text: 'Is your mailing address the same as your home address?',
    hint: 'Your mailing address is where you receive letters and packages.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'srCellPhone' : 'srMailingStreet',
  },

  srMailingStreet: {
    id: 'srMailingStreet', base: 9, isSubQ: true, section: 'Section B — Contact Information',
    text: 'What is your mailing street address?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srMailingParish',
  },

  srMailingParish: {
    id: 'srMailingParish', base: 9, isSubQ: true, section: 'Section B — Contact Information',
    text: 'Which parish is your mailing address in?',
    type: 'choice',
    options: [...PARISHES, 'Outside Jamaica'],
    next: () => 'srCellPhone',
  },

  // ── B: Phones ─────────────────────────────────────────────────────────────
  srCellPhone: {
    id: 'srCellPhone', base: 10, section: 'Section B — Contact Information',
    text: 'What is your cell phone number?',
    hint: 'Include the area code. For example: 876-555-1234.',
    type: 'voice',
    validate: validatePhone,
    next: () => 'srHomePhone',
  },

  srHomePhone: {
    id: 'srHomePhone', base: 11, section: 'Section B — Contact Information',
    text: 'What is your home phone number?',
    hint: 'Tap Skip if you do not have a home phone.',
    type: 'voice',
    validate: validatePhone,
    canSkip: true,
    next: () => 'srWorkPhone',
  },

  srWorkPhone: {
    id: 'srWorkPhone', base: 12, section: 'Section B — Contact Information',
    text: 'What is your business or work phone number?',
    hint: 'Tap Skip if you do not have a work phone.',
    type: 'voice',
    validate: validatePhone,
    canSkip: true,
    next: () => 'srEmail',
  },

  // ── B: Email ──────────────────────────────────────────────────────────────
  srEmail: {
    id: 'srEmail', base: 13, section: 'Section B — Contact Information',
    text: 'What is your email address?',
    hint: 'Tap Skip if you do not have one.',
    type: 'voice',
    canSkip: true,
    next: () => 'srContact1Surname',
  },

  // ── B: Emergency Contact 1 ────────────────────────────────────────────────
  srContact1Surname: {
    id: 'srContact1Surname', base: 14, section: 'Section B — Emergency Contact 1',
    text: 'What is the surname of your first emergency contact?',
    hint: 'This is someone PICA can reach if they cannot contact you directly.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srContact1FirstName',
  },

  srContact1FirstName: {
    id: 'srContact1FirstName', base: 15, section: 'Section B — Emergency Contact 1',
    text: 'What is their first name?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srContact1Relationship',
  },

  srContact1Relationship: {
    id: 'srContact1Relationship', base: 16, section: 'Section B — Emergency Contact 1',
    text: 'What is their relationship to you?',
    hint: 'For example: mother, father, spouse, sibling, friend.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srContact1Phone',
  },

  srContact1Phone: {
    id: 'srContact1Phone', base: 17, section: 'Section B — Emergency Contact 1',
    text: 'What is their phone number?',
    type: 'voice',
    validate: validatePhone,
    next: () => 'srContact1Address',
  },

  srContact1Address: {
    id: 'srContact1Address', base: 17, isSubQ: true, section: 'Section B — Emergency Contact 1',
    text: 'What is their address?',
    hint: 'Just the town and parish is fine. Tap Skip if you prefer.',
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'srContact2Surname',
  },

  // ── B: Emergency Contact 2 ────────────────────────────────────────────────
  srContact2Surname: {
    id: 'srContact2Surname', base: 18, section: 'Section B — Emergency Contact 2',
    text: 'What is the surname of your second emergency contact?',
    hint: 'Tap Skip if you only have one emergency contact.',
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'srContact2FirstName',
  },

  srContact2FirstName: {
    id: 'srContact2FirstName', base: 18, isSubQ: true, section: 'Section B — Emergency Contact 2',
    text: 'What is their first name?',
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'srContact2Relationship',
  },

  srContact2Relationship: {
    id: 'srContact2Relationship', base: 18, isSubQ: true, section: 'Section B — Emergency Contact 2',
    text: 'What is their relationship to you?',
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'srContact2Phone',
  },

  srContact2Phone: {
    id: 'srContact2Phone', base: 18, isSubQ: true, section: 'Section B — Emergency Contact 2',
    text: 'What is their phone number?',
    type: 'voice',
    validate: validatePhone,
    canSkip: true,
    next: () => 'srContact2Address',
  },

  srContact2Address: {
    id: 'srContact2Address', base: 18, isSubQ: true, section: 'Section B — Emergency Contact 2',
    text: 'What is their address?',
    hint: 'Just the town and parish is fine. Tap Skip if you prefer.',
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'srPassportNumber',
  },

  // ── C: Current Passport ───────────────────────────────────────────────────
  srPassportNumber: {
    id: 'srPassportNumber', base: 19, section: 'Section C — Current Passport',
    text: 'What is your current passport number?',
    hint: 'You can find this at the top right of the data page of your passport.',
    type: 'voice',
    validate: validatePassportNum,
    next: () => 'srIssueDay',
  },

  srIssueDay: {
    id: 'srIssueDay', base: 20, section: 'Section C — Current Passport',
    text: 'What day was your passport issued? (just the number)',
    type: 'voice',
    validate: validateDay,
    next: () => 'srIssueMonth',
  },

  srIssueMonth: {
    id: 'srIssueMonth', base: 20, isSubQ: true, section: 'Section C — Current Passport',
    text: 'What month was your passport issued?',
    type: 'choice',
    options: MONTHS,
    next: () => 'srIssueYear',
  },

  srIssueYear: {
    id: 'srIssueYear', base: 20, isSubQ: true, section: 'Section C — Current Passport',
    text: 'What year was your passport issued? (four digits)',
    type: 'voice',
    validate: validateYear4,
    next: () => 'srIssuePlace',
  },

  srIssuePlace: {
    id: 'srIssuePlace', base: 21, section: 'Section C — Current Passport',
    text: 'Where was your passport issued?',
    hint: 'Usually "Kingston" or "Jamaica".',
    type: 'voice',
    transform: 'titleCase',
    defaultValue: 'Kingston',
    next: () => 'srHeadCovering',
  },

  // ── D: Head covering for religious reasons ────────────────────────────────
  srHeadCovering: {
    id: 'srHeadCovering', base: 22, section: 'Section D — Religion',
    text: 'In your passport photo, do you wear a head covering for religious reasons?',
    hint: 'Head coverings are only allowed in passport photos for religious purposes — such as a hijab, turban, or similar.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'srReligion' : 'srTRN',
  },

  srReligion: {
    id: 'srReligion', base: 22, isSubQ: true, section: 'Section D — Religion',
    text: 'What is the name of your religion or sect?',
    hint: 'For example: Islam, Sikhism, Rastafari, Judaism.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'srTRN',
  },

  // ── F: Supplementary Information (both optional) ──────────────────────────
  srTRN: {
    id: 'srTRN', base: 23, section: 'Section F — Supplementary Information',
    text: 'What is your Tax Registration Number (TRN)?',
    hint: 'Your 9-digit TRN from the Tax Administration Jamaica. Tap Skip if you do not have it on hand.',
    type: 'voice',
    canSkip: true,
    next: () => 'srNIS',
  },

  srNIS: {
    id: 'srNIS', base: 23, isSubQ: true, section: 'Section F — Supplementary Information',
    text: 'What is your National Insurance Scheme (NIS) number?',
    hint: 'Your NIS number from the Ministry of Labour. Tap Skip if you do not have it on hand.',
    type: 'voice',
    canSkip: true,
    next: () => null,
  },
}
