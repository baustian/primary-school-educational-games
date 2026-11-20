import { useEffect, useState } from 'react'
import { gameConfig, letters, topics } from '../data/gameData'
import { canSpeak, speak } from '../utils/speech'
import LetterGrid from './LetterGrid'
import ScoreBoard from './ScoreBoard'
import Timer from './Timer'

// Tarjeta del tema. Mientras gira, va mostrando temas al azar como una ruleta.
function TopicCard({ topic, spinning, canReplay }) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!spinning) return undefined
    const id = setInterval(() => setShown(Math.floor(Math.random() * topics.length)), 90)
    return () => clearInterval(id)
  }, [spinning])

  const display = spinning ? topics[shown] : topic

  return (
    <div
      className={`relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 md:p-8 text-center shadow-lg ${
        spinning ? '' : 'animate-pop'
      }`}
    >
      <p className="text-white text-sm font-semibold uppercase tracking-widest mb-2">
        {spinning ? '🎡 Girando la ruleta…' : 'Tema'}
      </p>
      <div className={`flex items-center justify-center gap-4 ${spinning ? 'opacity-80' : ''}`}>
        <span className="text-5xl md:text-6xl">{display.emoji}</span>
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wide">{display.name}</h2>
      </div>
      {canReplay && (
        <button
          onClick={() => speak(topic.name)}
          className="absolute top-2 right-2 bg-white/25 hover:bg-white/40 text-white rounded-full w-10 h-10 text-xl"
          title="Escuchar el tema"
          aria-label="Escuchar el tema"
        >
          🔊
        </button>
      )}
    </div>
  )
}

const TONES = {
  info: 'bg-blue-50 border-blue-400 text-blue-900',
  warn: 'bg-amber-50 border-amber-400 text-amber-900 animate-shake',
}

function ResultBanner({ result, names, player, isComputerTurn }) {
  if (result.type === 'correct') {
    const who = isComputerTurn ? 'la computadora' : names[player]
    return (
      <div className="bg-green-500 text-white rounded-xl p-6 text-center animate-pop">
        {result.word && (
          <p className="text-4xl md:text-6xl font-black uppercase drop-shadow mb-2">
            {isComputerTurn ? '🤖 ' : result.by === 'voice' ? '🎤 ' : ''}
            {result.word}
          </p>
        )}
        <p className="text-2xl font-bold">
          🎉 ¡Punto para {who}! Letra {result.letter}
        </p>
        <p className="text-lg mt-1">+{gameConfig.pointsPerWord} puntos</p>
      </div>
    )
  }
  const messages = {
    timeout: ['⏰ ¡Se acabó el tiempo!', 'Sin puntos en este turno'],
    pass: ['⏭️ Turno pasado', 'Sin puntos en este turno'],
    computerMiss: ['🤖 La computadora no encontró palabra', '¡Sin puntos para ella!'],
  }
  const [title, subtitle] = messages[result.type] || messages.timeout
  return (
    <div className="bg-red-500 text-white rounded-xl p-6 text-center animate-pop">
      <p className="text-2xl font-bold">{title}</p>
      <p className="text-lg mt-1">{subtitle}</p>
    </div>
  )
}

