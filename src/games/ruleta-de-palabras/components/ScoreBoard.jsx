function ScoreBoard({ scores, currentPlayer, gameMode, userName }) {
  const isComputerMode = gameMode === 'computer';

  const player1Label = isComputerMode
    ? `👤 ${userName || 'Tú'}`
    : `👤 ${userName || 'Jugador 1'}`;
  const player2Label = isComputerMode ? '🤖 Computadora' : '👤 Invitado';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-center text-gray-700 font-bold text-lg mb-4">
        📊 Puntuaciones
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 / You */}
        <div
          className={`rounded-lg p-4 text-center transition-all transform ${
            currentPlayer === 1
              ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 scale-105 shadow-lg'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <p className={`font-semibold ${currentPlayer === 1 ? 'text-gray-800' : 'text-gray-600'}`}>
            {player1Label}
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              currentPlayer === 1 ? 'text-gray-800' : 'text-blue-600'
            }`}
          >
            {scores.player1}
          </p>
          {currentPlayer === 1 && <p className="text-sm mt-2">🎮 Activo</p>}
        </div>

        {/* Player 2 / Computer */}
        <div
          className={`rounded-lg p-4 text-center transition-all transform ${
            currentPlayer === 2
              ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 scale-105 shadow-lg'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <p className={`font-semibold ${currentPlayer === 2 ? 'text-gray-800' : 'text-gray-600'}`}>
            {player2Label}
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              currentPlayer === 2 ? 'text-gray-800' : 'text-blue-600'
            }`}
          >
            {scores.player2}
          </p>
          {currentPlayer === 2 && <p className="text-sm mt-2">🎮 Activo</p>}
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;
