import { useEffect, useMemo } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const COMPLETE_MSG =
  'You have completed the fifth section! You are almost there. Just two more sections to go.'

const COLORS = ['#1a6fe8', '#ffd700', '#ff6b6b', '#4ecdc4', '#22c55e', '#f97316', '#a78bfa']

function useParticles() {
  return useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        x: 2 + (i / 45) * 96,
        color: COLORS[i % COLORS.length],
        delay: (i % 9) * 0.2,
        duration: 2.2 + (i % 5) * 0.35,
        size: 6 + (i % 6) * 2.5,
        isCircle: i % 3 === 0,
        drift: ((i % 7) - 3) * 30,
      })),
    [],
  )
}

export default function SectionECompleteScreen({ onContinue }) {
  const { speak, stopSpeaking } = useSpeech()
  const particles = useParticles()

  useEffect(() => {
    const timer = setTimeout(() => speak(COMPLETE_MSG), 400)
    return () => {
      clearTimeout(timer)
      stopSpeaking()
    }
  }, [])

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

        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mb-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-black font-bold text-3xl text-center leading-tight mb-3">
          Section E Complete!
        </h1>

        <p className="text-gray-500 text-lg text-center leading-relaxed mb-2 px-2">
          You are almost there.
        </p>
        <p className="text-gray-500 text-lg text-center leading-relaxed mb-10 px-2">
          <strong className="text-black">Just two more sections to go!</strong>
        </p>

        {/* Summary badge */}
        <div
          className="w-full rounded-2xl px-5 py-4 mb-8 flex items-center gap-3"
          style={{ background: '#f0fdfa' }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#0d9488' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <p className="text-black font-bold text-sm">Section E — Declaration of Applicant</p>
            <p className="text-gray-400 text-xs mt-0.5">Declaration confirmed ✓</p>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-md active:opacity-80 transition-opacity"
          style={{ background: '#1a6fe8' }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
