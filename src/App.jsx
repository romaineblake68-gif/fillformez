import { useState, useEffect } from 'react'

// Home screen components
import TopNavBar from './components/TopNavBar'
import HeroSection from './components/HeroSection'
import WelcomeBackCard from './components/WelcomeBackCard'
import DraftResumeCard from './components/DraftResumeCard'
import FormPicker from './components/FormPicker'
import BottomNavBar from './components/BottomNavBar'
import WalletScreen from './screens/WalletScreen'
import HistoryScreen from './screens/HistoryScreen'
import ProfileScreen from './screens/ProfileScreen'
import AutofillPrompt from './components/AutofillPrompt'
import OnboardingModal, { ONBOARDING_KEY } from './components/OnboardingModal'

// TRN application flow screens
import TRNWelcomeScreen from './screens/TRNWelcomeScreen'
import TRNReviewScreen from './screens/TRNReviewScreen'
import TRNFormReadyScreen from './screens/TRNFormReadyScreen'

// NIS application flow screens
import NISWelcomeScreen from './screens/NISWelcomeScreen'
import NISFormReadyScreen from './screens/NISFormReadyScreen'

// Simplified Adult Renewal flow screens
import SimplifiedRenewalEligibilityScreen from './screens/SimplifiedRenewalEligibilityScreen'
import SimplifiedRenewalFormReadyScreen from './screens/SimplifiedRenewalFormReadyScreen'

// DEV ONLY — uncomment to re-enable SR overlay calibration button
// import SRTestButton from './components/SRTestButton'

// Passport application flow screens
import WelcomeScreen from './screens/WelcomeScreen'
import RoutingScreen from './screens/RoutingScreen'
import NoticeScreen from './screens/NoticeScreen'

import FormTypeScreen from './screens/FormTypeScreen'
import QuestionScreen from './screens/QuestionScreen'
import SectionACompleteScreen from './screens/SectionACompleteScreen'
import SectionBIntroScreen from './screens/SectionBIntroScreen'
import SectionBCompleteScreen from './screens/SectionBCompleteScreen'
import SectionCIntroScreen from './screens/SectionCIntroScreen'
import SectionCCompleteScreen from './screens/SectionCCompleteScreen'
import SectionDIntroScreen from './screens/SectionDIntroScreen'
import SectionDCompleteScreen from './screens/SectionDCompleteScreen'
import SectionEIntroScreen from './screens/SectionEIntroScreen'
import SectionEDeclarationScreen from './screens/SectionEDeclarationScreen'
import SectionEPassportNumScreen from './screens/SectionEPassportNumScreen'
import SectionECompleteScreen from './screens/SectionECompleteScreen'
import SectionFIntroScreen from './screens/SectionFIntroScreen'
import SectionFTransitionScreen from './screens/SectionFTransitionScreen'
import SectionFCompleteScreen from './screens/SectionFCompleteScreen'
import SectionGScreen from './screens/SectionGScreen'
import FinalCompleteScreen from './screens/FinalCompleteScreen'
import AnswersSummaryScreen from './screens/AnswersSummaryScreen'
import FormReadyScreen from './screens/FormReadyScreen'

// Question data
import {
  SECTION_A_QUESTIONS, SECTION_A_START, SECTION_A_BASE_COUNT,
  SECTION_B_QUESTIONS, SECTION_B_START, SECTION_B_BASE_COUNT,
  SECTION_C_QUESTIONS, SECTION_C_START, SECTION_C_BASE_COUNT,
  SECTION_D_QUESTIONS, SECTION_D_START,
  SECTION_F_C1_QUESTIONS, SECTION_F_C1_START,
  SECTION_F_C2_QUESTIONS, SECTION_F_C2_START,
  SECTION_F_BASE_COUNT,
} from './data/passportFlow'

import { TRN_QUESTIONS, TRN_START, TRN_BASE_COUNT } from './data/trnFlow'
import { NIS_QUESTIONS, NIS_START, NIS_BASE_COUNT } from './data/nisFlow'
import { SR_QUESTIONS, SR_START, SR_BASE_COUNT } from './data/simplifiedRenewalFlow'
import { loadProfile, profileHasData, applyAutofill } from './utils/profileStorage'
import { trackAppOpen, trackFormStart, trackFormComplete } from './utils/analytics'

import './index.css'

// ── Screen name constants ─────────────────────────────────────────────────────
const S = {
  HOME:                 'home',
  WELCOME:              'welcome',
  APPLICATION_TYPE:     'application-type',
  FIRST_OR_RENEWAL:     'first-or-renewal',
  RENEWAL_AGE:          'renewal-age',
  RENEWAL_NAME:         'renewal-name',
  FORM_TYPE_EXPLAIN:    'form-type-explain',
  SECTION_A:            'section-a',
  SECTION_A_COMPLETE:   'section-a-complete',
  SECTION_B_INTRO:      'section-b-intro',
  SECTION_B:            'section-b',
  SECTION_B_COMPLETE:   'section-b-complete',
  SECTION_C_ROUTING:    'section-c-routing',
  PAGE2_SIG_NOTICE:     'page2-sig-notice',
  SECTION_C_INTRO:      'section-c-intro',
  SECTION_C:            'section-c',
  SECTION_C_SIG_NOTICE: 'section-c-sig-notice',
  SECTION_C_COMPLETE:   'section-c-complete',
  SECTION_D_INTRO:      'section-d-intro',
  SECTION_D_STATUS:     'section-d-status',
  SECTION_D:            'section-d',
  LOST_STOLEN_NOTICE:   'lost-stolen-notice',
  SECTION_D_COMPLETE:   'section-d-complete',
  SECTION_E_INTRO:      'section-e-intro',
  SECTION_E_DECLARATION:'section-e-declaration',
  SECTION_E_PASSPORT:   'section-e-passport',
  SECTION_E_SIG_NOTICE: 'section-e-sig-notice',
  SECTION_E_SIGN_REMIND:'section-e-sign-remind',
  SECTION_E_COMPLETE:   'section-e-complete',
  SECTION_F_INTRO:      'section-f-intro',
  SECTION_F_CONTACT1:   'section-f-contact1',
  SECTION_F_TRANSITION: 'section-f-transition',
  SECTION_F_CONTACT2:   'section-f-contact2',
  SECTION_F_COMPLETE:   'section-f-complete',
  SECTION_G:            'section-g',
  FINAL_COMPLETE:       'final-complete',
  ANSWERS_SUMMARY:      'answers-summary',
  FORM_READY:           'form-ready',

  TRN_WELCOME:          'trn-welcome',
  TRN_FLOW:             'trn-flow',
  TRN_REVIEW:           'trn-review',
  TRN_FORM_READY:       'trn-form-ready',

  NIS_WELCOME:          'nis-welcome',
  NIS_FLOW:             'nis-flow',
  NIS_FORM_READY:       'nis-form-ready',

  SR_ELIGIBILITY:       'sr-eligibility',
  SR_FLOW:              'sr-flow',
  SR_DECLARATION:       'sr-declaration',
  SR_FORM_READY:        'sr-form-ready',

  AUTOFILL_PROMPT:      'autofill-prompt',
}

// ── Persistence ───────────────────────────────────────────────────────────────

const SAVE_KEY    = 'fillformeasy_passport_v1'
const HISTORY_KEY = 'fillformeasy_history_v1'
const TRN_SAVE_KEY = 'trnFormProgress'
const NIS_SAVE_KEY = 'nisFormProgress'
const SR_SAVE_KEY  = 'srFormProgress'

// Only save when the user has entered the real form sections (not pre-flow routing)
const SAVEABLE_SCREENS = new Set([
  S.SECTION_A, S.SECTION_A_COMPLETE,
  S.SECTION_B_INTRO, S.SECTION_B, S.SECTION_B_COMPLETE,
  S.SECTION_C_ROUTING, S.PAGE2_SIG_NOTICE, S.SECTION_C_INTRO,
  S.SECTION_C, S.SECTION_C_SIG_NOTICE, S.SECTION_C_COMPLETE,
  S.SECTION_D_INTRO, S.SECTION_D_STATUS, S.SECTION_D,
  S.LOST_STOLEN_NOTICE, S.SECTION_D_COMPLETE,
  S.SECTION_E_INTRO, S.SECTION_E_DECLARATION, S.SECTION_E_PASSPORT,
  S.SECTION_E_SIG_NOTICE, S.SECTION_E_COMPLETE,
  S.SECTION_F_INTRO, S.SECTION_F_CONTACT1, S.SECTION_F_TRANSITION,
  S.SECTION_F_CONTACT2, S.SECTION_F_COMPLETE,
  S.SECTION_G, S.FINAL_COMPLETE,
])

