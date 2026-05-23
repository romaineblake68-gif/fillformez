import { useState, useEffect, useMemo } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import { GENERATE_BUTTON_LABEL, GENERATING_LABEL } from '../utils/messages'

const COMPLETE_SPEECH =
  'Congratulations! You have completed your entire passport application guide. You now know exactly what to fill in, what to bring, and what to expect at the office. You are ready. Good luck!'

const COLORS = ['#16a34a', '#ffd700', '#ff6b6b', '#4ecdc4', '#22c55e', '#f97316', '#a78bfa']

function useParticles() {
  return useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: 2 + (i / 60) * 96,
        color: COLORS[i % COLORS.length],
        delay: (i % 12) * 0.15,
        duration: 2.5 + (i % 5) * 0.35,
        size: 7 + (i % 6) * 2.5,
        isCircle: i % 3 === 0,
        drift: ((i % 7) - 3) * 35,
      })),
    [],
  )
}

export default function FinalCompleteScreen({ onReview, onFormReady, allAnswers }) {
  const { speak, stopSpeaking } = useSpeech()
  const particles = useParticles()
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)

  // Section C (Parental Consent) only applies to minor applications.
  // guardianSurname is the first required question of Section C — it is only
  // present in cAnswers when the user completed that branch.
  const isMinorApplication = Boolean(allAnswers?.cAnswers?.guardianSurname)

  useEffect(() => {
    const timer = setTimeout(() => speak(COMPLETE_SPEECH), 400)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setGenError(null)
    try {
      const { generatePassportPDF } = await import('../utils/pdfGenerator')
      const url = await generatePassportPDF(allAnswers)
      onFormReady(url)
    } catch (err) {
      console.error('[FillFormEZ] PDF generation error:', err)
      setGenError('Could not generate the form. Please check that the PDF file is in the /public folder and try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleShare = () => {
    const text = encodeURIComponent(
      `I just used FillFormEasy to guide me through my passport application — it is so easy! Try it free: ${window.location.origin}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden relative">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="confetti-particle absolute"
            style={{
              left: `${p.x}%`,
              top: '-20px',
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.isCircle ? '50%' : '3px',
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift': `${p.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10">

        {/* Trophy icon */}
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-xl"
          style={{ background: 'linear-gradient(135deg, #16a34a 0%, #0d3b1e 100%)' }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <h1 className="text-black font-bold text-3xl text-center leading-tight mb-3">
          You're All Done!
        </h1>

        <p className="text-gray-500 text-base text-center leading-relaxed mb-2 px-2">
          You now know exactly what to fill in, what to bring, and what to expect.
        </p>
        <p className="text-gray-500 text-base text-center leading-relaxed mb-8 px-2">
          <strong className="text-black">You are ready. Good luck!</strong>
        </p>

        {/* Pre-submission reminder card */}
        <div
          className="w-full rounded-2xl px-5 py-4 mb-6"
          style={{ background: '#fffbeb', border: '1.5px solid #fcd34d' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="font-bold text-sm" style={{ color: '#92400e' }}>Before you submit your passport form</p>
          </div>
          <div className="flex flex-col gap-3">
            {isMinorApplication && (
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: '#b45309' }}>C</span>
                <p className="text-sm leading-relaxed" style={{ color: '#78350f' }}>
                  Sign the <strong>CONSENT FOR MINOR</strong> section on page 2 before going to the office. Your signature must match the one on the photo ID you are submitting.
                </p>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: '#b45309' }}>E</span>
              <p className="text-sm leading-relaxed" style={{ color: '#78350f' }}>
                Sign the <strong>DECLARATION OF APPLICANT</strong> section on page 2 before going to the office.{' '}
                {isMinorApplication
                  ? 'This signature must be identical to the one at Section C and the one on your photo ID.'
                  : 'This signature must match the one on your photo ID.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full flex flex-col gap-3">

          {/* Generate completed form — primary CTA */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-md active:opacity-80 transition-opacity flex items-center justify-center gap-2"
            style={{ background: generating ? '#6b7280' : '#16a34a' }}
          >
            {generating ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                </svg>
                {GENERATING_LABEL}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <polyline points="9 13 11 15 15 11" />
                </svg>
                {GENERATE_BUTTON_LABEL}
              </>
            )}
          </button>

          {/* Error message */}
          {genError && (
            <div className="w-full rounded-2xl px-4 py-3" style={{ background: '#fef2f2', border: '1.5px solid #fecaca' }}>
              <p className="text-red-600 text-sm leading-relaxed">{genError}</p>
            </div>
          )}

          {/* Review answers */}
          <button
            onClick={onReview}
            className="w-full py-4 rounded-2xl font-bold text-base border-2 active:opacity-80 transition-opacity flex items-center justify-center gap-2"
            style={{ borderColor: '#16a34a', color: '#16a34a', background: '#eef4fd' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Review my answers
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-full py-4 rounded-2xl font-bold text-white text-base active:opacity-80 transition-opacity flex items-center justify-center gap-2"
            style={{ background: '#25D366' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            Share this app
          </button>
        </div>
      </div>
    </div>
  )
}
