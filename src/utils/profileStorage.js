const PROFILE_KEY = 'fillformeez_profile_v1'

const EMPTY_PROFILE = {
  firstName: '',
  middleName: '',
  surname: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  sex: '',
  cellPhone: '',
  email: '',
  trn: '',
  nis: '',
  passportNumber: '',
  homeParish: '',
  homeDistrict: '',
  homeStreet: '',
  occupation: '',
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { ...EMPTY_PROFILE }
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) }
  } catch {
    return { ...EMPTY_PROFILE }
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {}
}

export function profileHasData(profile) {
  return !!(profile.firstName || profile.surname || profile.birthYear)
}

// Conservative autofill maps: profile key → form answer key.
// Only top-level (unconditional) questions are mapped.
// Conditional sub-questions (middleName, homeStreet, etc.) are intentionally excluded
// so the flow logic stays correct — the user must answer the parent yes/no first.

const PASSPORT_AUTOFILL_MAP = {
  firstName:  'firstName',
  surname:    'surname',
  birthDay:   'birthDay',
  birthMonth: 'birthMonth',
  birthYear:  'birthYear',
  sex:        'sex',
  occupation: 'occupation',
}

const TRN_AUTOFILL_MAP = {
  firstName:  'firstName',
  surname:    'lastName',
  birthDay:   'birthDay',
  birthMonth: 'birthMonth',
  birthYear:  'birthYear',
  sex:        'sex',
  cellPhone:  'cellPhone',
  occupation: 'occupation',
}

const NIS_AUTOFILL_MAP = {
  firstName:  'firstName',
  surname:    'lastName',
  birthDay:   'birthDay',
  birthMonth: 'birthMonth',
  birthYear:  'birthYear',
  sex:        'sex',
  occupation: 'occupation',
  cellPhone:  'cellPhone',
}

// Returns a partial answers object pre-populated from the profile.
// Only non-empty profile values are included.
export function applyAutofill(profile, formType) {
  const map =
    formType === 'passport' ? PASSPORT_AUTOFILL_MAP :
    formType === 'trn'      ? TRN_AUTOFILL_MAP :
                              NIS_AUTOFILL_MAP

  const result = {}
  for (const [profileKey, formKey] of Object.entries(map)) {
    const val = profile[profileKey]
    if (val) result[formKey] = val
  }
  return result
}
