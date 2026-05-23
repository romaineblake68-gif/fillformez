# FillFormEZ — Build Progress

A voice-guided Jamaican passport application assistant for people with low literacy.
Built with React 18 + Vite, Tailwind CSS v3, Web Speech API.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite (not CRA — CRA rejected capital letters in project name) |
| Styling | Tailwind CSS v3 + PostCSS + Autoprefixer |
| Voice output | `window.speechSynthesis` — rate 0.97, lang en-US |
| Voice input | `SpeechRecognition` / `webkitSpeechRecognition` |
| State | useState in App.jsx (no external store needed yet) |
| Routing | switch on `screen` state string constant |

Brand color: `#1a6fe8` (blue). Max-width phone frame (430px). Mobile-first.

---

## File Inventory

### `src/App.jsx`
Central state machine. All screen routing lives here. No router library.

Screen constants defined in `S` object:
```
HOME, WELCOME, FIRST_OR_RENEWAL, RENEWAL_AGE, RENEWAL_NAME,
FORM_TYPE_EXPLAIN, SECTION_A, SECTION_A_COMPLETE,
SECTION_B_INTRO, SECTION_B, SECTION_B_COMPLETE,
SECTION_C_ROUTING, PAGE2_SIG_NOTICE, SECTION_C_INTRO,
SECTION_C, SECTION_C_SIG_NOTICE, SECTION_C_COMPLETE,
SECTION_D_INTRO, SECTION_D_STATUS, SECTION_D,
LOST_STOLEN_NOTICE, SECTION_D_COMPLETE, COMING_SOON
```

State tracked:
- `isFirstTime` (boolean|null) — set during passport routing, used to skip Section D
- `formType` / `formTypeReason` / `formTypeBackScreen` — form type routing
- Section A: `currentAQId`, `aHistory`, `aAnswers`, `aReturnScreen`
- Section B: `currentBQId`, `bHistory`, `bAnswers`
- Section C: `currentCQId`, `cHistory`, `cAnswers`
- Section D: `currentDQId`, `dHistory`, `dAnswers`, `passportStatus`
- `sectionDBack`, `comingSoonBack` — dynamic back destinations

Key helper functions:
- `goFormTypeExplain(type, reason, backScreen, firstTime)` — sets form type state and navigates
- `afterSectionC(backFrom)` — checks `isFirstTime`; if true → COMING_SOON, else → SECTION_D_INTRO
- `startSectionD(status)` — initialises Section D state and navigates
- `handleDAnswer` — intercepts `nextId === null` from common questions and branches by `passportStatus`

---

### `src/hooks/useSpeech.js`
Custom hook wrapping both Web Speech APIs.

Exports:
- `speak(text)` — SpeechSynthesis, rate 0.97, lang en-US
- `stopSpeaking()` — cancels current utterance
- `startListening(onResult, onError)` — SpeechRecognition, callbacks stored in ref to avoid stale closures
- `stopListening()`
- `isListening` (boolean state)
- `isSpeechRecognitionSupported` (boolean)

---

### `src/data/passportFlow.js`
All question maps. Each question entry:
```js
{
  id, section, base, isSubQ?, text, hint, type,
  options?,   // for 'choice' type
  canSkip?,   // shows Skip button; routes via SKIP sentinel
  defaultValue?, // pre-fills confirming phase (e.g. country = "Jamaica")
  next(answer, allAnswers) => nextId | null
}
```
Types: `'voice'` | `'yesno'` | `'choice'`

**Exports:**
- `SKIP = '__SKIP__'` — sentinel value for skipped optional questions
- `SECTION_A_START`, `SECTION_A_BASE_COUNT = 18`, `SECTION_A_QUESTIONS` (26 entries)
- `SECTION_B_START`, `SECTION_B_BASE_COUNT = 4`, `SECTION_B_QUESTIONS` (6 entries)
- `SECTION_C_START`, `SECTION_C_BASE_COUNT = 5`, `SECTION_C_QUESTIONS` (6 entries)
- `SECTION_D_START`, `SECTION_D_QUESTIONS` (11 entries, baseCount passed dynamically)

---

### `src/screens/` — All Screen Files

#### Home screen components (in `src/components/`)
- **`TopNavBar.jsx`** — Logo bar: "FillForm" + blue "EZ" badge
- **`HeroSection.jsx`** — Blue hero, tagline, voice hint text, "Get Started" button
- **`WelcomeBackCard.jsx`** — "Resume where you left off" card (placeholder)
- **`FormPicker.jsx`** — 3 form type cards (placeholder)
- **`BottomNavBar.jsx`** — Home / Forms / Help nav bar

