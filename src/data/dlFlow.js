export const SKIP = '__SKIP__'
export const DL_START = 'dlLastName'
export const DL_BASE_COUNT = 16

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

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

function validateAge(v) {
  const n = parseInt(v, 10)
  if (!v || isNaN(n) || n < 16 || n > 120) return 'Please enter a valid age.'
  return null
}

// ── Questions ─────────────────────────────────────────────────────────────────
// Field order matches the DL1 Driver's Licence Application form.
//
// Personal Info  → bases 1–7   (name, phones, email, TRN)
// Address        → base 8      (place of residence)
// Personal Dets  → bases 9–12  (age, DOB, place of birth, citizenship)
// Licence History→ bases 13–15 (issued, refused, suspended)
// Declaration    → base 16     (read/write English)

export const DL_QUESTIONS = {

  // ── Personal Information ──────────────────────────────────────────────────
  dlLastName: {
    id: 'dlLastName', base: 1, section: 'Personal Information',
    text: 'What is your last name?',
    hint: 'This must match your National ID or passport exactly.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'dlFirstNames',
  },

  dlFirstNames: {
    id: 'dlFirstNames', base: 2, section: 'Personal Information',
    text: 'What are your first and middle names?',
    hint: 'Say your first name, then your middle name if you have one. For example: John Michael.',
    hintSpeech: 'Say your first name, then your middle name if you have one.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'dlHomePhone',
  },

  // ── Contact Information ───────────────────────────────────────────────────
  dlHomePhone: {
    id: 'dlHomePhone', base: 3, section: 'Contact Information',
    text: 'What is your home telephone number?',
    hint: 'Include the area code. Tap Skip if you do not have a home phone.',
    type: 'voice',
    validate: validatePhone,
    canSkip: true,
    next: () => 'dlWorkPhone',
  },

  dlWorkPhone: {
    id: 'dlWorkPhone', base: 4, section: 'Contact Information',
    text: 'What is your work telephone number?',
    hint: 'Tap Skip if you do not have a work phone.',
    type: 'voice',
    validate: validatePhone,
    canSkip: true,
    next: () => 'dlMobilePhone',
  },

  dlMobilePhone: {
    id: 'dlMobilePhone', base: 5, section: 'Contact Information',
    text: 'What is your mobile number?',
    hint: 'Include the area code. For example: 876-555-1234.',
    type: 'voice',
    validate: validatePhone,
    next: () => 'dlEmail',
  },

  dlEmail: {
    id: 'dlEmail', base: 6, section: 'Contact Information',
    text: 'What is your email address?',
    hint: 'Tap Skip if you do not have one.',
    type: 'voice',
    canSkip: true,
    next: () => 'dlTRN',
  },

  dlTRN: {
    id: 'dlTRN', base: 7, section: 'Contact Information',
    text: 'What is your Tax Registration Number (TRN)?',
    hint: 'Your 9-digit TRN from Tax Administration Jamaica. Tap Skip if you do not have it on hand.',
    type: 'voice',
    canSkip: true,
    next: () => 'dlResidence',
  },

  // ── Address ───────────────────────────────────────────────────────────────
  dlResidence: {
    id: 'dlResidence', base: 8, section: 'Address',
    text: 'What is your place of residence?',
    hint: 'Your full home address — house number, street, community, and parish.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'dlAgeNextBirthday',
  },

  // ── Personal Details ──────────────────────────────────────────────────────
  dlAgeNextBirthday: {
    id: 'dlAgeNextBirthday', base: 9, section: 'Personal Details',
    text: 'What age will you be on your next birthday?',
    hint: 'For example, if you turn 25 next birthday, say twenty-five.',
    type: 'voice',
    validate: validateAge,
    next: () => 'dlBirthDay',
  },

  dlBirthDay: {
    id: 'dlBirthDay', base: 10, section: 'Personal Details',
    text: 'What day were you born? (just the number)',
    hint: 'For example: if you were born on the 3rd, say three.',
    type: 'voice',
    validate: validateDay,
    next: () => 'dlBirthMonth',
  },

  dlBirthMonth: {
    id: 'dlBirthMonth', base: 10, isSubQ: true, section: 'Personal Details',
    text: 'What month were you born in?',
    type: 'choice',
    options: MONTHS,
    next: () => 'dlBirthYear',
  },

  dlBirthYear: {
    id: 'dlBirthYear', base: 10, isSubQ: true, section: 'Personal Details',
    text: 'What year were you born? (four digits)',
    hint: 'Enter the full four-digit year. For example: 1990.',
    type: 'voice',
    validate: validateYear4,
    next: () => 'dlPlaceOfBirth',
  },

  dlPlaceOfBirth: {
    id: 'dlPlaceOfBirth', base: 11, section: 'Personal Details',
    text: 'What is your place of birth?',
    hint: 'The town, city, or parish where you were born.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'dlCitizenship',
  },

  dlCitizenship: {
    id: 'dlCitizenship', base: 12, section: 'Personal Details',
    text: 'What is your citizenship?',
    hint: 'For most applicants this will be Jamaican.',
    type: 'voice',
    transform: 'titleCase',
    defaultValue: 'Jamaican',
    next: () => 'dlHasLicence',
  },

  // ── Licence History ───────────────────────────────────────────────────────
  dlHasLicence: {
    id: 'dlHasLicence', base: 13, section: "Licence History",
    text: "Has any driver's licence ever been issued to you?",
    hint: 'This includes licences from any country.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'dlLicenceAuthority' : 'dlRefused',
  },

  dlLicenceAuthority: {
    id: 'dlLicenceAuthority', base: 13, isSubQ: true, section: "Licence History",
    text: "Which authority or country issued your driver's licence?",
    hint: 'For example: Jamaica, United States, United Kingdom.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'dlRefused',
  },

  dlRefused: {
    id: 'dlRefused', base: 14, section: "Licence History",
    text: "Have you ever been refused a driver's licence?",
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'dlRefusedAuthority' : 'dlSuspended',
  },

  dlRefusedAuthority: {
    id: 'dlRefusedAuthority', base: 14, isSubQ: true, section: "Licence History",
    text: "Which authority refused your licence?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'dlRefusedDate',
  },

  dlRefusedDate: {
    id: 'dlRefusedDate', base: 14, isSubQ: true, section: "Licence History",
    text: 'When were you refused? (month and year is fine)',
    hint: 'For example: March 2019.',
    type: 'voice',
    next: () => 'dlSuspended',
  },

  dlSuspended: {
    id: 'dlSuspended', base: 15, section: "Licence History",
    text: "Have you ever had a driver's licence suspended, revoked, or endorsed?",
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'dlSuspendedAuthority' : 'dlReadWriteEnglish',
  },

  dlSuspendedAuthority: {
    id: 'dlSuspendedAuthority', base: 15, isSubQ: true, section: "Licence History",
    text: 'Which authority or tribunal handled the suspension, revocation, or endorsement?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'dlReadWriteEnglish',
  },

  // ── Declaration ───────────────────────────────────────────────────────────
  dlReadWriteEnglish: {
    id: 'dlReadWriteEnglish', base: 16, section: 'Declaration',
    text: 'Are you able to read and write in English?',
    type: 'yesno',
    next: () => null,
  },
}
