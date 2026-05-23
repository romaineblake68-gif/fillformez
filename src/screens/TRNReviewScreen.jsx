import { useState } from 'react'
import { TRN_QUESTIONS, SKIP } from '../data/trnFlow'
import { generateTRNPDF } from '../utils/trnPdfGenerator'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

const SECTIONS = [
  { key: 'TRN Application',   color: '#1a6fe8' },
  { key: 'Your Name',         color: '#22c55e' },
  { key: 'Name at Birth',     color: '#f97316' },
  { key: 'Personal Details',  color: '#a78bfa' },
  { key: 'Date of Birth',     color: '#0d9488' },
  { key: 'Place of Birth',    color: '#e11d48' },
  { key: 'Nationality',       color: '#6366f1' },
  { key: 'Phone Numbers',     color: '#f59e0b' },
  { key: 'Email Address',     color: '#10b981' },
  { key: 'Preferred Contact', color: '#8b5cf6' },
  { key: 'Home Address',      color: '#ef4444' },
  { key: 'Mailing Address',   color: '#06b6d4' },
  { key: "Mother's Name",     color: '#84cc16' },
  { key: "Spouse's Name",     color: '#f43f5e' },
  { key: 'Occupation',        color: '#14b8a6' },
  { key: 'NIS Number',        color: '#6d28d9' },
  { key: 'Identification',    color: '#dc2626' },
  { key: 'Business or Trade', color: '#d97706' },
  { key: 'Tax Office',        color: '#0284c7' },
  { key: 'On Behalf Of',      color: '#7c3aed' },
]

function SectionCard({ title, color, entries }) {
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
        {entries.map(({ label, value }, i) => (
          <div key={i} className={`px-4 py-3 bg-white ${i > 0 ? 'border-t border-gray-50' : ''}`}>
            <p className="text-xs text-gray-400 mb-0.5 leading-snug">{label}</p>
            <p className="text-black font-semibold text-sm break-words">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TRNReviewScreen({ trnAnswers, onBack, onFormReady }) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const url = await generateTRNPDF(trnAnswers)
      onFormReady(url)
    } catch {
      setError('Something went wrong generating your form. Please try again.')
      setGenerating(false)
    }
  }

  // Build section entries from answers (skip yesno routing questions + SKIP values)
  const sectionEntries = {}
  SECTIONS.forEach(({ key }) => { sectionEntries[key] = [] })

  Object.keys(TRN_QUESTIONS).forEach((id) => {
    const q = TRN_QUESTIONS[id]
    const val = trnAnswers[id]
    if (!val || val === SKIP) return
    if (q.type === 'yesno') return
    const sec = q.section || 'TRN Application'
    if (sectionEntries[sec]) {
      sectionEntries[sec].push({ label: q.text, value: String(val) })
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
        <p className="flex-1 text-sm font-bold text-black text-center">Review Your Answers</p>
        <div className="w-9 h-9 flex-shrink-0" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-5 pb-40 overflow-y-auto">
        <p className="text-gray-400 text-xs text-center mb-6">
          Check your answers before generating the form
        </p>

        {SECTIONS.map(({ key, color }) => (
          <SectionCard
            key={key}
            title={key}
            color={color}
            entries={sectionEntries[key] || []}
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
          style={{ background: '#1a6fe8' }}
        >
          {generating ? 'Generating your form…' : 'Confirm and Generate Form'}
        </button>
        <button
          onClick={onBack}
          disabled={generating}
          className="w-full py-3 rounded-2xl font-semibold text-base active:opacity-70 transition-opacity disabled:opacity-50"
          style={{ color: '#1a6fe8', background: '#eef4fd' }}
        >
          Go Back and Edit
        </button>
      </div>
    </div>
  )
}
