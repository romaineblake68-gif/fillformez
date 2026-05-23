import { useState, useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const G_COLOR = '#4f46e5'
const G_BG = '#ede9fe'
const G_BORDER = '#c4b5fd'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#1a6fe8" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#1a6fe8" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#f97316" opacity="0.15" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ── Tip icons ──────────────────────────────────────────────────────────────────

function Icon1() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={G_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <rect x="8.5" y="1" width="7" height="3.5" rx="1" />
    </svg>
  )
}

function Icon2() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={G_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function Icon3() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={G_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function Icon4() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={G_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function Icon5() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={G_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  )
}

function Icon6() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={G_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function Icon7() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={G_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

const TIP_ICONS = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7]

// ── Data ───────────────────────────────────────────────────────────────────────

const INTRO_SPEECH =
  'This is the last section. Section G is not filled out by you — it is completed by a certifying official. I am going to explain exactly what you need to know so you are fully prepared.'

const APPROVED_POSITIONS = [
  'Justice of the Peace', 'Attorney at Law', 'Medical Practitioner',
  'Dental Surgeon', 'Police Officer of Gazetted Rank', 'Bank Manager',
  'Credit Union Manager', 'Marriage Officer', 'Member of Parliament',
  'High Court Judge', 'Resident Magistrate', 'Consular Officer',
  'Parish Councillor', 'Commissioner of Oaths', 'Notary Public',
  'Clerk of Courts', 'Army Officer (Major rank or above)', 'Veterinarian',
  'Passport Officer', 'Principal of a Primary, Secondary or Tertiary Educational Institution',
]

const TIPS = [
  {
    id: 1,
    title: 'Who Can Be Your Certifying Official?',
    speech: 'Your certifying official must be a Jamaican citizen who is not a family member, and who has known you personally for at least 12 months. They must hold one of these approved positions — Justice of the Peace, Attorney at Law, Medical Practitioner, Dental Surgeon, Police Officer of Gazetted Rank, Bank Manager, Credit Union Manager, Marriage Officer, Member of Parliament, High Court Judge, Resident Magistrate, Consular Officer, Parish Councillor, Commissioner of Oaths, Notary Public, Clerk of Courts, Army Officer of Major rank or above, Veterinarian, Passport Officer, or Principal of a Primary, Secondary or Tertiary Educational Institution.',
    intro: 'Must be a Jamaican citizen, not a family member, who has known you personally for at least 12 months — and must hold one of these approved positions:',
    positions: true,
  },
  {
    id: 2,
    title: 'What the Certifying Official Must Do',
    speech: 'The certifying official must fill out every single field in Section G. If anything is left blank your application will be rejected. If they make a mistake they must strike through it, write the correct information, and sign beside the correction. No correction fluid and no erasing — just strike it out and fix it.',
    intro: 'The certifying official must fill out every single field in Section G. If anything is left blank, your application will be rejected.',
    note: 'If they make a mistake: strike through it, write the correct information, and sign beside the correction. No correction fluid — no erasing.',
  },
  {
    id: 3,
    title: 'Signing the Photograph',
    speech: 'The same certifying official must also sign the back of one of your passport photos. On the back of the photo they must write exactly this — I certify that this is a true photograph of — then your full name — then the date of certification. Then they sign it.',
    intro: 'The same certifying official must also sign the back of one of your passport photos. On the back they must write:',
    verbatim: '"I certify that this is a true photograph of [your full name]"\n[date of certification]\n[their signature]',
  },
  {
    id: 4,
    title: 'For Child Applications',
    speech: 'Important — if this is a child passport application, the certifying official must have known the parent or legal guardian for at least 12 months — not the child. The certifying official must write the parent or legal guardian name in Section G. The child name should never appear in Section G.',
    intro: 'If this is a child passport application, the certifying official must have known the parent or legal guardian for at least 12 months — not the child.',
    note: "The parent or legal guardian name goes in Section G. The child's name should never appear in Section G.",
  },
  {
    id: 5,
    title: 'Certification Has an Expiry',
    speech: 'Once your form and photos are certified you have 6 months to submit your application. After 6 months the certification expires and you will need to get it done again. So do not get it certified too early and then wait too long.',
    intro: 'Once your form and photos are certified, you have 6 months to submit your application.',
    note: 'After 6 months the certification expires and you will need to get it done again. Do not get it certified too early and then wait too long.',
  },
  {
    id: 6,
    title: 'No Fee for Certification in Jamaica',
    speech: 'No fee should be paid for certifying your application inside Jamaica. Certification is completely free. Do not pay anyone to certify your form.',
    intro: 'No fee should be paid for certifying your application inside Jamaica. Certification is completely free.',
    freeHighlight: true,
    note: 'Do not pay anyone to certify your form.',
  },
  {
    id: 7,
    title: 'Final Check — Before You Leave',
    speech: 'Before you leave your certifying official, check Section G yourself. Make sure your name is spelled correctly, all your information is accurate, every field is filled in, the official has signed and dated everything, and their stamp or seal is on there if they have one. It is much easier to fix something before you submit than after.',
    intro: 'Before you leave your certifying official, check Section G yourself. Make sure:',
    checklist: [
      'Your name is spelled correctly',
      'All your information is accurate',
      'Every field is filled in',
      'The official has signed and dated everything',
      'Their stamp or seal is on there if they have one',
    ],
    note: 'It is much easier to fix something before you submit than after.',
  },
]

// ── Main component ─────────────────────────────────────────────────────────────

export default function SectionGScreen({ onComplete, onBack }) {
  const [step, setStep] = useState(0)
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const text = step === 0 ? INTRO_SPEECH : TIPS[step - 1].speech
    const timer = setTimeout(() => speak(text), 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [step])

  const replay = () => {
    stopSpeaking()
    const text = step === 0 ? INTRO_SPEECH : TIPS[step - 1].speech
    setTimeout(() => speak(text), 80)
  }

  const goNext = () => {
    if (step < 7) setStep((s) => s + 1)
    else onComplete()
  }

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1)
    else onBack()
  }

  // ── Intro screen ─────────────────────────────────────────────────────────

  if (step === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <button
            onClick={goBack}
            aria-label="Go back"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
          >
            <ChevronLeft />
          </button>
          <p className="flex-1 text-xs font-semibold text-gray-400 text-center uppercase tracking-wide">
            Passport Application
          </p>
          <button
            onClick={replay}
            aria-label="Replay message"
            className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
            style={{ background: '#eef4fd' }}
          >
            <SpeakerIcon />
          </button>
        </div>

        <div className="flex-1 flex flex-col px-5 pt-8 pb-8 overflow-y-auto">
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: G_BG }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={G_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: G_BG, color: G_COLOR }}
            >
              Section G
            </span>
          </div>

          <h2 className="text-black font-bold text-2xl text-center leading-snug mb-5">
            Official Certification
          </h2>

          <div
            className="w-full rounded-2xl px-5 py-5 mb-4"
            style={{ background: G_BG, border: `1.5px solid ${G_BORDER}` }}
          >
            <p className="text-gray-800 text-base leading-relaxed">
              This section is <strong className="text-black">not filled out by you</strong> — it is completed by a certifying official. I am going to explain exactly what you need to know so you are fully prepared.
            </p>
          </div>

          <div
            className="w-full rounded-2xl px-5 py-4 mb-8 flex items-start gap-3"
            style={{ background: '#fff7ed', border: '1.5px solid #fed7aa' }}
          >
            <WarningIcon />
            <p className="text-gray-700 text-sm leading-relaxed">
              There are <strong className="text-black">7 important things</strong> to know about Section G. Read each one carefully.
            </p>
          </div>

          <button
            onClick={goNext}
            className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm active:opacity-80 transition-opacity"
            style={{ background: G_COLOR }}
          >
            Let's begin →
          </button>
        </div>
      </div>
    )
  }

  // ── Tip screen ───────────────────────────────────────────────────────────

  const tip = TIPS[step - 1]
  const TipIcon = TIP_ICONS[step - 1]
  const progressPct = (step / 7) * 100

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button
          onClick={goBack}
          aria-label="Go back"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
        >
          <ChevronLeft />
        </button>
        <p className="flex-1 text-xs font-semibold text-gray-400 text-center uppercase tracking-wide truncate px-1">
          Section G — Official Certification
        </p>
        <button
          onClick={replay}
          aria-label="Replay message"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 active:opacity-70"
          style={{ background: '#eef4fd' }}
        >
          <SpeakerIcon />
        </button>
      </div>

      <div className="px-4 pt-3 pb-2 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Tip {step} of 7</span>
          <span className="text-xs font-bold" style={{ color: G_COLOR }}>{Math.round(progressPct)}% complete</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: G_COLOR }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 pt-5 pb-8 overflow-y-auto">

        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: G_BG }}
          >
            <TipIcon />
          </div>
        </div>

        <h2 className="text-black font-bold text-xl text-center leading-snug mb-4">
          {tip.title}
        </h2>

        <div
          className="w-full rounded-2xl px-5 py-4 mb-3"
          style={{ background: G_BG, border: `1.5px solid ${G_BORDER}` }}
        >
          <p className="text-gray-800 text-sm leading-relaxed">{tip.intro}</p>
        </div>

        {/* Approved positions pill list (tip 1) */}
        {tip.positions && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {APPROVED_POSITIONS.map((pos) => (
              <span
                key={pos}
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: G_BG, color: G_COLOR }}
              >
                {pos}
              </span>
            ))}
          </div>
        )}

        {/* Verbatim template box (tip 3) */}
        {tip.verbatim && (
          <div
            className="w-full rounded-2xl px-5 py-4 mb-3"
            style={{ background: '#fafafa', border: `2px dashed ${G_BORDER}` }}
          >
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: G_COLOR }}>
              Write on the back of the photo
            </p>
            <p className="text-gray-800 text-sm leading-relaxed font-medium whitespace-pre-line">
              {tip.verbatim}
            </p>
          </div>
        )}

        {/* Checklist (tip 7) */}
        {tip.checklist && (
          <div className="mb-3">
            {tip.checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3 mb-2.5">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: G_COLOR }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        )}

        {/* Free highlight (tip 6) */}
        {tip.freeHighlight && (
          <div
            className="w-full rounded-2xl px-5 py-3 mb-3 flex items-center justify-center gap-2"
            style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <p className="text-green-700 font-bold text-base">Certification is FREE in Jamaica</p>
          </div>
        )}

        {/* Amber callout note */}
        {tip.note && (
          <div
            className="w-full rounded-2xl px-5 py-4 mb-4 flex items-start gap-3"
            style={{ background: '#fff7ed', border: '1.5px solid #fed7aa' }}
          >
            <WarningIcon />
            <p className="text-gray-700 text-sm leading-relaxed">{tip.note}</p>
          </div>
        )}

        <button
          onClick={goNext}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm active:opacity-80 transition-opacity"
          style={{ background: G_COLOR }}
        >
          {step < 7 ? 'Got it →' : 'Finish →'}
        </button>
      </div>
    </div>
  )
}
