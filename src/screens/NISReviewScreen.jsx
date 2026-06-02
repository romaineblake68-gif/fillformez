import { useState } from 'react'
import { NIS_QUESTIONS, SKIP } from '../data/nisFlow'
import { generateNISPDF } from '../utils/nisPdfGenerator'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function EditRow({ question, nisAnswers, currentValue, onSave, onCancel }) {
  const [text, setText] = useState(currentValue || '')
  const options = question.options || (question.getOptions ? question.getOptions(nisAnswers) : null)

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

const SECTIONS = [
  { key: 'Personal Information', color: '#1a6fe8' },
  { key: 'Your Name',            color: '#22c55e' },
  { key: 'Personal Details',     color: '#a78bfa' },
  { key: 'Date of Birth',        color: '#0d9488' },
  { key: 'Place of Birth',       color: '#e11d48' },
  { key: 'Previous IDs',         color: '#6366f1' },
  { key: 'Marital Status',       color: '#f97316' },
  { key: "Spouse's Details",     color: '#f59e0b' },
  { key: 'Marriage Details',     color: '#10b981' },
  { key: 'Home Address',         color: '#ef4444' },
  { key: 'Mailing Address',      color: '#06b6d4' },
  { key: 'Contact Details',      color: '#8b5cf6' },
  { key: "Parents' Details",     color: '#84cc16' },
  { key: 'Employment',           color: '#14b8a6' },
]

function SectionCard({ title, color, entries, editState, onEdit, onSaveEdit, nisAnswers }) {
  if (entries.length === 0) return null
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <h3 className="font-bold text-xs uppercase tracking-widest" style={{ color }}>
          {title}
        </h3>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #f3f4f6' }}>
        {entries.map(({ label, value, questionId }, i) => {
          const q = questionId ? NIS_QUESTIONS[questionId] : null
          const isEditing = editState?.questionId === questionId
          return (
            <div key={questionId || i} className={`px-4 py-3 bg-white ${i > 0 ? 'border-t border-gray-50' : ''}`}>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-gray-600 mb-0.5 leading-snug">{label}</p>
                  {!isEditing && <p className="text-black font-semibold text-sm break-words">{value}</p>}
                </div>
                {!isEditing && q && (
                  <button
                    onClick={() => onEdit(questionId)}
                    className="text-xs font-bold flex-shrink-0 pt-4 active:opacity-60"
                    style={{ color: '#1a6fe8' }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditing && q && (
                <EditRow
                  question={q}
                  nisAnswers={nisAnswers}
                  currentValue={value}
                  onSave={v => onSaveEdit(questionId, v)}
                  onCancel={() => onEdit(null)}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function NISReviewScreen({ nisAnswers, onBack, onFormReady, onEditAnswer }) {
  const [editState, setEditState] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const url = await generateNISPDF(nisAnswers)
      onFormReady(url)
    } catch {
      setError('Something went wrong generating your form. Please try again.')
      setGenerating(false)
    }
  }

  const handleEdit = (questionId) => setEditState(questionId ? { questionId } : null)

  const handleSaveEdit = (questionId, value) => {
    onEditAnswer?.(questionId, value)
    setEditState(null)
  }

  // Build section entries — skip yesno routing questions and SKIP values
  const sectionEntries = {}
  SECTIONS.forEach(({ key }) => { sectionEntries[key] = [] })

  Object.keys(NIS_QUESTIONS).forEach((id) => {
    const q = NIS_QUESTIONS[id]
    const val = nisAnswers[id]
    if (!val || val === SKIP) return
    if (q.type === 'yesno') return
    const sec = q.section || 'Personal Information'
    if (sectionEntries[sec]) {
      sectionEntries[sec].push({ label: q.text, value: String(val), questionId: id })
    }
  })

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
      <div className="flex-1 px-4 pt-5 pb-40 overflow-y-auto">
        <p className="text-gray-400 text-xs text-center mb-6">
          Tap <strong className="text-gray-500">Edit</strong> on any answer to change it
        </p>

        {SECTIONS.map(({ key, color }) => (
          <SectionCard
            key={key}
            title={key}
            color={color}
            entries={sectionEntries[key] || []}
            editState={editState}
            onEdit={handleEdit}
            onSaveEdit={handleSaveEdit}
            nisAnswers={nisAnswers}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-md active:opacity-80 transition-opacity disabled:opacity-50"
          style={{ background: '#16a34a' }}
        >
          {generating ? 'Generating your form…' : 'Confirm and Generate Form'}
        </button>
        <button
          onClick={onBack}
          disabled={generating}
          className="w-full py-3 rounded-2xl font-semibold text-base active:opacity-70 transition-opacity disabled:opacity-50"
          style={{ color: '#16a34a', background: '#f0fdf4' }}
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
