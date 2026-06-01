import { useState } from 'react'
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

function EditRow({ question, answers, currentValue, onSave, onCancel }) {
  const [text, setText] = useState(currentValue || '')
  const options = question.options || (question.getOptions ? question.getOptions(answers) : null)

  if (question.type === 'yesno') {
    return (
      <div className="flex gap-2 mt-2">
        {['Yes', 'No'].map(opt => (
          <button
            key={opt}
            onClick={() => onSave(opt)}
            className="flex-1 py-2 rounded-xl text-sm font-bold border-2 active:opacity-80"
            style={currentValue === opt
              ? { borderColor: '#16a34a', color: '#16a34a', background: '#f0fdf4' }
              : { borderColor: '#e5e7eb', color: '#374151', background: 'white' }}
          >
            {opt}
          </button>
        ))}
        <button onClick={onCancel} className="w-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 text-base active:opacity-70">✕</button>
      </div>
    )
  }

  if (question.type === 'choice' && options) {
    return (
      <div className="mt-2">
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onSave(opt)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border active:opacity-80"
              style={currentValue === opt
                ? { borderColor: '#16a34a', color: '#16a34a', background: '#f0fdf4' }
                : { borderColor: '#e5e7eb', color: '#374151', background: 'white' }}
            >
              {opt}
            </button>
          ))}
        </div>
        <button onClick={onCancel} className="mt-2 text-xs text-gray-400 underline active:opacity-60">Cancel</button>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold text-black focus:outline-none bg-white"
        style={{ borderColor: '#d1d5db' }}
        onFocus={e => { e.target.style.borderColor = '#16a34a' }}
        onBlur={e => { e.target.style.borderColor = '#d1d5db' }}
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => { if (text.trim()) onSave(text.trim()) }}
          className="flex-1 py-2 rounded-xl text-sm font-bold text-white active:opacity-80"
          style={{ background: '#16a34a' }}
        >
          Save
        </button>
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 active:opacity-80">
          Cancel
        </button>
      </div>
    </div>
  )
}

function SectionCard({ sectionKey, title, color, questions, answers, editState, onEdit, onSaveEdit }) {
  const ids = Object.keys(questions).filter(id => answers[id] !== undefined && answers[id] !== SKIP)
  if (ids.length === 0) return null

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <h3 className="font-bold text-xs uppercase tracking-widest" style={{ color }}>{title}</h3>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #f3f4f6' }}>
        {ids.map((id, i) => {
          const q = questions[id]
          const value = answers[id]
          const isEditing = editState?.sectionKey === sectionKey && editState?.questionId === id
          return (
            <div key={id} className={`px-4 py-3 bg-white ${i > 0 ? 'border-t border-gray-50' : ''}`}>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5 leading-snug">{q.text}</p>
                  {!isEditing && <p className="text-black font-semibold text-sm break-words">{value}</p>}
                </div>
                {!isEditing && (
                  <button
                    onClick={() => onEdit(sectionKey, id)}
                    className="text-xs font-bold flex-shrink-0 pt-4 active:opacity-60"
                    style={{ color: '#1a6fe8' }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditing && (
                <EditRow
                  key={id}
                  question={q}
                  answers={answers}
                  currentValue={value}
                  onSave={v => onSaveEdit(sectionKey, id, v)}
                  onCancel={() => onEdit(null, null)}
                />
              )}
            </div>
          )
        })}
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
  onEditAnswer,
}) {
  const [editState, setEditState] = useState(null)

  const hasB = Object.keys(bAnswers).some(k => bAnswers[k] && bAnswers[k] !== SKIP)
  const hasC = Object.keys(cAnswers).some(k => cAnswers[k] && cAnswers[k] !== SKIP)
  const hasD = Object.keys(dAnswers)
    .filter(k => k !== 'dPassportStatus')
    .some(k => dAnswers[k] && dAnswers[k] !== SKIP)

  const handleEdit = (sectionKey, questionId) => {
    setEditState(sectionKey ? { sectionKey, questionId } : null)
  }

  const handleSaveEdit = (sectionKey, questionId, value) => {
    onEditAnswer?.(sectionKey, questionId, value)
    setEditState(null)
  }

  const cardProps = { editState, onEdit: handleEdit, onSaveEdit: handleSaveEdit }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={onBack} aria-label="Go back" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0">
          <ChevronLeft />
        </button>
        <p className="flex-1 text-sm font-bold text-black text-center">Your Answers</p>
        <div className="w-9 h-9 flex-shrink-0" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-5 pb-12 overflow-y-auto">
        <p className="text-gray-400 text-xs text-center mb-6">
          Tap <strong className="text-gray-500">Edit</strong> on any answer to change it
        </p>

        <SectionCard sectionKey="a" title="Section A — Personal Information" color="#1a6fe8"
          questions={SECTION_A_QUESTIONS} answers={aAnswers} {...cardProps} />

        {hasB && (
          <SectionCard sectionKey="b" title="Section B — Marriage Information" color="#22c55e"
            questions={SECTION_B_QUESTIONS} answers={bAnswers} {...cardProps} />
        )}

        {hasC && (
          <SectionCard sectionKey="c" title="Section C — Parental Consent" color="#f97316"
            questions={SECTION_C_QUESTIONS} answers={cAnswers} {...cardProps} />
        )}

        {hasD && (
          <SectionCard sectionKey="d" title="Section D — Most Recent Passport" color="#a78bfa"
            questions={SECTION_D_QUESTIONS} answers={dAnswers} {...cardProps} />
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

        <SectionCard sectionKey="f1" title="Section F — Emergency Contact 1" color="#e11d48"
          questions={SECTION_F_C1_QUESTIONS} answers={f1Answers} {...cardProps} />

        <SectionCard sectionKey="f2" title="Section F — Emergency Contact 2" color="#e11d48"
          questions={SECTION_F_C2_QUESTIONS} answers={f2Answers} {...cardProps} />
      </div>
    </div>
  )
}
