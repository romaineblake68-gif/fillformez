import { useState } from 'react'

const SLIDES = [
  {
    heading: 'FillFormEZ guides you',
    body: 'We walk you through forms one question at a time. You can speak your answer or type it — whichever feels easier for you.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    heading: 'Your information stays on your phone',
    body: 'FillFormEZ never sends your information anywhere. Nothing leaves your phone unless you choose to share or print it.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    heading: 'You check before anything is printed',
    body: 'When you finish, you review all your answers first. FillFormEZ does not submit your form online — you take the printed form to the office yourself.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
]

export const ONBOARDING_KEY = 'fillformeez_onboarded'

export default function OnboardingModal({ onDone }) {
  const [slide, setSlide] = useState(0)
  const isLast = slide === SLIDES.length - 1
  const current = SLIDES[slide]

  const advance = () => {
    if (isLast) {
      onDone()
    } else {
      setSlide(s => s + 1)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: 'rgba(13,27,56,0.65)' }}
    >
      <div
        className="w-full rounded-t-3xl px-6 pt-6 pb-10 bg-white"
        style={{ maxWidth: 430 }}
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-7">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 28 : 8,
                background: i === slide ? '#16a34a' : '#d1d5db',
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm"
            style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}
          >
            {current.icon}
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-bold text-xl text-center mb-3 leading-snug" style={{ color: '#0d1b38' }}>
          {current.heading}
        </h2>

        {/* Body */}
        <p className="text-base text-gray-500 text-center leading-relaxed mb-8">
          {current.body}
        </p>

        {/* Action button */}
        <button
          onClick={advance}
          className="w-full py-5 rounded-2xl font-bold text-white text-lg active:opacity-80 transition-opacity"
          style={{ background: '#16a34a' }}
        >
          {isLast ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  )
}
