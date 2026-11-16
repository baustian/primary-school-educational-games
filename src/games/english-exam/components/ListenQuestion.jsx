import { useState } from 'react'
import Visual from './Visual.jsx'
import { Burst, En, Prompt } from './ui.jsx'
import { randomPraise, speak } from '../utils/speech.js'
import { shuffle } from '../utils/progress.js'

// Hear a word → touch the matching picture. No reading needed.
export default function ListenQuestion({ item, pool, optionCount = 3, onAnswer }) {
  const [options] = useState(() =>
    shuffle([item, ...shuffle(pool.filter((i) => i.en !== item.en)).slice(0, optionCount - 1)]),
  )
  const [wrong, setWrong] = useState([])
  const [done, setDone] = useState(false)

  const choose = (opt) => {
    if (done || wrong.includes(opt.en)) return
    if (opt.en === item.en) {
      setDone(true)
      speak([item.en, randomPraise()])
      setTimeout(() => onAnswer(wrong.length === 0), 1800)
    } else {
      setWrong((w) => [...w, opt.en])
      speak([`${opt.en}.`, 'Listen again!', item.en])
    }
  }

  return (
    <div className="space-y-6">
      <Prompt
        say={item.en}
        display={<En>👂 Listen and touch!</En>}
        es="Escuchá la palabra y tocá el dibujo correcto. Si no entendiste, tocá Escuchar."
      />
      <div className={`grid gap-4 ${options.length === 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {options.map((opt) => {
          const isRight = done && opt.en === item.en
          const isWrong = wrong.includes(opt.en)
          return (
            <button
              key={opt.en}
              type="button"
              onClick={() => choose(opt)}
              className={`relative flex flex-col items-center justify-center rounded-3xl border-4 p-3 min-h-36 transition-all ${
                isRight
                  ? 'border-green-500 bg-green-50 scale-105'
                  : isWrong
                    ? 'border-red-300 bg-red-50 opacity-50 animate-shake'
                    : 'border-indigo-100 bg-white hover:border-indigo-400 hover:scale-105 active:scale-95'
              }`}
            >
              <Visual v={opt} size="md" />
              {(isRight || isWrong) && (
                <span className={`mt-2 text-lg font-extrabold font-nunito ${isRight ? 'text-green-700' : 'text-red-400'}`}>
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
