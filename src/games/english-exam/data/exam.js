// Mock oral exam ("Simulacro") based on the study guide sent by the school
// (20 suggested questions). Every run picks different pictures/words.
import { findTopic } from './topics.js'
import { findHeard, heardAny, normalize } from '../utils/speech.js'
import { pickRandom, shuffle } from '../utils/progress.js'

// Exam date from the school's message. Update here if it changes.
export const EXAM_DATE = '2026-12-14'

export function daysUntilExam() {
  const [y, m, d] = EXAM_DATE.split('-').map(Number)
  const exam = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((exam - today) / 86400000)
}

export const ROOMS = [
  { en: 'kitchen', es: 'cocina', emoji: '🍳', alts: ['chicken', 'kitchens', 'kitten'] },
  { en: 'bathroom', es: 'baño', emoji: '🛁', alts: ['bath room', 'bath'] },
  { en: 'bedroom', es: 'dormitorio', emoji: '🛏️', alts: ['bed room', 'bed'] },
  { en: 'living room', es: 'living', emoji: '🛋️', alts: ['living', 'leaving room'] },
]

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
export const numberWord = (n) => NUMBER_WORDS[n] || String(n)

const items = (topicId) => findTopic(topicId).items
const colours = () => items('colours')
const capitalize = (s) => s[0].toUpperCase() + s.slice(1)
const article = (w) => (/^[aeiou]/.test(w) ? 'an' : 'a')

// Word choices offered when speech recognition fails or isn't available.
const wordChoices = (target, pool, n = 3) =>
  shuffle([target, ...shuffle(pool.filter((i) => i.en !== target.en)).slice(0, n - 1)]).map((i) => ({
    label: i.en,
    value: i.en,
    ok: i.en === target.en,
  }))

const matchItem = (item) => (alts) => ({ ok: heardAny(alts, [item.en, ...(item.alts || [])]), said: item.en })

const PEOPLE = [
  { en: 'mum', es: 'mamá', emoji: '👩' },
  { en: 'dad', es: 'papá', emoji: '👨' },
  { en: 'grandma', es: 'la abuela', emoji: '👵' },
  { en: 'grandpa', es: 'el abuelo', emoji: '👴' },
  { en: 'the baby', es: 'el bebé', emoji: '👶' },
]

const BIG_SMALL = [
  { en: 'elephant', emoji: '🐘', big: true },
  { en: 'whale', emoji: '🐋', big: true },
  { en: 'giraffe', emoji: '🦒', big: true },
  { en: 'mouse', emoji: '🐭', big: false },
  { en: 'ladybird', emoji: '🐞', big: false },
  { en: 'ant', emoji: '🐜', big: false },
]

const COUNTABLES = [
  { en: 'cars', emoji: '🚗' },
  { en: 'apples', emoji: '🍎' },
  { en: 'balls', emoji: '⚽' },
  { en: 'dogs', emoji: '🐶' },
  { en: 'birds', emoji: '🐦' },
  { en: 'stars', emoji: '⭐' },
]

// --- Question builders ------------------------------------------------------

function qName({ userName }) {
  const name = userName || '…'
  return {
    kind: 'speak',
    say: "Hello! What's your name?",
    es: '¿Cómo te llamás? Respondé: MY NAME IS… y tu nombre.',
    visual: { emoji: '🙋' },
    check: (alts) => {
      const n = normalize(userName || '')
      const ok =
        heardAny(alts, ['name']) || (n && alts.some((a) => normalize(a).includes(n.split(' ')[0])))
      return { ok, said: name }
    },
    model: () => `My name is ${name}.`,
  }
}

function qAge({ age }) {
  return {
    kind: 'speak',
    say: 'How old are you?',
    es: '¿Cuántos años tenés? Respondé: I’M… y tu edad.',
    visual: { emoji: '🎂' },
    check: (alts) => {
      const n = [3, 4, 5, 6, 7, 8, 9, 10, 11].find((k) => heardAny(alts, [numberWord(k)]))
      return { ok: !!n, said: n ? numberWord(n) : numberWord(age) }
    },
    model: (said) => `I'm ${said}.`,
    choices: [5, 6, 7, 8].map((k) => ({ label: numberWord(k), value: numberWord(k), ok: true })),
  }
}

function qFeeling() {
  const feeling = pickRandom(items('feelings').filter((i) => !i.scale))
  return {
    kind: 'yesno',
    say: `Are you ${feeling.en}?`,
    es: `Te pregunta si estás «${feeling.es}». Respondé YES o NO.`,
    visual: { emoji: feeling.emoji },
    answer: 'any',
    models: { yes: 'Yes, I am.', no: "No, I'm not." },
  }
}