function RoundScreen({
  turn,
  names,
  currentPlayer,
  isComputerTurn,
  isComputerMode,
  scores,
  timeLeft,
  totalTime,
  usedLetters,
  feedback,
  pendingWord,
  voiceSupported,
  micDenied,
  listening,
  canAnswer,
  onLetterSelected,
  onVoice,
  onConfirm,
  onPass,
  onQuit,
}) {
  const { topic, status, result } = turn
  const spinning = status === 'spinning'
  const lettersLeft = letters.length - usedLetters.length
  const toGo = lettersLeft - gameConfig.lettersLeftToFinish
  const lastLetter = status === 'result' && result?.type === 'correct' ? result.letter : null

  const turnLabel = isComputerTurn
    ? status === 'answering'
      ? '🤔 La computadora está pensando…'
      : '🤖 Turno de la computadora'
    : `🎮 Turno de ${names[currentPlayer]}`

  return (
    <div className="space-y-4">
      {/* Progreso */}
      <div className="bg-white rounded-xl shadow-lg p-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-gray-700 font-semibold">Turno {turn.number}</p>
        <p className="text-gray-700 font-semibold">
          {toGo > 0 ? (
            <>
              Faltan <span className="text-blue-600 font-bold">{toGo}</span> {toGo === 1 ? 'letra' : 'letras'} para el final
            </>
          ) : (
            '¡Última letra!'
          )}
        </p>
        <button onClick={onQuit} className="text-sm text-gray-500 hover:text-red-600 underline">
          Terminar partida
        </button>
      </div>

      <ScoreBoard scores={scores} currentPlayer={currentPlayer} names={names} isComputerMode={isComputerMode} />

      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 space-y-6">
        <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-xl p-4 text-center shadow-lg">
          <p className={`text-2xl font-bold ${isComputerTurn && status === 'answering' ? 'text-orange-700 animate-pulse' : 'text-gray-800'}`}>
            {turnLabel}
          </p>
        </div>

        <TopicCard topic={topic} spinning={spinning} canReplay={!spinning && canSpeak} />

        {(status === 'answering' || status === 'confirm') && (
          <Timer timeLeft={timeLeft} totalTime={totalTime} paused={status === 'confirm'} />
        )}

        {/* Respuesta por voz */}
        {status === 'confirm' && pendingWord && (
          <div className="bg-purple-50 border-4 border-purple-400 rounded-xl p-6 text-center space-y-4 animate-pop">
            <p className="text-gray-700 font-semibold">Escuché:</p>
            <p className="text-4xl font-black text-purple-700 uppercase">{pendingWord.word}</p>
            <p className="text-gray-700">
              No la tengo en mi lista de <strong className="uppercase">{topic.name}</strong>. ¿Vale con la letra{' '}
              <strong>{pendingWord.letter}</strong>?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onConfirm(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-xl"
              >
                ✅ Sí, vale
              </button>
              <button
                onClick={() => onConfirm(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl text-xl"
              >
                ❌ No vale / escuchó mal
              </button>
            </div>
          </div>
        )}

        {status === 'answering' && !isComputerTurn && (
          <div className="space-y-3">
            <p className="text-center text-gray-800 font-semibold text-lg">
              💭 Pensá una palabra de <span className="text-blue-600 font-bold uppercase">{topic.name}</span>
            </p>
            {voiceSupported && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onVoice}
                  disabled={!canAnswer}
                  className={`flex items-center gap-3 font-bold py-3 px-6 rounded-full text-xl text-white shadow-lg transition transform active:scale-95 ${
                    listening ? 'bg-red-500 animate-pulse' : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'
                  }`}
                >
                  <span className="text-2xl">🎤</span>
                  {listening ? 'Te escucho… (tocá para cortar)' : 'Decí la palabra'}
                </button>
                <p className="text-sm text-gray-500">o tocá la letra con la que empieza</p>
              </div>
            )}
            {micDenied && (
              <p className="text-center text-sm text-gray-500">
                🎤 El micrófono está bloqueado. Podés seguir jugando tocando las letras.
              </p>
            )}
            {feedback && (
              <div className={`border-2 rounded-xl p-4 text-center font-semibold ${TONES[feedback.tone] || TONES.info}`}>
                {feedback.text}
              </div>
            )}
          </div>
        )}

        {status === 'result' && result && (
          <ResultBanner result={result} names={names} player={currentPlayer} isComputerTurn={isComputerTurn} />
        )}

        <LetterGrid
          usedLetters={usedLetters}
          highlight={lastLetter}
          onLetterSelected={onLetterSelected}
          disabled={!canAnswer}
        />

        {status === 'answering' && !isComputerTurn && (
          <div className="text-center">
            <button onClick={onPass} className="text-gray-600 hover:text-gray-800 font-semibold underline">
              ⏭️ No se me ocurre nada, paso
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoundScreen
