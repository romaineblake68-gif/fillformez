import {
  NAME_ALIASES,
  JAMAICAN_FIRST_NAMES,
  JAMAICAN_SURNAMES,
  COMMUNITY_ALIASES,
  PATOIS_SUBSTITUTIONS,
} from '../data/jamaicanNames'
import { PARISHES } from '../data/jamaicanLocations'

const ALL_NAMES = [...JAMAICAN_FIRST_NAMES, ...JAMAICAN_SURNAMES]

// Returns true for personal name fields: firstName, lastName, middleName,
// motherFirstName, fatherSurname, applicantSurname, etc.
// Does NOT match placeOfBirth, homeStreet, or any address field.
function isNameField(question) {
  if (!question || !question.id) return false
  return /name|surname/i.test(question.id)
}

// Returns true for parish fields: birthParish, homeParish, mailingParish, etc.
function isParishField(question) {
  if (!question || !question.id) return false
  return /parish/i.test(question.id)
}

// Returns true for community/district/town fields: homeDistrict, mailingDistrict,
// homeTown, community, placeOfBirth, etc.
// These use exact COMMUNITY_ALIASES only — no fuzzy — to prevent spurious corrections
// across the large, diverse set of Jamaican community names.
function isCommunityField(question) {
  if (!question || !question.id) return false
  return /district|town|community/i.test(question.id)
}

// Returns true for day-of-month questions across all three forms:
//   Passport: birthDay, marriageDay, dIssueDay, dLossDay
//   TRN:      birthDay, idIssueDay, idExpiryDay
//   NIS:      birthDay, marriageDay, spouseBirthDay
// Does NOT match birthYear, birthMonth, cellPhone, or any name/address field.
function isNumberField(question) {
  if (!question || !question.id) return false
  return /[Dd]ay$/.test(question.id)
}

// Spoken number words and ordinals → digit string. Covers 0–31 (full day-of-month range).
// Cardinals: "eight"/"it"/"ate" → "8", "tree" → "3", "for" → "4", "to/too" → "2".
// Ordinals:  "fifth" → "5", "twenty first" → "21", etc.
// To add a new mishear: add an entry with the spoken word as key, digit string as value.
const NUMBER_WORDS = {
  // Cardinals
  'zero': '0', 'oh': '0', 'o': '0',
  'one': '1', 'won': '1', 'wan': '1',
  'two': '2', 'to': '2', 'too': '2', 'tu': '2',
  'three': '3', 'tree': '3', 'free': '3',
  'four': '4', 'for': '4', 'fore': '4',
  'five': '5', 'fife': '5',
  'six': '6',
  'seven': '7',
  'eight': '8', 'ate': '8', 'it': '8', 'et': '8',
  'nine': '9', 'nein': '9',
  'ten': '10',
  'eleven': '11',
  'twelve': '12',
  'thirteen': '13',
  'fourteen': '14',
  'fifteen': '15',
  'sixteen': '16',
  'seventeen': '17',
  'eighteen': '18',
  'nineteen': '19',
  'twenty': '20',
  'twenty one': '21', 'twenty-one': '21',
  'twenty two': '22', 'twenty-two': '22',
  'twenty three': '23', 'twenty-three': '23',
  'twenty four': '24', 'twenty-four': '24',
  'twenty five': '25', 'twenty-five': '25',
  'twenty six': '26', 'twenty-six': '26',
  'twenty seven': '27', 'twenty-seven': '27',
  'twenty eight': '28', 'twenty-eight': '28',
  'twenty nine': '29', 'twenty-nine': '29',
  'thirty': '30',
  'thirty one': '31', 'thirty-one': '31',
  // Ordinals
  'first': '1',
  'second': '2',
  'third': '3',
  'fourth': '4',
  'fifth': '5',
  'sixth': '6',
  'seventh': '7',
  'eighth': '8',
  'ninth': '9',
  'tenth': '10',
  'eleventh': '11',
  'twelfth': '12',
  'thirteenth': '13',
  'fourteenth': '14',
  'fifteenth': '15',
  'sixteenth': '16',
  'seventeenth': '17',
  'eighteenth': '18',
  'nineteenth': '19',
  'twentieth': '20',
  'twenty first': '21', 'twenty-first': '21',
  'twenty second': '22', 'twenty-second': '22',
  'twenty third': '23', 'twenty-third': '23',
  'twenty fourth': '24', 'twenty-fourth': '24',
  'twenty fifth': '25', 'twenty-fifth': '25',
  'twenty sixth': '26', 'twenty-sixth': '26',
  'twenty seventh': '27', 'twenty-seventh': '27',
  'twenty eighth': '28', 'twenty-eighth': '28',
  'twenty ninth': '29', 'twenty-ninth': '29',
  'thirtieth': '30',
  'thirty first': '31', 'thirty-first': '31',
}

