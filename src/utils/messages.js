// Central source for all user-facing conversational messages in FillFormEZ.
// Friendly Jamaican English — simple, calm, respectful, easy to understand.
// Import from here; do not hardcode these strings in individual screens.

// ── Question screen ────────────────────────────────────────────────────────────

/** Shown below the mic button while waiting for voice input. */
export const MIC_PROMPT = "Tap the mic and say your answer. Take your time."

/** Skip button label on optional questions. */
export const SKIP_LABEL = "If you don't know this, skip it for now."

/** Tip shown below the text input fallback. */
export const TYPING_TIP = "Use this if the mic is not picking you up."

/** Progress label when the user is near the end of a section. */
export const NEARLY_DONE_MSG = "Almost there — keep going!"

/** Percentage (inclusive) at which NEARLY_DONE_MSG replaces "X% complete". */
export const NEARLY_DONE_PCT = 75

// ── PDF generation (FinalCompleteScreen and TRN / NIS equivalents) ────────────

/** Primary CTA button label before PDF generation starts. */
export const GENERATE_BUTTON_LABEL = "Prepare My Form Now"

/** Button / spinner text while the PDF is being generated. */
export const GENERATING_LABEL = "Preparing your form, please wait…"

// ── Form-ready screens ─────────────────────────────────────────────────────────

/** Headline shown on all form-ready screens. */
export const FORM_READY_HEADLINE = "Your form is ready!"

/** Subtitle shown below the headline on all form-ready screens. */
export const FORM_READY_NOTE = "Please review it carefully before you print."
