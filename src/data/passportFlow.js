import { PARISHES, COMMUNITIES } from './jamaicanLocations'
import { passportNumberToSpeech } from '../utils/formatSpeech'

// Sentinel value used when the user taps Skip on an optional question
export const SKIP = '__SKIP__'

// First question ID in Section A
export const SECTION_A_START = 'surname'

// Total number of base questions (numbered 1–18) — used for progress display
export const SECTION_A_BASE_COUNT = 18

/**
 * Complete Section A question map.
 *
 * Each entry:
 *   id          – unique key (matches the map key)
 *   section     – label shown at top of screen
 *   base        – base question number (1–18); sub-questions share their parent's base
 *   isSubQ      – true for conditional follow-up questions (don't advance progress)
 *   text        – question spoken aloud and shown on screen
 *   hint        – plain-English explanation for "What does this mean?"
 *   type        – 'voice' | 'yesno' | 'choice'
 *   options     – string[] for 'choice' type
 *   canSkip     – shows a Skip button; calls next(SKIP, answers)
 *   defaultValue– pre-fills the confirming phase with this value
 *   next        – (answer, allAnswers) => nextId | null
 *                 null means end of Section A
 */
export const SECTION_A_QUESTIONS = {

  surname: {
    id: 'surname',
    section: 'Section A — Personal Information',
    base: 1,
    text: 'What is your surname?',
    hint: 'This is your last name — the one you are using right now.',
    type: 'voice',
    next: () => 'firstName',
  },

  firstName: {
    id: 'firstName',
    section: 'Section A — Personal Information',
    base: 2,
    text: 'What is your first name?',
    hint: 'This is the name your parents gave you — like "John", "Maria", or "Keisha".',
    type: 'voice',
    next: () => 'hasMiddleName',
  },

  hasMiddleName: {
    id: 'hasMiddleName',
    section: 'Section A — Personal Information',
    base: 3,
    text: 'Do you have a middle name?',
    hint: 'A middle name is an extra name between your first name and your surname. Not everyone has one — if you are not sure, check your birth certificate.',
    type: 'yesno',
    next: (answer) => answer === 'Yes' ? 'middleName' : 'maidenSurname',
  },

  middleName: {
    id: 'middleName',
    section: 'Section A — Personal Information',
    base: 3,
    isSubQ: true,
    text: 'What is your middle name?',
    hint: 'Say your middle name clearly, one word at a time.',
    type: 'voice',
    next: () => 'maidenSurname',
  },

  maidenSurname: {
    id: 'maidenSurname',
    section: 'Section A — Personal Information',
    base: 4,
    text: 'What is your last name at birth?',
    hint: 'This is your family name from birth, before any marriage. If your name never changed, it is the same as your current surname. If this does not apply to you, tap Skip.',
    type: 'voice',
    canSkip: true,
    next: () => 'hasNameChanged',
  },

  hasNameChanged: {
    id: 'hasNameChanged',
    section: 'Section A — Personal Information',
    base: 5,
    text: 'Has your name ever changed for any reason other than marriage — for example through a Deed Poll or court order?',
    hint: 'A Deed Poll is a legal document that lets you officially change your name. If your name only changed through marriage, tap No.',
    type: 'yesno',
    next: (answer) => answer === 'Yes' ? 'previousName' : 'occupation',
  },

  previousName: {
    id: 'previousName',
    section: 'Section A — Personal Information',
    base: 5,
    isSubQ: true,
    text: 'What was your previous name?',
    hint: 'Say your full name exactly as it was before the change was made.',
    type: 'voice',
    next: () => 'occupation',
  },

  occupation: {
    id: 'occupation',
    section: 'Section A — Personal Information',
    base: 6,
    text: 'What is your profession or occupation?',
    hint: 'For example — teacher, nurse, driver, student, self-employed. If you are not working right now, just say unemployed.',
    type: 'voice',
    next: () => 'maritalStatus',
  },

  maritalStatus: {
    id: 'maritalStatus',
    section: 'Section A — Personal Information',
    base: 7,
    text: 'What is your marital status?',
    hint: 'Single means you have never been married at all — not even once. If you were married before and it ended, you are either Divorced or Widowed — not Single.',
    type: 'choice',
    options: ['Single', 'Married', 'Divorced', 'Widowed'],
    next: () => 'placeOfBirth',
  },

  placeOfBirth: {
    id: 'placeOfBirth',
    section: 'Section A — Personal Information',
    base: 8,
    text: 'What is your place of birth? For example, Black River, Kingston, Mandeville.',
    hint: 'Say the town or city where you were born — exactly as it appears on your birth certificate. For example: "Black River" or "Kingston".',
    type: 'voice',
    next: () => 'birthDay',
  },

  birthDay: {
    id: 'birthDay',
    section: 'Section A — Personal Information',
    base: 9,
    text: 'What is your date of birth? — Let\'s start with the day. What day of the month were you born?',
    hint: 'Say just the number of the day. For example, "fifteen" or "three".',
    type: 'voice',
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
      return null
    },
    next: () => 'birthMonth',
  },

  birthMonth: {
    id: 'birthMonth',
    section: 'Section A — Personal Information',
    base: 9,
    isSubQ: true,
    text: 'What month were you born in?',
    hint: 'Tap the month you were born.',
    type: 'choice',
    options: [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December',
    ],
    next: () => 'birthYear',
  },

  birthYear: {
    id: 'birthYear',
    section: 'Section A — Personal Information',
    base: 9,
    isSubQ: true,
    text: 'What year were you born?',
    hint: 'Say the full year. For example: "nineteen eighty five" or "two thousand and one".',
    type: 'voice',
    next: () => 'sex',
  },

  sex: {
    id: 'sex',
    section: 'Section A — Personal Information',
    base: 10,
    text: 'What is your sex?',
    hint: 'Tap the option that applies to you.',
    type: 'choice',
    options: ['Male', 'Female'],
    next: () => 'motherFirstName',
  },

  motherFirstName: {
    id: 'motherFirstName',
    section: 'Section A — Personal Information',
    base: 11,
    text: "What is your mother's first name?",
    hint: "Say your mother's first name — for example, \"Sandra\" or \"Patricia\".",
    type: 'voice',
    next: () => 'motherMaidenName',
  },

  motherMaidenName: {
    id: 'motherMaidenName',
    section: 'Section A — Personal Information',
    base: 12,
    text: "What is your mother's maiden name?",
    hint: "This is your mother's surname before she got married. If she never married, just use her regular surname.",
    type: 'voice',
    next: () => 'streetAddress',
  },

  streetAddress: {
    id: 'streetAddress',
    section: 'Section A — Personal Information',
    base: 13,
    text: 'What is your street address? If you do not have one, enter your community or district.',
    hint: "Say your street number and name — for example: '14 Main Street'. If you have no formal street address, say your community name — for example: 'Southfield'.",
    type: 'voice',
    next: () => 'postOffice',
  },

  postOffice: {
    id: 'postOffice',
    section: 'Section A — Personal Information',
    base: 14,
    isSubQ: true,
    text: 'What is your Post Office or P.O. Box area? You can skip this if you do not know.',
    hint: "Say the post office name — for example: 'Southfield P.O.' or 'Black River P.O.'. If you are not sure, tap Skip.",
    type: 'voice',
    canSkip: true,
    next: () => 'townParish',
  },

  townParish: {
    id: 'townParish',
    section: 'Section A — Personal Information',
    base: 14,
    isSubQ: true,
    text: 'Which parish do you live in?',
    type: 'choice',
    options: PARISHES,
    next: () => 'country',
  },

  country: {
    id: 'country',
    section: 'Section A — Personal Information',
    base: 15,
    text: 'What country do you live in?',
    hint: 'If you live in Jamaica, just confirm Jamaica. If you live overseas, say your country.',
    type: 'voice',
    defaultValue: 'Jamaica',
    next: () => 'mailingAddressSame',
  },

  mailingAddressSame: {
    id: 'mailingAddressSame',
    section: 'Section A — Personal Information',
    base: 16,
    text: 'Is your mailing address the same as your home address?',
    hint: 'A mailing address is where you receive letters and mail. If it is the same place you live, tap Yes.',
    type: 'yesno',
    next: (answer) => answer === 'Yes' ? 'phoneAreaCode' : 'mailingStreet',
  },

  mailingStreet: {
    id: 'mailingStreet',
    section: 'Section A — Personal Information',
    base: 16,
    isSubQ: true,
    text: 'What is the street number and street name for your mailing address?',
    hint: 'Say the street address where you receive your mail.',
    type: 'voice',
    next: () => 'mailingTownParish',
  },

  mailingTownParish: {
    id: 'mailingTownParish',
    section: 'Section A — Personal Information',
    base: 16,
    isSubQ: true,
    text: 'Which parish is your mailing address in?',
    type: 'choice',
    options: PARISHES,
    next: () => 'mailingTownCommunity',
  },

  mailingTownCommunity: {
    id: 'mailingTownCommunity',
    section: 'Section A — Personal Information',
    base: 16,
    isSubQ: true,
    text: 'Which community or district is your mailing address in?',
    hint: 'Say the name — for example: "Southfield" or "Rose Hall". Tap Skip if you are not sure.',
    type: 'voice',
    canSkip: true,
    next: () => 'mailingCountry',
  },

  mailingCountry: {
    id: 'mailingCountry',
    section: 'Section A — Personal Information',
    base: 16,
    isSubQ: true,
    text: 'What country is your mailing address in?',
    hint: 'The country for your mailing address.',
    type: 'voice',
    defaultValue: 'Jamaica',
    next: () => 'mailingPostalCode',
  },

  mailingPostalCode: {
    id: 'mailingPostalCode',
    section: 'Section A — Personal Information',
    base: 16,
    isSubQ: true,
    text: 'What is the postal code for your mailing address?',
    hint: 'This is a number code used for mail delivery. If you do not know it, tap Skip.',
    type: 'voice',
    canSkip: true,
    next: () => 'phoneAreaCode',
  },

  phoneAreaCode: {
    id: 'phoneAreaCode',
    section: 'Section A — Personal Information',
    base: 17,
    text: 'What is the area code for your residential phone number?',
    hint: 'This is the first 3 digits of your phone number — for example, "876" for Jamaica. If you do not have a residential phone, tap Skip.',
    type: 'voice',
    canSkip: true,
    toSpeech: (text) => text.split('').join(' '),
    next: (answer) => answer === SKIP ? 'hasEmail' : 'phoneNumber',
  },

  phoneNumber: {
    id: 'phoneNumber',
    section: 'Section A — Personal Information',
    base: 17,
    isSubQ: true,
    text: 'Now say the 7 digits of your phone number after the area code.',
    hint: 'Say the 7 digits after the area code. For example: "5-5-5-1-2-3-4". Tap Skip if you prefer not to give this.',
    type: 'voice',
    canSkip: true,
    toSpeech: (text) => text.split('').join(' '),
    next: () => 'hasEmail',
  },

  hasEmail: {
    id: 'hasEmail',
    section: 'Section A — Personal Information',
    base: 18,
    text: 'Do you have an email address?',
    hint: 'This is optional, but PICA may use it to contact you about your application. If you do not have one, tap No.',
    type: 'yesno',
    next: (answer) => answer === 'Yes' ? 'emailAddress' : null,
  },

  emailAddress: {
    id: 'emailAddress',
    section: 'Section A — Personal Information',
    base: 18,
    isSubQ: true,
    text: 'What is your email address?',
    hint: 'Say your email address clearly. For example: "john at gmail dot com". Or spell it out letter by letter if needed.',
    type: 'voice',
    next: () => null, // null = end of Section A
  },
}

