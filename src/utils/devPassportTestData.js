// ── DEV-ONLY — Passport PDF quick-test helper ─────────────────────────────────
// Called via a dynamic import() inside a import.meta.env.DEV guard in WalletScreen.
// This file is never executed in production builds.
// To remove: delete this file and the DevPassportPanel block in WalletScreen.jsx.

import { generatePassportPDF } from './pdfGenerator'

// ── Address mapping test guide ─────────────────────────────────────────────────
// Section A applicant:
//   streetAddress → combined into PDF "street number and name" field
//   postOffice    → also combined into PDF "street number and name" field
//   townParish    → PDF "town, city or parish" field (parish only)
//
// Section F emergency contacts (f1 / f2):
//   f1Address     → combined into PDF emergency contact address row 1 (Address1)
//   f1PostOffice  → also combined into PDF emergency contact address row 1
//   f1Parish      → PDF emergency contact town field (parish only)
//
// PDF field naming for emergency contacts uses 1-indexed suffixes:
//   Address1 = row 1 of street, Address2 = row 2 of street (overflow)
//   Town1    = row 1 of parish, Town2    = row 2 of parish
//
// Expected PDF output (ALL CAPS):
//   Applicant street row 1: "47 DUNROBIN AVENUE, P" (first 17 chars)
//   Applicant street row 2: ".O. BOX 123"          (overflow)
//   Applicant town:         "ST. ANDREW"
//   Contact 1 street row 1: "88 CONSTANT SPRING RO" (first 17 chars of long address)
//   Contact 1 street row 2: "AD, P.O. BOX 78"      (overflow)
//   Contact 1 town:         "ST. ANN"
//   Contact 2 street row 1: "7 RED HILLS ROAD"      (no P.O. Box — street only)
//   Contact 2 street row 2: (empty — no overflow)
//   Contact 2 town:         "ST. CATHERINE"
//   Email:                  "alicetest@example.com" (stays lowercase — excluded from caps)

// ── First-time applicant ──────────────────────────────────────────────────────
const FIRST_TIME = {
  aAnswers: {
    surname:           'Campbell',
    firstName:         'Alice',
    middleName:        'Rose',
    occupation:        'Registered Nurse',
    sex:               'Female',
    maritalStatus:     'Single',
    placeOfBirth:      'Kingston',
    birthDay:          '15',
    birthMonth:        'March',
    birthYear:         '1990',
    streetAddress:     '47 Dunrobin Avenue',   // → combined into street field
    postOffice:        'P.O. Box 123',          // → also combined into street field
    townParish:        'St. Andrew',            // → town/parish field only
    country:           'Jamaica',
    phoneAreaCode:     '876',
    phoneNumber:       '555-0101',
    emailAddress:      'alicetest@example.com', // → stays lowercase (NO_UPPERCASE)
    motherFirstName:   'Gloria',
    motherMaidenName:  'Brown',
    mailingAddressSame:'Yes',
  },
  bAnswers:   {},
  cAnswers:   {},
  dAnswers:   {},
  ePassportNumber: '',
  isFirstTime:     true,
  passportStatus:  'first-time',
  f1Answers: {
    f1Surname:      'Williams',
    f1FirstName:    'Marcus',
    f1MiddleName:   'Anthony',
    f1Address:      '88 Constant Spring Road', // → long address, forces row overflow
    f1PostOffice:   'P.O. Box 78',             // → combined: "88 CONSTANT SPRING ROAD, P.O. BOX 78"
    f1Parish:       'St. Ann',                 // → contact 1 town field only
    f1Country:      'Jamaica',
    f1Relationship: 'Brother',
    f1AreaCode:     '876',
    f1PhoneNumber:  '555-0201',
  },
  f2Answers: {
    f2Surname:      'Brown',
    f2FirstName:    'Gloria',
    f2Address:      '7 Red Hills Road',  // → short address, fits in row 1 only
    // f2PostOffice intentionally omitted — tests street-only path
    f2Parish:       'St. Catherine',    // → contact 2 town field only
    f2Country:      'Jamaica',
    f2Relationship: 'Mother',
    f2AreaCode:     '876',
    f2PhoneNumber:  '555-0202',
  },
}

// ── Renewal applicant — Section B marriage + Section D previous passport ──────
const RENEWAL = {
  aAnswers: {
    surname:           'Campbell',
    firstName:         'Alice',
    middleName:        'Rose',
    occupation:        'Registered Nurse',
    sex:               'Female',
    maritalStatus:     'Married',
    placeOfBirth:      'Kingston',
    birthDay:          '15',
    birthMonth:        'March',
    birthYear:         '1990',
    streetAddress:     '47 Dunrobin Avenue',
    postOffice:        'P.O. Box 123',
    townParish:        'St. Andrew',
    country:           'Jamaica',
    phoneAreaCode:     '876',
    phoneNumber:       '555-0101',
    emailAddress:      'alicetest@example.com',
    motherFirstName:   'Gloria',
    motherMaidenName:  'Brown',
    mailingAddressSame:'Yes',
  },
  bAnswers: {
    marriageDay:    '3',
    marriageMonth:  'July',
    marriageYear:   '2015',
    marriagePlace:  'Kingston',
    marriageParish: 'St. Andrew',
    marriageCountry:'Jamaica',
    spouseFirstName:'David',
    spouseSurname:  'Campbell',
  },
  cAnswers: {},
  dAnswers: {
    dPassportNumber: 'PK123456',
    dIssueDay:       '10',
    dIssueMonth:     'June',
    dIssueYear:      '2014',
    dIssuePlace:     'Kingston',
    dPassportStatus: 'renewing',
  },
  ePassportNumber: 'PK123456',
  isFirstTime:     false,
  passportStatus:  'renewing',
  f1Answers: {
    f1Surname:      'Williams',
    f1FirstName:    'Marcus',
    f1MiddleName:   'Anthony',
    f1Address:      '88 Constant Spring Road',
    f1PostOffice:   'P.O. Box 78',
    f1Parish:       'St. Ann',
    f1Country:      'Jamaica',
    f1Relationship: 'Brother',
    f1AreaCode:     '876',
    f1PhoneNumber:  '555-0201',
  },
  f2Answers: {
    f2Surname:      'Brown',
    f2FirstName:    'Gloria',
    f2Address:      '7 Red Hills Road',
    // f2PostOffice intentionally omitted — tests street-only path
    f2Parish:       'St. Catherine',
    f2Country:      'Jamaica',
    f2Relationship: 'Mother',
    f2AreaCode:     '876',
    f2PhoneNumber:  '555-0202',
  },
}

export async function runDevPassportTest(variant) {
  const answers = variant === 'renewal' ? RENEWAL : FIRST_TIME
  const url = await generatePassportPDF(answers)
  window.open(url, '_blank')
}
