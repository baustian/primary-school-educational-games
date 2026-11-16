import { useState } from 'react'
import SpeakQuestion from './SpeakQuestion.jsx'
import Visual, { Car, Pencil } from './Visual.jsx'
import { Burst, En, Prompt } from './ui.jsx'
import { heardYesNo, randomPraise, speak } from '../utils/speech.js'
import { numberWord } from '../data/exam.js'

const ADVANCE_MS = 1900

export default function ExamQuestion({ q, onAnswer }) {
  switch (q.kind) {
    case 'speak':
      return <SpeakQuestion {...q} onAnswer={onAnswer} />
    case 'yesno':
      return <YesNoQuestion q={q} onAnswer={onAnswer} />
    case 'pick':
      return <PickQuestion q={q} onAnswer={onAnswer} />
    case 'count':
      return <CountQuestion q={q} onAnswer={onAnswer} />
    case 'paint':
      return <PaintQuestion q={q} onAnswer={onAnswer} />
    default:
      return null
  }
}

function YesNoQuestion({ q, onAnswer }) {
  const { answer, models } = q
  const fallback = answer === 'any' ? 'yes' : answer
  const check = (alternatives) => {
    const yn = heardYesNo(alternatives)
    if (yn === 'spanish') return { ok: false, spanish: true, said: fallback }
    if (!yn) return { ok: false, said: fallback }
    const ok = answer === 'any' || yn === answer
    return { ok, said: ok ? yn : answer }
  }
  const hint = answer === 'any' ? `${models.yes} / ${models.no}` : models[answer]
  return (
    <SpeakQuestion
      say={q.say}
      es={q.es}
      visual={q.visual}
      check={check}
      model={(said) => models[said]}
      hint={hint}
      choicesAlways
      choices={[
        { label: answer === 'any' ? models.yes : 'Yes', value: 'yes', ok: answer !== 'no' },
        { label: answer === 'any' ? models.no : 'No', value: 'no', ok: answer !== 'yes' },
      ]}
      onAnswer={onAnswer}
    />
  )
}

function PickQuestion({ q, onAnswer }) {
  const [wrong, setWrong] = useState([])
  const [done, setDone] = useState(false)

  const choose = (opt) => {
    if (done || wrong.includes(opt.en)) return
    if (opt.ok) {
      setDone(true)
      speak(randomPraise())
      setTimeout(() => onAnswer(wrong.length === 0), ADVANCE_MS)
    } else {
      setWrong((w) => [...w, opt.en])
      speak([`That's ${opt.en}.`, q.say])
    }
  }

  const cols = q.options.length === 4 ? 'grid-cols-2' : q.options.length === 5 ? 'grid-cols-5' : 'grid-cols-3'

  return (
    <div className="space-y-6">
      <Prompt say={q.say} es={q.es} />
      <div className={`grid gap-3 ${cols}`}>
        {q.options.map((opt) => {
          const isRight = done && opt.ok
          const isWrong = wrong.includes(opt.en)
          return (
            <button
              key={opt.en}
              type="button"
              onClick={() => choose(opt)}
              className={`relative flex flex-col items-center justify-center rounded-3xl border-4 p-2 min-h-28 transition-all ${
                isRight
                  ? 'border-green-500 bg-green-50 scale-105'
                  : isWrong
                    ? 'border-red-300 bg-red-50 opacity-50 animate-shake'
                    : 'border-indigo-100 bg-white hover:border-indigo-400 hover:scale-105 active:scale-95'
              }`}
            >
              <Visual v={opt.v} size="sm" />
              {(isRight || isWrong) && (
                <span className={`mt-1 text-sm sm:text-base font-extrabold font-nunito ${isRight ? 'text-green-700' : 'text-red-400'}`}>
                  <En>{opt.en}</En>
                </span>
              )}
              {isRight && <Burst />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CountQuestion({ q, onAnswer }) {
  const [selected, setSelected] = useState([]) // indexes, in tap order
  const [misses, setMisses] = useState(0)
  const [done, setDone] = useState(false)

  const toggle = (i) => {
    if (done) return
    const next = selected.includes(i) ? selected.filter((s) => s !== i) : [...selected, i]
    setSelected(next)
    if (!selected.includes(i)) speak(numberWord(next.length))
  }

  const submit = () => {
    if (selected.length === q.n) {
      setDone(true)
      speak([randomPraise(), `${numberWord(q.n)} pencils!`])
      setTimeout(() => onAnswer(misses === 0), ADVANCE_MS)
    } else {
      setMisses((m) => m + 1)
      speak([`That's ${numberWord(selected.length)}.`, q.say])
      setSelected([])
    }
  }

  return (
    <div className="space-y-6">
      <Prompt say={q.say} es={q.es} />
      <div className="relative flex flex-wrap justify-center gap-3 sm:gap-4 py-2">
        {done && <Burst />}
        {q.pencils.map((color, i) => {
          const order = selected.indexOf(i)
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              aria-label={`lápiz ${i + 1}`}
              className={`relative rounded-2xl px-1 pt-1 transition-all ${
                order >= 0 ? '-translate-y-4 bg-yellow-100 ring-4 ring-yellow-400' : 'hover:-translate-y-1'
              }`}
            >
              <Pencil color={color} className="h-28 sm:h-32" />
              {order >= 0 && (
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold font-nunito flex items-center justify-center">
                  {order + 1}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={submit}
          disabled={!selected.length || done}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold font-nunito rounded-2xl px-8 py-4 text-2xl shadow-lg disabled:opacity-40"
        >
          ¡Listo! ✅
        </button>
      </div>
    </div>
  )
}

function PaintQuestion({ q, onAnswer }) {
  const [paint, setPaint] = useState('#ffffff')
  const [misses, setMisses] = useState(0)
  const [done, setDone] = useState(false)

  const choose = (c) => {
    if (done) return
    setPaint(c.color)
    if (c.en === q.target.en) {
      setDone(true)
      speak([randomPraise(), `A ${c.en} car!`])
      setTimeout(() => onAnswer(misses === 0), ADVANCE_MS)
    } else {
      setMisses((m) => m + 1)
      speak([`That's ${c.en}.`, q.say])
    }
  }

  return (
    <div className="space-y-6">
      <Prompt say={q.say} es={q.es} />
      <div className="relative flex justify-center">
        {done && <Burst />}
        <Car color={paint} className="w-72 sm:w-80" />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {q.palette.map((c) => (
          <button
            key={c.en}
            type="button"
            onClick={() => choose(c)}
            aria-label={c.en}
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg ring-2 ring-slate-300 hover:scale-110 active:scale-95 transition-transform"
            style={{ backgroundColor: c.color }}
          />
        ))}
      </div>
      <p className="text-center text-lg text-gray-500 font-nunito">🖌️ Tocá un color para pintar el auto</p>
    </div>
  )
}