// ── Section B ─────────────────────────────────────────────────────────────────

export const SECTION_B_START = 'marriageDay'
export const SECTION_B_BASE_COUNT = 4

export const SECTION_B_QUESTIONS = {

  marriageDay: {
    id: 'marriageDay',
    section: 'Section B — Marriage Information',
    base: 1,
    text: "When did you get married? Let's start with the day. What day of the month did you get married?",
    hint: 'You will find this date on your marriage certificate. Just say the number — for example, "twelve" or "five".',
    type: 'voice',
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
      return null
    },
    next: () => 'marriageMonth',
  },

  marriageMonth: {
    id: 'marriageMonth',
    section: 'Section B — Marriage Information',
    base: 1,
    isSubQ: true,
    text: 'What month did you get married?',
    hint: 'Tap the month of your marriage. You will find this on your marriage certificate.',
    type: 'choice',
    options: [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December',
    ],
    next: () => 'marriageYear',
  },

  marriageYear: {
    id: 'marriageYear',
    section: 'Section B — Marriage Information',
    base: 1,
    isSubQ: true,
    text: 'What year did you get married?',
    hint: 'Say the full year — for example: "nineteen ninety five" or "two thousand and ten".',
    type: 'voice',
    next: () => 'marriagePlace',
  },

  marriagePlace: {
    id: 'marriagePlace',
    section: 'Section B — Marriage Information',
    base: 2,
    text: 'What town, city, or community did you get married in?',
    hint: 'For example — Black River, Kingston, Mandeville. Just the town or city, not the parish.',
    type: 'voice',
    next: () => 'marriageParish',
  },

  marriageParish: {
    id: 'marriageParish',
    section: 'Section B — Marriage Information',
    base: 2,
    isSubQ: true,
    text: 'Which parish was the marriage in? Tap Skip if it was outside Jamaica.',
    type: 'choice',
    options: PARISHES,
    canSkip: true,
    next: () => 'marriageCountry',
  },

  marriageCountry: {
    id: 'marriageCountry',
    section: 'Section B — Marriage Information',
    base: 2,
    isSubQ: true,
    text: 'What country did you get married in?',
    hint: 'If you were married in Jamaica, say Jamaica. If overseas, say the country — for example: "United States" or "United Kingdom".',
    type: 'voice',
    defaultValue: 'Jamaica',
    next: () => 'spouseFirstName',
  },

  spouseFirstName: {
    id: 'spouseFirstName',
    section: 'Section B — Marriage Information',
    base: 3,
    text: "What is your spouse's first name?",
    hint: 'If you are divorced or widowed, put the name of your former spouse.',
    type: 'voice',
    next: () => 'spouseSurname',
  },

  spouseSurname: {
    id: 'spouseSurname',
    section: 'Section B — Marriage Information',
    base: 4,
    text: "What is your spouse's surname?",
    hint: 'If you are divorced or widowed, put the surname of your former spouse.',
    type: 'voice',
    next: () => null, // null = end of Section B
  },
}

