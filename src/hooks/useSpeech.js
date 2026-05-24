import { useRef, useState, useCallback } from 'react'
import { isMuted } from '../utils/muteState'

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export function useSpeech() {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  // Use a ref for callbacks to avoid stale closure issues mid-recognition
  const callbacksRef = useRef({ onResult: null, onError: null })

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    if (isMuted()) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.97
    utterance.pitch = 1
    utterance.lang = 'en-US'
    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel()
  }, [])

  const startListening = useCallback((onResult, onError) => {
    if (!SpeechRecognition) {
      onError?.('not-supported')
      return
    }

    // Store callbacks in ref so recognition handlers always see latest version
    callbacksRef.current = { onResult, onError }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)

    recognition.onend = () => setIsListening(false)

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim()
      callbacksRef.current.onResult?.(transcript)
    }

    recognition.onerror = (e) => {
      setIsListening(false)
      callbacksRef.current.onError?.(e.error)
    }

    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch (_) {
      // ignore if already stopped
    }
    setIsListening(false)
  }, [])

  const isSpeechRecognitionSupported = Boolean(SpeechRecognition)

  return {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    isListening,
    isSpeechRecognitionSupported,
  }
}