#### Passport flow screens

**`WelcomeScreen.jsx`**
- Auto-speaks: *"Welcome to FillFormEasy! I am going to walk you through your passport application one step at a time. Just listen, speak your answer, and tap to confirm. Let us get started."*
- Pulsing speaker animation, "Play message again" button, "Let's Get Started →"

**`RoutingScreen.jsx`**
- Generic reusable routing screen
- Props: `question`, `note?`, `buttons: [{label, value}]`, `layout: 'stack'|'grid'`, `onSelect(value)`, `onBack`
- Auto-speaks question on mount; speaker replay in header
- `layout='grid'` → 2-column grid (used for 4-option screens)

**`InfoScreen.jsx`**
- Generic info/message screen
- Props: `message`, `subtext`, `buttonLabel`, `onContinue`, `onBack`
- Auto-speaks message + subtext on mount

**`NoticeScreen.jsx`**
- Reusable important-notice screen with amber warning icon
- Props: `speechText`, `title`, `lines: string[]`, `buttonLabel`, `onContinue`, `onBack?`
- Auto-speaks speechText on mount; speaker replay button
- If `onBack` not provided, no back button shown

**`FormTypeScreen.jsx`**
- Two cards side-by-side: Regular Form (always active) and Simplified Form (greyed if not qualified)
- Each card has a speaker icon that reads `CARD_SPEECH[type]` aloud when tapped
- Auto-speaks routing-reason-specific message from `AUTO_SPEECH` map on mount
- Reasons: `'first-time'`, `'was-minor'`, `'name-changed'`, `'qualifies-simplified'`
- Selected form defaults to 'simplified' if qualifies, else 'regular'
- "Continue with [Simplified/Regular] Form →" button

**`QuestionScreen.jsx`**
- Core question-answering screen — reused for ALL sections (A, B, C, D)
- Props: `questionId`, `questions` (default: SECTION_A_QUESTIONS), `baseCount` (default: 18), `onAnswer`, `onBack`
- Phase state machine: `'question'` → `'recording'` → `'confirming'`
- `goToConfirming(text, shouldSpeak)` — transitions to confirming; if shouldSpeak=true, reads *"You said: [answer]. Is this correct?"*
- `defaultValue` questions start in confirming with a different spoken message
- Sub-components:
  - `TextFallback` — always-visible text input + send button below mic; resets on question change via `key={question.id}`
  - `HintSheet` — bottom-sheet modal for "What does this mean?" — speaks hint text, "Got it" to close
  - `YesNoButtons` — large Yes/No tap buttons
  - `ChoiceGrid` — responsive grid for multi-option choices (2-col for ≤4 options, 3-col for more)
  - `ConfirmCard` — shows answer in large text; "No, redo" + "Yes!" buttons
- Progress bar: `question.base / baseCount * 100%`; sub-questions share parent's base number
- Mic button: pulsing ring animation while recording; stop button while listening
- Skip button shown if `question.canSkip === true`; routes via `SKIP` sentinel

---

## Passport Application Flow