function qWhatsThis() {
  const pool = [...items('animals'), ...items('toys'), ...items('food')]
  const item = pickRandom(pool)
  const topic = ['animals', 'toys', 'food'].map(findTopic).find((t) => t.items.includes(item))
  return {
    kind: 'speak',
    say: "What's this?",
    es: '¿Qué es esto? Decí el nombre en inglés.',
    visual: { emoji: item.emoji },
    check: matchItem(item),
    model: () => item.model || `It's ${article(item.en)} ${item.en}.`,
    choices: wordChoices(item, topic.items),
  }
}

function qIsIt() {
  const animals = items('animals')
  const shown = pickRandom(animals)
  const yes = Math.random() < 0.5
  const asked = yes ? shown : pickRandom(animals.filter((a) => a.en !== shown.en))
  return {
    kind: 'yesno',
    say: `Is it ${article(asked.en)} ${asked.en}?`,
    es: `Te pregunta si es «${asked.es}». Mirá el dibujo y respondé YES o NO.`,
    visual: { emoji: shown.emoji },
    answer: yes ? 'yes' : 'no',
    models: {
      yes: 'Yes, it is.',
      no: `No, it isn't. It's ${article(shown.en)} ${shown.en}.`,
    },
  }
}

function qBig() {
  const thing = pickRandom(BIG_SMALL)
  const askBig = Math.random() < 0.5
  const correct = askBig === thing.big ? 'yes' : 'no'
  return {
    kind: 'yesno',
    say: `Is it ${askBig ? 'big' : 'small'}?`,
    es: `¿Es ${askBig ? 'grande' : 'chico'}? Respondé YES o NO.`,
    visual: { emoji: thing.emoji, scale: thing.big ? 1.3 : 0.55 },
    answer: correct,
    models: {
      yes: 'Yes, it is.',
      no: `No, it isn't. It's ${thing.big ? 'big' : 'small'}.`,
    },
  }
}

function qHowMany() {
  const thing = pickRandom(COUNTABLES)
  const n = 2 + Math.floor(Math.random() * 7) // 2..8
  const numbers = items('numbers')
  const target = numbers[n - 1]
  return {
    kind: 'speak',
    say: `How many ${thing.en}?`,
    es: '¿Cuántos hay? Contá y decí el número en inglés.',
    visual: { count: n, emoji: thing.emoji },
    check: matchItem(target),
    model: () => `${capitalize(target.en)}. ${capitalize(target.en)} ${thing.en}.`,
    choices: wordChoices(target, numbers.filter((x) => Math.abs(x.count - n) <= 2)),
  }
}

function qCarColour() {
  const colour = pickRandom(colours().filter((c) => c.en !== 'white'))
  return {
    kind: 'speak',
    say: 'What colour is it?',
    es: '¿De qué color es? Decí el color en inglés.',
    visual: { car: colour.color },
    check: matchItem(colour),
    model: () => `It's ${colour.en}.`,
    choices: wordChoices(colour, colours()),
  }
}

function qLike() {
  const food = pickRandom(items('food'))
  const plural = food.en === 'apple' || food.en === 'banana' || food.en === 'egg' ? `${food.en}s` : food.en
  return {
    kind: 'yesno',
    say: `Do you like ${plural}?`,
    es: `Te pregunta si te gusta «${food.es}». Respondé YES, I DO o NO, I DON’T.`,
    visual: { emoji: food.emoji },
    answer: 'any',
    models: { yes: 'Yes, I do.', no: "No, I don't." },
  }
}

function qFavouriteColour() {
  return {
    kind: 'speak',
    say: "What's your favourite colour?",
    es: '¿Cuál es tu color favorito? Respondé: MY FAVOURITE COLOUR IS…',
    visual: { emoji: '🌈' },
    check: (alts) => {
      const c = findHeard(alts, colours())
      return { ok: !!c, said: c?.en || 'red' }
    },
    model: (said) => `My favourite colour is ${said}.`,
    choices: colours().slice(0, 6).map((c) => ({ label: c.en, value: c.en, ok: true })),
  }
}

