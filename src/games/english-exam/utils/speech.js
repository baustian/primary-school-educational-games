// Text-to-speech and speech-recognition helpers built on the Web Speech API.
// TTS works in every modern browser. Speech recognition works in Chrome, Edge,
// Android and recent Safari; everywhere else the game falls back to a
// "say it out loud and compare" mode.
import { useCallback, useEffect, useRef, useState } from 'react'

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

let voices = []
const refreshVoices = () => {
  voices = synth ? synth.getVoices() : []
}
if (synth) {
  refreshVoices()
  if (synth.addEventListener) synth.addEventListener('voiceschanged', refreshVoices)
  else synth.onvoiceschanged = refreshVoices
}

// British English first: AACI examiners follow Cambridge English.
const LANG_ORDER = {
  en: ['en-GB', 'en-IE', 'en-AU', 'en-US', 'en'],
  es: ['es-AR', 'es-US', 'es-419', 'es-MX', 'es-ES', 'es'],
}

const voiceQuality = (v) =>
  (/natural|neural|online|enhanced|premium/i.test(v.name) ? 4 : 0) +
  (/google/i.test(v.name) ? 3 : 0) +
  (/sonia|libby|serena|kate|female|mujer|paulina|elena/i.test(v.name) ? 1 : 0)

const voiceCache = {}

export function pickVoice(lang) {
  if (!voices.length) refreshVoices()
  const cacheKey = `${lang}:${voices.length}`
  if (voiceCache[cacheKey] !== undefined) return voiceCache[cacheKey]
  let chosen = null
  for (const code of LANG_ORDER[lang]) {
    const candidates = voices.filter((v) =>
      (v.lang || '').replace('_', '-').toLowerCase().startsWith(code.toLowerCase()),
    )
    if (candidates.length) {
      chosen = [...candidates].sort((a, b) => voiceQuality(b) - voiceQuality(a))[0]
      break
    }
  }
  voiceCache[cacheKey] = chosen
  return chosen
}

export const canSpeak = !!synth

export const ENGLISH_RATE = 0.85
export const SLOW_RATE = 0.55

// speak('cat') or speak(['cat', { text: 'gato', lang: 'es' }], { slow: true })
export function speak(parts, { slow = false } = {}) {
  if (!synth) return
  synth.cancel()
  if (synth.paused) synth.resume()
  const list = (Array.isArray(parts) ? parts : [parts])
    .filter(Boolean)
    .map((p) => (typeof p === 'string' ? { text: p } : p))
  for (const { text, lang = 'en' } of list) {
    const u = new SpeechSynthesisUtterance(text)
    const voice = pickVoice(lang)
    if (voice) u.voice = voice
    u.lang = voice?.lang || (lang === 'es' ? 'es-AR' : 'en-GB')
    u.rate = lang === 'es' ? 1 : slow ? SLOW_RATE : ENGLISH_RATE
    u.pitch = 1.05
    synth.speak(u)
  }
}

export const speakEs = (text) => speak({ text, lang: 'es' })

export function stopSpeaking() {
  synth?.cancel()
}

export const PRAISE = ['Great!', 'Well done!', 'Excellent!', 'Super!', 'Very good!', 'Fantastic!']
export const randomPraise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)]

// ---------------------------------------------------------------------------
// Speech recognition
// ---------------------------------------------------------------------------

const Recognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export const canListen = !!Recognition

// Shared across components so we only ask once per session after a denial.
let micDenied = false

export function useListener() {
  const [listening, setListening] = useState(false)
  const [denied, setDenied] = useState(micDenied)
  const recRef = useRef(null)

  useEffect(() => () => recRef.current?.abort(), [])

  // onResult receives every transcript alternative ([] when nothing was heard).
  const listen = useCallback((onResult) => {
    if (!Recognition) return
    stopSpeaking()
    recRef.current?.abort()
    const rec = new Recognition()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.continuous = false
    rec.maxAlternatives = 5
    let delivered = false
    let blocked = false
    rec.onresult = (event) => {
      const alternatives = []
      for (const result of event.results) {
        for (let i = 0; i < result.length; i++) alternatives.push(result[i].transcript)
      }
      delivered = true
      onResult(alternatives)
    }
    rec.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        blocked = true
        micDenied = true
        setDenied(true)
      }
    }
    rec.onend = () => {
      setListening(false)
      if (!delivered && !blocked) onResult([])
    }
    recRef.current = rec
    setListening(true)
    try {
      rec.start()
    } catch {
      setListening(false)
    }
  }, [])

  const stop = useCallback(() => recRef.current?.stop(), [])

  return { supported: canListen && !denied, listening, listen, stop }
}

// ---------------------------------------------------------------------------
// Answer matching — deliberately forgiving: a 6-year-old with a Spanish accent
// talking to a recognizer trained mostly on adults.
// ---------------------------------------------------------------------------

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve',
]

export function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\b(\d+)\b/g, (m) => NUMBER_WORDS[Number(m)] ?? m)
    .replace(/'/g, '')
    .replace(/[^a-z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const STOP_WORDS = new Set(['a', 'an', 'the', 'your', 'my', 'its', 'it', 'is', 'im', 'i'])

function levenshtein(a, b) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = tmp
    }
  }
  return dp[b.length]
}

function wordMatches(heard, target) {
  if (heard === target) return true
  const h = heard.replace(/s$/, '')
  const t = target.replace(/s$/, '')
  if (h === t) return true
  const tolerance = t.length >= 7 ? 2 : t.length >= 4 ? 1 : 0
  return tolerance > 0 && levenshtein(h, t) <= tolerance
}

// True when any alternative contains every meaningful word of any target phrase.
export function heardAny(alternatives, targets) {
  return alternatives.some((alt) => {
    const words = normalize(alt).split(' ').filter(Boolean)
    return targets.some((target) => {
      const targetWords = normalize(target)
        .split(' ')
        .filter((w) => w && !STOP_WORDS.has(w))
      if (!targetWords.length) return false
      return targetWords.every((tw) => words.some((w) => wordMatches(w, tw)))
    })
  })
}

// Returns the first candidate (an object with `en` and optional `alts`) that was heard.
export function findHeard(alternatives, candidates) {
  return candidates.find((c) => heardAny(alternatives, [c.en, ...(c.alts || [])])) || null
}

const YES = ['yes', 'yeah', 'yep', 'yup', 'yes i do', 'yes it is']
const NO = ['no', 'nope', 'not', 'dont', 'isnt', 'cant', 'havent', 'im not']

// 'yes' | 'no' | 'spanish' (said "sí") | null
export function heardYesNo(alternatives) {
  const words = new Set(alternatives.flatMap((a) => normalize(a).split(' ')))
  if (YES.some((y) => words.has(y))) return 'yes'
  if (NO.some((n) => words.has(n))) return 'no'
  if (words.has('si') || words.has('see') || words.has('sea')) return 'spanish'
  return null
}

export const heardSomething = (alternatives) => alternatives.some((a) => normalize(a).length > 0)

export const bestTranscript = (alternatives) => alternatives.find((a) => a.trim()) || ''
