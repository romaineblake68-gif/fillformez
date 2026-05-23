// ── Speech formatting helpers ──────────────────────────────────────────────────
//
// These convert raw answer values into natural spoken phrases before TTS reads
// them back in the "You said: ___ Is this correct?" step.
// Attach to a question as:  toSpeech: (v) => yearToSpeech(v)
//

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen',
]

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty',
  'sixty', 'seventy', 'eighty', 'ninety',
]

function twoDigit(n) {
  if (n === 0) return ''
  if (n < 20) return ONES[n]
  const t = Math.floor(n / 10)
  const u = n % 10
  return u === 0 ? TENS[t] : `${TENS[t]} ${ONES[u]}`
}

// Converts a 4-digit year string to a natural spoken phrase.
//   yearToSpeech('1982') → 'nineteen eighty two'
//   yearToSpeech('2000') → 'two thousand'
//   yearToSpeech('2005') → 'two thousand and five'
//   yearToSpeech('2024') → 'twenty twenty four'
export function yearToSpeech(yearStr) {
  const year = parseInt(yearStr, 10)
  if (isNaN(year)) return String(yearStr)

  if (year >= 1900 && year <= 1999) {
    const lo = year - 1900
    if (lo === 0) return 'nineteen hundred'
    return `nineteen ${twoDigit(lo)}`
  }
  if (year === 2000) return 'two thousand'
  if (year >= 2001 && year <= 2009) return `two thousand and ${ONES[year - 2000]}`
  if (year >= 2010 && year <= 2099) {
    const lo = year - 2000
    return `twenty ${twoDigit(lo)}`
  }
  return String(yearStr)
}

// Converts a phone/number string to digit-by-digit speech.
//   phoneToSpeech('876-555-1234') → 'eight seven six five five five one two three four'
//   phoneToSpeech('4462354')      → 'four four six two three five four'
export function phoneToSpeech(phoneStr) {
  const digits = String(phoneStr).replace(/\D/g, '')
  if (!digits) return String(phoneStr)
  return digits.split('').map(d => ONES[parseInt(d, 10)] ?? d).join(' ')
}

// Converts a passport number to character-by-character speech.
//   passportNumberToSpeech('A5646566') → 'A five six four six five six six'
// Letters are spoken by their letter name. Digits become digit words.
// Hyphens and non-alphanumeric characters are silently stripped.
export function passportNumberToSpeech(str) {
  return String(str)
    .toUpperCase()
    .split('')
    .filter(c => /[A-Z0-9]/.test(c))
    .map(c => /\d/.test(c) ? ONES[parseInt(c, 10)] : c)
    .join(' ')
}
