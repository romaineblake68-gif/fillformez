import { PARISHES, COMMUNITIES } from './jamaicanLocations'
import { yearToSpeech, phoneToSpeech } from '../utils/formatSpeech'

export const SKIP = '__SKIP__'

export const NIS_START = 'title'
export const NIS_BASE_COUNT = 20

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const NIS_QUESTIONS = {

  // ── Section 1 — Personal Information ──────────────────────────────────────

  title: {
    id: 'title', base: 1, section: 'Personal Information',
    text: 'What is your title?',
    hint: 'Choose the title you normally use — Mr, Mrs, or Miss.',
    type: 'choice',
    options: ['Mr', 'Mrs', 'Miss'],
    next: () => 'lastName',
  },

  lastName: {
    id: 'lastName', base: 2, section: 'Your Name',
    text: 'What is your last name?',
    hint: 'This is your surname — the name you share with your family.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'firstName',
  },

  firstName: {
    id: 'firstName', base: 2, isSubQ: true, section: 'Your Name',
    text: 'What is your first name?',
    hint: 'This is your given name — the one your parents called you from birth.',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'hasMiddleName',
  },

  hasMiddleName: {
    id: 'hasMiddleName', base: 2, isSubQ: true, section: 'Your Name',
    text: 'Do you have a middle name?',
    type: 'yesno',
    next: (ans, all) => {
      if (ans === 'Yes') return 'middleName'
      return all.title === 'Mr' ? 'hasOtherNames' : 'hasMaidenName'
    },
  },

  middleName: {
    id: 'middleName', base: 2, isSubQ: true, section: 'Your Name',
    text: 'What is your middle name?',
    type: 'voice',
    transform: 'titleCase',
    next: (_, all) => all.title === 'Mr' ? 'hasOtherNames' : 'hasMaidenName',
  },

  hasMaidenName: {
    id: 'hasMaidenName', base: 2, isSubQ: true, section: 'Your Name',
    text: 'Do you have a maiden name?',
    hint: 'A maiden name is the last name you had before you got married.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'maidenName' : 'hasOtherNames',
  },

  maidenName: {
    id: 'maidenName', base: 2, isSubQ: true, section: 'Your Name',
    text: 'What is your maiden name?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'hasOtherNames',
  },

  hasOtherNames: {
    id: 'hasOtherNames', base: 2, isSubQ: true, section: 'Your Name',
    text: 'Have you ever used any other names?',
    hint: 'For example — a different spelling, a nickname used on official documents, or a name before adoption.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'otherNames' : 'sex',
  },

  otherNames: {
    id: 'otherNames', base: 2, isSubQ: true, section: 'Your Name',
    text: 'What other name or names have you used?',
    hint: 'Say all other names you have been known by officially.',
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'sex',
  },

  // ── Section 2 — Personal Details ──────────────────────────────────────────

  sex: {
    id: 'sex', base: 3, section: 'Personal Details',
    text: 'What is your sex?',
    type: 'choice',
    options: ['Male', 'Female'],
    next: () => 'birthDay',
  },

  birthDay: {
    id: 'birthDay', base: 4, section: 'Date of Birth',
    text: 'What day of the month were you born? Just say the number.',
    hint: 'Say just the number. For example — "fifteen" or "three".',
    type: 'voice',
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
      return null
    },
    next: () => 'birthMonth',
  },

  birthMonth: {
    id: 'birthMonth', base: 4, isSubQ: true, section: 'Date of Birth',
    text: 'What month were you born in?',
    type: 'choice',
    options: MONTHS,
    next: () => 'birthYear',
  },

  birthYear: {
    id: 'birthYear', base: 4, isSubQ: true, section: 'Date of Birth',
    text: 'What year were you born?',
    hint: 'Say the full year — for example "nineteen eighty five" or "two thousand and one".',
    type: 'voice',
    toSpeech: (v) => yearToSpeech(v),
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1900 || n > 2026) return 'Please enter a year between 1900 and 2026.'
      return null
    },
    next: () => 'birthCountry',
  },

  birthCountry: {
    id: 'birthCountry', base: 5, section: 'Place of Birth',
    text: 'What country were you born in?',
    type: 'choice',
    options: ['Jamaica', 'Another country'],
    next: (ans) => ans === 'Jamaica' ? 'birthParish' : 'birthCountryName',
  },

  birthParish: {
    id: 'birthParish', base: 5, isSubQ: true, section: 'Place of Birth',
    text: 'Which parish in Jamaica were you born in?',
    hint: 'Say the parish name — for example: "Kingston", "St. Andrew", or "Westmoreland".',
    type: 'voice',
    canSkip: true,
    next: () => 'prevNIS',
  },

  birthCountryName: {
    id: 'birthCountryName', base: 5, isSubQ: true, section: 'Place of Birth',
    text: 'What country were you born in? Please say the full country name.',
    type: 'voice',
    next: () => 'prevNIS',
  },

  // ── Section 3 — Previous IDs ───────────────────────────────────────────────

  prevNIS: {
    id: 'prevNIS', base: 6, section: 'Previous IDs',
    text: 'Do you have a previous NIS number? If not, tap Skip.',
    speechText: 'Do you have a previous N I S number? If not, tap Skip.',
    hint: 'You may have an old NIS number if you registered before. It is printed on your NIS card.',
    hintSpeech: 'You may have an old N I S number if you registered before. It is printed on your N I S card.',
    type: 'voice',
    canSkip: true,
    next: () => 'trnNumber',
  },

  trnNumber: {
    id: 'trnNumber', base: 6, isSubQ: true, section: 'Previous IDs',
    text: 'Do you have a TRN number? If not, tap Skip.',
    hint: 'Your TRN is your Tax Registration Number — a 9-digit number used for government and financial purposes.',
    type: 'voice',
    canSkip: true,
    next: () => 'maritalStatus',
  },

  // ── Section 4 — Marital Status ─────────────────────────────────────────────

  maritalStatus: {
    id: 'maritalStatus', base: 7, section: 'Marital Status',
    text: 'What is your marital status?',
    hint: 'A common-law union means you live with a partner as husband and wife but are not legally married.',
    type: 'choice',
    options: ['Single', 'Common-Law Union', 'Married', 'Widowed', 'Divorced'],
    next: (ans) => ans === 'Married' ? 'spouseTitle' : 'homeParish',
  },

  spouseTitle: {
    id: 'spouseTitle', base: 8, isSubQ: true, section: "Spouse's Details",
    text: "What is your spouse's title?",
    type: 'choice',
    options: ['Mr', 'Miss', 'Mrs', 'Ms', 'Dr'],
    next: () => 'spouseLastName',
  },

  spouseLastName: {
    id: 'spouseLastName', base: 8, isSubQ: true, section: "Spouse's Details",
    text: "What is your spouse's last name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'spouseFirstName',
  },

  spouseFirstName: {
    id: 'spouseFirstName', base: 8, isSubQ: true, section: "Spouse's Details",
    text: "What is your spouse's first name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'spouseHasMiddle',
  },

  spouseHasMiddle: {
    id: 'spouseHasMiddle', base: 8, isSubQ: true, section: "Spouse's Details",
    text: 'Does your spouse have a middle name?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'spouseMiddleName' : 'spouseMaidenName',
  },

  spouseMiddleName: {
    id: 'spouseMiddleName', base: 8, isSubQ: true, section: "Spouse's Details",
    text: "What is your spouse's middle name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'spouseMaidenName',
  },

  spouseMaidenName: {
    id: 'spouseMaidenName', base: 8, isSubQ: true, section: "Spouse's Details",
    text: "What is your spouse's maiden name? If they do not have one, tap Skip.",
    hint: 'The maiden name is the last name they had before marriage.',
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'marriageDay',
  },

  marriageDay: {
    id: 'marriageDay', base: 9, isSubQ: true, section: 'Marriage Details',
    text: 'What day of the month did you get married or enter your union? Say the number.',
    type: 'voice',
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
      return null
    },
    next: () => 'marriageMonth',
  },

  marriageMonth: {
    id: 'marriageMonth', base: 9, isSubQ: true, section: 'Marriage Details',
    text: 'What month did you get married or enter your union?',
    type: 'choice',
    options: MONTHS,
    next: () => 'marriageYear',
  },

  marriageYear: {
    id: 'marriageYear', base: 9, isSubQ: true, section: 'Marriage Details',
    text: 'What year did you get married or enter your union?',
    type: 'voice',
    toSpeech: (v) => yearToSpeech(v),
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1900 || n > 2026) return 'Please enter a year between 1900 and 2026.'
      return null
    },
    next: () => 'spouseBirthDay',
  },

  spouseBirthDay: {
    id: 'spouseBirthDay', base: 9, isSubQ: true, section: 'Marriage Details',
    text: "What day of the month was your spouse born? Say the number.",
    type: 'voice',
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
      return null
    },
    next: () => 'spouseBirthMonth',
  },

  spouseBirthMonth: {
    id: 'spouseBirthMonth', base: 9, isSubQ: true, section: 'Marriage Details',
    text: "What month was your spouse born in?",
    type: 'choice',
    options: MONTHS,
    next: () => 'spouseBirthYear',
  },

  spouseBirthYear: {
    id: 'spouseBirthYear', base: 9, isSubQ: true, section: 'Marriage Details',
    text: "What year was your spouse born?",
    type: 'voice',
    toSpeech: (v) => yearToSpeech(v),
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1900 || n > 2026) return 'Please enter a year between 1900 and 2026.'
      return null
    },
    next: () => 'homeParish',
  },

  // ── Section 5 — Home Address ───────────────────────────────────────────────

  homeParish: {
    id: 'homeParish', base: 10, section: 'Home Address',
    text: 'Which parish do you live in?',
    type: 'choice',
    options: PARISHES,
    next: () => 'homeDistrict',
  },

  homeDistrict: {
    id: 'homeDistrict', base: 10, isSubQ: true, section: 'Home Address',
    text: 'Which community or district do you live in?',
    hint: 'Say the name — for example: "Southfield" or "Rose Hall". Tap Skip if you are not sure.',
    type: 'voice',
    canSkip: true,
    next: () => 'homeStreet',
  },

  hasHomeStreet: {
    id: 'hasHomeStreet', base: 10, isSubQ: true, section: 'Home Address',
    text: 'Do you have a street number and name?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'homeStreet' : 'homeCountry',
  },

  homeStreet: {
    id: 'homeStreet', base: 10, isSubQ: true, section: 'Home Address',
    text: 'Tell us your street address.',
    hint: 'Tap the mic and say it slowly, or type it below. Skip if you do not have a street number.',
    type: 'voice',
    canSkip: true,
    next: () => 'homeCountry',
  },

  homeCountry: {
    id: 'homeCountry', base: 10, isSubQ: true, section: 'Home Address',
    text: 'What country do you live in?',
    type: 'voice',
    defaultValue: 'Jamaica',
    next: () => 'mailingAddressSame',
  },

  mailingAddressSame: {
    id: 'mailingAddressSame', base: 11, section: 'Mailing Address',
    text: 'Is your mailing address the same as your home address?',
    hint: 'Your mailing address is where you receive letters and official documents.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'hasEmail' : 'mailingParish',
  },

  mailingParish: {
    id: 'mailingParish', base: 11, isSubQ: true, section: 'Mailing Address',
    text: 'Which parish is your mailing address in?',
    type: 'choice',
    options: PARISHES,
    next: () => 'mailingDistrict',
  },

  mailingDistrict: {
    id: 'mailingDistrict', base: 11, isSubQ: true, section: 'Mailing Address',
    text: 'Which community or district is your mailing address in?',
    hint: 'Say the name — for example: "Southfield" or "Rose Hall". Tap Skip if you are not sure.',
    type: 'voice',
    canSkip: true,
    next: () => 'mailingStreet',
  },

  hasMailingStreet: {
    id: 'hasMailingStreet', base: 11, isSubQ: true, section: 'Mailing Address',
    text: 'Does your mailing address have a street number and name?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'mailingStreet' : 'mailingCountry',
  },

  mailingStreet: {
    id: 'mailingStreet', base: 11, isSubQ: true, section: 'Mailing Address',
    text: 'Tell us the street address for your mailing address.',
    hint: 'Tap the mic and say it slowly, or type it below. Skip if you are not sure.',
    type: 'voice',
    canSkip: true,
    next: () => 'mailingCountry',
  },

  mailingCountry: {
    id: 'mailingCountry', base: 11, isSubQ: true, section: 'Mailing Address',
    text: 'What country is your mailing address in?',
    type: 'voice',
    defaultValue: 'Jamaica',
    next: () => 'hasEmail',
  },

  // ── Section 6 — Contact ────────────────────────────────────────────────────

  hasEmail: {
    id: 'hasEmail', base: 12, section: 'Contact Details',
    text: 'Do you have an email address?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'email' : 'cellPhone',
  },

  email: {
    id: 'email', base: 12, isSubQ: true, section: 'Contact Details',
    text: 'What is your email address? Please spell it out clearly.',
    hint: 'Say each part clearly — for example: "romaineblake68 at gmail dot com".',
    type: 'voice',
    canSkip: true,
    next: () => 'cellPhone',
  },

  cellPhone: {
    id: 'cellPhone', base: 12, section: 'Contact Details',
    text: 'What is your cell phone number? If you do not have one, tap Skip.',
    hint: 'Include the area code. For example: 876-555-1234.',
    type: 'voice',
    canSkip: true,
    toSpeech: (v) => phoneToSpeech(v),
    next: () => 'hasHomePhone',
  },

  hasHomePhone: {
    id: 'hasHomePhone', base: 12, isSubQ: true, section: 'Contact Details',
    text: 'Do you have a home phone number?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'homePhone' : 'hasWorkPhone',
  },

  homePhone: {
    id: 'homePhone', base: 12, isSubQ: true, section: 'Contact Details',
    text: 'What is your home phone number?',
    hint: 'Include the area code. For example: 876-555-1234.',
    type: 'voice',
    toSpeech: (v) => phoneToSpeech(v),
    next: () => 'hasWorkPhone',
  },

  hasWorkPhone: {
    id: 'hasWorkPhone', base: 12, isSubQ: true, section: 'Contact Details',
    text: 'Do you have a work phone number?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'workPhone' : 'fatherLastName',
  },

  workPhone: {
    id: 'workPhone', base: 12, isSubQ: true, section: 'Contact Details',
    text: 'What is your work phone number?',
    hint: 'Include the area code. For example: 876-555-1234.',
    type: 'voice',
    toSpeech: (v) => phoneToSpeech(v),
    next: () => 'fatherLastName',
  },

  // ── Section 7 — Parents ────────────────────────────────────────────────────

  fatherLastName: {
    id: 'fatherLastName', base: 13, section: "Parents' Details",
    text: "What is your father's last name? If you do not know, tap Skip.",
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'fatherFirstName',
  },

  fatherFirstName: {
    id: 'fatherFirstName', base: 13, isSubQ: true, section: "Parents' Details",
    text: "What is your father's first name? If you do not know, tap Skip.",
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'fatherHasMiddle',
  },

  fatherHasMiddle: {
    id: 'fatherHasMiddle', base: 13, isSubQ: true, section: "Parents' Details",
    text: 'Does your father have a middle name?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'fatherMiddleName' : 'motherTitle',
  },

  fatherMiddleName: {
    id: 'fatherMiddleName', base: 13, isSubQ: true, section: "Parents' Details",
    text: "What is your father's middle name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'motherTitle',
  },

  motherTitle: {
    id: 'motherTitle', base: 13, isSubQ: true, section: "Parents' Details",
    text: "What is your mother's title?",
    type: 'choice',
    options: ['Miss', 'Mrs'],
    next: () => 'motherLastName',
  },

  motherLastName: {
    id: 'motherLastName', base: 13, isSubQ: true, section: "Parents' Details",
    text: "What is your mother's last name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'motherFirstName',
  },

  motherFirstName: {
    id: 'motherFirstName', base: 13, isSubQ: true, section: "Parents' Details",
    text: "What is your mother's first name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'motherHasMiddle',
  },

  motherHasMiddle: {
    id: 'motherHasMiddle', base: 13, isSubQ: true, section: "Parents' Details",
    text: 'Does your mother have a middle name?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'motherMiddleName' : 'motherMaidenName',
  },

  motherMiddleName: {
    id: 'motherMiddleName', base: 13, isSubQ: true, section: "Parents' Details",
    text: "What is your mother's middle name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'motherMaidenName',
  },

  motherMaidenName: {
    id: 'motherMaidenName', base: 13, isSubQ: true, section: "Parents' Details",
    text: "What is your mother's maiden name? If you do not know, tap Skip.",
    hint: 'Her maiden name is the last name she had before she got married.',
    type: 'voice',
    transform: 'titleCase',
    canSkip: true,
    next: () => 'employmentType',
  },

  // ── Section 8 — Employment ─────────────────────────────────────────────────

  employmentType: {
    id: 'employmentType', base: 14, section: 'Employment',
    text: 'Which best describes your current employment situation?',
    hint: 'Domestic means you work in someone\'s home — for example as a helper or caregiver.',
    type: 'choice',
    options: ['Self-Employed', 'Employed', 'Domestic', 'Student', 'Unemployed'],
    next: (ans) => (ans === 'Student' || ans === 'Unemployed') ? null : 'occupation',
  },

  occupation: {
    id: 'occupation', base: 15, section: 'Employment',
    text: 'What is your occupation? This means the type of work you do.',
    hint: 'For example — farmer, teacher, nurse, driver, student, self-employed, retired.',
    type: 'voice',
    next: (ans, all) => all.employmentType === 'Employed' ? 'employerName' : null,
  },

  employerName: {
    id: 'employerName', base: 15, isSubQ: true, section: 'Employment',
    text: 'What is the name of your employer?',
    hint: 'Say the full official name of the company or organisation you work for.',
    type: 'voice',
    next: () => 'employerAddress',
  },

  employerAddress: {
    id: 'employerAddress', base: 15, isSubQ: true, section: 'Employment',
    text: "What is your employer's address? If you do not know it, tap Skip.",
    type: 'voice',
    canSkip: true,
    next: () => 'employerRefNumber',
  },

  employerRefNumber: {
    id: 'employerRefNumber', base: 15, isSubQ: true, section: 'Employment',
    text: 'What is your employer reference number? If you do not have one, tap Skip.',
    hint: 'This is a number your employer uses to identify your workplace with the NIS office. It may be on your payslip.',
    hintSpeech: 'This is a number your employer uses to identify your workplace with the N I S office. It may be on your payslip.',
    type: 'voice',
    canSkip: true,
    next: () => 'industryType',
  },

  industryType: {
    id: 'industryType', base: 15, isSubQ: true, section: 'Employment',
    text: 'Which industry does your employer operate in?',
    type: 'choice',
    options: [
      'Agriculture', 'Manufacturing', 'Construction', 'Retail',
      'Finance', 'Healthcare', 'Education', 'Government', 'Transport', 'Other',
    ],
    next: () => null,
  },
}