function qWhere() {
  const person = pickRandom(PEOPLE)
  const roomIndex = Math.floor(Math.random() * ROOMS.length)
  const room = ROOMS[roomIndex]
  const who = person.en === 'the baby' ? 'the baby' : person.en
  return {
    kind: 'speak',
    say: `Where's ${who}?`,
    es: `¿Dónde está ${person.es}? Respondé: IN THE… y el lugar de la casa.`,
    visual: { house: { room: roomIndex, person: person.emoji } },
    check: matchItem(room),
    model: () => `In the ${room.en}.`,
    choices: ROOMS.map((r) => ({ label: `in the ${r.en}`, value: r.en, ok: r.en === room.en })),
  }
}

function qCan() {
  const action = pickRandom(items('actions'))
  return {
    kind: 'yesno',
    say: `Can you ${action.en}?`,
    es: `Te pregunta si podés «${action.es}». Respondé YES, I CAN o NO, I CAN’T.`,
    visual: { emoji: action.emoji },
    answer: 'any',
    models: { yes: 'Yes, I can.', no: "No, I can't." },
  }
}

function qHaveGot() {
  const thing = pickRandom([...items('animals').slice(0, 8), ...items('toys')])
  return {
    kind: 'yesno',
    say: `Have you got ${article(thing.en)} ${thing.en}?`,
    es: `Te pregunta si tenés «${thing.es}». Respondé YES, I HAVE o NO, I HAVEN’T.`,
    visual: { emoji: thing.emoji },
    answer: 'any',
    models: { yes: 'Yes, I have.', no: "No, I haven't." },
  }
}

const TOUCHABLE = {
  nose: 'la nariz',
  eyes: 'los ojos',
  ears: 'las orejas',
  mouth: 'la boca',
  hair: 'el pelo',
  hands: 'las manos',
  arm: 'el brazo',
  leg: 'la pierna',
  foot: 'el pie',
}

function qTouch(exclude) {
  const body = items('body').filter((b) => TOUCHABLE[b.en])
  const target = pickRandom(body.filter((b) => b.en !== exclude))
  const options = shuffle([target, ...shuffle(body.filter((b) => b.en !== target.en)).slice(0, 5)])
  return {
    kind: 'pick',
    say: `Touch your ${target.en}.`,
    es: `Tocate ${TOUCHABLE[target.en]} de verdad, y después tocá el dibujo correcto.`,
    target: target.en,
    options: options.map((o) => ({ v: { emoji: o.emoji }, en: o.en, ok: o.en === target.en })),
  }
}

function qHairColour() {
  return {
    kind: 'speak',
    say: 'What colour is your hair?',
    es: '¿De qué color es tu pelo? Respondé: IT’S… y el color.',
    visual: { emoji: '💇' },
    check: (alts) => {
      const c = findHeard(alts, colours())
      return { ok: !!c, said: c?.en || 'brown' }
    },
    model: (said) => `It's ${said}.`,
    choices: ['brown', 'black', 'yellow', 'red'].map((c) => ({ label: c, value: c, ok: true })),
  }
}

function qCommand() {
  const commands = items('commands').filter((c) => !c.en.startsWith('touch'))
  const target = pickRandom(commands)
  const options = shuffle([target, ...shuffle(commands.filter((c) => c.en !== target.en)).slice(0, 3)])
  return {
    kind: 'pick',
    say: `${capitalize(target.en)}!`,
    es: '¡Hacé lo que dice la maestra! Después tocá el dibujo que corresponde.',
    target: target.en,
    options: options.map((o) => ({ v: { emoji: o.emoji }, en: o.en, ok: o.en === target.en })),
  }
}

function qShowPencils() {
  const n = 2 + Math.floor(Math.random() * 5) // 2..6
  return {
    kind: 'count',
    say: `Show me ${numberWord(n)} pencils.`,
    es: 'Tocá la cantidad de lápices que pide la maestra y después ¡Listo!',
    n,
    pencils: shuffle(colours().filter((c) => c.en !== 'white')).slice(0, 8).map((c) => c.color),
  }
}

function qShowColourPencil() {
  const palette = shuffle(colours().filter((c) => c.en !== 'white')).slice(0, 5)
  const target = pickRandom(palette)
  return {
    kind: 'pick',
    say: `Show me ${article(target.en)} ${target.en} pencil.`,
    es: 'Tocá el lápiz del color que pide la maestra.',
    target: target.en,
    options: palette.map((c) => ({ v: { pencil: c.color }, en: c.en, ok: c.en === target.en })),
  }
}

function qDrawCar() {
  const palette = shuffle(colours().filter((c) => c.en !== 'white')).slice(0, 6)
  const target = pickRandom(palette)
  return {
    kind: 'paint',
    say: `Now draw ${article(target.en)} ${target.en} car.`,
    es: 'Pintá el auto del color que pide la maestra.',
    target,
    palette,
  }
}

