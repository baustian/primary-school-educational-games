import LetterGrid from './LetterGrid';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';

function RoundScreen({
  roundNumber,
  totalRounds,
  topic,
  currentPlayer,
  gameMode,
  scores,
  roundWinner,
  displayTime,
  isTimeRunning,
  usedLetters,
  computerWord,
  userName,
  onLetterSelected,
}) {
  // Check if computer is thinking
  const computerThinking = gameMode === 'computer' && currentPlayer === 2 && isTimeRunning && roundWinner === null;

  const playerLabel = gameMode === 'computer'
    ? (currentPlayer === 1 ? 'Tu turno' : 'Turno de la Computadora')
    : `Turno del Jugador ${currentPlayer}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 text-center">
        <p className="text-gray-600 font-semibold text-lg">
          Ronda {roundNumber} de {totalRounds}
        </p>
      </div>

      {/* Score Board */}
      <ScoreBoard scores={scores} currentPlayer={currentPlayer} gameMode={gameMode} userName={userName} />

      {/* Main Game Area */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Current Player Indicator */}
        <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-xl p-4 text-center shadow-lg">
          <p className={`text-2xl font-bold ${
            computerThinking ? 'text-orange-600 animate-pulse' : 'text-gray-800'
          }`}>
            {computerThinking ? '🤔 Pensando...' : playerLabel}
          </p>
        </div>

        {/* Topic Card */}
        {topic && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-center shadow-lg transform transition hover:scale-105">
            <p className="text-white text-sm font-semibold uppercase tracking-widest mb-2">
              Tema
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl">{topic.emoji}</span>
              <h2 className="text-4xl font-bold text-white">{topic.name}</h2>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6 text-center">
          <p className="text-gray-800 font-semibold text-lg">
            💭 Piensa una palabra de <span className="text-blue-600 font-bold">{topic?.name}</span>
          </p>
          <p className="text-gray-700 mt-2 text-sm">
            Presiona la letra con la que comienza tu palabra
          </p>
        </div>

        {/* Timer */}
        {isTimeRunning && (
          <Timer timeLeft={displayTime} totalTime={30} />
        )}

        {/* Letter Grid */}
        <LetterGrid
          usedLetters={usedLetters}
          onLetterSelected={onLetterSelected}
          disabled={!isTimeRunning || roundWinner !== null || computerThinking}
        />

        {/* Computer Word Display - Large and Prominent */}
        {computerWord && gameMode === 'computer' && currentPlayer === 2 && (
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-8 text-center shadow-2xl transform animate-bounce">
            <p className="text-lg font-bold uppercase mb-4 tracking-wider">🤖 La computadora eligió:</p>
            <p className="text-7xl font-black drop-shadow-lg">{computerWord}</p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-100"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        )}

        {/* Round Results */}
        {roundWinner === currentPlayer && (
          <div className="bg-green-500 text-white rounded-xl p-6 text-center animate-bounce">
            <p className="text-2xl font-bold">🎉 ¡Punto para {gameMode === 'computer' ? (currentPlayer === 1 ? 'Ti' : 'la Computadora') : `Jugador ${currentPlayer}`}!</p>
            <p className="text-lg mt-2">+10 puntos</p>
          </div>
        )}

        {displayTime === 0 && !isTimeRunning && roundWinner === null && (
          <div className="bg-red-500 text-white rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">⏰ ¡Se acabó el tiempo!</p>
            <p className="text-lg mt-2">Sin puntos para esta ronda</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoundScreen;
