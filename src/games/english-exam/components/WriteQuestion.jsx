import { useState } from 'react'
import Visual from './Visual.jsx'
import { BigButton, Burst, En, Prompt, SmallButton } from './ui.jsx'
import { randomPraise, speak } from '../utils/speech.js'
import { shuffle, useSettings } from '../utils/progress.js'

const EXTRA_LETTERS = 'abcdefghiklmnoprstuwy'

function makeTiles(word) {
  const letters = word.split('')
  const extras = shuffle(EXTRA_LETTERS.split('').filter((c) => !letters.includes(c))).slice(0, 2)
  return shuffle([...letters, ...extras]).map((ch, id) => ({ id, ch }))
}

// Spell the word with letter tiles (or the keyboard, for older kids).
export default function WriteQuestion({ item, onAnswer }) {
  const { settings, setSetting } = useSettings()
  const word = item.en.toLowerCase()

  const [done, setDone] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [hinted, setHinted] = useState(false)

  const finish = () => {
    setDone(true)
    speak([item.en, randomPraise()])
  }

  return (
    <div className="space-y-6">
      <Prompt
        say={item.en}
        display={<En>✏️ Write it!</En>}
        es={`Escuchá la palabra y escribila en inglés. Quiere decir «${item.es}».`}
      />
      <div className="flex justify-center">
        <Visual v={item} size="md" />
      </div>

      {done ? (
        <div className="relative flex flex-col items-center gap-4 animate-pop">
          <Burst />
          <p className="text-5xl font-extrabold text-green-600 font-nunito tracking-widest">
            <En>{word}</En>
          </p>
          <p className="text-2xl font-bold text-green-700 font-nunito">¡Muy bien! 🎉</p>
          <BigButton color="from-green-500 to-emerald-600" onClick={() => onAnswer(mistakes === 0 && !hinted)}>
            Siguiente ➡️
          </BigButton>
        </div>
      ) : settings.keyboard ? (
        <KeyboardInput word={word} mistakes={mistakes} onMistake={() => setMistakes((m) => m + 1)} onSolved={finish} />
      ) : (
        <Tiles
          word={word}
          onMistake={() => setMistakes((m) => m + 1)}
          onHint={() => {
            setHinted(true)
            speak(item.en, { slow: true })
          }}
          onSolved={finish}
        />
      )}

      {!done && (
        <div className="flex justify-center">
          <SmallButton onClick={() => setSetting('keyboard', !settings.keyboard)}>
            {settings.keyboard ? '🔤 Usar letras' : '⌨️ Usar teclado'}
          </SmallButton>
        </div>
      )}
    </div>
  )
}

function Tiles({ word, onMistake, onHint, onSolved }) {
  const [tiles] = useState(() => makeTiles(word))
  const [slots, setSlots] = useState(() => Array(word.length).fill(null)) // tile ids
  const [wrongSlots, setWrongSlots] = useState([])

  const used = new Set(slots.filter((s) => s !== null))
  const charAt = (slotIndex) => tiles.find((t) => t.id === slots[slotIndex])?.ch

  const check = (next) => {
    if (next.some((s) => s === null)) return
    const letters = next.map((id) => tiles.find((t) => t.id === id).ch)
    if (letters.join('') === word) {
      onSolved()
      return
    }
    onMistake()
    const bad = letters.map((ch, i) => (ch === word[i] ? -1 : i)).filter((i) => i >= 0)
    setWrongSlots(bad)
    setTimeout(() => {
      setWrongSlots([])
      setSlots((s) => s.map((id, i) => (bad.includes(i) ? null : id)))
    }, 900)
  }

  const place = (tile) => {
    if (used.has(tile.id) || wrongSlots.length) return
    const index = slots.indexOf(null)
    if (index < 0) return
    const next = slots.map((s, i) => (i === index ? tile.id : s))
    setSlots(next)
    check(next)
  }

  const remove = (index) => {
    if (wrongSlots.length) return
    setSlots((s) => s.map((id, i) => (i === index ? null : id)))
  }

  const hint = () => {
    if (wrongSlots.length) return
    onHint()
    const index = slots.findIndex((_, i) => charAt(i) !== word[i])
    if (index < 0) return
    // Tiles already sitting in a correct slot stay where they are.
    const lockedIds = new Set(slots.filter((id, i) => id !== null && charAt(i) === word[i] && i !== index))
    const tile = tiles.find((t) => t.ch === word[index] && !lockedIds.has(t.id))
    if (!tile) return
    const next = slots.map((id, i) => {
      if (i === index) return tile.id
      return id === tile.id ? null : id
    })
    setSlots(next)
    check(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-2">
        {slots.map((id, i) => {
          const ch = charAt(i)
          const wrong = wrongSlots.includes(i)
          return (
            <button
              key={i}
              type="button"
              onClick={() => remove(i)}
              className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-4 text-4xl font-extrabold font-nunito flex items-center justify-center ${
                wrong
                  ? 'border-red-400 bg-red-100 text-red-600 animate-shake'
                  : ch
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                    : 'border-dashed border-gray-300 bg-gray-50'
              }`}
            >
              {ch && <En>{ch}</En>}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {tiles.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => place(t)}
            disabled={used.has(t.id)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-white text-3xl font-extrabold font-nunito shadow-md hover:scale-110 active:scale-95 transition-transform disabled:opacity-20 disabled:scale-90"
          >
            <En>{t.ch}</En>
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <SmallButton onClick={hint}>💡 Pista</SmallButton>
      </div>
    </div>
  )
}

function KeyboardInput({ word, mistakes, onMistake, onSolved }) {
  const { settings } = useSettings()
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    if (value.trim().toLowerCase().replace(/\s+/g, ' ') === word) {
      onSolved()
    } else {
      onMistake()
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  const hint =
    mistakes >= 3 ? word : mistakes >= 1 ? word.split('').map((c, i) => (i === 0 ? c : '_')).join(' ') : null

  return (
    <form onSubmit={submit} className="flex flex-col items-center gap-4">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoCapitalize={settings.uppercase ? 'characters' : 'none'}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className={`w-full max-w-sm text-center text-4xl font-extrabold font-nunito border-4 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 ${
          settings.uppercase ? 'uppercase' : ''
        } ${shake ? 'border-red-400 animate-shake' : 'border-indigo-200'}`}
      />
      {hint && (
        <p className="text-2xl text-gray-500 font-nunito tracking-widest">
          Pista: <En>{hint}</En>
        </p>
      )}
      <BigButton type="submit">Comprobar ✔</BigButton>
    </form>
  )
}