// Same order as the school's study guide.
export function buildExam({ userName, age, practice = false }) {
  const ctx = { userName, age }
  const firstTouch = qTouch()
  const all = [
    qName(ctx),
    qAge(ctx),
    qFeeling(),
    qWhatsThis(),
    qIsIt(),
    qBig(),
    qHowMany(),
    qCarColour(),
    qLike(),
    qFavouriteColour(),
    qWhere(),
    qCan(),
    qHaveGot(),
    firstTouch,
    qHairColour(),
    qTouch(firstTouch.target),
    qCommand(),
    qShowPencils(),
    qShowColourPencil(),
    qDrawCar(),
  ]
  if (!practice) return all
  // A shorter mixed round: keep the first two (greeting) plus 6 random others, in order.
  const rest = shuffle(all.slice(2).map((q, i) => ({ q, i })))
    .slice(0, 6)
    .sort((a, b) => a.i - b.i)
    .map(({ q }) => q)
  return [...all.slice(0, 2), ...rest]
}

// Study cards for "Preguntas del examen" → Aprender.
export function questionCards({ userName, age }) {
  const name = userName || '…'
  return [
    { q: "What's your name?", a: `My name is ${name}.`, es: '¿Cómo te llamás?', aEs: `Me llamo ${name}.`, v: { emoji: '🙋' } },
    { q: 'How old are you?', a: `I'm ${numberWord(age)}.`, es: '¿Cuántos años tenés?', aEs: `Tengo ${age} años.`, v: { emoji: '🎂' } },
    { q: 'Are you tired?', a: "Yes, I am. Or: No, I'm not.", es: '¿Estás cansado/a?', aEs: 'Sí. / No.', v: { emoji: '😴' } },
    { q: "What's this?", a: "It's a cat.", es: '¿Qué es esto?', aEs: 'Es un gato.', v: { emoji: '🐱' } },
    { q: 'Is it a dog?', a: "No, it isn't. It's a cat.", es: '¿Es un perro?', aEs: 'No, no es. Es un gato.', v: { emoji: '🐱' } },
    { q: 'Is it big?', a: 'Yes, it is.', es: '¿Es grande?', aEs: 'Sí, es grande.', v: { emoji: '🐘', scale: 1.3 } },
    { q: 'How many cars?', a: 'Two. Two cars.', es: '¿Cuántos autos hay?', aEs: 'Dos. Dos autos.', v: { count: 2, emoji: '🚗' } },
    { q: 'What colour is it?', a: "It's black.", es: '¿De qué color es?', aEs: 'Es negro.', v: { car: '#212121' } },
    { q: 'Do you like pizza?', a: "Yes, I do. Or: No, I don't.", es: '¿Te gusta la pizza?', aEs: 'Sí, me gusta. / No, no me gusta.', v: { emoji: '🍕' } },
    { q: "What's your favourite colour?", a: 'My favourite colour is red.', es: '¿Cuál es tu color favorito?', aEs: 'Mi color favorito es el rojo.', v: { emoji: '🌈' } },
    { q: "Where's mum?", a: 'In the kitchen.', es: '¿Dónde está mamá?', aEs: 'En la cocina.', v: { house: { room: 0, person: '👩' } } },
    { q: 'Can you swim?', a: "Yes, I can. Or: No, I can't.", es: '¿Sabés nadar?', aEs: 'Sí, puedo. / No, no puedo.', v: { emoji: '🏊' } },
    { q: 'Have you got a dog?', a: "Yes, I have. Or: No, I haven't.", es: '¿Tenés un perro?', aEs: 'Sí, tengo. / No, no tengo.', v: { emoji: '🐶' } },
    { q: 'What colour is your hair?', a: "It's brown.", es: '¿De qué color es tu pelo?', aEs: 'Es marrón.', v: { emoji: '💇' } },
    { q: 'Touch your nose.', a: '(Touch your nose!)', es: 'Tocate la nariz.', aEs: '¡Tocate la nariz de verdad!', v: { emoji: '👃' } },
    { q: 'Show me five pencils.', a: '(Show five pencils!)', es: 'Mostrame cinco lápices.', aEs: '¡Mostrá cinco lápices!', v: { count: 5, emoji: '✏️' } },
    { q: 'Draw a yellow car.', a: '(Draw a yellow car!)', es: 'Dibujá un auto amarillo.', aEs: '¡Dibujá un auto amarillo!', v: { car: '#fdd835' } },
  ]
}