// ── Section C ─────────────────────────────────────────────────────────────────

export const SECTION_C_START = 'guardianSurname'
export const SECTION_C_BASE_COUNT = 5

export const SECTION_C_QUESTIONS = {

  guardianSurname: {
    id: 'guardianSurname',
    section: 'Section C — Parental Consent',
    base: 1,
    text: 'What is your surname?',
    hint: 'This is the surname of the parent or legal guardian filling out this section — not the child\'s surname.',
    type: 'voice',
    next: () => 'guardianFirstName',
  },

  guardianFirstName: {
    id: 'guardianFirstName',
    section: 'Section C — Parental Consent',
    base: 2,
    text: 'What is your first name?',
    hint: 'This is the first name of the parent or legal guardian completing this section.',
    type: 'voice',
    next: () => 'guardianHasMiddleName',
  },

  guardianHasMiddleName: {
    id: 'guardianHasMiddleName',
    section: 'Section C — Parental Consent',
    base: 3,
    text: 'Do you have a middle name?',
    hint: 'A middle name is an extra name between your first name and your surname. Not everyone has one.',
    type: 'yesno',
    next: (answer) => answer === 'Yes' ? 'guardianMiddleName' : 'relationship',
  },

  guardianMiddleName: {
    id: 'guardianMiddleName',
    section: 'Section C — Parental Consent',
    base: 3,
    isSubQ: true,
    text: 'What is your middle name?',
    hint: 'Say your middle name clearly, one word at a time.',
    type: 'voice',
    next: () => 'relationship',
  },

  relationship: {
    id: 'relationship',
    section: 'Section C — Parental Consent',
    base: 4,
    text: 'What is your relationship to the child?',
    hint: 'Tap the option that describes how you are connected to the child you are applying for.',
    type: 'choice',
    options: ['Mother', 'Father', 'Legal Guardian'],
    next: () => 'childFirstName',
  },

  childFirstName: {
    id: 'childFirstName',
    section: 'Section C — Parental Consent',
    base: 5,
    text: "What is the child's first name?",
    hint: "Say the child's first name exactly as it appears on their birth certificate.",
    type: 'voice',
    next: () => 'childLastName',
  },

  childLastName: {
    id: 'childLastName',
    section: 'Section C — Parental Consent',
    base: 5,
    isSubQ: true,
    text: "What is the child's last name?",
    hint: "Say the child's surname — their family name — exactly as it appears on their birth certificate.",
    type: 'voice',
    next: () => null, // null = end of Section C
  },
}

