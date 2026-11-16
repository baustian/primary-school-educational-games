import { useEffect, useState } from 'react'
import Visual from './Visual.jsx'
import { BigButton, Card, En, MicButton, SmallButton } from './ui.jsx'
import { bestTranscript, heardAny, heardSomething, speak, speakEs, useListener } from '../utils/speech.js'

// Flashcards. Each card: { v, en, sentence?, es }            (words)
//                     or { v, q, a, es, aEs }                 (exam questions)
export default function LearnActivity({ cards, onFinish }) {
  const [index, setIndex] = useState(0)
  const card = cards[index]
  const last = index === cards.length - 1

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2 flex-wrap">
        {cards.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Tarjeta ${i + 1}`}
            className={`w-4 h-4 rounded-full transition-all ${i === index ? 'bg-indigo-600 scale-125' : i < index ? 'bg-indigo-300' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {card.q ? <QuestionCard key={index} card={card} /> : <WordCard key={index} card={card} />}

      <div className="flex justify-between items-center gap-3">
        <SmallButton onClick={() => setIndex((i) => i - 1)} disabled={index === 0}>
          ⬅️ Atrás
        </SmallButton>
        {last ? (
          <BigButton color="from-green-500 to-emerald-600" onClick={onFinish}>
            ¡Terminé! ⭐
          </BigButton>
        ) : (
          <BigButton onClick={() => setIndex((i) => i + 1)}>Siguiente ➡️</BigButton>
        )}
      </div>
    </div>
  )
}

function useAutoSpeak(parts) {
  const key = JSON.stringify(parts)
  useEffect(() => {
    const t = setTimeout(() => speak(JSON.parse(key)), 300)
    return () => clearTimeout(t)
  }, [key])
}

function WordCard({ card }) {
  const [showEs, setShowEs] = useState(false)
  const parts = card.sentence && card.sentence.toLowerCase() !== `${card.en}.` ? [card.en, card.sentence] : [card.en]
  useAutoSpeak(parts)

  return (
    <Card className="flex flex-col items-center gap-5 text-center animate-pop">
      <button type="button" onClick={() => speak(parts)} className="min-h-40 flex items-center" aria-label="Escuchar">
        <Visual v={card.v} size="lg" />
      </button>
      <p className="text-5xl sm:text-6xl font-extrabold text-indigo-800 font-nunito">
        <En>{card.en}</En>
      </p>
      {card.sentence && (
        <p className="text-2xl text-indigo-500 font-bold font-nunito">
          <En>{card.sentence}</En>
        </p>
      )}
      {showEs && <p className="text-2xl text-gray-600 font-nunito animate-pop">💬 {card.es}</p>}
      <div className="flex flex-wrap justify-center gap-2">
        <SmallButton onClick={() => speak(parts)}>🔊 Escuchar</SmallButton>
        <SmallButton onClick={() => speak(card.en, { slow: true })}>🐢 Despacio</SmallButton>
        <SmallButton
          onClick={() => {
            setShowEs(true)
            speakEs(card.es)
          }}
        >
          💬 ¿Qué significa?
        </SmallButton>
      </div>
      <TryIt targets={[card.en, ...(card.alts || [])]} />
    </Card>
  )
}

function QuestionCard({ card }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showEs, setShowEs] = useState(false)
  useAutoSpeak([card.q])

  return (
    <Card className="flex flex-col items-center gap-4 text-center animate-pop">
      <div className="flex items-start gap-3 w-full">
        <span className="text-5xl" aria-hidden="true">
          🦉
        </span>
        <button
          type="button"
          onClick={() => speak(card.q)}
          className="flex-1 bg-indigo-50 border-4 border-indigo-200 rounded-3xl px-4 py-3 text-3xl font-extrabold text-indigo-800 font-nunito text-left"
        >
          <En>{card.q}</En>
        </button>
      </div>
      <div className="min-h-32 flex items-center">
        <Visual v={card.v} size="lg" />
      </div>
      {showAnswer ? (
        <button
          type="button"
          onClick={() => speak(card.a)}
          className="bg-green-50 border-4 border-green-300 rounded-3xl px-5 py-3 text-3xl font-extrabold text-green-700 font-nunito animate-pop"
        >
          🧒 <En>{card.a}</En>
        </button>
      ) : (
        <BigButton
          color="from-green-500 to-emerald-600"
          onClick={() => {
            setShowAnswer(true)
            speak(card.a)
          }}
        >
          👂 ¿Qué respondo?
        </BigButton>
      )}
      {showEs && (
        <div className="text-xl text-gray-600 font-nunito animate-pop">
          <p>💬 {card.es}</p>
          {showAnswer && <p className="text-green-700">➡️ {card.aEs}</p>}
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        <SmallButton onClick={() => speak(card.q, { slow: true })}>🐢 Despacio</SmallButton>
        <SmallButton
          onClick={() => {
            setShowEs(true)
            speakEs(showAnswer ? `${card.es} ${card.aEs}` : card.es)
          }}
        >
          💬 ¿Qué significa?
        </SmallButton>
      </div>
      {showAnswer && <TryIt />}
    </Card>
  )
}

// Optional "repeat after me" with the microphone. Never blocks progress.
function TryIt({ targets }) {
  const { supported, listening, listen } = useListener()
  const [feedback, setFeedback] = useState(null)

  if (!supported) {
    return <p className="text-lg text-rose-600 font-bold font-nunito">🗣️ ¡Repetilo en voz alta!</p>
  }

  const onMic = () =>
    listen((alternatives) => {
      if (!heardSomething(alternatives)) {
        setFeedback({ ok: false, text: '🙉 No te escuché. ¡Otra vez!' })
        return
      }
      const ok = !targets || heardAny(alternatives, targets)
      if (ok) speak('Well done!')
      setFeedback(
        ok
          ? { ok, text: '🌟 ¡Muy bien dicho!' }
          : { ok, text: `Escuché «${bestTranscript(alternatives)}». ¡Probá otra vez!` },
      )
    })

  return (
    <div className="flex flex-col items-center gap-2 pt-2 border-t-2 border-dashed border-gray-200 w-full">
      <p className="text-lg font-bold text-gray-500 font-nunito">¿Te animás a decirlo?</p>
      <MicButton listening={listening} onClick={onMic} />
      {feedback && !listening && (
        <p className={`text-xl font-bold font-nunito ${feedback.ok ? 'text-green-600' : 'text-orange-600'}`}>{feedback.text}</p>
      )}
    </div>
  )
}
