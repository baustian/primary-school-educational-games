// Vocabulary topics for the AACI "Starters"-level oral exam (1.º y 2.º grado).
// Based on the Bright Ideas Starter units the school is using.
//
// Item fields:
//   en      English word (lowercase — the UI uppercases it for display; TTS reads lowercase
//           so words like "it" are not spelled out as letters)
//   es      Spanish meaning (Argentina)
//   emoji / color / count / scale   how the item is drawn (see components/Visual.jsx)
//   alts    other transcriptions the speech recognizer may return for this word
//   model   full model answer for the "speak" activity (defaults to the topic frame)
//   prompt  question asked in the "speak" activity (defaults to the topic prompt)

const withArticle = (w) => (/^[aeiou]/.test(w) ? `an ${w}` : `a ${w}`)

export const ACTIVITIES = {
  learn: { id: 'learn', icon: '👀', title: 'Aprender', subtitle: 'Mirá, escuchá y repetí' },
  listen: { id: 'listen', icon: '👂', title: 'Escuchar', subtitle: 'Escuchá y tocá el dibujo' },
  write: { id: 'write', icon: '✏️', title: 'Escribir', subtitle: 'Armá la palabra con letras' },
  speak: { id: 'speak', icon: '🎤', title: 'Hablar', subtitle: 'Decí la palabra en inglés' },
  practice: { id: 'practice', icon: '🗣️', title: 'Practicar', subtitle: 'Respondé como en el examen' },
}

