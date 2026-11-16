import { useState } from 'react'
import Visual from './Visual.jsx'
import { BigButton, Burst, En, MicButton, Prompt, SmallButton } from './ui.jsx'
import { bestTranscript, heardSomething, randomPraise, speak, useListener } from '../utils/speech.js'

// Answer out loud. Three ways in, from best to most forgiving:
//  1. The microphone (speech recognition), matched leniently.
//  2. Tapping a written choice (always for yes/no; after 2 misses otherwise).
//  3. Without speech recognition: say it aloud, listen to the model answer and compare.
//
// check(alternatives) → { ok, said, spanish? }   (check([]).said is the expected answer)
// model(said)         → model sentence, e.g. "It's a cat."
export default function SpeakQuestion({
  say,
  display,
  es,
  visual,
  check,
  model,
  hint,
  choices,
  choicesAlways = false,
  onAnswer,
}) {
  const { supported, listening, listen } = useListener()
  const [misses, setMisses] = useState(0)
  const [heard, setHeard] = useState(null) // null = not tried yet, '' = heard nothing
  const [spanish, setSpanish] = useState(false)
  const [wrongChoices, setWrongChoices] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [result, setResult] = useState(null) // { said, firstTry }

  const expected = check([]).said
  const hintText = hint || model(expected)

  const succeed = (said, firstTry) => {
    setResult({ said, firstTry })
    speak([randomPraise(), model(said)])
  }

  const miss = (nextMisses) => {
    setMisses(nextMisses)
    if (nextMisses >= 2) speak(['Listen!', hintText])
    else speak('Try again!')
  }

  const onMic = () =>
    listen((alternatives) => {
      setHeard(bestTranscript(alternatives))
      if (!heardSomething(alternatives)) {
        speak("I can't hear you. Again, please!")
        return
      }
      const r = check(alternatives)
      setSpanish(!!r.spanish)
      if (r.ok) succeed(r.said, misses === 0)
      else miss(misses + 1)
    })

  const onChoice = (c) => {
    if (wrongChoices.includes(c.value)) return
    if (c.ok) {
      succeed(c.value, misses === 0)
    } else {
      setWrongChoices((w) => [...w, c.value])
      speak(c.label)
      setMisses((m) => m + 1)
    }
  }

  const showChoices = choices && (choicesAlways || !supported || misses >= 2)

  return (
    <div className="space-y-6">
      <Prompt say={say} display={display} es={es} />
      <div className="flex justify-center min-h-32 items-center">
        <Visual v={visual} size="lg" />
      </div>

      {result ? (
        <div className="relative flex flex-col items-center gap-4 text-center animate-pop">
          <Burst />
          <p className="text-2xl font-bold text-green-700 font-nunito">¡Muy bien! 🎉 Repetí conmigo:</p>
          <button
            type="button"
            onClick={() => speak(model(result.said))}
            className="text-3xl sm:text-4xl font-extrabold text-green-700 font-nunito bg-green-50 border-4 border-green-300 rounded-3xl px-6 py-3"
          >
            🔊 <En>{model(result.said)}</En>
          </button>
          <BigButton color="from-green-500 to-emerald-600" onClick={() => onAnswer(result.firstTry)}>
            Siguiente ➡️
          </BigButton>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {supported ? (
            <>
              <MicButton listening={listening} onClick={onMic} />
              {heard !== null && !listening && (
                <div className="text-center font-nunito animate-pop">
                  {heard === '' ? (
                    <p className="text-xl text-gray-600">🙉 No te escuché. ¡Hablá más fuerte y cerca!</p>
                  ) : (
                    <>
                      <p className="text-lg text-gray-500">
                        Escuché: «<span className="font-bold text-gray-700">{heard}</span>»
                      </p>
                      <p className="text-xl font-bold text-orange-600">
                        {spanish ? '¡En inglés! Decí YES 😉' : '¡Casi! Probá otra vez 💪'}
                      </p>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <SelfCheck
              revealed={revealed}
              hintText={hintText}
              onReveal={() => {
                setRevealed(true)
                speak(hintText)
              }}
              onGood={() => succeed(expected, misses === 0)}
              onAgain={() => {
                setRevealed(false)
                setMisses((m) => m + 1)
              }}
            />
          )}

          {supported && misses >= 2 && (
            <button
              type="button"
              onClick={() => speak(hintText)}
              className="text-center font-nunito bg-amber-50 border-4 border-amber-200 rounded-2xl px-5 py-3"
            >
              <span className="block text-base text-amber-700 font-bold">Probá decir: 🔊</span>
              <span className="block text-2xl font-extrabold text-amber-800">
                <En>{hintText}</En>
              </span>
            </button>
          )}

          {showChoices && (
            <div className="w-full">
              <p className="text-center text-lg text-gray-500 font-nunito mb-2">
                {choicesAlways ? 'Hablá o tocá tu respuesta:' : 'O tocá la respuesta:'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {choices.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onChoice(c)}
                    className={`rounded-2xl border-4 px-5 py-3 text-2xl font-extrabold font-nunito transition-all ${
                      wrongChoices.includes(c.value)
                        ? 'border-red-200 bg-red-50 text-red-300 animate-shake'
                        : 'border-sky-300 bg-sky-50 text-sky-800 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <En>{c.label}</En>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {supported && misses >= 1 && (
              <SmallButton onClick={() => succeed(expected, true)} title="Para el adulto que acompaña">
                👍 Lo dijo bien (adulto)
              </SmallButton>
            )}
            {misses >= 3 && <SmallButton onClick={() => onAnswer(false)}>Saltar ➡️</SmallButton>}
          </div>
        </div>
      )}
    </div>
  )
}

function SelfCheck({ revealed, hintText, onReveal, onGood, onAgain }) {
  if (!revealed) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-3xl font-extrabold text-rose-600 font-nunito">🗣️ ¡Decilo en voz alta!</p>
        <BigButton color="from-sky-500 to-blue-600" onClick={onReveal}>
          👂 Escuchar la respuesta
        </BigButton>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-3 text-center animate-pop">
      <p className="text-3xl font-extrabold text-indigo-700 font-nunito">
        <En>{hintText}</En>
      </p>
      <p className="text-lg text-gray-600 font-nunito">¿Lo dijiste igual?</p>
      <div className="flex gap-3">
        <BigButton color="from-green-500 to-emerald-600" onClick={onGood}>
          👍 ¡Sí!
        </BigButton>
        <BigButton color="from-amber-400 to-orange-500" onClick={onAgain}>
          🔁 Otra vez
        </BigButton>
      </div>
    </div>
  )
}
