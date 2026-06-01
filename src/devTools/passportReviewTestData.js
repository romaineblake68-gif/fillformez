import { SKIP } from '../data/passportFlow'

const aAnswers = {
  surname:            'Campbell',
  firstName:          'Simone',
  hasMiddleName:      'Yes',
  middleName:         'Renee',
  maidenSurname:      'Brown',
  hasNameChanged:     'No',
  occupation:         'Teacher',
  maritalStatus:      'Married',
  placeOfBirth:       'Kingston',
  birthDay:           '12',
  birthMonth:         'March',
  birthYear:          '1989',
  sex:                'Female',
  motherFirstName:    'Patricia',
  motherMaidenName:   'Reid',
  streetAddress:      '14 Constant Spring Road',
  postOffice:         'Kingston 8 P.O.',
  townParish:         'Kingston',
  country:            'Jamaica',
  mailingAddressSame: 'Yes',
  phoneAreaCode:      '876',
  phoneNumber:        '5551234',
  hasEmail:           'Yes',
  emailAddress:       'simone.campbell@gmail.com',
}

const bAnswers = {
  marriageDay:    '15',
  marriageMonth:  'June',
  marriageYear:   '2014',
  marriagePlace:  'Kingston',
  marriageParish: 'Kingston',
  marriageCountry: 'Jamaica',
  spouseFirstName: 'Michael',
  spouseSurname:   'Campbell',
}

// Section C is for minors — left empty for this test scenario
const cAnswers = {}

const dAnswers = {
  dPassportStatus: 'renewing',
  dPassportNumber: 'A1234567',
  dIssueDay:       '10',
  dIssueMonth:     'January',
  dIssueYear:      '2015',
  dIssuePlace:     'Kingston',
}

const ePassportNumber = 'A1234567'

const f1Answers = {
  f1Surname:       'Reid',
  f1FirstName:     'Patricia',
  f1HasMiddleName: 'No',
  f1Address:       '22 Maxfield Avenue',
  f1Parish:        'Kingston',
  f1PostOffice:    'Kingston 13 P.O.',
  f1Country:       'Jamaica',
  f1Relationship:  'Mother',
  f1AreaCode:      '876',
  f1PhoneNumber:   '5559876',
}

const f2Answers = {
  f2Surname:       'Brown',
  f2FirstName:     'Robert',
  f2HasMiddleName: 'No',
  f2Address:       '5 Half-Way Tree Road',
  f2Parish:        'St. Andrew',
  f2PostOffice:    SKIP,
  f2Country:       'Jamaica',
  f2Relationship:  'Brother',
  f2AreaCode:      '876',
  f2PhoneNumber:   '5554567',
}

const DEV_PASSPORT_TEST_DATA = {
  aAnswers,
  bAnswers,
  cAnswers,
  dAnswers,
  ePassportNumber,
  f1Answers,
  f2Answers,
}

export default DEV_PASSPORT_TEST_DATA