export const TOPICS = [
  {
    id: 'colours',
    title: 'Colours',
    es: 'Colores',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    prompt: 'What colour is it?',
    promptEs: '¿De qué color es?',
    frame: (w) => `It's ${w}.`,
    items: [
      { en: 'red', es: 'rojo', color: '#e53935', alts: ['read', 'bread', 'rad'] },
      { en: 'blue', es: 'azul', color: '#1e88e5', alts: ['blew', 'blu'] },
      { en: 'yellow', es: 'amarillo', color: '#fdd835', alts: ['jello', 'hello'] },
      { en: 'green', es: 'verde', color: '#43a047', alts: ['grin', 'grain'] },
      { en: 'orange', es: 'naranja', color: '#fb8c00' },
      { en: 'pink', es: 'rosa', color: '#f48fb1', alts: ['pinch', 'bink'] },
      { en: 'purple', es: 'violeta', color: '#8e24aa', alts: ['purpel', 'people'] },
      { en: 'black', es: 'negro', color: '#212121', alts: ['block', 'back'] },
      { en: 'white', es: 'blanco', color: '#ffffff', alts: ['wait', 'why', 'right'] },
      { en: 'brown', es: 'marrón', color: '#795548', alts: ['round', 'brain'] },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers',
    es: 'Números del 1 al 10',
    icon: '🔢',
    color: 'from-amber-500 to-orange-500',
    prompt: 'How many?',
    promptEs: '¿Cuántos hay?',
    frame: (w) => `${w[0].toUpperCase()}${w.slice(1)}.`,
    items: [
      { en: 'one', es: 'uno', count: 1, emoji: '🍎', alts: ['won'] },
      { en: 'two', es: 'dos', count: 2, emoji: '⭐', alts: ['to', 'too'] },
      { en: 'three', es: 'tres', count: 3, emoji: '🐟', alts: ['tree', 'free'] },
      { en: 'four', es: 'cuatro', count: 4, emoji: '🚗', alts: ['for', 'far', 'floor'] },
      { en: 'five', es: 'cinco', count: 5, emoji: '🎈', alts: ['fine', 'fight'] },
      { en: 'six', es: 'seis', count: 6, emoji: '🌸', alts: ['sticks', 'sex', 'sits'] },
      { en: 'seven', es: 'siete', count: 7, emoji: '⚽', alts: ['heaven', 'savan'] },
      { en: 'eight', es: 'ocho', count: 8, emoji: '🐞', alts: ['ate', 'eat', 'hate'] },
      { en: 'nine', es: 'nueve', count: 9, emoji: '🍌', alts: ['mine', 'night', 'nein'] },
      { en: 'ten', es: 'diez', count: 10, emoji: '🧁', alts: ['tan', 'then', 'tin'] },
    ],
  },
  {
    id: 'animals',
    title: 'Animals',
    es: 'Animales',
    icon: '🐶',
    color: 'from-green-500 to-emerald-600',
    prompt: "What's this?",
    promptEs: '¿Qué es esto?',
    frame: (w) => `It's ${withArticle(w)}.`,
    items: [
      { en: 'cat', es: 'gato', emoji: '🐱', alts: ['cut', 'cap', 'kat'] },
      { en: 'dog', es: 'perro', emoji: '🐶', alts: ['dock', 'doc', 'duck'] },
      { en: 'fish', es: 'pez', emoji: '🐟', alts: ['fix', 'fisch'] },
      { en: 'bird', es: 'pájaro', emoji: '🐦', alts: ['bed', 'bert', 'word'] },
      { en: 'horse', es: 'caballo', emoji: '🐴', alts: ['hors', 'house'] },
      { en: 'cow', es: 'vaca', emoji: '🐮', alts: ['cao', 'cal'] },
      { en: 'duck', es: 'pato', emoji: '🦆', alts: ['dock', 'doc'] },
      { en: 'frog', es: 'rana', emoji: '🐸', alts: ['frock', 'frag'] },
      { en: 'mouse', es: 'ratón', emoji: '🐭', alts: ['mous', 'mouth'] },
      { en: 'monkey', es: 'mono', emoji: '🐵', alts: ['monkeys', 'munkey'] },
      { en: 'elephant', es: 'elefante', emoji: '🐘' },
      { en: 'snake', es: 'serpiente', emoji: '🐍', alts: ['snack', 'snakes'] },
    ],
  },
  {
    id: 'toys',
    title: 'Toys',
    es: 'Juguetes',
    icon: '🧸',
    color: 'from-sky-500 to-blue-600',
    prompt: "What's this?",
    promptEs: '¿Qué es esto?',
    frame: (w) => `It's ${withArticle(w)}.`,
    items: [
      { en: 'ball', es: 'pelota', emoji: '⚽', alts: ['bowl', 'bol', 'pole'] },
      { en: 'doll', es: 'muñeca', emoji: '🪆', alts: ['dull', 'dol', 'dal'] },
      { en: 'teddy', es: 'osito de peluche', emoji: '🧸', alts: ['teddy bear', 'teddie', 'eddie'] },
      { en: 'kite', es: 'barrilete', emoji: '🪁', alts: ['kate', 'kind'] },
      { en: 'car', es: 'auto', emoji: '🚗', alts: ['card', 'far', 'call'] },
      { en: 'train', es: 'tren', emoji: '🚂', alts: ['trains', 'tren', 'rain'] },
      { en: 'robot', es: 'robot', emoji: '🤖' },
      { en: 'bike', es: 'bicicleta', emoji: '🚲', alts: ['bicycle', 'bite'] },
      { en: 'plane', es: 'avión', emoji: '✈️', alts: ['plain', 'airplane', 'aeroplane', 'plan'] },
      { en: 'boat', es: 'barco', emoji: '⛵', alts: ['both', 'bought', 'vote'] },
    ],
  },
  {
    id: 'body',
    title: 'My body',
    es: 'El cuerpo',
    icon: '👃',
    color: 'from-orange-400 to-red-500',
    prompt: "What's this?",
    promptEs: '¿Qué es esto?',
    frame: (w) => (w.endsWith('s') ? `They're my ${w}.` : `It's my ${w}.`),
    items: [
      { en: 'nose', es: 'nariz', emoji: '👃', alts: ['knows', 'nos', 'notes'] },
      { en: 'eyes', es: 'ojos', emoji: '👀', alts: ['eye', 'ice', 'i s'] },
      { en: 'ears', es: 'orejas', emoji: '👂', alts: ['ear', 'years'] },
      { en: 'mouth', es: 'boca', emoji: '👄', alts: ['mouse', 'mount'] },
      { en: 'hair', es: 'pelo', emoji: '💇', alts: ['here', 'hare', 'air'] },
      { en: 'hands', es: 'manos', emoji: '👐', alts: ['hand', 'hans', 'ends'] },
      { en: 'arm', es: 'brazo', emoji: '💪', alts: ['arms', 'harm'] },
      { en: 'leg', es: 'pierna', emoji: '🦵', alts: ['legs', 'lag', 'lake'] },
      { en: 'foot', es: 'pie', emoji: '🦶', alts: ['food', 'feet'] },
      { en: 'teeth', es: 'dientes', emoji: '🦷', alts: ['teef', 'tooth'] },
    ],
  },
  {
    id: 'family',
    title: 'My family',
    es: 'La familia',
    icon: '👨‍👩‍👧',
    color: 'from-fuchsia-500 to-purple-600',
    prompt: 'Who is it?',
    promptEs: '¿Quién es?',
    frame: (w) => `It's my ${w}.`,
    items: [
      { en: 'mum', es: 'mamá', emoji: '👩', alts: ['mom', 'mam', 'mama', 'mummy', 'mommy', 'mon'] },
      { en: 'dad', es: 'papá', emoji: '👨', alts: ['daddy', 'dead', 'dat'] },
      { en: 'sister', es: 'hermana', emoji: '👧', alts: ['sisters', 'sista'] },
      { en: 'brother', es: 'hermano', emoji: '👦', alts: ['brothers', 'bother'] },
      { en: 'grandma', es: 'abuela', emoji: '👵', alts: ['granny', 'grandmother', 'grandmom'] },
      { en: 'grandpa', es: 'abuelo', emoji: '👴', alts: ['grandfather', 'granddad', 'grandad'] },
      { en: 'baby', es: 'bebé', emoji: '👶', alts: ['bebe', 'maybe', 'bay'] },
    ],
  },
  {
    id: 'food',
    title: 'Food',
    es: 'Comida',
    icon: '🍕',
    color: 'from-yellow-500 to-amber-600',
    prompt: "What's this?",
    promptEs: '¿Qué es esto?',
    frame: (w) => `It's ${withArticle(w)}.`,
    items: [
      { en: 'pizza', es: 'pizza', emoji: '🍕', alts: ['pisa', 'peter'] },
      { en: 'apple', es: 'manzana', emoji: '🍎', alts: ['apples', 'happle'] },
      { en: 'banana', es: 'banana', emoji: '🍌', alts: ['bananas'] },
      { en: 'ice cream', es: 'helado', emoji: '🍦', alts: ['icecream', 'i scream', 'ice-cream'] },
      { en: 'cake', es: 'torta', emoji: '🍰', alts: ['kate', 'cape', 'kick'] },
      { en: 'chocolate', es: 'chocolate', emoji: '🍫', model: "It's chocolate." },
      { en: 'milk', es: 'leche', emoji: '🥛', alts: ['melk', 'mill'], model: "It's milk." },
      { en: 'bread', es: 'pan', emoji: '🍞', alts: ['bred', 'red', 'brat'], model: "It's bread." },
      { en: 'egg', es: 'huevo', emoji: '🥚', alts: ['eggs', 'act', 'ag'] },
      { en: 'burger', es: 'hamburguesa', emoji: '🍔', alts: ['hamburger', 'booger', 'berger'] },
    ],
  },
  {
    id: 'school',
    title: 'At school',
    es: 'Cosas del colegio',
    icon: '🎒',
    color: 'from-teal-500 to-cyan-600',
    prompt: "What's this?",
    promptEs: '¿Qué es esto?',
    frame: (w) => `It's ${withArticle(w)}.`,
    items: [
      { en: 'pencil', es: 'lápiz', emoji: '✏️', alts: ['pencils', 'pensil', 'stencil'] },
      { en: 'pen', es: 'lapicera', emoji: '🖊️', alts: ['pan', 'pin', 'ben'] },
      { en: 'book', es: 'libro', emoji: '📕', alts: ['books', 'look', 'buck'] },
      { en: 'bag', es: 'mochila', emoji: '🎒', alts: ['back', 'beg', 'bug'] },
      { en: 'ruler', es: 'regla', emoji: '📏', alts: ['roller', 'rule'] },
      { en: 'crayon', es: 'crayón', emoji: '🖍️', alts: ['crayons', 'crayola'] },
      { en: 'scissors', es: 'tijera', emoji: '✂️', alts: ['scissor', 'sizzers'], model: "They're scissors." },
      { en: 'teacher', es: 'maestra', emoji: '👩‍🏫', alts: ['teachers', 'teach'] },
      { en: 'computer', es: 'computadora', emoji: '💻', alts: ['computers'] },
    ],
  },
  {
    id: 'feelings',
    title: 'Feelings & sizes',
    es: 'Cómo estoy y tamaños',
    icon: '😀',
    color: 'from-lime-500 to-green-600',
    prompt: 'How are you?',
    promptEs: '¿Cómo estás?',
    frame: (w) => `I'm ${w}.`,
    items: [
      { en: 'happy', es: 'contento', emoji: '😀', alts: ['hoppy', 'happen'] },
      { en: 'sad', es: 'triste', emoji: '😢', alts: ['said', 'set', 'sat'] },
      { en: 'tired', es: 'cansado', emoji: '😴', alts: ['tire', 'tyred', 'type'] },
      { en: 'angry', es: 'enojado', emoji: '😠', alts: ['hungry', 'angri'] },
      { en: 'scared', es: 'asustado', emoji: '😱', alts: ['scare', 'skirt', 'scarred'] },
      { en: 'hungry', es: 'con hambre', emoji: '😋', alts: ['angry', 'hungary'] },
      { en: 'big', es: 'grande', emoji: '🐘', scale: 1.4, prompt: 'Is it big or small?', promptEs: '¿Es grande o chico?', model: "It's big.", alts: ['pig', 'bake', 'beg'] },
      { en: 'small', es: 'chico', emoji: '🐭', scale: 0.5, prompt: 'Is it big or small?', promptEs: '¿Es grande o chico?', model: "It's small.", alts: ['smoll', 'small'] },
    ],
  },
  {
    id: 'house',
    title: 'My house',
    es: 'La casa',
    icon: '🏠',
    color: 'from-indigo-500 to-blue-600',
    prompt: "What's this?",
    promptEs: '¿Qué es esto?',
    frame: (w) => `It's the ${w}.`,
    items: [
      { en: 'house', es: 'casa', emoji: '🏠', alts: ['horse'], model: "It's a house." },
      { en: 'kitchen', es: 'cocina', emoji: '🍳', alts: ['chicken', 'kitchens', 'kitten'] },
      { en: 'bathroom', es: 'baño', emoji: '🛁', alts: ['bath room', 'bath'] },
      { en: 'bedroom', es: 'dormitorio', emoji: '🛏️', alts: ['bed room', 'bed'] },
      { en: 'living room', es: 'living', emoji: '🛋️', alts: ['living', 'leaving room'] },
      { en: 'garden', es: 'jardín', emoji: '🌻', alts: ['gardens', 'guarding'] },
      { en: 'door', es: 'puerta', emoji: '🚪', alts: ['dor', 'poor'], model: "It's a door." },
      { en: 'window', es: 'ventana', emoji: '🪟', alts: ['windows', 'when do'], model: "It's a window." },
    ],
  },
  {
    id: 'actions',
    title: 'I can…',
    es: 'Lo que puedo hacer',
    icon: '🏊',
    color: 'from-cyan-500 to-sky-600',
    prompt: 'What can you do?',
    promptEs: '¿Qué podés hacer?',
    frame: (w) => `I can ${w}.`,
    items: [
      { en: 'swim', es: 'nadar', emoji: '🏊', alts: ['swimming', 'swing', 'with him'] },
      { en: 'run', es: 'correr', emoji: '🏃', alts: ['ran', 'running', 'rum'] },
      { en: 'jump', es: 'saltar', emoji: '🦘', alts: ['jumping', 'jam', 'champ'] },
      { en: 'dance', es: 'bailar', emoji: '💃', alts: ['dancing', 'dense', 'dans'] },
      { en: 'sing', es: 'cantar', emoji: '🎤', alts: ['singing', 'sink', 'thing', 'seen'] },
      { en: 'ride a bike', es: 'andar en bici', emoji: '🚴', alts: ['ride', 'bike', 'right a bike'] },
      { en: 'climb', es: 'trepar', emoji: '🧗', alts: ['climbing', 'claim', 'crime'] },
      { en: 'fly', es: 'volar', emoji: '🕊️', alts: ['flying', 'fry', 'flight'] },
    ],
  },
  {
    id: 'commands',
    title: 'Simon says',
    es: 'Órdenes del examen',
    icon: '👏',
    color: 'from-rose-500 to-pink-600',
    activities: ['learn', 'listen'],
    items: [
      { en: 'turn around', es: 'date vuelta (girá)', emoji: '🔄' },
      { en: 'stand up', es: 'parate', emoji: '🧍' },
      { en: 'sit down', es: 'sentate', emoji: '🪑' },
      { en: 'clap your hands', es: 'aplaudí', emoji: '👏' },
      { en: 'jump', es: 'saltá', emoji: '🦘' },
      { en: 'wave', es: 'saludá con la mano', emoji: '👋' },
      { en: 'touch your nose', es: 'tocate la nariz', emoji: '👃' },
      { en: 'close your eyes', es: 'cerrá los ojos', emoji: '😌' },
    ],
  },
  {
    // Special topic: the exam's question patterns (see data/exam.js).
    id: 'questions',
    title: 'Exam questions',
    es: 'Preguntas del examen',
    icon: '💬',
    color: 'from-violet-500 to-indigo-600',
    activities: ['learn', 'practice'],
    special: 'questions',
    items: [],
  },
]

export const DEFAULT_ACTIVITIES = ['learn', 'listen', 'write', 'speak']

export const activitiesFor = (topic) => topic.activities || DEFAULT_ACTIVITIES

export const findTopic = (id) => TOPICS.find((t) => t.id === id)

export const itemByWord = (topicId, en) => findTopic(topicId)?.items.find((i) => i.en === en)

// Model answer for the "speak" activity, e.g. "It's an elephant."
export const modelFor = (topic, item) => item.model || (topic.frame ? topic.frame(item.en) : item.en)

export const promptFor = (topic, item) => ({
  en: item.prompt || topic.prompt || "What's this?",
  es: item.promptEs || topic.promptEs || '¿Qué es esto?',
})

// Single words without spaces are short enough for a 6-year-old to spell.
export const isWritable = (item) => !item.en.includes(' ') && item.en.length <= 8

export const mistakeKey = (topicId, en) => `${topicId}:${en}`
