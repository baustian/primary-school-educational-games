import { useCallback, useEffect, useRef, useState } from 'react'
import { topics, gameConfig, letters } from './data/gameData'
import { useUser } from '../../hooks/useUser'
import EducationalInfoModal from '../../components/EducationalInfoModal'
import { games } from '../../data/games'
import ModeSelector from './components/ModeSelector'
import RoundScreen from './components/RoundScreen'
import GameOverScreen from './components/GameOverScreen'
import { evaluateAnswer, firstLetter, speak, stopSpeaking, useListener } from './utils/speech'

const SETTINGS_KEY = 'ruleta-de-palabras:settings'

const DEFAULT_SETTINGS = {
  mode: 'computer', // 'computer' | '2players'
  time: gameConfig.defaultTime,
  difficulty: 'normal', // 'facil' | 'normal' | 'dificil'
  readAloud: true,
  player2Name: '',
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
    const merged = { ...DEFAULT_SETTINGS, ...saved }
    if (!gameConfig.timeOptions.includes(merged.time)) merged.time = DEFAULT_SETTINGS.time
    return merged
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // Sin almacenamiento disponible: la configuración dura solo esta sesión.
  }
}

const shuffle = (list) => {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const randomItem = (list) => list[Math.floor(Math.random() * list.length)]

const EMPTY_SCORES = { player1: 0, player2: 0 }

function RuletaDePalabras() {
  const { userName, addScore } = useUser()
  const gameInfo = games.find((g) => g.id === 'ruleta-de-palabras')?.educationalInfo

  const [settings, setSettings] = useState(loadSettings)
  const [phase, setPhase] = useState('setup') // setup | playing | gameOver
  const [scores, setScores] = useState(EMPTY_SCORES)
  const [usedLetters, setUsedLetters] = useState([])
  const [player, setPlayer] = useState(1)
  // status: spinning (ruleta de temas) | answering | confirm (¿vale la palabra?) | result
  const [turn, setTurn] = useState(null)
  const [timeLeft, setTimeLeft] = useState(settings.time)
  const [feedback, setFeedback] = useState(null)
  const [pendingWord, setPendingWord] = useState(null)
  const [history, setHistory] = useState([])

  const { supported: voiceSupported, denied: micDenied, listening, listen, cancel: cancelListening } = useListener()

  const timerRef = useRef(null)
  const topicBagRef = useRef([])
  const resolvedTurnRef = useRef(0)
  const latest = useRef({})

  const isComputerTurn = settings.mode === 'computer' && player === 2
  const names = {
    1: userName || (settings.mode === 'computer' ? 'Vos' : 'Jugador 1'),
    2: settings.mode === 'computer' ? 'Computadora' : settings.player2Name.trim() || 'Jugador 2',
  }

  const schedule = (fn, ms) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(fn, ms)
  }

  // Cancelar todo al salir del juego.
  useEffect(
    () => () => {
      clearTimeout(timerRef.current)
      stopSpeaking()
    },
    [],
  )

  // Saca temas de una "bolsa" mezclada para que no se repitan hasta haber salido todos.
  const drawTopic = (previous) => {
    if (!topicBagRef.current.length) {
      let bag = shuffle(topics)
      if (previous && bag[bag.length - 1].id === previous.id) bag = [previous, ...bag.slice(0, -1)]
      topicBagRef.current = bag
    }
    return topicBagRef.current.pop()
  }

  const beginTurn = (nextPlayer, number, cfg, previousTopic) => {
    const topic = drawTopic(previousTopic)
    cancelListening()
    setPlayer(nextPlayer)
    setTurn({ number, topic, status: 'spinning', result: null })
    setTimeLeft(cfg.time)
    setFeedback(null)
    setPendingWord(null)
    schedule(() => {
      setTurn((t) => (t && t.number === number ? { ...t, status: 'answering' } : t))
      if (cfg.readAloud) speak(topic.name)
    }, gameConfig.spinDuration)
  }

  const startGame = (cfg) => {
    setSettings(cfg)
    saveSettings(cfg)
    clearTimeout(timerRef.current)
    topicBagRef.current = []
    resolvedTurnRef.current = 0
    setScores(EMPTY_SCORES)
    setUsedLetters([])
    setHistory([])
    setPhase('playing')
    beginTurn(1, 1, cfg, null)
  }

  const finishGame = (finalScores) => {
    clearTimeout(timerRef.current)
    cancelListening()
    stopSpeaking()
    setScores(finalScores)
    setPhase('gameOver')
    if (userName && finalScores.player1 > 0) addScore(finalScores.player1)
  }

  // result: { type: 'correct' | 'timeout' | 'pass' | 'computerMiss', letter?, word?, by? }
  const resolveTurn = (result) => {
    if (!turn || resolvedTurnRef.current === turn.number) return
    resolvedTurnRef.current = turn.number
    cancelListening()

    let newUsed = usedLetters
    let newScores = scores
    if (result.type === 'correct') {
      newUsed = [...usedLetters, result.letter]
      const key = `player${player}`
      newScores = { ...scores, [key]: scores[key] + gameConfig.pointsPerWord }
      setUsedLetters(newUsed)
      setScores(newScores)
      setHistory((h) => [...h, { player, topic: turn.topic, letter: result.letter, word: result.word || null }])
    }
    setTurn({ ...turn, status: 'result', result })
    setFeedback(null)
    setPendingWord(null)
    if (result.by === 'computer' && settings.readAloud) speak(result.word)

    const gameEnds = letters.length - newUsed.length <= gameConfig.lettersLeftToFinish
    const delay = result.by === 'computer' ? gameConfig.computerResultDuration : gameConfig.resultDuration
    schedule(() => {
      if (gameEnds) finishGame(newScores)
      else beginTurn(player === 1 ? 2 : 1, turn.number + 1, settings, turn.topic)
    }, delay)
  }

  // Los temporizadores usan siempre la última versión de las funciones.
  useEffect(() => {
    latest.current = { resolveTurn, turn, usedLetters }
  })

  // Cuenta regresiva
  const status = turn?.status
  const turnNumber = turn?.number
  useEffect(() => {
    if (status !== 'answering') return undefined
    const id = setTimeout(() => {
      if (timeLeft <= 1) {
        setTimeLeft(0)
        latest.current.resolveTurn({ type: 'timeout' })
      } else {
        setTimeLeft(timeLeft - 1)
      }
    }, 1000)
    return () => clearTimeout(id)
  }, [status, turnNumber, timeLeft])

  // Turno de la computadora
  useEffect(() => {
    if (status !== 'answering' || !isComputerTurn) return undefined
    const thinking = Math.min(1500 + Math.random() * 2000, (settings.time - 1) * 1000)
    const id = setTimeout(() => {
      const { topic } = latest.current.turn
      const options = topic.words.filter((word) => {
        const letter = firstLetter(word)
        return letters.includes(letter) && !latest.current.usedLetters.includes(letter)
      })
      const missChance = gameConfig.computerMissChance[settings.difficulty] ?? 0.15
      if (!options.length || Math.random() < missChance) {
        latest.current.resolveTurn({ type: 'computerMiss' })
      } else {
        const word = randomItem(options)
        latest.current.resolveTurn({ type: 'correct', letter: firstLetter(word), word, by: 'computer' })
      }
    }, thinking)
    return () => clearTimeout(id)
  }, [status, turnNumber, isComputerTurn, settings.time, settings.difficulty])

  const canAnswer = phase === 'playing' && status === 'answering' && !isComputerTurn

  const handleLetterSelected = (letter) => {
    if (!canAnswer || usedLetters.includes(letter)) return
    resolveTurn({ type: 'correct', letter, by: 'tap' })
  }

  const handleHeard = (alternatives) => {
    const { turn: current, usedLetters: used, resolveTurn: resolve } = latest.current
    if (current?.status !== 'answering') return
    const evaluation = evaluateAnswer(alternatives, current.topic, used)
    const { word, letter } = evaluation
    switch (evaluation.kind) {
      case 'valid':
        resolve({ type: 'correct', letter, word, by: 'voice' })
        break
      case 'unknown':
        setFeedback(null)
        setPendingWord({ word, letter })
        setTurn((t) => ({ ...t, status: 'confirm' }))
        break
      case 'used':
        setFeedback({ tone: 'warn', text: `"${word}" empieza con ${letter}, pero esa letra ya salió. ¡Pensá otra!` })
        break
      case 'noLetter':
        setFeedback({
          tone: 'warn',
          text: letter
            ? `"${word}" empieza con ${letter}, que no está en el tablero. ¡Pensá otra!`
            : 'No entendí la palabra. Probá de nuevo.',
        })
        break
      default:
        setFeedback({ tone: 'info', text: 'No te escuché. Tocá el micrófono y probá de nuevo.' })
    }
  }

  const handleVoice = () => {
    if (!canAnswer) return
    if (listening) {
      cancelListening()
      return
    }
    setFeedback(null)
    listen(handleHeard)
  }

  const confirmPending = (accepted) => {
    if (status !== 'confirm' || !pendingWord) return
    if (accepted) {
      resolveTurn({ type: 'correct', letter: pendingWord.letter, word: pendingWord.word, by: 'voice' })
    } else {
      setPendingWord(null)
      setFeedback({ tone: 'info', text: 'No vale. ¡Probá con otra palabra!' })
      setTurn((t) => ({ ...t, status: 'answering' }))
    }
  }

  // También se puede jugar con el teclado de la computadora.
  const keyHandler = useRef(null)
  useEffect(() => {
    keyHandler.current = handleLetterSelected
  })
  const onKeyDown = useCallback((event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)) return
    const key = event.key?.toUpperCase()
    if (key && key.length === 1 && letters.includes(key)) keyHandler.current?.(key)
  }, [])
  useEffect(() => {
    if (phase !== 'playing') return undefined
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, onKeyDown])

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-blue-500 to-blue-600">
      <div className="p-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6 drop-shadow-lg">
            🎡 Ruleta de Palabras
          </h1>

          {phase === 'setup' && (
            <ModeSelector
              initialSettings={settings}
              userName={userName}
              voiceSupported={voiceSupported}
              onStart={startGame}
            />
          )}

          {phase === 'playing' && turn && (
            <RoundScreen
              turn={turn}
              names={names}
              currentPlayer={player}
              isComputerTurn={isComputerTurn}
              isComputerMode={settings.mode === 'computer'}
              scores={scores}
              timeLeft={timeLeft}
              totalTime={settings.time}
              usedLetters={usedLetters}
              feedback={feedback}
              pendingWord={pendingWord}
              voiceSupported={voiceSupported}
              micDenied={micDenied}
              listening={listening}
              canAnswer={canAnswer}
              onLetterSelected={handleLetterSelected}
              onVoice={handleVoice}
              onConfirm={confirmPending}
              onPass={() => canAnswer && resolveTurn({ type: 'pass' })}
              onQuit={() => finishGame(scores)}
            />
          )}

          {phase === 'gameOver' && (
            <GameOverScreen
              scores={scores}
              names={names}
              isComputerMode={settings.mode === 'computer'}
              history={history}
              onPlayAgain={() => startGame(settings)}
              onChangeSettings={() => setPhase('setup')}
            />
          )}
        </div>
      </div>

      <EducationalInfoModal gameInfo={gameInfo} />
    </div>
  )
}

export default RuletaDePalabras