// Fixed progress for non-question screens (intros, notices, complete screens)
const SCREEN_PROGRESS = {
  [S.SECTION_A_COMPLETE]:    { label: 'Personal Information',  pct: 35 },
  [S.SECTION_B_INTRO]:       { label: 'Marriage Details',      pct: 37 },
  [S.SECTION_B_COMPLETE]:    { label: 'Marriage Details',      pct: 46 },
  [S.SECTION_C_ROUTING]:     { label: 'Parental Consent',      pct: 48 },
  [S.PAGE2_SIG_NOTICE]:      { label: 'Parental Consent',      pct: 49 },
  [S.SECTION_C_INTRO]:       { label: 'Parental Consent',      pct: 50 },
  [S.SECTION_C_SIG_NOTICE]:  { label: 'Parental Consent',      pct: 57 },
  [S.SECTION_C_COMPLETE]:    { label: 'Parental Consent',      pct: 59 },
  [S.SECTION_D_INTRO]:       { label: 'Previous Passport',     pct: 61 },
  [S.SECTION_D_STATUS]:      { label: 'Previous Passport',     pct: 63 },
  [S.LOST_STOLEN_NOTICE]:    { label: 'Previous Passport',     pct: 69 },
  [S.SECTION_D_COMPLETE]:    { label: 'Previous Passport',     pct: 71 },
  [S.SECTION_E_INTRO]:       { label: 'Declaration',           pct: 73 },
  [S.SECTION_E_DECLARATION]: { label: 'Declaration',           pct: 75 },
  [S.SECTION_E_PASSPORT]:    { label: 'Declaration',           pct: 77 },
  [S.SECTION_E_SIG_NOTICE]:  { label: 'Declaration',           pct: 79 },
  [S.SECTION_E_COMPLETE]:    { label: 'Declaration',           pct: 81 },
  [S.SECTION_F_INTRO]:       { label: 'Emergency Contacts',    pct: 83 },
  [S.SECTION_F_TRANSITION]:  { label: 'Emergency Contacts',    pct: 90 },
  [S.SECTION_F_COMPLETE]:    { label: 'Emergency Contacts',    pct: 96 },
  [S.SECTION_G]:             { label: 'Final Checklist',       pct: 98 },
  [S.FINAL_COMPLETE]:        { label: 'Almost Done',           pct: 99 },
}

// Returns { label, pct, stepNum, stepOf }
// For question screens, pct advances per-question using the question's base position.
// For transition/notice/complete screens, pct is a fixed milestone value.
function computeProgress(snap) {
  if (!snap) return { label: 'Passport Application', pct: 0, stepNum: null, stepOf: null }
  const s = snap.screen

  // Question screens — linear interpolation within each section's pct range
  if (s === S.SECTION_A) {
    const base = SECTION_A_QUESTIONS[snap.currentAQId]?.base ?? 1
    return { label: 'Personal Information', stepNum: base, stepOf: SECTION_A_BASE_COUNT,
      pct: Math.round(5 + (base / SECTION_A_BASE_COUNT) * 30) }
  }
  if (s === S.SECTION_B) {
    const base = SECTION_B_QUESTIONS[snap.currentBQId]?.base ?? 1
    return { label: 'Marriage Details', stepNum: base, stepOf: SECTION_B_BASE_COUNT,
      pct: Math.round(37 + (base / SECTION_B_BASE_COUNT) * 9) }
  }
  if (s === S.SECTION_C) {
    const base = SECTION_C_QUESTIONS[snap.currentCQId]?.base ?? 1
    return { label: 'Parental Consent', stepNum: base, stepOf: SECTION_C_BASE_COUNT,
      pct: Math.round(50 + (base / SECTION_C_BASE_COUNT) * 9) }
  }
  if (s === S.SECTION_D) {
    const base = SECTION_D_QUESTIONS[snap.currentDQId]?.base ?? 1
    return { label: 'Previous Passport', stepNum: base, stepOf: 8,
      pct: Math.round(63 + (base / 8) * 8) }
  }
  if (s === S.SECTION_F_CONTACT1) {
    const base = SECTION_F_C1_QUESTIONS[snap.currentF1QId]?.base ?? 1
    return { label: 'Emergency Contact 1', stepNum: base, stepOf: SECTION_F_BASE_COUNT,
      pct: Math.round(83 + (base / SECTION_F_BASE_COUNT) * 7) }
  }
  if (s === S.SECTION_F_CONTACT2) {
    const base = SECTION_F_C2_QUESTIONS[snap.currentF2QId]?.base ?? 1
    return { label: 'Emergency Contact 2', stepNum: base, stepOf: SECTION_F_BASE_COUNT,
      pct: Math.round(90 + (base / SECTION_F_BASE_COUNT) * 6) }
  }

  // All other screens — fixed milestone
  const fixed = SCREEN_PROGRESS[s]
  return fixed
    ? { ...fixed, stepNum: null, stepOf: null }
    : { label: 'Passport Application', pct: 50, stepNum: null, stepOf: null }
}

function formatSavedAt(ts) {
  if (!ts) return ''
  const diffMs = Date.now() - ts
  const mins = Math.floor(diffMs / 60000)
  if (mins < 2) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(diffMs / 3600000)
  if (hours < 24) return `${hours}h ago`
  if (Math.floor(diffMs / 86400000) === 1) return 'Yesterday'
  return new Date(ts).toLocaleDateString('en-JM', { month: 'short', day: 'numeric' })
}

// ── Notice content ────────────────────────────────────────────────────────────

const PAGE2_SIG_SPEECH =
  'There is a large empty box in the middle of page 2 that says Signature of the Applicant inside it. Do not sign that box at home. The passport officer will ask you to sign it in front of them at the office. Leave that box empty until then.'
const PAGE2_SIG_LINES = [
  'There is a large empty box in the middle of page 2 that says "Signature of the Applicant" inside it.',
  'Do not sign that box at home.',
  'The passport officer will ask you to sign it in front of them at the office. Leave that box empty until then.',
]

const C_SIG_SPEECH =
  'You need to sign the consent section on page 2 — the section that starts with the word CONSENT FOR MINOR — before you go to the office. Your signature must match the signature on the photo ID you are submitting with your application.'
const C_SIG_LINES = [
  'You need to sign the consent section on page 2 — the section that starts with the word CONSENT FOR MINOR — before you go to the office.',
  'Your signature must match the signature on the photo ID you are submitting with your application.',
]

const LOST_STOLEN_SPEECH =
  'Before you come to submit your application, you must first go to your nearest PICA passport office and make a report about your lost or stolen passport. You will need that report when you come to submit. Do not come without it.'
const LOST_STOLEN_LINES = [
  'Before you come to submit your application, you must first go to your nearest PICA passport office and make a report about your lost or stolen passport.',
  'You will need that report when you come to submit.',
  'Do not come without it.',
]

const E_SIG_SPEECH =
  'You need to sign the declaration section on page 2 — the section that starts with the words DECLARATION OF APPLICANT — before you go to the office. This signature must be identical to the one you signed at the consent section and the one on your photo ID.'
const E_SIG_LINES = [
  'You need to sign the declaration section on page 2 — the section that starts with the words DECLARATION OF APPLICANT — before you go to the office.',
  'This signature must be identical to the one you signed at the consent section and the one on your photo ID.',
]

const E_SIGN_REMIND_SPEECH =
  'There is a large empty box in the middle of page 2 that says Signature of the Applicant inside it. Do not sign that box at home. The passport officer will ask you to sign it in front of them at the office. Leave that box empty until then.'
const E_SIGN_REMIND_LINES = [
  'There is a large empty box in the middle of page 2 that says "Signature of the Applicant" inside it.',
  'Do not sign that box at home.',
  'The passport officer will ask you to sign it in front of them at the office. Leave that box empty until then.',
]

const SR_DECLARATION_SPEECH =
  'Almost done! Before you print, please note — you must sign the declaration section on the form. ' +
  'It is best to sign in front of the passport officer at the PICA office. ' +
  'Make sure your signature does not touch the border of the signature box. ' +
  'Your thumbprint will be collected at the office — you do not need to add it yourself.'

const SR_DECLARATION_LINES = [
  'You must sign the declaration section on the form — do not sign it before you go to the office if you can help it.',
  'It is best to sign in front of the passport officer at PICA.',
  'Make sure your signature does not touch the border of the signature box.',
  'Your thumbprint will be collected at the PICA office — you do not need to add it yourself.',
]

// ── Common Section D question IDs (those that return null = end of common Qs)
const D_COMMON_IDS = new Set([
  'dPassportNumber', 'dIssueDay', 'dIssueMonth', 'dIssueYear',
  'dIssuePlace', 'dPrevSurname', 'dPrevFirstName',
  'dPrevHasMiddle', 'dPrevMiddleName',
])

// ── SR Coming Soon overlay ────────────────────────────────────────────────────
// Shown whenever the user reaches an SR entry point while the flow is locked.
// onContinue receives the destination screen for after dismissal.

