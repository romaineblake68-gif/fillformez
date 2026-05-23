import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import { FORM_READY_HEADLINE, FORM_READY_NOTE } from '../utils/messages'

const READY_SPEECH =
  'Your TRN application form is ready! Please look it over carefully before you print. Then bring it to the Tax Administration Jamaica office of your choice with your identification document. You are almost there — good luck!'

const WHAT_TO_BRING = [
  'Completed TRN application form (this one)',
  'Valid photo ID (passport, driver\'s licence, or national ID)',
  'Birth certificate (if no photo ID)',
  'Marriage certificate (if name changed due to marriage)',
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

export default function TRNFormReadyScreen({ pdfUrl, onBack }) {
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
    a.download = 'TRN-Application-Completed.pdf'
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

        {/* Success icon */}
        <div className="flex justify-center mb-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #0d3b1e 100%)' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <polyline points="9 13 11 15 15 11" />
            </svg>
          </div>
        </div>

        <h2 className="text-black font-bold text-2xl text-center leading-snug mb-2">
          {FORM_READY_HEADLINE}
        </h2>
        <p className="text-gray-500 text-sm text-center leading-relaxed mb-7 px-2">
          {FORM_READY_NOTE}
        </p>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-md active:opacity-80 transition-opacity flex items-center justify-center gap-2 mb-7"
          style={{ background: '#16a34a' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download My TRN Application Form
        </button>

        {/* What to bring */}
        <div
          className="w-full rounded-2xl px-5 py-5"
          style={{ background: '#f8fdf9', border: '1.5px solid #bbf7d0' }}
        >
          <p className="text-black font-bold text-sm mb-4">What to bring to the TAJ office</p>
          <div className="flex flex-col gap-3">
            {WHAT_TO_BRING.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: '#16a34a' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed text-gray-800 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