// ── Section D ─────────────────────────────────────────────────────────────────
// baseCount varies by passport status — passed from App.jsx:
//   renewing   → 6
//   damaged    → 7  (uses dDescriptionDamaged at base 7)
//   lost/stolen→ 8  (uses dWhereLostStolen at base 7, dDescriptionLostStolen at base 8)

export const SECTION_D_START = 'dPassportNumber'

export const SECTION_D_QUESTIONS = {

  dPassportNumber: {
    id: 'dPassportNumber',
    section: 'Section D — Most Recent Passport',
    base: 1,
    text: 'What is your passport number?',
    hint: 'You will find this on the photo page of your passport. It is a combination of letters and numbers. If your passport is lost or stolen and you do not have the number, tap Skip.',
    type: 'voice',
    canSkip: true,
    toSpeech: (v) => passportNumberToSpeech(v),
    next: () => 'dIssueDay',
  },

  dIssueDay: {
    id: 'dIssueDay',
    section: 'Section D — Most Recent Passport',
    base: 2,
    text: "When was your passport issued? Let's start with the day. What day of the month was it issued?",
    hint: 'This date is on the photo page of your passport. If you do not have the passport with you, tap Skip — you can skip the month and year too.',
    type: 'voice',
    canSkip: true,
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
      return null
    },
    next: (answer) => answer === SKIP ? 'dIssuePlace' : 'dIssueMonth',
  },

  dIssueMonth: {
    id: 'dIssueMonth',
    section: 'Section D — Most Recent Passport',
    base: 2,
    isSubQ: true,
    text: 'What month was your passport issued?',
    hint: 'Tap the month shown on the photo page of your passport.',
    type: 'choice',
    options: [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December',
    ],
    next: () => 'dIssueYear',
  },

  dIssueYear: {
    id: 'dIssueYear',
    section: 'Section D — Most Recent Passport',
    base: 2,
    isSubQ: true,
    text: 'What year was your passport issued?',
    hint: 'Say the full year — for example: "two thousand and fifteen".',
    type: 'voice',
    next: () => 'dIssuePlace',
  },

  dIssuePlace: {
    id: 'dIssuePlace',
    section: 'Section D — Most Recent Passport',
    base: 3,
    text: 'Where was your passport issued?',
    hint: 'The city or country where you applied for that passport. For example — Kingston. Or London if you applied overseas. If you do not know, tap Skip.',
    type: 'voice',
    canSkip: true,
    // Renewal ends here; all other statuses continue to date of loss and name questions
    next: (answer, answers) => answers.dPassportStatus === 'renewing' ? null : 'dLossDay',
  },

  // ── Date of loss (non-renewal only) ─────────────────────────────────────

  dLossDay: {
    id: 'dLossDay',
    section: 'Section D — Most Recent Passport',
    base: 4,
    text: 'When did you lose or stop having your passport? What day of the month was it?',
    hint: 'If you are not sure of the exact date, tap Skip.',
    type: 'voice',
    canSkip: true,
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
      return null
    },
    next: (answer) => answer === SKIP ? 'dPrevSurname' : 'dLossMonth',
  },

  dLossMonth: {
    id: 'dLossMonth',
    section: 'Section D — Most Recent Passport',
    base: 4,
    isSubQ: true,
    text: 'What month did you lose your passport?',
    type: 'choice',
    options: [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December',
    ],
    next: () => 'dLossYear',
  },

  dLossYear: {
    id: 'dLossYear',
    section: 'Section D — Most Recent Passport',
    base: 4,
    isSubQ: true,
    text: 'What year did you lose your passport?',
    hint: 'Say the full year — for example: "two thousand and twenty".',
    type: 'voice',
    next: () => 'dPrevSurname',
  },

  // ── Name on previous passport (non-renewal only) ─────────────────────────

  dPrevSurname: {
    id: 'dPrevSurname',
    section: 'Section D — Most Recent Passport',
    base: 5,
    text: 'What is the surname on your previous passport?',
    hint: 'Write the name exactly as it appears on the old passport, even if your name has changed since then.',
    type: 'voice',
    next: () => 'dPrevFirstName',
  },

  dPrevFirstName: {
    id: 'dPrevFirstName',
    section: 'Section D — Most Recent Passport',
    base: 5,
    isSubQ: true,
    text: 'What is the first name on your previous passport?',
    hint: 'Write the name exactly as it appears on the old passport.',
    type: 'voice',
    next: () => 'dPrevHasMiddle',
  },

  dPrevHasMiddle: {
    id: 'dPrevHasMiddle',
    section: 'Section D — Most Recent Passport',
    base: 5,
    isSubQ: true,
    text: 'Do you have any middle names on your previous passport?',
    hint: 'Check the photo page of your old passport to see if a middle name is listed.',
    type: 'yesno',
    next: (answer) => answer === 'Yes' ? 'dPrevMiddleName' : null,
  },

  dPrevMiddleName: {
    id: 'dPrevMiddleName',
    section: 'Section D — Most Recent Passport',
    base: 5,
    isSubQ: true,
    text: 'What are the middle names on your previous passport?',
    hint: 'Say the middle name or names exactly as they appear on the old passport.',
    type: 'voice',
    next: () => null,
  },

  // ── Place of loss / damage and brief statement (non-renewal only) ────────

  dWhereLostStolen: {
    id: 'dWhereLostStolen',
    section: 'Section D — Most Recent Passport',
    base: 6,
    text: 'Where was your passport lost, stolen, or damaged?',
    hint: 'Say the town and parish where it happened. If you are not sure of the exact place, tap Skip.',
    type: 'voice',
    canSkip: true,
    next: (answer, answers) =>
      answers.dPassportStatus === 'damaged' ? 'dDescriptionDamaged' : 'dDescriptionLostStolen',
  },

  dDescriptionLostStolen: {
    id: 'dDescriptionLostStolen',
    section: 'Section D — Most Recent Passport',
    base: 7,
    text: 'Can you briefly describe what happened to your passport?',
    hint: 'Keep it simple. For example — my passport was lost at home and I cannot find it. Or — my passport was stolen and I made a police report.',
    type: 'voice',
    next: () => null,
  },

  dDescriptionDamaged: {
    id: 'dDescriptionDamaged',
    section: 'Section D — Most Recent Passport',
    base: 7,
    text: 'Can you briefly describe what happened to your passport?',
    hint: 'Keep it simple. For example — my passport was damaged by water. Or — my passport was destroyed in a fire.',
    type: 'voice',
    next: () => null,
  },
}