function SRComingSoonOverlay({ onContinue }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(13,27,56,0.55)' }}
    >
      <div
        className="w-full rounded-t-3xl px-6 pt-5 pb-10 bg-white"
        style={{ maxWidth: 430 }}
      >
        <div className="w-10 h-1.5 rounded-full mx-auto mb-5 bg-gray-200" />

        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: '#fef3c7' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <h2 className="font-bold text-xl text-center mb-2" style={{ color: '#0d1b38' }}>
          Coming Soon
        </h2>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-7 px-2">
          Simplified Adult Renewal is currently being improved and will be available soon.
          Please use the regular passport application for now.
        </p>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-bold text-white text-base active:opacity-80"
          style={{ background: '#16a34a' }}
        >
          Use Regular Passport Application
        </button>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState(S.HOME)
  const [activeTab, setActiveTab] = useState('home')

  // Saved progress — loaded once from localStorage on mount
  const [savedProgress, setSavedProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  // Completed form history — persisted across sessions
  const [completedForms, setCompletedForms] = useState(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  // Form-type routing
  const [formType, setFormType]               = useState('regular')
  const [formTypeReason, setFormTypeReason]   = useState('first-time')
  const [formTypeBackScreen, setFormTypeBack] = useState(S.FIRST_OR_RENEWAL)
  const [isFirstTime, setIsFirstTime]         = useState(null)
  const [applicationType, setApplicationType] = useState(null)

  // Section A
  const [currentAQId, setCurrentAQId]     = useState(SECTION_A_START)
  const [aHistory, setAHistory]           = useState([])
  const [aAnswers, setAAnswers]           = useState({})
  const [aReturnScreen, setAReturnScreen] = useState(S.HOME)

  // Section B
  const [currentBQId, setCurrentBQId] = useState(SECTION_B_START)
  const [bHistory, setBHistory]       = useState([])
  const [bAnswers, setBAnswers]       = useState({})

  // Section C
  const [currentCQId, setCurrentCQId] = useState(SECTION_C_START)
  const [cHistory, setCHistory]       = useState([])
  const [cAnswers, setCAnswers]       = useState({})

  // Section D
  const [currentDQId, setCurrentDQId]       = useState(SECTION_D_START)
  const [dHistory, setDHistory]             = useState([])
  const [dAnswers, setDAnswers]             = useState({})
  const [passportStatus, setPassportStatus] = useState('renewing')

  // Section E
  const [ePassportNumber, setEPassportNumber] = useState('')

  // Section F — Contact 1
  const [currentF1QId, setCurrentF1QId] = useState(SECTION_F_C1_START)
  const [f1History, setF1History]       = useState([])
  const [f1Answers, setF1Answers]       = useState({})

  // Section F — Contact 2
  const [currentF2QId, setCurrentF2QId] = useState(SECTION_F_C2_START)
  const [f2History, setF2History]       = useState([])
  const [f2Answers, setF2Answers]       = useState({})

  // Generated PDF
  const [pdfUrl, setPdfUrl] = useState(null)

  // Autofill prompt — holds { type: 'passport'|'trn'|'nis', returnScreen? }
  const [pendingFormStart, setPendingFormStart] = useState(null)

  // Onboarding — show once on first app open
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return localStorage.getItem(ONBOARDING_KEY) !== 'true' } catch { return true }
  })

  const handleOnboardingDone = () => {
    try { localStorage.setItem(ONBOARDING_KEY, 'true') } catch {}
    setShowOnboarding(false)
  }

  // TRN flow
  const [trnQId, setTrnQId]       = useState(TRN_START)
  const [trnHistory, setTrnHistory] = useState([])
  const [trnAnswers, setTrnAnswers] = useState({})
  const [trnPdfUrl, setTrnPdfUrl]   = useState(null)

  // TRN saved progress (for Resume button on TRN welcome screen)
  const [savedTRNProgress, setSavedTRNProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(TRN_SAVE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  // NIS flow
  const [nisQId, setNisQId]       = useState(NIS_START)
  const [nisHistory, setNisHistory] = useState([])
  const [nisAnswers, setNisAnswers] = useState({})
  const [nisPdfUrl, setNisPdfUrl]   = useState(null)

  // NIS saved progress (for Resume button on NIS welcome screen)
  const [savedNISProgress, setSavedNISProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(NIS_SAVE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  // Simplified Adult Renewal flow
  const [srQId, setSrQId]       = useState(SR_START)
  const [srHistory, setSrHistory] = useState([])
  const [srAnswers, setSrAnswers] = useState({})
  const [srPdfUrl, setSrPdfUrl]   = useState(null)
  const [srEligibilityBack, setSrEligibilityBack] = useState(S.HOME)
  const [showSRComingSoon, setShowSRComingSoon] = useState(false)

  const [savedSRProgress, setSavedSRProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(SR_SAVE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  // Dynamic back destinations
  const [sectionDBack, setSectionDBack] = useState(S.SECTION_C_ROUTING)
  const [sectionEBack, setSectionEBack] = useState(S.SECTION_D_COMPLETE)

  // ── Analytics: track each app open ───────────────────────────────────────
  useEffect(() => { trackAppOpen() }, [])

  // ── Auto-expire stale drafts (older than 48 hours) ────────────────────────
  // Runs once on mount. If a draft was saved more than 48 hours ago, it is
  // silently deleted so sensitive data doesn't linger indefinitely.
  useEffect(() => {
    const MAX_AGE = 48 * 60 * 60 * 1000 // 48 hours in milliseconds
    const now = Date.now()
    const draftKeys = [
      [SAVE_KEY,     setSavedProgress],
      [TRN_SAVE_KEY, setSavedTRNProgress],
      [NIS_SAVE_KEY, setSavedNISProgress],
      [SR_SAVE_KEY,  setSavedSRProgress],
    ]
    draftKeys.forEach(([key, clearState]) => {
      try {
        const raw = localStorage.getItem(key)
        if (!raw) return
        const snap = JSON.parse(raw)
        if (snap?.savedAt && now - snap.savedAt > MAX_AGE) {
          localStorage.removeItem(key)
          clearState(null)
        }
      } catch {}
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigation helpers ──────────────────────────────────────────────────

  const goHome = () => {
    setScreen(S.HOME)
    setActiveTab('home')
    setCurrentAQId(SECTION_A_START)
    setAHistory([])
  }

  // ── Clear all user data ───────────────────────────────────────────────────
  // Called from the "Clear All My Data" button in ProfileScreen.
  // Wipes every piece of user data from localStorage and releases any active
  // PDF blob URLs from memory. Does NOT clear non-sensitive prefs (mute, onboarding).

  const handleClearAll = () => {
    // 1. Remove all localStorage keys that hold user data
    ;[
      SAVE_KEY, HISTORY_KEY,
      TRN_SAVE_KEY, NIS_SAVE_KEY, SR_SAVE_KEY,
      'fillformeez_analytics_v1',
      'fillformeez_profile_v1',
    ].forEach(key => { try { localStorage.removeItem(key) } catch {} })

    // 2. Revoke any active PDF blob URLs so the PDF data is freed from memory
    ;[pdfUrl, trnPdfUrl, nisPdfUrl, srPdfUrl].forEach(url => {
      if (url) { try { URL.revokeObjectURL(url) } catch {} }
    })

    // 3. Reset all in-memory state that holds user data
    setSavedProgress(null)
    setCompletedForms([])
    setSavedTRNProgress(null)
    setSavedNISProgress(null)
    setSavedSRProgress(null)
    setPdfUrl(null)
    setTrnPdfUrl(null)
    setNisPdfUrl(null)
    setSrPdfUrl(null)
    setAAnswers({})
    setBAnswers({})
    setCAnswers({})
    setDAnswers({})
    setF1Answers({})
    setF2Answers({})
    setTrnAnswers({})
    setNisAnswers({})
    setSrAnswers({})

    goHome()
  }

  const startSectionA = (returnScreen) => {
    const profile = loadProfile()
    if (profileHasData(profile)) {
      setPendingFormStart({ type: 'passport', returnScreen })
      setScreen(S.AUTOFILL_PROMPT)
    } else {
      trackFormStart('passport', false)
      setAReturnScreen(returnScreen)
      setCurrentAQId(SECTION_A_START)
      setAHistory([])
      setAAnswers({})
      setScreen(S.SECTION_A)
    }
  }

  const handleAutofillConfirm = (useProfile) => {
    if (!pendingFormStart) return
    const { type, returnScreen } = pendingFormStart
    const profile = useProfile ? loadProfile() : {}

    if (type === 'passport') {
      trackFormStart('passport', false)
      const newAnswers = useProfile ? applyAutofill(profile, 'passport') : {}
      setAReturnScreen(returnScreen)
      setCurrentAQId(SECTION_A_START)
      setAHistory([])
      setAAnswers(newAnswers)
      setScreen(S.SECTION_A)
    } else if (type === 'trn') {
      trackFormStart('trn', false)
      const newAnswers = useProfile ? applyAutofill(profile, 'trn') : {}
      try { localStorage.removeItem(TRN_SAVE_KEY) } catch {}
      setSavedTRNProgress(null)
      setTrnQId(TRN_START)
      setTrnHistory([])
      setTrnAnswers(newAnswers)
      setScreen(S.TRN_FLOW)
    } else if (type === 'nis') {
      trackFormStart('nis', false)
      const newAnswers = useProfile ? applyAutofill(profile, 'nis') : {}
      try { localStorage.removeItem(NIS_SAVE_KEY) } catch {}
      setSavedNISProgress(null)
      setNisQId(NIS_START)
      setNisHistory([])
      setNisAnswers(newAnswers)
      setScreen(S.NIS_FLOW)
    } else if (type === 'simplified-renewal') {
      trackFormStart('simplified-renewal', false)
      const newAnswers = useProfile ? applyAutofill(profile, 'simplified-renewal') : {}
      try { localStorage.removeItem(SR_SAVE_KEY) } catch {}
      setSavedSRProgress(null)
      setSrQId(SR_START)
      setSrHistory([])
      setSrAnswers(newAnswers)
      setScreen(S.SR_FLOW)
    }
    setPendingFormStart(null)
  }

  const goFormTypeExplain = (type, reason, backScreen, firstTime = null) => {
    setFormType(type)
    setFormTypeReason(reason)
    setFormTypeBack(backScreen)
    if (firstTime !== null) setIsFirstTime(firstTime)
    setScreen(S.FORM_TYPE_EXPLAIN)
  }

  const goSectionEIntro = (backTo) => {
    setSectionEBack(backTo)
    setScreen(S.SECTION_E_INTRO)
  }

  // Called after Section C complete (or skipped) — routes to D or E
  const afterSectionC = (backFrom) => {
    if (isFirstTime) {
      goSectionEIntro(backFrom)
    } else {
      setSectionDBack(backFrom)
      setScreen(S.SECTION_D_INTRO)
    }
  }

  // ── Auto-save progress to localStorage ─────────────────────────────────────

  useEffect(() => {
    if (!SAVEABLE_SCREENS.has(screen)) return
    const snap = {
      savedAt: Date.now(), screen,
      formType, formTypeReason, formTypeBackScreen, isFirstTime, applicationType,
      currentAQId, aHistory, aAnswers, aReturnScreen,
      currentBQId, bHistory, bAnswers,
      currentCQId, cHistory, cAnswers,
      currentDQId, dHistory, dAnswers, passportStatus,
      ePassportNumber,
      currentF1QId, f1History, f1Answers,
      currentF2QId, f2History, f2Answers,
      sectionDBack, sectionEBack,
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(snap))
      setSavedProgress(snap)
    } catch (e) {
      console.warn('[FillFormEasy] Could not save progress:', e.message)
    }
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    screen, formType, formTypeReason, formTypeBackScreen, isFirstTime, applicationType,
    currentAQId, aHistory, aAnswers, aReturnScreen,
    currentBQId, bHistory, bAnswers,
    currentCQId, cHistory, cAnswers,
    currentDQId, dHistory, dAnswers, passportStatus,
    ePassportNumber,
    currentF1QId, f1History, f1Answers,
    currentF2QId, f2History, f2Answers,
    sectionDBack, sectionEBack,
  ])

  // ── Resume saved session ─────────────────────────────────────────────────────

  const handleResume = () => {
    if (!savedProgress) return
    trackFormStart('passport', true)
    const s = savedProgress
    setFormType(s.formType ?? 'regular')
    setFormTypeReason(s.formTypeReason ?? 'first-time')
    setFormTypeBack(s.formTypeBackScreen ?? S.FIRST_OR_RENEWAL)
    setIsFirstTime(s.isFirstTime ?? null)
    setApplicationType(s.applicationType ?? null)
    setCurrentAQId(s.currentAQId ?? SECTION_A_START)
    setAHistory(s.aHistory ?? [])
    setAAnswers(s.aAnswers ?? {})
    setAReturnScreen(s.aReturnScreen ?? S.FORM_TYPE_EXPLAIN)
    setCurrentBQId(s.currentBQId ?? SECTION_B_START)
    setBHistory(s.bHistory ?? [])
    setBAnswers(s.bAnswers ?? {})
    setCurrentCQId(s.currentCQId ?? SECTION_C_START)
    setCHistory(s.cHistory ?? [])
    setCAnswers(s.cAnswers ?? {})
    setCurrentDQId(s.currentDQId ?? SECTION_D_START)
    setDHistory(s.dHistory ?? [])
    setDAnswers(s.dAnswers ?? {})
    setPassportStatus(s.passportStatus ?? 'renewing')
    setEPassportNumber(s.ePassportNumber ?? '')
    setCurrentF1QId(s.currentF1QId ?? SECTION_F_C1_START)
    setF1History(s.f1History ?? [])
    setF1Answers(s.f1Answers ?? {})
    setCurrentF2QId(s.currentF2QId ?? SECTION_F_C2_START)
    setF2History(s.f2History ?? [])
    setF2Answers(s.f2Answers ?? {})
    setSectionDBack(s.sectionDBack ?? S.SECTION_C_ROUTING)
    setSectionEBack(s.sectionEBack ?? S.SECTION_D_COMPLETE)
    setScreen(s.screen)
  }

  // ── Start Fresh ───────────────────────────────────────────────────────────────

  const handleStartFresh = () => {
    localStorage.removeItem(SAVE_KEY)
    setSavedProgress(null)
    setFormType('regular')
    setFormTypeReason('first-time')
    setFormTypeBack(S.FIRST_OR_RENEWAL)
    setIsFirstTime(null)
    setApplicationType(null)
    setCurrentAQId(SECTION_A_START)
    setAHistory([])
    setAAnswers({})
    setAReturnScreen(S.HOME)
    setCurrentBQId(SECTION_B_START)
    setBHistory([])
    setBAnswers({})
    setCurrentCQId(SECTION_C_START)
    setCHistory([])
    setCAnswers({})
    setCurrentDQId(SECTION_D_START)
    setDHistory([])
    setDAnswers({})
    setPassportStatus('renewing')
    setEPassportNumber('')
    setCurrentF1QId(SECTION_F_C1_START)
    setF1History([])
    setF1Answers({})
    setCurrentF2QId(SECTION_F_C2_START)
    setF2History([])
    setF2Answers({})
    setSectionDBack(S.SECTION_C_ROUTING)
    setSectionEBack(S.SECTION_D_COMPLETE)
    setScreen(S.WELCOME)
  }

  // Pre-selected declaration type for Section E
  const ePreSelected = isFirstTime
    ? 'first-time'
    : passportStatus === 'renewing'
      ? 'renewing'
      : 'lost-stolen-damaged'

  // ── Section A ───────────────────────────────────────────────────────────

  const handleAAnswer = (questionId, value) => {
    const newAnswers = { ...aAnswers, [questionId]: value }
    setAAnswers(newAnswers)
    const q = SECTION_A_QUESTIONS[questionId]
    const nextId = q.next(value, newAnswers)
    if (nextId === null) {
      setScreen(S.SECTION_A_COMPLETE)
    } else {
      setAHistory((h) => [...h, questionId])
      setCurrentAQId(nextId)
    }
  }

  const handleABack = () => {
    if (aHistory.length === 0) { setScreen(aReturnScreen); return }
    const prevId = aHistory[aHistory.length - 1]
    const newAnswers = { ...aAnswers }
    delete newAnswers[currentAQId]
    setAAnswers(newAnswers)
    setAHistory((h) => h.slice(0, -1))
    setCurrentAQId(prevId)
  }

  const handleSectionAComplete = () => {
    const status = aAnswers.maritalStatus
    if (status && status !== 'Single') {
      setScreen(S.SECTION_B_INTRO)
    } else {
      setScreen(S.SECTION_C_ROUTING)
    }
  }

  // ── Section B ───────────────────────────────────────────────────────────

  const startSectionB = () => {
    setCurrentBQId(SECTION_B_START)
    setBHistory([])
    setScreen(S.SECTION_B)
  }

  const handleBAnswer = (questionId, value) => {
    const newAnswers = { ...bAnswers, [questionId]: value }
    setBAnswers(newAnswers)
    const q = SECTION_B_QUESTIONS[questionId]
    const nextId = q.next(value, newAnswers)
    if (nextId === null) {
      setScreen(S.SECTION_B_COMPLETE)
    } else {
      setBHistory((h) => [...h, questionId])
      setCurrentBQId(nextId)
    }
  }

  const handleBBack = () => {
    if (bHistory.length === 0) { setScreen(S.SECTION_B_INTRO); return }
    const prevId = bHistory[bHistory.length - 1]
    const newAnswers = { ...bAnswers }
    delete newAnswers[currentBQId]
    setBAnswers(newAnswers)
    setBHistory((h) => h.slice(0, -1))
    setCurrentBQId(prevId)
  }

  // ── Section C ───────────────────────────────────────────────────────────

  const sectionCRoutingBack = () => {
    const status = aAnswers.maritalStatus
    if (status && status !== 'Single') {
      setScreen(S.SECTION_B_COMPLETE)
    } else {
      setScreen(S.SECTION_A_COMPLETE)
    }
  }

  const startSectionC = () => {
    setCurrentCQId(SECTION_C_START)
    setCHistory([])
    setScreen(S.SECTION_C)
  }

  const handleCAnswer = (questionId, value) => {
    const newAnswers = { ...cAnswers, [questionId]: value }
    setCAnswers(newAnswers)
    const q = SECTION_C_QUESTIONS[questionId]
    const nextId = q.next(value, newAnswers)
    if (nextId === null) {
      setScreen(S.SECTION_C_SIG_NOTICE)
    } else {
      setCHistory((h) => [...h, questionId])
      setCurrentCQId(nextId)
    }
  }

  const handleCBack = () => {
    if (cHistory.length === 0) { setScreen(S.SECTION_C_INTRO); return }
    const prevId = cHistory[cHistory.length - 1]
    const newAnswers = { ...cAnswers }
    delete newAnswers[currentCQId]
    setCAnswers(newAnswers)
    setCHistory((h) => h.slice(0, -1))
    setCurrentCQId(prevId)
  }

  // ── Section D ───────────────────────────────────────────────────────────

  const startSectionD = (status) => {
    setPassportStatus(status)
    setCurrentDQId(SECTION_D_START)
    setDHistory([])
    setDAnswers({ dPassportStatus: status })
    setScreen(S.SECTION_D)
  }

  const sectionDBaseCount = passportStatus === 'renewing' ? 3 : 7

  const handleDAnswer = (questionId, value) => {
    const newAnswers = { ...dAnswers, [questionId]: value }
    setDAnswers(newAnswers)
    const q = SECTION_D_QUESTIONS[questionId]
    const nextId = q.next(value, newAnswers)

    if (nextId === null) {
      if (questionId === 'dDescriptionLostStolen' || questionId === 'dDescriptionDamaged') {
        setScreen(S.SECTION_D_COMPLETE)
      } else if (D_COMMON_IDS.has(questionId)) {
        const status = passportStatus
        if (status === 'lost' || status === 'stolen') {
          setScreen(S.LOST_STOLEN_NOTICE)
        } else if (status === 'damaged') {
          setCurrentDQId('dWhereLostStolen')
          setScreen(S.SECTION_D)
        } else {
          setScreen(S.SECTION_D_COMPLETE)
        }
      }
    } else {
      setDHistory((h) => [...h, questionId])
      setCurrentDQId(nextId)
    }
  }

  const handleDBack = () => {
    if (dHistory.length === 0) { setScreen(S.SECTION_D_STATUS); return }
    const prevId = dHistory[dHistory.length - 1]
    const newAnswers = { ...dAnswers }
    delete newAnswers[currentDQId]
    setDAnswers(newAnswers)
    setDHistory((h) => h.slice(0, -1))
    setCurrentDQId(prevId)
  }

  // ── Section E ───────────────────────────────────────────────────────────

  const handleEDeclarationSelect = (type) => {
    if (type === 'renewing') {
      setScreen(S.SECTION_E_PASSPORT)
    } else {
      setScreen(S.SECTION_E_SIG_NOTICE)
    }
  }

  // ── Section F ───────────────────────────────────────────────────────────

  const startSectionF = () => {
    setCurrentF1QId(SECTION_F_C1_START)
    setF1History([])
    setF1Answers({})
    setScreen(S.SECTION_F_CONTACT1)
  }

  const handleF1Answer = (questionId, value) => {
    const newAnswers = { ...f1Answers, [questionId]: value }
    setF1Answers(newAnswers)
    const q = SECTION_F_C1_QUESTIONS[questionId]
    const nextId = q.next(value, newAnswers)
    if (nextId === null) {
      setScreen(S.SECTION_F_TRANSITION)
    } else {
      setF1History((h) => [...h, questionId])
      setCurrentF1QId(nextId)
    }
  }

  const handleF1Back = () => {
    if (f1History.length === 0) { setScreen(S.SECTION_F_INTRO); return }
    const prevId = f1History[f1History.length - 1]
    const newAnswers = { ...f1Answers }
    delete newAnswers[currentF1QId]
    setF1Answers(newAnswers)
    setF1History((h) => h.slice(0, -1))
    setCurrentF1QId(prevId)
  }

  const startContact2 = () => {
    setCurrentF2QId(SECTION_F_C2_START)
    setF2History([])
    setF2Answers({})
    setScreen(S.SECTION_F_CONTACT2)
  }

  const handleF2Answer = (questionId, value) => {
    const newAnswers = { ...f2Answers, [questionId]: value }
    setF2Answers(newAnswers)
    const q = SECTION_F_C2_QUESTIONS[questionId]
    const nextId = q.next(value, newAnswers)
    if (nextId === null) {
      setScreen(S.SECTION_F_COMPLETE)
    } else {
      setF2History((h) => [...h, questionId])
      setCurrentF2QId(nextId)
    }
  }

  const handleF2Back = () => {
    if (f2History.length === 0) { setScreen(S.SECTION_F_TRANSITION); return }
    const prevId = f2History[f2History.length - 1]
    const newAnswers = { ...f2Answers }
    delete newAnswers[currentF2QId]
    setF2Answers(newAnswers)
    setF2History((h) => h.slice(0, -1))
    setCurrentF2QId(prevId)
  }

  // ── TRN ──────────────────────────────────────────────────────────────────

  const handleTRNAnswer = (questionId, value) => {
    const newAnswers = { ...trnAnswers, [questionId]: value }
    setTrnAnswers(newAnswers)
    const q = TRN_QUESTIONS[questionId]
    const nextId = q.next(value, newAnswers)
    if (nextId === null) {
      setScreen(S.TRN_REVIEW)
    } else {
      const newHistory = [...trnHistory, questionId]
      setTrnHistory(newHistory)
      setTrnQId(nextId)
      // Save progress so user can resume if they leave the app
      try {
        const pct = Math.min(99, Math.round((newHistory.length / TRN_BASE_COUNT) * 100))
        const snap = { currentStep: nextId, answers: newAnswers, history: newHistory, savedAt: Date.now(), pct }
        localStorage.setItem(TRN_SAVE_KEY, JSON.stringify(snap))
        setSavedTRNProgress(snap)
      } catch {}
    }
  }

  const handleTRNResume = () => {
    if (!savedTRNProgress) return
    trackFormStart('trn', true)
    setTrnQId(savedTRNProgress.currentStep || TRN_START)
    setTrnAnswers(savedTRNProgress.answers || {})
    setTrnHistory(savedTRNProgress.history || [])
    setScreen(S.TRN_FLOW)
  }

  const handleTRNBack = () => {
    if (trnHistory.length === 0) { setScreen(S.TRN_WELCOME); return }
    const prevId = trnHistory[trnHistory.length - 1]
    const newAnswers = { ...trnAnswers }
    delete newAnswers[trnQId]
    setTrnAnswers(newAnswers)
    setTrnHistory((h) => h.slice(0, -1))
    setTrnQId(prevId)
  }

  // ── NIS ──────────────────────────────────────────────────────────────────

  const handleNISAnswer = (questionId, value) => {
    const newAnswers = { ...nisAnswers, [questionId]: value }
    setNisAnswers(newAnswers)
    const q = NIS_QUESTIONS[questionId]
    const nextId = q.next(value, newAnswers)
    if (nextId === null) {
      import('./utils/nisPdfGenerator').then(({ generateNISPDF }) =>
        generateNISPDF(newAnswers).then((url) => {
          trackFormComplete('nis')
          try { localStorage.removeItem(NIS_SAVE_KEY) } catch {}
          setSavedNISProgress(null)
          const entry = {
            name: 'NIS Registration',
            completedAt: Date.now(),
            applicantName: [newAnswers.firstName, newAnswers.lastName].filter(Boolean).join(' '),
          }
          const updated = [entry, ...completedForms]
          setCompletedForms(updated)
          try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)) } catch {}
          setNisPdfUrl(url)
          setScreen(S.NIS_FORM_READY)
        }).catch(err => console.error('[NIS] PDF generation failed:', err))
      )
    } else {
      const newHistory = [...nisHistory, questionId]
      setNisHistory(newHistory)
      setNisQId(nextId)
      try {
        const pct = Math.min(99, Math.round((newHistory.length / NIS_BASE_COUNT) * 100))
        const snap = { currentStep: nextId, answers: newAnswers, history: newHistory, savedAt: Date.now(), pct }
        localStorage.setItem(NIS_SAVE_KEY, JSON.stringify(snap))
        setSavedNISProgress(snap)
      } catch {}
    }
  }

  const handleNISResume = () => {
    if (!savedNISProgress) return
    trackFormStart('nis', true)
    setNisQId(savedNISProgress.currentStep || NIS_START)
    setNisAnswers(savedNISProgress.answers || {})
    setNisHistory(savedNISProgress.history || [])
    setScreen(S.NIS_FLOW)
  }

  const handleNISBack = () => {
    if (nisHistory.length === 0) { setScreen(S.NIS_WELCOME); return }
    const prevId = nisHistory[nisHistory.length - 1]
    const newAnswers = { ...nisAnswers }
    delete newAnswers[nisQId]
    setNisAnswers(newAnswers)
    setNisHistory((h) => h.slice(0, -1))
    setNisQId(prevId)
  }

  // ── Simplified Adult Renewal ──────────────────────────────────────────────

  const startSRFlow = () => {
    const profile = loadProfile()
    if (profileHasData(profile)) {
      setPendingFormStart({ type: 'simplified-renewal' })
      setScreen(S.AUTOFILL_PROMPT)
    } else {
      trackFormStart('simplified-renewal', false)
      try { localStorage.removeItem(SR_SAVE_KEY) } catch {}
      setSavedSRProgress(null)
      setSrQId(SR_START)
      setSrHistory([])
      setSrAnswers({})
      setScreen(S.SR_FLOW)
    }
  }

  const handleSRResume = () => {
    if (!savedSRProgress) return
    trackFormStart('simplified-renewal', true)
    setSrQId(savedSRProgress.currentStep || SR_START)
    setSrAnswers(savedSRProgress.answers || {})
    setSrHistory(savedSRProgress.history || [])
    setScreen(S.SR_FLOW)
  }

  const handleSRAnswer = (questionId, value) => {
    const newAnswers = { ...srAnswers, [questionId]: value }
    setSrAnswers(newAnswers)
    const q = SR_QUESTIONS[questionId]
    const nextId = q.next(value, newAnswers)
    if (nextId === null) {
      // Record completion and clear draft before declaration screen
      trackFormComplete('simplified-renewal')
      try { localStorage.removeItem(SR_SAVE_KEY) } catch {}
      setSavedSRProgress(null)
      const entry = {
        name: 'Simplified Passport Renewal',
        completedAt: Date.now(),
        applicantName: [newAnswers.srFirstName, newAnswers.srSurname].filter(Boolean).join(' '),
      }
      const updated = [entry, ...completedForms]
      setCompletedForms(updated)
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)) } catch {}
      // Generate PDF in background — will be ready by the time user taps "Continue to Form"
      import('./utils/simplifiedRenewalPdfGenerator').then(({ generateSimplifiedRenewalPDF }) =>
        generateSimplifiedRenewalPDF(newAnswers)
          .then(url => setSrPdfUrl(url))
          .catch(err => console.error('[SR] PDF generation failed:', err))
      )
      setScreen(S.SR_DECLARATION)
    } else {
      const newHistory = [...srHistory, questionId]
      setSrHistory(newHistory)
      setSrQId(nextId)
      try {
        const pct = Math.min(99, Math.round((newHistory.length / SR_BASE_COUNT) * 100))
        const snap = { currentStep: nextId, answers: newAnswers, history: newHistory, savedAt: Date.now(), pct }
        localStorage.setItem(SR_SAVE_KEY, JSON.stringify(snap))
        setSavedSRProgress(snap)
      } catch {}
    }
  }

  const handleSRBack = () => {
    if (srHistory.length === 0) { setScreen(S.SR_ELIGIBILITY); return }
    const prevId = srHistory[srHistory.length - 1]
    const newAnswers = { ...srAnswers }
    delete newAnswers[srQId]
    setSrAnswers(newAnswers)
    setSrHistory((h) => h.slice(0, -1))
    setSrQId(prevId)
  }

  // ── Render ──────────────────────────────────────────────────────────────

  switch (screen) {

    case S.WELCOME:
      return (
        <WelcomeScreen
          onStart={() => setScreen(S.APPLICATION_TYPE)}
          onBack={goHome}
        />
      )

    case S.APPLICATION_TYPE:
      return (
        <RoutingScreen
          question="What type of passport application is this?"
          buttons={[
            { label: 'First time applying for a passport',      value: 'first-time'   },
            { label: 'Renewal — I still have my old passport',  value: 'renewal'      },
            { label: 'Replacement — lost, stolen, or damaged',  value: 'replacement'  },
          ]}
          onSelect={(val) => {
            setApplicationType(val)
            setIsFirstTime(val === 'first-time')
            setFormType('regular')
            startSectionA(S.APPLICATION_TYPE)
          }}
          onBack={() => setScreen(S.WELCOME)}
        />
      )

    case S.FIRST_OR_RENEWAL:
      return (
        <RoutingScreen
          question="Have you had a Jamaican passport before?"
          buttons={[
            { label: 'Yes, I have had one before', value: 'yes' },
            { label: 'No, this is my first passport', value: 'no' },
          ]}
          onSelect={(val) =>
            val === 'no'
              ? goFormTypeExplain('regular', 'first-time', S.FIRST_OR_RENEWAL, true)
              : setScreen(S.RENEWAL_AGE)
          }
          onBack={() => setScreen(S.WELCOME)}
        />
      )

    case S.RENEWAL_AGE:
      return (
        <RoutingScreen
          question="When your last passport was issued, were you 18 years old or older?"
          buttons={[
            { label: 'Yes, I was 18 or older', value: 'yes' },
            { label: 'No, I was younger than 18', value: 'no' },
          ]}
          onSelect={(val) =>
            val === 'no'
              ? goFormTypeExplain('regular', 'was-minor', S.RENEWAL_AGE, false)
              : setScreen(S.RENEWAL_NAME)
          }
          onBack={() => setScreen(S.FIRST_OR_RENEWAL)}
        />
      )

    case S.RENEWAL_NAME:
      return (
        <RoutingScreen
          question="Since your last passport, have you changed your name or marital status?"
          buttons={[
            { label: 'Yes, something changed', value: 'yes' },
            { label: 'No, everything is the same', value: 'no' },
          ]}
          onSelect={(val) =>
            val === 'yes'
              ? goFormTypeExplain('regular', 'name-changed', S.RENEWAL_NAME, false)
              : goFormTypeExplain('simplified', 'qualifies-simplified', S.RENEWAL_NAME, false)
          }
          onBack={() => setScreen(S.RENEWAL_AGE)}
        />
      )

    case S.FORM_TYPE_EXPLAIN:
      return (
        <>
          <FormTypeScreen
            qualifiesSimplified={formType === 'simplified'}
            reason={formTypeReason}
            onSelect={(type) => {
              if (type === 'simplified') {
                // SR flow is locked — show coming soon overlay instead of routing
                setShowSRComingSoon(true)
              } else {
                setFormType(type)
                startSectionA(S.FORM_TYPE_EXPLAIN)
              }
            }}
            onBack={() => setScreen(formTypeBackScreen)}
          />
          {showSRComingSoon && (
            <SRComingSoonOverlay
              onContinue={() => {
                setShowSRComingSoon(false)
                setScreen(S.WELCOME)
              }}
            />
          )}
        </>
      )

    case S.SECTION_A:
      return (
        <QuestionScreen
          questionId={currentAQId}
          questions={SECTION_A_QUESTIONS}
          baseCount={SECTION_A_BASE_COUNT}
          onAnswer={handleAAnswer}
          onBack={handleABack}
          onHome={goHome}
          answers={aAnswers}
          overallPct={computeProgress({ screen: S.SECTION_A, currentAQId }).pct}
        />
      )

    case S.SECTION_A_COMPLETE:
      return <SectionACompleteScreen onContinue={handleSectionAComplete} />

    case S.SECTION_B_INTRO:
      return (
        <SectionBIntroScreen
          onContinue={startSectionB}
          onBack={() => setScreen(S.SECTION_A_COMPLETE)}
        />
      )

    case S.SECTION_B:
      return (
        <QuestionScreen
          questionId={currentBQId}
          questions={SECTION_B_QUESTIONS}
          baseCount={SECTION_B_BASE_COUNT}
          onAnswer={handleBAnswer}
          onBack={handleBBack}
          onHome={goHome}
          answers={bAnswers}
          overallPct={computeProgress({ screen: S.SECTION_B, currentBQId }).pct}
        />
      )

    case S.SECTION_B_COMPLETE:
      return <SectionBCompleteScreen onContinue={() => setScreen(S.SECTION_C_ROUTING)} />

    case S.SECTION_C_ROUTING:
      return (
        <RoutingScreen
          question="Is this passport application for someone under 18 years old?"
          buttons={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]}
          onSelect={(val) =>
            val === 'yes'
              ? setScreen(S.PAGE2_SIG_NOTICE)
              : afterSectionC(S.SECTION_C_ROUTING)
          }
          onBack={sectionCRoutingBack}
        />
      )

    case S.PAGE2_SIG_NOTICE:
      return (
        <NoticeScreen
          speechText={PAGE2_SIG_SPEECH}
          title="Important — Do Not Sign at Home"
          lines={PAGE2_SIG_LINES}
          buttonLabel="Got it"
          onContinue={() => setScreen(S.SECTION_C_INTRO)}
          onBack={() => setScreen(S.SECTION_C_ROUTING)}
        />
      )

    case S.SECTION_C_INTRO:
      return (
        <SectionCIntroScreen
          onContinue={startSectionC}
          onBack={() => setScreen(S.PAGE2_SIG_NOTICE)}
        />
      )

    case S.SECTION_C:
      return (
        <QuestionScreen
          questionId={currentCQId}
          questions={SECTION_C_QUESTIONS}
          baseCount={SECTION_C_BASE_COUNT}
          onAnswer={handleCAnswer}
          onBack={handleCBack}
          onHome={goHome}
          answers={cAnswers}
          overallPct={computeProgress({ screen: S.SECTION_C, currentCQId }).pct}
        />
      )

    case S.SECTION_C_SIG_NOTICE:
      return (
        <NoticeScreen
          speechText={C_SIG_SPEECH}
          title="Important — Signature Rules for Section C"
          lines={C_SIG_LINES}
          buttonLabel="Got it, I understand"
          onContinue={() => setScreen(S.SECTION_C_COMPLETE)}
        />
      )

    case S.SECTION_C_COMPLETE:
      return (
        <SectionCCompleteScreen onContinue={() => afterSectionC(S.SECTION_C_COMPLETE)} />
      )

    case S.SECTION_D_INTRO:
      return (
        <SectionDIntroScreen
          onContinue={() => setScreen(S.SECTION_D_STATUS)}
          onBack={() => setScreen(sectionDBack)}
        />
      )

    case S.SECTION_D_STATUS:
      return (
        <RoutingScreen
          question="What is the current status of your passport?"
          buttons={[
            { label: 'I am renewing it — I have it with me', value: 'renewing' },
            { label: 'It is lost',                           value: 'lost'     },
            { label: 'It was stolen',                        value: 'stolen'   },
            { label: 'It is damaged or destroyed',           value: 'damaged'  },
          ]}
          onSelect={(val) => startSectionD(val)}
          onBack={() => setScreen(S.SECTION_D_INTRO)}
        />
      )

    case S.SECTION_D:
      return (
        <QuestionScreen
          questionId={currentDQId}
          questions={SECTION_D_QUESTIONS}
          baseCount={sectionDBaseCount}
          onAnswer={handleDAnswer}
          onBack={handleDBack}
          onHome={goHome}
          answers={dAnswers}
          overallPct={computeProgress({ screen: S.SECTION_D, currentDQId }).pct}
        />
      )

    case S.LOST_STOLEN_NOTICE:
      return (
        <NoticeScreen
          speechText={LOST_STOLEN_SPEECH}
          title="Important — Report Required Before You Submit"
          lines={LOST_STOLEN_LINES}
          buttonLabel="Got it"
          onContinue={() => {
            setCurrentDQId('dWhereLostStolen')
            setScreen(S.SECTION_D)
          }}
        />
      )

    case S.SECTION_D_COMPLETE:
      return (
        <SectionDCompleteScreen
          onContinue={() => goSectionEIntro(S.SECTION_D_COMPLETE)}
        />
      )

    // ── Section E ──────────────────────────────────────────────────────

    case S.SECTION_E_INTRO:
      return (
        <SectionEIntroScreen
          onContinue={() => setScreen(S.SECTION_E_DECLARATION)}
          onBack={() => setScreen(sectionEBack)}
        />
      )

    case S.SECTION_E_DECLARATION:
      return (
        <SectionEDeclarationScreen
          preSelected={ePreSelected}
          onSelect={handleEDeclarationSelect}
          onBack={() => setScreen(S.SECTION_E_INTRO)}
        />
      )

    case S.SECTION_E_PASSPORT:
      return (
        <SectionEPassportNumScreen
          onConfirm={(num) => {
            setEPassportNumber(num)
            setScreen(S.SECTION_E_SIG_NOTICE)
          }}
          onBack={() => setScreen(S.SECTION_E_DECLARATION)}
        />
      )

    case S.SECTION_E_SIG_NOTICE:
      return (
        <NoticeScreen
          speechText={E_SIG_SPEECH}
          title="Important — Signature Must Match Every Time"
          lines={E_SIG_LINES}
          buttonLabel="Got it"
          onContinue={() => setScreen(S.SECTION_E_COMPLETE)}
          onBack={() =>
            ePassportNumber
              ? setScreen(S.SECTION_E_PASSPORT)
              : setScreen(S.SECTION_E_DECLARATION)
          }
        />
      )

    case S.SECTION_E_COMPLETE:
      return (
        <SectionECompleteScreen
          onContinue={() => setScreen(S.SECTION_F_INTRO)}
        />
      )

    // ── Section F ──────────────────────────────────────────────────────

    case S.SECTION_F_INTRO:
      return (
        <SectionFIntroScreen
          onContinue={startSectionF}
          onBack={() => setScreen(S.SECTION_E_COMPLETE)}
        />
      )

    case S.SECTION_F_CONTACT1:
      return (
        <QuestionScreen
          questionId={currentF1QId}
          questions={SECTION_F_C1_QUESTIONS}
          baseCount={SECTION_F_BASE_COUNT}
          onAnswer={handleF1Answer}
          onBack={handleF1Back}
          onHome={goHome}
          answers={f1Answers}
          overallPct={computeProgress({ screen: S.SECTION_F_CONTACT1, currentF1QId }).pct}
        />
      )

    case S.SECTION_F_TRANSITION:
      return (
        <SectionFTransitionScreen
          onContinue={startContact2}
        />
      )

    case S.SECTION_F_CONTACT2:
      return (
        <QuestionScreen
          questionId={currentF2QId}
          questions={SECTION_F_C2_QUESTIONS}
          baseCount={SECTION_F_BASE_COUNT}
          onAnswer={handleF2Answer}
          onBack={handleF2Back}
          onHome={goHome}
          answers={f2Answers}
          overallPct={computeProgress({ screen: S.SECTION_F_CONTACT2, currentF2QId }).pct}
        />
      )

    case S.SECTION_F_COMPLETE:
      return (
        <SectionFCompleteScreen
          onContinue={() => setScreen(S.SECTION_G)}
        />
      )

    // ── Section G ──────────────────────────────────────────────────────

    case S.SECTION_G:
      return (
        <SectionGScreen
          onComplete={() => setScreen(S.FINAL_COMPLETE)}
          onBack={() => setScreen(S.SECTION_F_COMPLETE)}
        />
      )

    case S.FINAL_COMPLETE:
      return (
        <FinalCompleteScreen
          onReview={() => setScreen(S.ANSWERS_SUMMARY)}
          onFormReady={(url) => {
            trackFormComplete('passport')
            const entry = {
              name: 'Jamaica Passport Application',
              completedAt: Date.now(),
              applicantName: [aAnswers.firstName, aAnswers.surname].filter(Boolean).join(' '),
            }
            const updated = [entry, ...completedForms]
            setCompletedForms(updated)
            try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)) } catch {}
            localStorage.removeItem(SAVE_KEY)
            setSavedProgress(null)
            setPdfUrl(url)
            setScreen(S.FORM_READY)
          }}
          allAnswers={{
            aAnswers,
            bAnswers,
            cAnswers,
            dAnswers,
            ePassportNumber,
            isFirstTime,
            passportStatus,
            f1Answers,
            f2Answers,
          }}
        />
      )

    case S.FORM_READY:
      return (
        <FormReadyScreen
          pdfUrl={pdfUrl}
          onBack={() => setScreen(S.FINAL_COMPLETE)}
          onViewHistory={() => { setScreen(S.HOME); setActiveTab('history') }}
          onStartAnother={goHome}
          onHome={goHome}
        />
      )

    case S.ANSWERS_SUMMARY:
      return (
        <AnswersSummaryScreen
          aAnswers={aAnswers}
          bAnswers={bAnswers}
          cAnswers={cAnswers}
          dAnswers={dAnswers}
          ePassportNumber={ePassportNumber}
          f1Answers={f1Answers}
          f2Answers={f2Answers}
          onBack={() => setScreen(S.FINAL_COMPLETE)}
        />
      )

    // ── TRN ───────────────────────────────────────────────────────────

    case S.TRN_WELCOME:
      return (
        <TRNWelcomeScreen
          onStart={() => {
            const profile = loadProfile()
            if (profileHasData(profile)) {
              setPendingFormStart({ type: 'trn' })
              setScreen(S.AUTOFILL_PROMPT)
            } else {
              trackFormStart('trn', false)
              try { localStorage.removeItem(TRN_SAVE_KEY) } catch {}
              setSavedTRNProgress(null)
              setTrnQId(TRN_START)
              setTrnHistory([])
              setTrnAnswers({})
              setScreen(S.TRN_FLOW)
            }
          }}
          onBack={goHome}
          onResume={savedTRNProgress ? handleTRNResume : null}
        />
      )

    case S.TRN_FLOW:
      return (
        <QuestionScreen
          questionId={trnQId}
          questions={TRN_QUESTIONS}
          baseCount={TRN_BASE_COUNT}
          onAnswer={handleTRNAnswer}
          onBack={handleTRNBack}
          onHome={goHome}
          answers={trnAnswers}
        />
      )

    case S.TRN_REVIEW:
      return (
        <TRNReviewScreen
          trnAnswers={trnAnswers}
          onBack={() => setScreen(S.TRN_FLOW)}
          onFormReady={(url) => {
            trackFormComplete('trn')
            // PDF generated — clear saved TRN progress
            try { localStorage.removeItem(TRN_SAVE_KEY) } catch {}
            setSavedTRNProgress(null)
            const entry = {
              name: 'TRN Application',
              completedAt: Date.now(),
              applicantName: [trnAnswers.firstName, trnAnswers.lastName].filter(Boolean).join(' '),
            }
            const updated = [entry, ...completedForms]
            setCompletedForms(updated)
            try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)) } catch {}
            setTrnPdfUrl(url)
            setScreen(S.TRN_FORM_READY)
          }}
        />
      )

    case S.TRN_FORM_READY:
      return (
        <TRNFormReadyScreen
          pdfUrl={trnPdfUrl}
          onBack={() => setScreen(S.TRN_REVIEW)}
          onViewHistory={() => { setScreen(S.HOME); setActiveTab('history') }}
          onStartAnother={goHome}
          onHome={goHome}
        />
      )

    // ── NIS ───────────────────────────────────────────────────────────

    case S.NIS_WELCOME:
      return (
        <NISWelcomeScreen
          onStart={() => {
            const profile = loadProfile()
            if (profileHasData(profile)) {
              setPendingFormStart({ type: 'nis' })
              setScreen(S.AUTOFILL_PROMPT)
            } else {
              trackFormStart('nis', false)
              try { localStorage.removeItem(NIS_SAVE_KEY) } catch {}
              setSavedNISProgress(null)
              setNisQId(NIS_START)
              setNisHistory([])
              setNisAnswers({})
              setScreen(S.NIS_FLOW)
            }
          }}
          onBack={goHome}
          onResume={savedNISProgress ? handleNISResume : null}
        />
      )

    case S.NIS_FLOW:
      return (
        <QuestionScreen
          questionId={nisQId}
          questions={NIS_QUESTIONS}
          baseCount={NIS_BASE_COUNT}
          onAnswer={handleNISAnswer}
          onBack={handleNISBack}
          onHome={goHome}
          answers={nisAnswers}
        />
      )

    case S.NIS_FORM_READY:
      return (
        <NISFormReadyScreen
          pdfUrl={nisPdfUrl}
          onBack={goHome}
          onViewHistory={() => { setScreen(S.HOME); setActiveTab('history') }}
          onStartAnother={goHome}
          onHome={goHome}
        />
      )

    // ── Simplified Adult Renewal ──────────────────────────────────────

    case S.SR_ELIGIBILITY:
      return (
        <SimplifiedRenewalEligibilityScreen
          onEligible={startSRFlow}
          onNotEligible={() => setScreen(S.WELCOME)}
          onBack={() => setScreen(srEligibilityBack)}
        />
      )

    case S.SR_FLOW:
      return (
        <QuestionScreen
          questionId={srQId}
          questions={SR_QUESTIONS}
          baseCount={SR_BASE_COUNT}
          onAnswer={handleSRAnswer}
          onBack={handleSRBack}
          onHome={goHome}
          answers={srAnswers}
        />
      )

    case S.SR_DECLARATION:
      return (
        <NoticeScreen
          title="Before You Print — Sign at the Office"
          speechText={SR_DECLARATION_SPEECH}
          lines={SR_DECLARATION_LINES}
          buttonLabel="Continue to Form"
          onContinue={() => setScreen(S.SR_FORM_READY)}
          onBack={goHome}
        />
      )

    case S.SR_FORM_READY:
      return (
        <SimplifiedRenewalFormReadyScreen
          pdfUrl={srPdfUrl}
          onBack={() => setScreen(S.SR_DECLARATION)}
          onViewHistory={() => { setScreen(S.HOME); setActiveTab('history') }}
          onStartAnother={goHome}
          onHome={goHome}
        />
      )

    // ── Autofill prompt ───────────────────────────────────────────────
    case S.AUTOFILL_PROMPT:
      return (
        <AutofillPrompt
          onUseProfile={() => handleAutofillConfirm(true)}
          onStartFresh={() => handleAutofillConfirm(false)}
          onBack={() => {
            const type = pendingFormStart?.type
            setPendingFormStart(null)
            if (type === 'trn') setScreen(S.TRN_WELCOME)
            else if (type === 'nis') setScreen(S.NIS_WELCOME)
            else if (type === 'simplified-renewal') setScreen(S.HOME)
            else setScreen(S.APPLICATION_TYPE)
          }}
        />
      )

    // ── Home ──────────────────────────────────────────────────────────
    default: {
      const prog = savedProgress ? computeProgress(savedProgress) : null

      // Build in-progress list for HistoryScreen from all three forms' saved progress
      const inProgressForms = [
        ...(savedProgress ? [{
          id: 'passport',
          name: 'Passport Application',
          label: prog.label,
          pct: prog.pct,
          savedAt: savedProgress.savedAt ?? null,
        }] : []),
        ...(savedTRNProgress ? [{
          id: 'trn',
          name: 'TRN Application',
          label: null,
          // Use stored pct if present; fall back to computing from history length
          // so older snaps (saved before pct was added) still show a progress bar.
          pct: savedTRNProgress.pct ?? Math.min(99, Math.round(((savedTRNProgress.history?.length ?? 0) / TRN_BASE_COUNT) * 100)),
          savedAt: savedTRNProgress.savedAt ?? null,
        }] : []),
        ...(savedNISProgress ? [{
          id: 'nis',
          name: 'NIS Registration',
          label: null,
          pct: savedNISProgress.pct ?? Math.min(99, Math.round(((savedNISProgress.history?.length ?? 0) / NIS_BASE_COUNT) * 100)),
          savedAt: savedNISProgress.savedAt ?? null,
        }] : []),
        ...(savedSRProgress ? [{
          id: 'simplified-renewal',
          name: 'Simplified Passport Renewal',
          label: null,
          pct: savedSRProgress.pct ?? Math.min(99, Math.round(((savedSRProgress.history?.length ?? 0) / SR_BASE_COUNT) * 100)),
          savedAt: savedSRProgress.savedAt ?? null,
        }] : []),
      ]

      return (
        <div className="flex flex-col" style={{ minHeight: '100svh' }}>
          <TopNavBar />
          <main className="flex-1 overflow-y-auto bg-white">
            {activeTab === 'home' && (
              <>
                <HeroSection onGetStarted={() => setScreen(S.WELCOME)} />
                {savedProgress && (
                  <WelcomeBackCard
                    progressLabel={prog.label}
                    progressPct={prog.pct}
                    stepNum={prog.stepNum}
                    stepOf={prog.stepOf}
                    savedAtLabel={formatSavedAt(savedProgress.savedAt)}
                    onResume={handleResume}
                    onStartFresh={handleStartFresh}
                  />
                )}
                {savedTRNProgress && (
                  <DraftResumeCard
                    formName="TRN Application"
                    pct={savedTRNProgress.pct ?? null}
                    savedAtLabel={savedTRNProgress.savedAt ? formatSavedAt(savedTRNProgress.savedAt) : null}
                    onResume={handleTRNResume}
                  />
                )}
                {savedNISProgress && (
                  <DraftResumeCard
                    formName="NIS Registration"
                    pct={savedNISProgress.pct ?? null}
                    savedAtLabel={savedNISProgress.savedAt ? formatSavedAt(savedNISProgress.savedAt) : null}
                    onResume={handleNISResume}
                  />
                )}
                {savedSRProgress && (
                  <DraftResumeCard
                    formName="Simplified Passport Renewal"
                    pct={savedSRProgress.pct ?? null}
                    savedAtLabel={savedSRProgress.savedAt ? formatSavedAt(savedSRProgress.savedAt) : null}
                    onResume={handleSRResume}
                  />
                )}
                <FormPicker
                  onSelect={(formId) => {
                    if (formId === 'passport') setScreen(S.WELCOME)
                    else if (formId === 'trn') setScreen(S.TRN_WELCOME)
                    else if (formId === 'nis') setScreen(S.NIS_WELCOME)
                    else if (formId === 'simplified-renewal') {
                      // SR flow locked — FormPicker's comingSoon flag intercepts the tap;
                      // this branch is intentionally unreachable while SR is Coming Soon
                    }
                  }}
                />
                <div className="h-4" />
              </>
            )}
            {activeTab === 'wallet'  && <WalletScreen />}
            {activeTab === 'history' && (
              <HistoryScreen
                completedForms={completedForms}
                inProgressForms={inProgressForms}
                onResume={(id) => {
                  if (id === 'passport') handleResume()
                  else if (id === 'trn') handleTRNResume()
                  else if (id === 'nis') handleNISResume()
                  else if (id === 'simplified-renewal') handleSRResume()
                }}
                onStartForm={() => setActiveTab('home')}
              />
            )}
            {activeTab === 'profile' && <ProfileScreen onClearAll={handleClearAll} />}
          </main>
          <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
          {showOnboarding && <OnboardingModal onDone={handleOnboardingDone} />}
          {/* DEV ONLY — uncomment when calibrating SR PDF overlay */}
          {/* <SRTestButton /> */}
        </div>
      )
    }
  }
}