```
Home
  └─ Welcome screen
       └─ "Have you had a Jamaican passport before?"
            ├─ No (first time) ──────────────────────────────────────────────┐
            └─ Yes                                                           │
                 └─ "Were you 18+ when last passport was issued?"            │
                       ├─ No (was minor) ──────────────────────────────────┐ │
                       └─ Yes                                              │ │
                            └─ "Has name or marital status changed?"       │ │
                                  ├─ Yes (name changed) ─────────────────┐ │ │
                                  └─ No ──────────────────────────────┐  │ │ │
                                                                       │  │ │ │
         FormTypeScreen:                                               │  │ │ │
           Simplified (qualifies) ◄────────────────────────────────────┘  │ │ │
           Regular (first-time)   ◄──────────────────────────────────────┘─┘ │
           Regular (was-minor)    ◄────────────────────────────────────────── │
           Regular (name-changed) ◄──────────────────────────────────────────┘

Section A — Personal Information (18 base questions, 26 total with sub-Qs)
  Surname → First name → Middle name (Y/N + sub-Q) → Maiden surname (skip)
  → Name changed (Y/N + sub-Q) → Occupation → Marital status (choice)
  → Place of birth → Date of birth (day/month/year) → Sex
  → Mother's first name → Mother's maiden name
  → Street address → Town/parish → Country (default: Jamaica)
  → Mailing same? (Y/N → if No: mailing street/town/country/postal code)
  → Phone area code (skip) → Phone number (skip) → Email? (Y/N + sub-Q)

Section A Complete screen (voice: "You have completed the first section!")

  ├─ Marital status = Single ──────────────────────────────────────────────────┐
  └─ Married / Divorced / Widowed                                              │
       Section B Intro → Section B questions                                   │
         Marriage date (day/month/year) → Marriage place                       │
         → Spouse first name → Spouse surname                                  │
       Section B Complete screen (voice: "You have completed the second section!")
                                                                               │
Section C Routing: "Is this for someone under 18?" ◄───────────────────────────┘
  ├─ No → afterSectionC() → [see Section D routing below]
  └─ Yes
       ↓
       Notice: "Do not sign the page 2 box at home"
       ↓
       Section C Intro ("This is the consent section...")
       ↓
       Section C — Parental Consent (5 base questions)
         Guardian surname → Guardian first name → Middle name (Y/N + sub-Q)
         → Relationship (Mother / Father / Legal Guardian)
         → Child's full name
       ↓
       Notice: Signature rules for Section C (parent/guardian only, must match
               photo ID and Section E — read aloud in full)
       ↓
       Section C Complete (voice: "You have completed the third section!")
       ↓
       afterSectionC()

afterSectionC():
  isFirstTime = true  → COMING_SOON (Section E placeholder)
  isFirstTime = false → Section D Intro

Section D — Most Recent Passport
  Intro screen (voice: "This next section is about your most recent passport...")
  ↓
  "What is the current status of your passport?" (4 choices):
    Renewing / Lost / Stolen / Damaged or Destroyed
  ↓
  Common questions (all paths):
    Passport number (skip) → Issue date: day (skip→jumps to place) / month / year
    → Issue place (skip) → Previous surname → Previous first name
    → Previous middle name (Y/N + sub-Q)
  ↓
  Branch by status:
    Renewing  → Section D Complete
    Damaged   → Description question → Section D Complete
    Lost/Stolen → Notice: "Make a PICA report before submitting — do not come without it"
                → Where lost/stolen (skip) → Description question → Section D Complete

  Progress bar baseCount: 6 (renewing) / 7 (damaged) / 8 (lost or stolen)

Section D Complete (voice: "You have completed the fourth section!")
↓
COMING_SOON — "Section E is coming soon!"
```

---

## Section Complete Screens

| Section | Colour | Voice |
|---|---|---|
| A | Blue #1a6fe8 | "You have completed the first section! Great job. Take a breath — you are doing really well." |
| B | Green #22c55e | "You have completed the second section! You are making great progress. Keep going." |
| C | Orange #f97316 | "You have completed the third section! Almost halfway there. You are doing a great job." |
| D | Purple #7c3aed | "You have completed the fourth section! You are doing great. Just a few more to go." |

All celebration screens have CSS confetti animation using `@keyframes confetti-fall` with `var(--drift)` CSS variable, 45 particles in 7 colours.

---

## Signature Rules — Important Notices

Three signature notices are built into the flow:

1. **Page 2 signature box** (before Section C questions) — "Do not sign that box at home. The passport officer will ask you to sign it in front of them."
2. **Section C signature rule** (after Section C questions) — Parent/guardian only; must match photo ID; must match Section E. No back button — user must acknowledge before proceeding.
3. **Section E signature reminder** — To be added when Section E is built.

---

## Sections Still To Build

- **Section E** — Applicant's declaration and signature (+ Section E signature reminder notice)
- **Section F** — Certifier's information
- **Output / Review** — Summary of all answers before submission
- **Save / Resume** — Persist answers across sessions (currently in-memory only)

---

## Key Design Patterns

### Question back navigation
Each section has its own `history` stack (array of visited question IDs). Back pops the stack and deletes the current answer so the question can be re-answered.

### SKIP sentinel
`SKIP = '__SKIP__'` is passed as the answer value for optional questions. The question's `next()` function routes differently when it sees SKIP (e.g., skipping month/year when user skips the day of issue date).

### Confirmation audio
`goToConfirming(text, shouldSpeak)` — when `shouldSpeak=true`, the app reads *"You said: [answer]. Is this correct?"* after any voice, typed, or choice answer. `defaultValue` pre-fills use a different spoken message to avoid the awkward "You said: Jamaica" phrasing.

### Text fallback
Always-visible text input below the mic button on every voice question. Resets between questions via `key={question.id}`. Submit on Enter or tap the send arrow.

### Section D branching
After common questions end (`nextId === null` from `D_COMMON_IDS`), `handleDAnswer` in App.jsx checks `passportStatus` state and routes to complete, description question, or lost/stolen notice without requiring question map changes.
