import {
  SECTION_A_QUESTIONS,
  SECTION_B_QUESTIONS,
  SECTION_C_QUESTIONS,
  SECTION_D_QUESTIONS,
  SECTION_F_C1_QUESTIONS,
  SECTION_F_C2_QUESTIONS,
  SKIP,
} from '../data/passportFlow'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function SectionCard({ title, color, questions, answers }) {
  const pairs = Object.keys(questions)
    .filter((id) => answers[id] !== undefined && answers[id] !== SKIP)
    .map((id) => ({ label: questions[id].text, value: answers[id] }))

  if (pairs.length === 0) return null

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <h3 className="font-bold text-xs uppercase tracking-widest" style={{ color }}>
          {title}
        </h3>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #f3f4f6' }}>
        {pairs.map(({ label, value }, i) => (
          <div
            key={i}
            className={`px-4 py-3 bg-white ${i > 0 ? 'border-t border-gray-50' : ''}`}
          >
            <p className="text-xs text-gray-400 mb-0.5 leading-snug">{label}</p>
            <p className="text-black font-semibold text-sm break-words">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnswersSummaryScreen({
  aAnswers,
  bAnswers,
  cAnswers,
  dAnswers,
  ePassportNumber,
  f1Answers,
  f2Answers,
  onBack,
}) {
  const hasB = Object.keys(bAnswers).some((k) => bAnswers[k] && bAnswers[k] !== SKIP)
  const hasC = Object.keys(cAnswers).some((k) => cAnswers[k] && cAnswers[k] !== SKIP)
  const hasD = Object.keys(dAnswers)
    .filter((k) => k !== 'dPassportStatus')
    .some((k) => dAnswers[k] && dAnswers[k] !== SKIP)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
        >
          <ChevronLeft />
        </button>
        <p className="flex-1 text-sm font-bold text-black text-center">Your Answers</p>
        <div className="w-9 h-9 flex-shrink-0" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-5 pb-12 overflow-y-auto">
        <p className="text-gray-400 text-xs text-center mb-6">
          Everything you entered during your application session
        </p>

        <SectionCard
          title="Section A — Personal Information"
          color="#1a6fe8"
          questions={SECTION_A_QUESTIONS}
          answers={aAnswers}
        />

        {hasB && (
          <SectionCard
            title="Section B — Marriage Information"
            color="#22c55e"
            questions={SECTION_B_QUESTIONS}
            answers={bAnswers}
          />
        )}

        {hasC && (
          <SectionCard
            title="Section C — Parental Consent"
            color="#f97316"
            questions={SECTION_C_QUESTIONS}
            answers={cAnswers}
          />
        )}

        {hasD && (
          <SectionCard
            title="Section D — Most Recent Passport"
            color="#a78bfa"
            questions={SECTION_D_QUESTIONS}
            answers={dAnswers}
          />
        )}

        {ePassportNumber ? (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#0d9488' }} />
              <h3 className="font-bold text-xs uppercase tracking-widest" style={{ color: '#0d9488' }}>
                Section E — Declaration
              </h3>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #f3f4f6' }}>
              <div className="px-4 py-3 bg-white">
                <p className="text-xs text-gray-400 mb-0.5">Passport number (for renewal)</p>
                <p className="text-black font-semibold text-sm tracking-widest">{ePassportNumber}</p>
              </div>
            </div>
          </div>
        ) : null}

        <SectionCard
          title="Section F — Emergency Contact 1"
          color="#e11d48"
          questions={SECTION_F_C1_QUESTIONS}
          answers={f1Answers}
        />

        <SectionCard
          title="Section F — Emergency Contact 2"
          color="#e11d48"
          questions={SECTION_F_C2_QUESTIONS}
          answers={f2Answers}
        />
      </div>
    </div>
  )
}
