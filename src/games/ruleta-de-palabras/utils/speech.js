// Voz en castellano para Ruleta de Palabras (Web Speech API).
// El reconocimiento funciona en Chrome, Edge, Android y Safari reciente; en
// los demás navegadores el botón de micrófono no aparece y se juega tocando
// las letras.
import { useCallback, useEffect, useRef, useState } from 'react'
import { letters } from '../data/gameData'

// ---------------------------------------------------------------------------
// Texto a voz
// ---------------------------------------------------------------------------

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
const SPANISH = ['es-AR', 'es-419', 'es-US', 'es-MX', 'es-ES', 'es']

function pickSpanishVoice() {
  const voices = synth?.getVoices() || []
  for (const code of SPANISH) {
    const found = voices.filter((v) => (v.lang || '').replace('_', '-').toLowerCase().startsWith(code.toLowerCase()))
    if (found.length) {
      return found.find((v) => /natural|neural|online|google/i.test(v.name)) || found[0]
    }
  }
  return null
}

export const canSpeak = !!synth

export function speak(text) {
  if (!synth || !text) return
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const voice = pickSpanishVoice()
  if (voice) u.voice = voice
  u.lang = voice?.lang || 'es-AR'
  u.rate = 0.95
  synth.speak(u)
}

export const stopSpeaking = () => synth?.cancel()

// ---------------------------------------------------------------------------
// Reconocimiento de voz
// ---------------------------------------------------------------------------

const Recognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

export const canListen = !!Recognition

export function useListener() {
  const [listening, setListening] = useState(false)
  const [denied, setDenied] = useState(false)
  const recRef = useRef(null)

  useEffect(() => () => recRef.current?.abort(), [])

  // onResult recibe todas las alternativas transcriptas ([] si no escuchó nada).
  const listen = useCallback((onResult) => {
    if (!Recognition) return
    stopSpeaking()
    recRef.current?.abort()
    const rec = new Recognition()
    rec.lang = 'es-AR'
    rec.interimResults = false
    rec.continuous = false
    rec.maxAlternatives = 5
    let delivered = false
    let cancelled = false
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
        setDenied(true)
        cancelled = true
      }
      if (event.error === 'aborted') cancelled = true
    }
    rec.onend = () => {
      if (recRef.current === rec) recRef.current = null
      setListening(false)
      if (!delivered && !cancelled) onResult([])
    }
    recRef.current = rec
    setListening(true)
    try {
      rec.start()
    } catch {
      recRef.current = null
      setListening(false)
    }
  }, [])

  // Corta sin entregar resultado (fin del turno, cambio de pantalla).
  const cancel = useCallback(() => {
    const rec = recRef.current
    recRef.current = null
    if (rec) {
      rec.onresult = null
      rec.onend = null
      rec.abort()
    }
    setListening(false)
  }, [])

  return { supported: canListen && !denied, denied, listening, listen, cancel }
}

// ---------------------------------------------------------------------------
// Validación de la palabra dicha
// ---------------------------------------------------------------------------

const NUMBERS = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
  'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho',
  'diecinueve', 'veinte',
]
const TENS = { 30: 'treinta', 40: 'cuarenta', 50: 'cincuenta', 60: 'sesenta', 70: 'setenta', 80: 'ochenta', 90: 'noventa', 100: 'cien', 1000: 'mil' }

// Minúsculas, sin tildes (la ñ pasa a n) ni signos; los dígitos se pasan a palabras.
export function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\d+/g, (m) => NUMBERS[Number(m)] ?? TENS[Number(m)] ?? m)
    .replace(/[^a-z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Letra del tablero con la que empieza una palabra (Á → A, Ñ → N).
export const firstLetter = (word) => normalize(word).charAt(0).toUpperCase()

const FILLER = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'eh', 'em', 'mm', 'este', 'esta',
  'es', 'mi', 'palabra', 'digo', 'yo', 'y', 'de',
])

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

// Saca muletillas y artículos del principio ("la jirafa", "eh... jirafa").
function stripFiller(words) {
  let start = 0
  while (start < words.length - 1 && FILLER.has(words[start])) start++
  return words.slice(start)
}

// Frases candidatas de una transcripción: la frase completa sin artículos y cada palabra suelta.
function candidatesOf(alternative) {
  const words = stripFiller(normalize(alternative).split(' ').filter(Boolean))
  if (!words.length) return []
  const list = [words.join(' ')]
  for (const word of words) if (!FILLER.has(word) && !list.includes(word)) list.push(word)
  return list
}

const singular = (s) => s.replace(/(es|s)$/, '')

function similar(heard, target) {
  if (heard === target) return true
  if (singular(heard) === singular(target)) return true
  const tolerance = target.length >= 8 ? 2 : target.length >= 4 ? 1 : 0
  return tolerance > 0 && levenshtein(heard, target) <= tolerance
}

/**
 * Evalúa lo que dijo el jugador para el tema actual.
 * Devuelve:
 *  - { kind: 'nothing' }                      no se escuchó nada
 *  - { kind: 'valid', word, letter }          palabra del tema con letra libre
 *  - { kind: 'used', word, letter }           palabra correcta pero la letra ya salió
 *  - { kind: 'noLetter', word, letter }       empieza con una letra que no está en el tablero
 *  - { kind: 'unknown', word, letter }        letra libre pero la palabra no está en la lista
 */
export function evaluateAnswer(alternatives, topic, usedLetters) {
  const heard = alternatives.map(candidatesOf).filter((c) => c.length)
  if (!heard.length) return { kind: 'nothing' }

  const topicWords = topic.words.map((word) => ({ word, norm: normalize(word) }))
  const letterState = (letter) =>
    !letters.includes(letter) ? 'noLetter' : usedLetters.includes(letter) ? 'used' : 'valid'

  // 1) Coincidencia exacta y 2) coincidencia aproximada, recorriendo las alternativas en orden.
  // Se prefiere una palabra cuya letra esté libre.
  for (const exact of [true, false]) {
    let fallback = null
    for (const candidates of heard) {
      for (const candidate of candidates) {
        const match = topicWords.find((t) => (exact ? t.norm === candidate : similar(candidate, t.norm)))
        if (!match) continue
        const letter = firstLetter(match.word)
        const state = letterState(letter)
        if (state === 'valid') return { kind: 'valid', word: match.word, letter }
        fallback ??= { kind: state, word: match.word, letter }
      }
    }
    if (fallback) return fallback
  }

  // No está en la lista: se toma la primera transcripción como la palabra dicha.
  const raw = alternatives.find((a) => normalize(a)) || ''
  const rawWords = raw.replace(/[.,!?¿¡]/g, ' ').trim().split(/\s+/)
  let start = 0
  while (start < rawWords.length - 1 && FILLER.has(normalize(rawWords[start]))) start++
  const word = rawWords.slice(start).join(' ')
  const letter = firstLetter(word)
  const state = letterState(letter)
  return { kind: state === 'valid' ? 'unknown' : state, word, letter }
}
