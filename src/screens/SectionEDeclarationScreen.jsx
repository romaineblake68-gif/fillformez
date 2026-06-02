import { useState, useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const DECLARATIONS = [
  {
    type: 'first-time',
    text: 'I have never held or applied for a Jamaican passport before',
  },
  {
    type: 'renewing',
    text: 'I have had a passport before and I am submitting it with this application',
  },
  {
    type: 'lost-stolen-damaged',
    text: 'My passport is lost, stolen or damaged and I have already made a report',
  },
]

function buildSpeech(preSelected) {
  const decl = DECLARATIONS.find(d => d.type === preSelected)
  if (!decl) return 'Please review the declarations and select the one that applies to you.'
  return `Based on what you told us, we have selected this declaration for you — ${decl.text}. Is this correct?`
}

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

function OptionSpeakerIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function SectionEDeclarationScreen({ preSelected, onSelect, onBack }) {
  const [selected, setSelected] = useState(preSelected)
  const { speak, stopSpeaking } = useSpeech()
  const speech = buildSpeech(preSelected)

  useEffect(() => {
    const timer = setTimeout(() => speak(speech), 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const replay = () => {
    stopSpeaking()
    setTimeout(() => speak(speech), 80)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:bg-gray-200 flex-shrink-0"
        >
          <ChevronLeft />
        </button>
        <p className="flex-1 text-xs font-semibold text-gray-400 text-center uppercase tracking-wide">
          Section E — Declaration
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

      {/* Body */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-8 overflow-y-auto">

        <h2 className="text-black font-bold text-xl text-center leading-snug mb-2">
          Your Declaration
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6 px-2 leading-relaxed">
          The highlighted option matches your answers. Tap a different one if needed.
        </p>

        {/* Declaration cards */}
        <div className="flex flex-col gap-3 mb-8">
          {DECLARATIONS.map((decl) => {
            const isSelected = selected === decl.type
            return (
              <div key={decl.type} className="relative">
                <button
                  onClick={() => setSelected(decl.type)}
                  className="w-full text-left rounded-2xl px-5 py-5 transition-all active:scale-[0.98] border-2"
                  style={{
                    background: isSelected ? '#1a6fe8' : '#ffffff',
                    borderColor: isSelected ? '#1a6fe8' : '#e5e7eb',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Selection indicator */}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all"
                      style={{
                        background: isSelected ? 'rgba(255,255,255,0.25)' : 'transparent',
                        borderColor: isSelected ? 'white' : '#d1d5db',
                      }}
                    >
                      {isSelected && <CheckIcon />}
                    </div>

                    <p
                      className="text-base font-semibold leading-snug pr-8"
                      style={{ color: isSelected ? 'white' : '#111827' }}
                    >
                      {decl.text}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => speak(decl.text)}
                  aria-label={`Read declaration aloud`}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full active:opacity-60 transition-opacity"
                  style={{ background: '#0d1b38' }}
                >
                  <OptionSpeakerIcon />
                </button>
              </div>
            )
          })}
        </div>

        {/* Confirm button */}
        <button
          onClick={() => onSelect(selected)}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm active:opacity-80 transition-opacity"
          style={{ background: '#1a6fe8' }}
        >
          Confirm my declaration →
        </button>
      </div>
    </div>
  )
}
