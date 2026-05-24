import { PARISHES, COMMUNITIES } from './jamaicanLocations'
import { yearToSpeech, phoneToSpeech } from '../utils/formatSpeech'

export const SKIP = '__SKIP__'

export const TRN_START = 'firstTime'
export const TRN_BASE_COUNT = 21

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const TRN_QUESTIONS = {

  // ── Screen 1 — First time? ─────────────────────────────────────────────────
  firstTime: {
    id: 'firstTime', base: 1, section: 'TRN Application',
    text: 'Is this your first time applying for a TRN?',
    hint: 'A TRN is a Tax Registration Number — a 9-digit number used to identify you with the government, banks, and other institutions.',
    type: 'choice',
    options: ['Yes, first time', 'No, I need to update my information'],
    next: () => 'lastName',
  },

  // ── Screen 2 — Full name ───────────────────────────────────────────────────
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
    next: (ans) => ans === 'Yes' ? 'middleName' : 'sameBirthLastName',
  },
  middleName: {
    id: 'middleName', base: 2, isSubQ: true, section: 'Your Name',
    text: 'What is your middle name?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'sameBirthLastName',
  },

  // ── Screen 3 — Name at birth ───────────────────────────────────────────────
  sameBirthLastName: {
    id: 'sameBirthLastName', base: 3, section: 'Name at Birth',
    text: 'Is the last name you just gave us the same last name you were born with?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'sex' : 'birthLastName',
  },
  birthLastName: {
    id: 'birthLastName', base: 3, isSubQ: true, section: 'Name at Birth',
    text: 'What was your last name at birth?',
    type: 'voice',
    transform: 'titleCase',
    next: () => 'nameChangeReason',
  },
  nameChangeReason: {
    id: 'nameChangeReason', base: 3, isSubQ: true, section: 'Name at Birth',
    text: 'What was the reason for the name change?',
    hint: 'A Deed Poll is a legal document used to officially change your name.',
    type: 'choice',
    options: ['Adoption', 'Marriage', 'Deed Poll', 'Other'],
    next: () => 'sex',
  },

  // ── Screen 4 — Sex ─────────────────────────────────────────────────────────
  sex: {
    id: 'sex', base: 4, section: 'Personal Details',
    text: 'What is your sex?',
    type: 'choice',
    options: ['Male', 'Female'],
    next: () => 'maritalStatus',
  },

  // ── Screen 5 — Marital status ──────────────────────────────────────────────
  maritalStatus: {
    id: 'maritalStatus', base: 5, section: 'Personal Details',
    text: 'What is your marital status?',
    hint: 'Single means you have never been married. Divorced means you were married but are now legally separated. Widowed means your spouse has passed away.',
    type: 'choice',
    options: ['Single', 'Married', 'Divorced', 'Widowed'],
    next: () => 'birthDay',
  },

  // ── Screen 6 — Date of birth ───────────────────────────────────────────────
  birthDay: {
    id: 'birthDay', base: 6, section: 'Date of Birth',
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
    id: 'birthMonth', base: 6, isSubQ: true, section: 'Date of Birth',
    text: 'What month were you born in?',
    type: 'choice',
    options: MONTHS,
    next: () => 'birthYear',
  },
  birthYear: {
    id: 'birthYear', base: 6, isSubQ: true, section: 'Date of Birth',
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

  // ── Screen 7 — Country of birth ───────────────────────────────────────────
  birthCountry: {
    id: 'birthCountry', base: 7, section: 'Place of Birth',
    text: 'What country were you born in?',
    type: 'choice',
    options: ['Jamaica', 'Another country'],
    next: (ans) => ans === 'Jamaica' ? 'birthParish' : 'birthCountryName',
  },
  birthParish: {
    id: 'birthParish', base: 7, isSubQ: true, section: 'Place of Birth',
    text: 'Which parish in Jamaica were you born in?',
    type: 'choice',
    options: PARISHES,
    next: () => 'birthTown',
  },
  birthTown: {
    id: 'birthTown', base: 7, isSubQ: true, section: 'Place of Birth',
    text: 'Which community or town were you born in?',
    hint: 'Say the name — for example: "Southfield" or "Black River". Tap Skip if you are not sure.',
    type: 'voice',
    canSkip: true,
    next: () => 'nationality',
  },
  birthCountryName: {
    id: 'birthCountryName', base: 7, isSubQ: true, section: 'Place of Birth',
    text: 'What country were you born in? Please say the full country name.',
    type: 'voice',
    next: () => 'birthCityAbroad',
  },
  birthCityAbroad: {
    id: 'birthCityAbroad', base: 7, isSubQ: true, section: 'Place of Birth',
    text: 'What city or town were you born in?',
    type: 'voice',
    next: () => 'nationality',
  },

  // ── Screen 8 — Nationality ────────────────────────────────────────────────
  nationality: {
    id: 'nationality', base: 8, section: 'Nationality',
    text: 'What country are you a citizen of?',
    hint: 'For most Jamaicans, the answer is Jamaica.',
    type: 'choice',
    options: ['Jamaican', 'Other'],
    next: (ans) => ans === 'Other' ? 'nationalityOther' : 'cellPhone',
  },
  nationalityOther: {
    id: 'nationalityOther', base: 8, isSubQ: true, section: 'Nationality',
    text: 'What country are you a citizen of? Please say the country name clearly.',
    type: 'voice',
    next: () => 'cellPhone',
  },

  // ── Screen 9 — Phone numbers ───────────────────────────────────────────────
  cellPhone: {
    id: 'cellPhone', base: 9, section: 'Phone Numbers',
    text: 'What is your cell phone number? If you do not have one, tap Skip.',
    hint: 'Include the area code. For example: 876-555-1234.',
    type: 'voice',
    canSkip: true,
    toSpeech: (v) => phoneToSpeech(v),
    next: () => 'hasHomePhone',
  },
  hasHomePhone: {
    id: 'hasHomePhone', base: 9, isSubQ: true, section: 'Phone Numbers',
    text: 'Do you have a home phone number?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'homePhone' : 'hasWorkPhone',
  },
  homePhone: {
    id: 'homePhone', base: 9, isSubQ: true, section: 'Phone Numbers',
    text: 'What is your home phone number?',
    hint: 'Include the area code. For example: 876-555-1234.',
    type: 'voice',
    toSpeech: (v) => phoneToSpeech(v),
    next: () => 'hasWorkPhone',
  },
  hasWorkPhone: {
    id: 'hasWorkPhone', base: 9, isSubQ: true, section: 'Phone Numbers',
    text: 'Do you have a work phone number?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'workPhone' : 'hasEmail',
  },
  workPhone: {
    id: 'workPhone', base: 9, isSubQ: true, section: 'Phone Numbers',
    text: 'What is your work phone number?',
    hint: 'Include the area code. For example: 876-555-1234.',
    type: 'voice',
    toSpeech: (v) => phoneToSpeech(v),
    next: () => 'hasEmail',
  },

  // ── Screen 10 — Email ─────────────────────────────────────────────────────
  hasEmail: {
    id: 'hasEmail', base: 10, section: 'Email Address',
    text: 'Do you have an email address?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'email' : 'contactMethod',
  },
  email: {
    id: 'email', base: 10, isSubQ: true, section: 'Email Address',
    text: 'What is your email address? Please spell it out clearly.',
    hint: 'Say each part clearly — for example: "romaineblake68 at gmail dot com".',
    type: 'voice',
    next: () => 'contactMethod',
  },

  // ── Screen 11 — Preferred contact ────────────────────────────────────────
  contactMethod: {
    id: 'contactMethod', base: 11, section: 'Preferred Contact',
    text: 'How would you like to be contacted by the Tax Administration?',
    hint: 'SMS means a text message to your phone. Mail means a letter to your home address.',
    type: 'choice',
    options: ['Phone call', 'Fax', 'Email', 'SMS', 'Mail'],
    next: () => 'homeParish',
  },

  // ── Screen 12 — Home address ──────────────────────────────────────────────
  homeParish: {
    id: 'homeParish', base: 12, section: 'Home Address',
    text: 'Which parish do you live in?',
    type: 'choice',
    options: PARISHES,
    next: () => 'homeDistrict',
  },
  homeDistrict: {
    id: 'homeDistrict', base: 12, isSubQ: true, section: 'Home Address',
    text: 'Which community or district do you live in?',
    hint: 'Say the name — for example: "Southfield" or "Rose Hall". Tap Skip if you are not sure.',
    type: 'voice',
    canSkip: true,
    next: () => 'homeStreet',
  },
  hasHomeStreet: {
    id: 'hasHomeStreet', base: 12, isSubQ: true, section: 'Home Address',
    text: 'Do you have a street number and name?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'homeStreet' : 'hasPoBox',
  },
  homeStreet: {
    id: 'homeStreet', base: 12, isSubQ: true, section: 'Home Address',
    text: 'Tell us your street address.',
    hint: 'Tap the mic and say it slowly, or type it below. Skip if you do not have a street number.',
    type: 'voice',
    canSkip: true,
    next: () => 'poBox',
  },
  hasPoBox: {
    id: 'hasPoBox', base: 12, isSubQ: true, section: 'Home Address',
    text: 'Do you have a P.O. Box?',
    hint: 'A P.O. Box is a numbered box at the post office where you receive mail.',
    type: 'choice',
    options: ['Yes', "I don't have one"],
    next: (ans) => ans === 'Yes' ? 'poBox' : 'knowsHomePostalCode',
  },
  poBox: {
    id: 'poBox', base: 12, isSubQ: true, section: 'Home Address',
    text: 'What is your P.O. Box number?',
    type: 'voice',
    canSkip: true,
    next: () => 'homePostalCode',
  },
  knowsHomePostalCode: {
    id: 'knowsHomePostalCode', base: 12, isSubQ: true, section: 'Home Address',
    text: 'Do you know your postal code?',
    hint: 'A postal code is a short number used for mail delivery. If you are not sure, tap No.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'homePostalCode' : 'homeCountry',
  },
  homePostalCode: {
    id: 'homePostalCode', base: 12, isSubQ: true, section: 'Home Address',
    text: 'What is your postal code?',
    type: 'voice',
    canSkip: true,
    next: () => 'homeCountry',
  },
  homeCountry: {
    id: 'homeCountry', base: 12, isSubQ: true, section: 'Home Address',
    text: 'What country do you live in?',
    type: 'voice',
    defaultValue: 'Jamaica',
    next: () => 'mailingAddressSame',
  },

  // ── Screen 13 — Mailing address ───────────────────────────────────────────
  mailingAddressSame: {
    id: 'mailingAddressSame', base: 13, section: 'Mailing Address',
    text: 'Is your mailing address the same as your home address?',
    hint: 'Your mailing address is where you receive letters and documents.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'motherFirstName' : 'mailingParish',
  },
  mailingParish: {
    id: 'mailingParish', base: 13, isSubQ: true, section: 'Mailing Address',
    text: 'Which parish is your mailing address in?',
    type: 'choice',
    options: PARISHES,
    next: () => 'mailingDistrict',
  },
  mailingDistrict: {
    id: 'mailingDistrict', base: 13, isSubQ: true, section: 'Mailing Address',
    text: 'Which community or district is your mailing address in?',
    hint: 'Say the name — for example: "Southfield" or "Rose Hall". Tap Skip if you are not sure.',
    type: 'voice',
    canSkip: true,
    next: () => 'mailingStreet',
  },
  mailingStreet: {
    id: 'mailingStreet', base: 13, isSubQ: true, section: 'Mailing Address',
    text: 'Tell us the street address for your mailing address.',
    hint: 'Tap the mic and say it slowly, or type it below. Skip if you are not sure.',
    type: 'voice',
    canSkip: true,
    next: () => 'mailingPostalCode',
  },
  knowsMailingPostalCode: {
    id: 'knowsMailingPostalCode', base: 13, isSubQ: true, section: 'Mailing Address',
    text: 'Do you know the postal code for this address?',
    hint: 'A postal code is a short number used for mail delivery. If you are not sure, tap No.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'mailingPostalCode' : 'mailingCountry',
  },
  mailingPostalCode: {
    id: 'mailingPostalCode', base: 13, isSubQ: true, section: 'Mailing Address',
    text: 'What is the postal code for this address?',
    type: 'voice',
    canSkip: true,
    next: () => 'mailingCountry',
  },
  mailingCountry: {
    id: 'mailingCountry', base: 13, isSubQ: true, section: 'Mailing Address',
    text: 'What country is your mailing address in?',
    type: 'voice',
    defaultValue: 'Jamaica',
    next: () => 'motherFirstName',
  },

  // ── Screen 14 — Mother's name ─────────────────────────────────────────────
  motherFirstName: {
    id: 'motherFirstName', base: 14, section: "Mother's Name",
    text: "What is your mother's first name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'motherHasMiddleName',
  },
  motherHasMiddleName: {
    id: 'motherHasMiddleName', base: 14, isSubQ: true, section: "Mother's Name",
    text: "Does your mother have a middle name?",
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'motherMiddleName' : 'motherMaidenName',
  },
  motherMiddleName: {
    id: 'motherMiddleName', base: 14, isSubQ: true, section: "Mother's Name",
    text: "What is your mother's middle name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'motherMaidenName',
  },
  motherMaidenName: {
    id: 'motherMaidenName', base: 14, isSubQ: true, section: "Mother's Name",
    text: "What is your mother's maiden name?",
    hint: "Her maiden name is the last name she had before she got married — the surname she was born with. If she never married, it is the same as her current last name.",
    type: 'voice',
    transform: 'titleCase',
    next: (_, all) => {
      const ms = all.maritalStatus
      if (ms === 'Married') return 'spouseFirstName'
      if (ms === 'Divorced' || ms === 'Widowed') return 'spouseContext'
      return 'occupation'
    },
  },

  // ── Screen 15 — Spouse (only if ever married) ─────────────────────────────
  spouseContext: {
    id: 'spouseContext', base: 15, section: "Spouse's Name",
    text: 'Next, we need the name of your ex-spouse or late spouse. Their details are still required for this form.',
    type: 'choice',
    options: ['Got it, continue'],
    next: () => 'spouseFirstName',
  },
  spouseFirstName: {
    id: 'spouseFirstName', base: 15, section: "Spouse's Name",
    text: "What is your spouse's first name?",
    hint: "Your spouse is the person you are or were married to. If you are divorced or widowed, tell us your former spouse's name.",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'spouseHasMiddleName',
  },
  spouseHasMiddleName: {
    id: 'spouseHasMiddleName', base: 15, isSubQ: true, section: "Spouse's Name",
    text: "Does your spouse have a middle name?",
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'spouseMiddleName' : 'spouseLastName',
  },
  spouseMiddleName: {
    id: 'spouseMiddleName', base: 15, isSubQ: true, section: "Spouse's Name",
    text: "What is your spouse's middle name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'spouseLastName',
  },
  spouseLastName: {
    id: 'spouseLastName', base: 15, isSubQ: true, section: "Spouse's Name",
    text: "What is your spouse's last name?",
    type: 'voice',
    transform: 'titleCase',
    next: () => 'occupation',
  },

  // ── Screen 16 — Occupation ────────────────────────────────────────────────
  occupation: {
    id: 'occupation', base: 16, section: 'Occupation',
    text: 'What is your occupation? This means what kind of work do you do for a living.',
    hint: 'For example — farmer, teacher, nurse, driver, student, self-employed, retired.',
    type: 'voice',
    next: () => 'hasNIS',
  },

  // ── Screen 17 — NIS ───────────────────────────────────────────────────────
  hasNIS: {
    id: 'hasNIS', base: 17, section: 'NIS Number',
    text: 'Do you have a NIS number?',
    speechText: 'Do you have an N I S number?',
    hint: 'NIS stands for National Insurance Scheme. You can find your NIS number on your NIS card or on your payslip from work.',
    hintSpeech: 'N I S stands for National Insurance Scheme. You can find your N I S number on your N I S card or on your payslip from work.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'nisNumber' : 'idType',
  },
  nisNumber: {
    id: 'nisNumber', base: 17, isSubQ: true, section: 'NIS Number',
    text: 'What is your NIS number? Please say it clearly.',
    speechText: 'What is your N I S number? Please say it clearly.',
    type: 'voice',
    next: () => 'idType',
  },

  // ── Screen 18 — Identification ────────────────────────────────────────────
  idType: {
    id: 'idType', base: 18, section: 'Identification',
    text: 'Which type of identification are you using for this application?',
    hint: "Your Elector Registration ID is also called your National ID or Voter's ID.",
    type: 'choice',
    options: ["Driver's Licence", 'Passport', 'Elector Registration ID', 'Birth Certificate', 'Other ID'],
    next: () => 'idNumber',
  },
  idNumber: {
    id: 'idNumber', base: 18, isSubQ: true, section: 'Identification',
    text: 'What is the ID number?',
    type: 'voice',
    next: (ans, allAnswers) =>
      allAnswers.idType === 'Elector Registration ID' ? 'idCountryOfIssue' : 'idIssueYear',
  },
  idIssueYear: {
    id: 'idIssueYear', base: 18, isSubQ: true, section: 'Identification',
    text: 'What year was this ID issued?',
    type: 'voice',
    toSpeech: (v) => yearToSpeech(v),
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1900 || n > 2026) return 'Please enter a year between 1900 and 2026.'
      return null
    },
    next: (ans, allAnswers) =>
      allAnswers.idType === 'Elector Registration ID' ? 'idHasExpiry' : 'idIssueMonth',
  },
  idIssueMonth: {
    id: 'idIssueMonth', base: 18, isSubQ: true, section: 'Identification',
    text: 'What month was it issued?',
    type: 'choice',
    options: MONTHS,
    next: () => 'idIssueDay',
  },
  idIssueDay: {
    id: 'idIssueDay', base: 18, isSubQ: true, section: 'Identification',
    text: 'What day of the month was it issued?',
    type: 'voice',
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
      return null
    },
    next: () => 'idHasExpiry',
  },
  idHasExpiry: {
    id: 'idHasExpiry', base: 18, isSubQ: true, section: 'Identification',
    text: 'Does this ID have an expiry date?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'idExpiryYear' : 'idCountryOfIssue',
  },
  idExpiryYear: {
    id: 'idExpiryYear', base: 18, isSubQ: true, section: 'Identification',
    text: 'What year does this ID expire?',
    type: 'voice',
    toSpeech: (v) => yearToSpeech(v),
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1900 || n > 2026) return 'Please enter a year between 1900 and 2026.'
      return null
    },
    next: (ans, allAnswers) =>
      allAnswers.idType === 'Elector Registration ID' ? 'idCountryOfIssue' : 'idExpiryMonth',
  },
  idExpiryMonth: {
    id: 'idExpiryMonth', base: 18, isSubQ: true, section: 'Identification',
    text: 'What month does it expire?',
    type: 'choice',
    options: MONTHS,
    next: () => 'idExpiryDay',
  },
  idExpiryDay: {
    id: 'idExpiryDay', base: 18, isSubQ: true, section: 'Identification',
    text: 'What day of the month does it expire?',
    type: 'voice',
    validate: (v) => {
      const n = parseInt(v, 10)
      if (isNaN(n) || n < 1 || n > 31) return 'Please enter a day between 1 and 31.'
      return null
    },
    next: () => 'idCountryOfIssue',
  },
  idCountryOfIssue: {
    id: 'idCountryOfIssue', base: 18, isSubQ: true, section: 'Identification',
    text: 'What country issued this ID?',
    type: 'voice',
    defaultValue: 'Jamaica',
    next: () => 'hasBusiness',
  },

  // ── Screen 19 — Business ──────────────────────────────────────────────────
  hasBusiness: {
    id: 'hasBusiness', base: 19, section: 'Business or Trade',
    text: 'Do you run a business, trade, or profession in Jamaica?',
    hint: 'For example — do you sell goods, offer a service, or work for yourself?',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'businessName' : 'taxOffice',
  },
  businessName: {
    id: 'businessName', base: 19, isSubQ: true, section: 'Business or Trade',
    text: 'What is the name of your business or employer?',
    type: 'voice',
    next: () => 'businessAddress',
  },
  businessAddress: {
    id: 'businessAddress', base: 19, isSubQ: true, section: 'Business or Trade',
    text: 'What is the address of your business?',
    type: 'voice',
    next: () => 'taxOffice',
  },

  // ── Screen 20 — Tax office ────────────────────────────────────────────────
  taxOffice: {
    id: 'taxOffice', base: 20, section: 'Tax Office',
    text: 'Which Tax Office would you like to collect your TRN card from?',
    hint: 'Choose the office closest to where you live or work.',
    type: 'choice',
    options: [
      'Kingston — Constant Spring',
      'Kingston — Half Way Tree',
      'Kingston — May Pen Road',
      'St. Andrew — Cross Roads',
      'St. Andrew — Portmore',
      'St. Thomas — Morant Bay',
      'Portland — Port Antonio',
      'St. Mary — Annotto Bay',
      "St. Ann — St. Ann's Bay",
      'Trelawny — Falmouth',
      'St. James — Montego Bay',
      'Hanover — Lucea',
      'Westmoreland — Savanna-la-Mar',
      'St. Elizabeth — Black River',
      'St. Elizabeth — Santa Cruz',
      'Manchester — Mandeville',
      'Clarendon — May Pen',
      'St. Catherine — Spanish Town',
      'St. Catherine — Old Harbour',
    ],
    next: () => 'fillingForSomeoneElse',
  },

  // ── Screen 21 — Applying on behalf of someone ─────────────────────────────
  fillingForSomeoneElse: {
    id: 'fillingForSomeoneElse', base: 21, section: 'On Behalf Of',
    text: 'Are you filling this form out on behalf of someone else?',
    hint: 'For example — a child under 18, or someone who cannot sign for themselves.',
    type: 'yesno',
    next: (ans) => ans === 'Yes' ? 'agentRelationship' : null,
  },
  agentRelationship: {
    id: 'agentRelationship', base: 21, isSubQ: true, section: 'On Behalf Of',
    text: 'What is your relationship to this person?',
    hint: 'For example: Parent, Guardian, Authorized Representative.',
    type: 'voice',
    next: () => 'agentTRN',
  },
  agentTRN: {
    id: 'agentTRN', base: 21, isSubQ: true, section: 'On Behalf Of',
    text: 'What is your own TRN number?',
    hint: 'As the person filling this form, we need your TRN number.',
    type: 'voice',
    next: () => 'agentFullName',
  },
  agentFullName: {
    id: 'agentFullName', base: 21, isSubQ: true, section: 'On Behalf Of',
    text: 'What is your full name?',
    type: 'voice',
    next: () => null,
  },
}
