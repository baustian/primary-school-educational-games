import { useEffect } from 'react'
import { BigButton, Burst, Card, SmallButton, Stars } from './ui.jsx'
import { speak } from '../utils/speech.js'

const MESSAGES = {
  3: { en: 'Excellent! Three stars!', es: '¡Excelente! ¡Lo hiciste genial!', emoji: '🏆' },
  2: { en: 'Very good! Two stars!', es: '¡Muy bien! Si practicás un poquito más, sacás 3 estrellas.', emoji: '🎉' },
  1: { en: 'Good job! One star!', es: '¡Bien hecho! Practicar hace que cada vez salga mejor.', emoji: '💪' },
}

export default function ResultScreen({ stars, correct, total, onAgain, onBack, onNext, nextLabel }) {
  const msg = MESSAGES[stars] || MESSAGES[1]

  useEffect(() => {
    const t = setTimeout(() => speak(msg.en), 300)
    return () => clearTimeout(t)
  }, [msg.en])

  return (
    <Card className="relative text-center flex flex-col items-center gap-5 animate-pop">
      <Burst />
      <div className="text-8xl">{msg.emoji}</div>
      <Stars value={stars} size="text-6xl" />
      <p className="text-3xl font-extrabold text-indigo-800 font-nunito">{msg.en}</p>
      <p className="text-xl text-gray-600 font-nunito">{msg.es}</p>
      {total > 0 && (
        <p className="text-lg text-gray-500 font-nunito">
          Respuestas correctas al primer intento: <strong>{correct}</strong> de {total}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {onNext && (
          <BigButton color="from-green-500 to-emerald-600" onClick={onNext}>
            {nextLabel || 'Siguiente actividad'} ➡️
          </BigButton>
        )}
        {onAgain && <SmallButton onClick={onAgain}>🔁 Jugar otra vez</SmallButton>}
        <SmallButton onClick={onBack}>⬅️ Volver</SmallButton>
      </div>
    </Card>
  )
}
