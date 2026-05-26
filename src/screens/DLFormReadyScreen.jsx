import { useEffect } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const READY_SPEECH =
  "Your Driver's Licence application form is ready! Please look it over carefully before you print. " +
  "Remember to sign the form after printing, bring your required documents and photos, " +
  "and bring your payment to the licensing office. Good luck!"

const WHAT_TO_BRING = [
  { text: 'Completed application form (this one)',                   always: true  },
  { text: 'Valid National ID or passport',                           always: true  },
  { text: 'Two recent passport-size photos (within 6 months)',       always: true  },
  { text: 'Proof of payment of the licensing fee',                   always: true  },
  { text: 'Certificate of Competence (if required for your class)',  always: false },
  { text: 'TRN card or document showing your TRN',                   always: false },
]

const REMINDERS = [
  'Sign the application form after printing — do not sign before you arrive.',
  'A Certificate of Competence may be required depending on the licence class.',
  'Passport-size photos must be recent (taken within the last 6 months).',
  'Making a false statement on this form is a criminal offence.',
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

export default function DLFormReadyScreen({ pdfUrl, onBack, onViewHistory, onStartAnother, onHome }) {
  const { speak, stopSpeaking } = useSpeech()
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => speak(READY_SPEECH), 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const replay = () => {
    stopSpeaking()
    setTimeout(() => speak(READY_SPEECH), 80)
  }

  const handleDownload = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = 'DL1-Application-Completed.pdf'
    a.click()
    URL.revokeObjectURL(pdfUrl)
    setDownloaded(true)
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
          style={{ background: '#f0fdf4' }}
        >
          <SpeakerIcon />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-5 pt-8 pb-10 overflow-y-auto">

        {/* Success mark */}
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
          Great job. Please review it carefully before you print — you are responsible for making sure all your information is correct.
        </p>

        {/* Download button */}
        <button
          onClick={downloaded ? undefined : handleDownload}
          disabled={!pdfUrl || downloaded}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-md transition-opacity flex items-center justify-center gap-2 mb-4"
          style={{ background: downloaded ? '#6b7280' : pdfUrl ? '#16a34a' : '#9ca3af', cursor: (downloaded || !pdfUrl) ? 'default' : 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {downloaded
              ? <polyline points="20 6 9 17 4 12" />
              : (<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>)
            }
          </svg>
          {downloaded ? 'Downloaded ✓' : pdfUrl ? 'Download / Open PDF' : 'Preparing PDF…'}
        </button>

        {/* Reminders */}
        <div
          className="w-full rounded-2xl px-4 py-4 mb-5"
          style={{ background: '#fffbeb', border: '1.5px solid #fcd34d' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#92400e' }}>Important Reminders</p>
          </div>
          <div className="flex flex-col gap-2">
            {REMINDERS.map((r, i) => (
              <p key={i} className="text-sm leading-relaxed" style={{ color: '#92400e' }}>
                • {r}
              </p>
            ))}
          </div>
        </div>

        {/* Navigation */}
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

        {/* What to bring */}
        <div
          className="w-full rounded-2xl px-5 py-5"
          style={{ background: '#f8fdf9', border: '1.5px solid #bbf7d0' }}
        >
          <p className="text-black font-bold text-sm mb-4">What to bring to the licensing office</p>
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
