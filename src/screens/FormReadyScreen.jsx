import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const READY_SPEECH =
  'Your passport form is ready! Please look it over carefully before you print. Then get it certified by your certifying official and bring it to the PICA office with all your supporting documents. You are almost there — good luck!'

const WHAT_TO_BRING = [
  { text: 'Completed application form (this one)',        always: true  },
  { text: 'Two passport-size photos',                     always: true  },
  { text: 'Birth certificate or proof of citizenship',    always: true  },
  { text: 'Valid photo ID',                               always: true  },
  { text: 'Marriage certificate (if applicable)',         always: false },
  { text: 'Police report (if passport was lost/stolen)',  always: false },
  { text: 'Previous passport (if renewing)',              always: false },
]

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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#16a34a" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export default function FormReadyScreen({ pdfUrl, onBack, onViewHistory, onStartAnother, onHome }) {
  const { speak, stopSpeaking } = useSpeech()

  useEffect(() => {
    const timer = setTimeout(() => speak(READY_SPEECH), 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const replay = () => {
    stopSpeaking()
    setTimeout(() => speak(READY_SPEECH), 80)
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = 'Jamaica-Passport-Application-Completed.pdf'
    a.click()
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
          Your Completed Form
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

      <div className="flex-1 flex flex-col px-5 pt-8 pb-10 overflow-y-auto">

        {/* Big success checkmark */}
        <div className="flex justify-center mb-5">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #0d3b1e 100%)' }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h2 className="text-black font-bold text-2xl text-center leading-snug mb-2">
          Your form is ready!
        </h2>
        <p className="text-gray-500 text-sm text-center leading-relaxed mb-6 px-2">
          Great job. Your form has been completed and is ready to download, print, or review.
        </p>

        {/* Download / Open PDF — same behavior as before */}
        <button
          onClick={handleDownload}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-md active:opacity-80 transition-opacity flex items-center justify-center gap-2 mb-4"
          style={{ background: '#16a34a' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download / Open PDF
        </button>

        {/* Reminder */}
        <div
          className="w-full rounded-2xl px-4 py-3.5 flex items-start gap-3 mb-5"
          style={{ background: '#fffbeb', border: '1.5px solid #fcd34d' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
          <p className="text-sm leading-relaxed" style={{ color: '#92400e' }}>
            Remember to print and sign any required sections before submitting.
          </p>
        </div>

        {/* Navigation actions */}
        <div className="w-full flex flex-col gap-3 mb-8">
          <button
            onClick={onViewHistory}
            className="w-full py-4 rounded-2xl font-bold text-base border-2 flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
            style={{ borderColor: '#0d1b38', color: '#0d1b38', background: 'white' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d1b38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" />
            </svg>
            View History
          </button>

          <button
            onClick={onStartAnother}
            className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
            style={{ background: '#0d1b38', color: 'white' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Start Another Form
          </button>

          <button
            onClick={onHome}
            className="w-full py-2 font-semibold text-sm text-center active:opacity-60 transition-opacity"
            style={{ color: '#6b7280' }}
          >
            Back to Home
          </button>
        </div>

        {/* What to bring checklist */}
        <div
          className="w-full rounded-2xl px-5 py-5"
          style={{ background: '#f8fdf9', border: '1.5px solid #bbf7d0' }}
        >
          <p className="text-black font-bold text-sm mb-4">What to bring to the PICA office</p>
          <div className="flex flex-col gap-3">
            {WHAT_TO_BRING.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: item.always ? '#16a34a' : '#94a3b8' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className={`text-sm leading-relaxed ${item.always ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            Green items are required for everyone. Grey items apply depending on your situation.
          </p>
        </div>
      </div>
    </div>
  )
}
