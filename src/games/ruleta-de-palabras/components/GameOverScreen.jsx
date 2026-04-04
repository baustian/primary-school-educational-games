function GameOverScreen({ scores, gameMode, userName, onPlayAgain }) {
  const isComputerMode = gameMode === 'computer';
  const player1Score = scores.player1;
  const player2Score = scores.player2;
  const isWinner = player1Score > player2Score;
  const isTie = player1Score === player2Score;

  const player1Label = isComputerMode
    ? `👤 ${userName || 'Tú'}`
    : `👤 ${userName || 'Jugador 1'}`;
  const player2Label = isComputerMode ? '🤖 Computadora' : '👤 Invitado';

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-8 animate-fadeIn">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        🏆 ¡FIN DEL JUEGO!
      </h2>

      {/* Winner Result */}
      {isTie ? (
        <div className="bg-gradient-to-r from-purple-300 to-pink-500 rounded-xl p-8 shadow-lg">
          <p className="text-white text-2xl font-bold mb-4">¡Empate!</p>
          <p className="text-white text-lg">
            Ambos jugadores con {player1Score} puntos
          </p>
        </div>
      ) : isWinner ? (
        <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-xl p-8 shadow-lg">
          <p className="text-gray-800 text-lg font-semibold mb-2">
            {isComputerMode ? '🎉 ¡Ganaste!' : '🥇 Ganador'}
          </p>
          <p className="text-gray-800 text-3xl font-bold mb-2">
            {player1Label}
          </p>
          <p className="text-3xl font-bold text-yellow-700">
            {player1Score} puntos
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-red-300 to-red-500 rounded-xl p-8 shadow-lg">
          <p className="text-white text-lg font-semibold mb-2">
            {isComputerMode ? '😢 La computadora ganó' : '🥇 Ganador'}
          </p>
          <p className="text-white text-3xl font-bold mb-2">
            {player2Label}
          </p>
          <p className="text-3xl font-bold text-red-700">
            {player2Score} puntos
          </p>
        </div>
      )}

      {/* Final Scores */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Puntuaciones Finales</h3>

        <div className={`bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4 flex items-center justify-between ${
          isWinner ? 'ring-4 ring-yellow-400' : ''
        }`}>
          <span className={`text-2xl font-bold ${isWinner ? 'text-yellow-600' : 'text-gray-700'}`}>
            {isWinner ? '🥇' : '🥈'}
          </span>
          <span className="text-xl font-semibold text-gray-800">
            {player1Label}
          </span>
          <span className="text-2xl font-bold text-blue-600">{player1Score}</span>
        </div>

        <div className={`bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4 flex items-center justify-between ${
          !isWinner && !isTie ? 'ring-4 ring-yellow-400' : ''
        }`}>
          <span className={`text-2xl font-bold ${!isWinner && !isTie ? 'text-yellow-600' : 'text-gray-700'}`}>
            {!isWinner && !isTie ? '🥇' : '🥈'}
          </span>
          <span className="text-xl font-semibold text-gray-800">
            {player2Label}
          </span>
          <span className="text-2xl font-bold text-blue-600">{player2Score}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 space-y-3">
        <button
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-lg text-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          🎮 Jugar de Nuevo
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 rounded-lg text-xl transition-all transform hover:scale-105 active:scale-95"
        >
          🏠 Ir al Inicio
        </button>
      </div>
    </div>
  );
}

export default GameOverScreen;
