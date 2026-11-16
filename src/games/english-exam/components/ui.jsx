import { useEffect, useState } from 'react'
import { speak, speakEs } from '../utils/speech.js'
import { useSettings } from '../utils/progress.js'

// English text, shown in CAPITALS by default (1st graders read "imprenta mayúscula").
export function En({ children, className = '' }) {
  const { settings } = useSettings()
  return <span className={`${settings.uppercase ? 'uppercase' : ''} ${className}`}>{children}</span>
}

// The owl teacher asking the question, with replay / slow / Spanish-help buttons.
export function Prompt({ say, display, es, autoPlay = true }) {
  const [showEs, setShowEs] = useState(false)

  useEffect(() => {
    if (!autoPlay || !say) return
    const t = setTimeout(() => speak(say), 300)
    return () => clearTimeout(t)
  }, [say, autoPlay])

  const helpEs = () => {
    setShowEs(true)
    speakEs(es)
  }

  return (
    <div className="w-full">
      <div className="flex items-start gap-3">
        <div className="text-5xl sm:text-6xl select-none" aria-hidden="true">
          🦉
        </div>
        <div className="relative flex-1 bg-white border-4 border-indigo-300 rounded-3xl px-5 py-3 shadow-sm">
          <div className="absolute -left-3 top-5 w-4 h-4 bg-white border-l-4 border-b-4 border-indigo-300 rotate-45" />
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-800 font-nunito leading-tight">
            {display ?? <En>{say}</En>}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        <SmallButton onClick={() => speak(say)} title="Escuchar otra vez">
          🔊 Escuchar
        </SmallButton>
        <SmallButton onClick={() => speak(say, { slow: true })} title="Escuchar despacio">
          🐢 Despacio
        </SmallButton>
        {es && (
          <SmallButton onClick={helpEs} title="Ayuda en castellano">
            💬 Ayuda
          </SmallButton>
        )}
      </div>
      {showEs && es && (
        <p className="mt-2 text-center text-base sm:text-lg text-gray-600 font-nunito bg-sky-50 rounded-xl px-3 py-2">
          {es}
        </p>
      )}
    </div>
  )
}

export function SmallButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`bg-white border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 font-bold font-nunito rounded-full px-4 py-2 text-base transition-colors disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function BigButton({ children, className = '', color = 'from-indigo-500 to-indigo-600', ...props }) {
  return (
    <button
      type="button"
      className={`bg-gradient-to-r ${color} text-white font-extrabold font-nunito rounded-2xl px-8 py-4 text-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:hover:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function MicButton({ listening, onClick, disabled }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={listening ? 'Escuchando' : 'Hablar'}
        className={`relative w-28 h-28 rounded-full text-6xl shadow-xl transition-all duration-200 disabled:opacity-40 ${
          listening ? 'bg-red-500 scale-110' : 'bg-gradient-to-br from-rose-400 to-red-500 hover:scale-105 active:scale-95'
        }`}
      >
        {listening && <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />}
        <span className="relative">🎤</span>
      </button>
      <p className="text-lg font-bold text-gray-600 font-nunito">
        {listening ? '¡Te escucho! Hablá ahora…' : 'Tocá el micrófono y hablá'}
      </p>
    </div>
  )
}

const BURST = [
  { e: '⭐', x: -110, d: 0 },
  { e: '🎉', x: -60, d: 120 },
  { e: '✨', x: -15, d: 60 },
  { e: '🌟', x: 30, d: 180 },
  { e: '🎈', x: 75, d: 40 },
  { e: '⭐', x: 115, d: 140 },
]

export function Burst() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10" aria-hidden="true">
      {BURST.map((b, i) => (
        <span
          key={i}
          className="absolute text-4xl animate-rise"
          style={{ left: b.x, animationDelay: `${b.d}ms`, opacity: 0 }}
        >
          {b.e}
        </span>
      ))}
    </div>
  )
}

export function Stars({ value = 0, size = 'text-2xl' }) {
  return (
    <span className={`${size} whitespace-nowrap`} aria-label={`${value} de 3 estrellas`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= value ? '' : 'opacity-25 grayscale'}>
          ⭐
        </span>
      ))}
    </span>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-3xl shadow-xl border-4 border-indigo-100 p-5 sm:p-8 ${className}`}>{children}</div>
  )
}