// Converts spoken day text to a digit string.
// Handles:
//   - Plain digits:          "8" → "8"
//   - Numeric ordinals:      "5th" / "21st" → "5" / "21"
//   - Cardinal words:        "eight" / "it" → "8"
//   - Ordinal words:         "fifth" / "twenty first" → "5" / "21"
//   - Phrases with noise:    "the fifth" / "fifth of August" / "on the 5th" → "5"
// Unknown input passes through unchanged; validate() will catch it.
function normalizeNumberTranscript(text) {
  const trimmed = text.trim()

  // Already plain digits — pass through
  if (/^\d+$/.test(trimmed)) return trimmed

  // Numeric ordinal: "5th", "21st", "3rd", "2nd" — strip suffix
  const numOrdinal = trimmed.match(/^(\d{1,2})(st|nd|rd|th)$/i)
  if (numOrdinal) return numOrdinal[1]

  // Normalise to lowercase then strip leading noise ("the", "on the", "on")
  // and trailing context ("of August", "of March", etc.)
  let lower = trimmed.toLowerCase()
    .replace(/^(on\s+the\s+|on\s+|the\s+)/, '')
    .replace(/\s+of\s+\w+$/, '')
    .trim()

  if (Object.prototype.hasOwnProperty.call(NUMBER_WORDS, lower)) {
    return NUMBER_WORDS[lower]
  }

  // Numeric ordinal may appear after noise stripping ("the 5th of July" → "5th")
  const numOrdinal2 = lower.match(/^(\d{1,2})(st|nd|rd|th)$/)
  if (numOrdinal2) return numOrdinal2[1]

  return trimmed
}

// Standard Levenshtein distance.
function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const d = []
  for (let i = 0; i <= m; i++) d[i] = [i]
  for (let j = 0; j <= n; j++) d[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = a[i - 1] === b[j - 1]
        ? d[i - 1][j - 1]
        : 1 + Math.min(d[i - 1][j - 1], d[i - 1][j], d[i][j - 1])
    }
  }
  return d[m][n]
}

// Generic fuzzy matcher. Returns the best match from list above threshold, or null.
function fuzzyMatchFromList(text, list, threshold) {
  if (text.length < 2) return null
  const lower = text.toLowerCase()
  let best = null
  let bestScore = 0
  for (const item of list) {
    const dist = levenshtein(lower, item.toLowerCase())
    const score = 1 - dist / Math.max(lower.length, item.length)
    if (score > bestScore && score >= threshold) {
      bestScore = score
      best = item
    }
  }
  return best
}

// Name threshold: ≥85% to avoid false corrections.
// At this level "romain" → "Romaine" (0.857) passes,
// but "williamson" → "williams" (0.800) does not.
const NAME_THRESHOLD = 0.85

// Parish threshold: slightly lower (0.80) because parish names are a small
// known list with few alternatives, so false positives are unlikely.
const PARISH_THRESHOLD = 0.80

// Spoken → canonical parish corrections.
// Handles "saint X" → "St. X" and common misspellings.
// The fuzzy matcher handles everything else (kingston, portland, clarendon…).
const PARISH_ALIASES = {
  'saint andrew':    'St. Andrew',
  'st andrew':       'St. Andrew',
  'saint james':     'St. James',
  'st james':        'St. James',
  'saint ann':       'St. Ann',
  'st ann':          'St. Ann',
  'saint thomas':    'St. Thomas',
  'st thomas':       'St. Thomas',
  'saint mary':      'St. Mary',
  'st mary':         'St. Mary',
  'saint elizabeth': 'St. Elizabeth',
  'st elizabeth':    'St. Elizabeth',
  'saint catherine': 'St. Catherine',
  'st catherine':    'St. Catherine',
  'westmorland':     'Westmoreland',
}

// Applies PATOIS_SUBSTITUTIONS word-by-word on multi-word text.
// Only used for general voice fields (not name/parish/community).
// Skips single-word answers entirely to avoid false corrections.
// Safe to expand — only corrects exact lowercase matches in the substitution map.
function applyPatoisSubstitutions(text) {
  const words = text.trim().split(/\s+/)
  if (words.length < 2) return text
  return words.map(word => PATOIS_SUBSTITUTIONS[word.toLowerCase()] ?? word).join(' ')
}

