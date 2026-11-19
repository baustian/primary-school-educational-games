import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const EMPTY = {
  topics: {}, // { [topicId]: { [activityId]: stars (1-3) } }
  mistakes: {}, // { "topicId:word": count } — drives "Repaso rápido"
  exam: { best: null, attempts: 0 },
  settings: { uppercase: true, keyboard: false, age: 6 },
}

const storageKey = (userName) => `englishExam:${userName || 'invitado'}`

function load(userName) {
  try {
    const raw = localStorage.getItem(storageKey(userName))
    if (!raw) return EMPTY
    const saved = JSON.parse(raw)
    return { ...EMPTY, ...saved, settings: { ...EMPTY.settings, ...saved.settings } }
  } catch {
    return EMPTY
  }
}

export function useProgress(userName) {
  const [progress, setProgress] = useState(() => load(userName))

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userName), JSON.stringify(progress))
    } catch {
      // Storage full or blocked: progress just won't persist.
    }
  }, [progress, userName])

  const saveStars = useCallback((topicId, activityId, stars) => {
    setProgress((p) => {
      const topic = p.topics[topicId] || {}
      if ((topic[activityId] || 0) >= stars) return p
      return { ...p, topics: { ...p.topics, [topicId]: { ...topic, [activityId]: stars } } }
    })
  }, [])

  const recordAnswer = useCallback((key, firstTry) => {
    setProgress((p) => {
      const current = p.mistakes[key] || 0
      const next = firstTry ? Math.max(0, current - 1) : current + 1
      if (next === current) return p
      const mistakes = { ...p.mistakes, [key]: next }
      if (next === 0) delete mistakes[key]
      return { ...p, mistakes }
    })
  }, [])

  const saveExam = useCallback((score) => {
    setProgress((p) => ({
      ...p,
      exam: { best: Math.max(p.exam.best ?? 0, score), attempts: p.exam.attempts + 1 },
    }))
  }, [])

  const setSetting = useCallback((key, value) => {
    setProgress((p) => ({ ...p, settings: { ...p.settings, [key]: value } }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress((p) => ({ ...EMPTY, settings: p.settings }))
  }, [])

  return { progress, saveStars, recordAnswer, saveExam, setSetting, resetProgress }
}

export const starsFor = (correct, total) => {
  if (!total) return 3
  const ratio = correct / total
  if (ratio >= 0.85) return 3
  if (ratio >= 0.55) return 2
  return 1
}

// Settings that deeply nested components need (uppercase display, keyboard mode…)
export const SettingsContext = createContext({ settings: EMPTY.settings, setSetting: () => {} })
export const useSettings = () => useContext(SettingsContext)

export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export const pickRandom = (array) => array[Math.floor(Math.random() * array.length)]