// ── Section F ─────────────────────────────────────────────────────────────────

export const SECTION_F_BASE_COUNT = 9
export const SECTION_F_C1_START = 'f1Surname'
export const SECTION_F_C2_START = 'f2Surname'

function makeContactQuestions(prefix, contactLabel) {
  const sec = `Section F — Emergency Contacts (${contactLabel})`
  return {
    [`${prefix}Surname`]: {
      id: `${prefix}Surname`,
      section: sec,
      base: 1,
      text: "What is their surname?",
      hint: "This is their family name — the last name they use every day.",
      type: 'voice',
      next: () => `${prefix}FirstName`,
    },
    [`${prefix}FirstName`]: {
      id: `${prefix}FirstName`,
      section: sec,
      base: 2,
      text: "What is their first name?",
      hint: "This is the name they go by every day — like John or Maria.",
      type: 'voice',
      next: () => `${prefix}HasMiddleName`,
    },
    [`${prefix}HasMiddleName`]: {
      id: `${prefix}HasMiddleName`,
      section: sec,
      base: 3,
      text: "Do they have a middle name?",
      hint: "A middle name is an extra name between the first name and surname. Not everyone has one.",
      type: 'yesno',
      next: (answer) => answer === 'Yes' ? `${prefix}MiddleName` : `${prefix}Address`,
    },
    [`${prefix}MiddleName`]: {
      id: `${prefix}MiddleName`,
      section: sec,
      base: 3,
      isSubQ: true,
      text: "What is their middle name?",
      hint: "Say their middle name clearly.",
      type: 'voice',
      next: () => `${prefix}Address`,
    },
    [`${prefix}Address`]: {
      id: `${prefix}Address`,
      section: sec,
      base: 4,
      text: "What is their street address? If they do not have one, enter their community or district.",
      hint: "Say their street address, or the name of their community or district.",
      type: 'voice',
      next: () => `${prefix}Parish`,
    },
    [`${prefix}Parish`]: {
      id: `${prefix}Parish`,
      section: sec,
      base: 5,
      text: "Which parish do they live in?",
      type: 'choice',
      options: [...PARISHES, 'Outside Jamaica'],
      next: (ans) => ans === 'Outside Jamaica' ? `${prefix}CityAbroad` : `${prefix}PostOffice`,
    },
    [`${prefix}PostOffice`]: {
      id: `${prefix}PostOffice`,
      section: sec,
      base: 5,
      isSubQ: true,
      canSkip: true,
      text: "What is their Post Office or P.O. Box area?",
      hint: "For example: Southfield P.O. or May Pen P.O. Skip if you are not sure.",
      type: 'voice',
      next: () => `${prefix}Country`,
    },
    [`${prefix}CityAbroad`]: {
      id: `${prefix}CityAbroad`,
      section: sec,
      base: 5,
      isSubQ: true,
      text: "What city or region do they live in?",
      type: 'voice',
      next: () => `${prefix}Country`,
    },
    [`${prefix}Country`]: {
      id: `${prefix}Country`,
      section: sec,
      base: 6,
      text: "What country do they live in?",
      hint: "If they live in Jamaica, say Jamaica. If they live overseas, say the name of their country.",
      type: 'voice',
      defaultValue: 'Jamaica',
      next: () => `${prefix}Relationship`,
    },
    [`${prefix}Relationship`]: {
      id: `${prefix}Relationship`,
      section: sec,
      base: 7,
      text: "What is their relationship to you?",
      hint: "For example: mother, father, friend, sister, uncle, neighbour.",
      type: 'voice',
      next: () => `${prefix}AreaCode`,
    },
    [`${prefix}AreaCode`]: {
      id: `${prefix}AreaCode`,
      section: sec,
      base: 8,
      text: "What is the area code for their phone number?",
      hint: "For most Jamaica numbers this is 876. For overseas contacts, say the country code and area code.",
      type: 'voice',
      toSpeech: (text) => text.split('').join(' '),
      next: () => `${prefix}PhoneNumber`,
    },
    [`${prefix}PhoneNumber`]: {
      id: `${prefix}PhoneNumber`,
      section: sec,
      base: 9,
      text: "What are the 7 digits of their phone number?",
      hint: "Say the 7 digits one by one — for example: 1, 2, 3, 4, 5, 6, 7.",
      type: 'voice',
      toSpeech: (text) => text.split('').join(' '),
      next: () => null, // null = end of contact questions
    },
  }
}

export const SECTION_F_C1_QUESTIONS = makeContactQuestions('f1', 'Contact 1')
export const SECTION_F_C2_QUESTIONS = makeContactQuestions('f2', 'Contact 2')