// ── Public API ────────────────────────────────────────────────────────────────
//
// normalizeTranscript(rawText, question)
//
// Called ONLY on mic input, before goToConfirming in QuestionScreen.
// Returns corrected text if a correction is found, otherwise rawText unchanged.
// Never throws — any error falls back to rawText.
//
// Processing order:
//
//   NUMBER / DAY fields (question.id ends with "Day"):
//     1. Plain digits pass through unchanged ("8" → "8")
//     2. Numeric ordinals stripped ("5th"/"21st" → "5"/"21")
//     3. Leading noise stripped ("the fifth" / "on the 5th" → "fifth" / "5th")
//     4. Trailing context stripped ("fifth of August" → "fifth")
//     5. Cardinal + ordinal word lookup ("eight"/"it"/"fifth" → "8"/"8"/"5")
//     Unknown input passes through to validate().
//     Applied FIRST so number words are never fuzzy-matched as names.
//
//   PARISH fields (question.id contains "parish"):
//     1. Exact alias match via PARISH_ALIASES ("saint andrew" → "St. Andrew")
//     2. Fuzzy match against PARISHES list (≥80% similarity)
//
//   COMMUNITY fields (question.id contains "district", "town", or "community"):
//     1. Exact alias match via COMMUNITY_ALIASES ("mo bay" → "Montego Bay")
//     No fuzzy — community names are too diverse for safe fuzzy matching.
//
//   NAME fields (question.id contains "name" or "surname"):
//     1. Exact alias match on full phrase via NAME_ALIASES ("you mean" → "Romaine")
//     2. Word-by-word fuzzy match against Jamaican first names + surnames (≥85%)
//
//   ALL OTHER fields:
//     1. PATOIS_SUBSTITUTIONS applied word-by-word (multi-word only)
//
// titleCase is intentionally NOT applied here — QuestionScreen's goToConfirming
// already handles it via question.transform.
//
// To add a new correction:
//   - Common mishear of a name/surname → add to NAME_ALIASES in jamaicanNames.js
//   - New name the fuzzy misses → add to JAMAICAN_FIRST_NAMES or JAMAICAN_SURNAMES
//   - Community shorthand → add to COMMUNITY_ALIASES in jamaicanNames.js
//   - Patois word → add to PATOIS_SUBSTITUTIONS (keep list short and safe)
//   - Parish spelling variant → add to PARISH_ALIASES below
//
export function normalizeTranscript(rawText, question) {
  try {
    if (!rawText || !rawText.trim()) return rawText

    const trimmed = rawText.trim()
    const lower = trimmed.toLowerCase()

    // ── Number / day-of-month field ────────────────────────────────────────────
    // Must run first so "it"/"tree"/"for" etc. are resolved to digits before any
    // name or community logic could incorrectly match them.
    if (isNumberField(question)) {
      return normalizeNumberTranscript(trimmed)
    }

    // ── Parish field ───────────────────────────────────────────────────────────
    if (isParishField(question)) {
      if (PARISH_ALIASES[lower]) return PARISH_ALIASES[lower]
      return fuzzyMatchFromList(trimmed, PARISHES, PARISH_THRESHOLD) ?? trimmed
    }

    // ── Community / district field ─────────────────────────────────────────────
    if (isCommunityField(question)) {
      // Exact alias only — "mo bay" → "Montego Bay", "ochi" → "Ocho Rios", etc.
      return COMMUNITY_ALIASES[lower] ?? trimmed
    }

    // ── Name field ─────────────────────────────────────────────────────────────
    if (isNameField(question)) {
      // Step 1 — exact alias match on full phrase ("you mean" → "Romaine")
      if (NAME_ALIASES[lower]) return NAME_ALIASES[lower]

      // Step 2 — fuzzy match each word individually
      const words = trimmed.split(/\s+/)
      const corrected = words.map(word =>
        fuzzyMatchFromList(word, ALL_NAMES, NAME_THRESHOLD) ?? word
      )
      return corrected.join(' ')
    }

    // ── General voice field ────────────────────────────────────────────────────
    // Conservative patois pass — only fires on multi-word responses.
    return applyPatoisSubstitutions(trimmed)
  } catch {
    return rawText
  }
}
