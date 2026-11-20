import { Link } from 'react-router-dom'

function GameOverScreen({ scores, names, isComputerMode, history, onPlayAgain, onChangeSettings }) {
  const { player1, player2 } = scores
  const winner = player1 === player2 ? null : player1 > player2 ? 1 : 2
  const icon = (n) => (n === 2 && isComputerMode ? '🤖' : '👤')

  let headline
  if (winner === null) {
    headline = { title: '🤝 ¡Empate!', subtitle: `Los dos con ${player1} puntos`, style: 'from-purple-400 to-pink-500 text-white' }
  } else if (winner === 1) {
    headline = {
      title: isComputerMode ? '🎉 ¡Ganaste!' : `🥇 ¡Ganó ${names[1]}!`,
      subtitle: `${player1} puntos`,
      style: 'from-yellow-300 to-yellow-500 text-gray-800',
    }
  } else {
    headline = {
      title: isComputerMode ? '😅 Esta vez ganó la computadora' : `🥇 ¡Ganó ${names[2]}!`,
      subtitle: `${player2} puntos`,
      style: isComputerMode ? 'from-red-300 to-red-500 text-white' : 'from-yellow-300 to-yellow-500 text-gray-800',
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center space-y-6 animate-pop">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800">🏆 ¡Fin del juego!</h2>

      <div className={`bg-gradient-to-r rounded-xl p-6 shadow-lg ${headline.style}`}>
        <p className="text-3xl font-bold mb-1">{headline.title}</p>
        <p className="text-xl font-semibold">{headline.subtitle}</p>
      </div>

      <div className="space-y-3">
        {[1, 2].map((n) => (
          <div
            key={n}
            className={`bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4 flex items-center justify-between ${
              winner === n ? 'ring-4 ring-yellow-400' : ''
            }`}
          >
            <span className="text-2xl">{winner === n ? '🥇' : winner === null ? '🤝' : '🥈'}</span>
            <span className="text-xl font-semibold text-gray-800 truncate px-2">
              {icon(n)} {names[n]}
            </span>
            <span className="text-2xl font-bold text-blue-600">{scores[`player${n}`]}</span>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <div className="text-left">
          <h3 className="text-xl font-bold text-gray-700 mb-3 text-center">📝 Palabras de la partida</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {history.map((h, i) => (
              <li key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                <span className="w-9 h-9 shrink-0 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
                  {h.letter}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-gray-800 uppercase truncate">{h.word || '(tocó la letra)'}</span>
                  <span className="block text-xs text-gray-500 truncate">
                    {h.topic.emoji} {h.topic.name.toUpperCase()} · {names[h.player]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-2 space-y-3">
        <button
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-lg text-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
        >
          🎮 Jugar de nuevo
        </button>
        <button
          onClick={onChangeSettings}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-lg transition-all"
        >
          ⚙️ Cambiar modo o tiempo
        </button>
        <Link
          to="/"
          className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg text-lg transition-all"
        >
          🏠 Ir al inicio
        </Link>
      </div>
    </div>
  )
}

export default GameOverScreen
