function ModeSelector({ onSelectMode, userName }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-8 animate-fadeIn">
      {userName && (
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 text-center">
          <p className="text-blue-800 font-semibold">Bienvenido/a</p>
          <p className="text-2xl font-bold text-blue-600">{userName}</p>
        </div>
      )}
      <h2 className="text-4xl font-bold text-gray-800 mb-8">
        ¿Cómo quieres jugar?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Two Players Mode */}
        <button
          onClick={() => onSelectMode('2players')}
          className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-2xl p-8 shadow-xl transform transition hover:scale-105 active:scale-95"
        >
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-3xl font-bold mb-4">Dos Jugadores</h3>
          <p className="text-lg opacity-90">
            Juega contra otro jugador. Turnan rondas y gana quien acumule más puntos.
          </p>
        </button>

        {/* Computer Mode */}
        <button
          onClick={() => onSelectMode('computer')}
          className="bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white rounded-2xl p-8 shadow-xl transform transition hover:scale-105 active:scale-95"
        >
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-3xl font-bold mb-4">Contra la Computadora</h3>
          <p className="text-lg opacity-90">
            Juega contra la computadora. ¿Puedes ganarle en 5 rondas?
          </p>
        </button>
      </div>

      {/* How to Play Info */}
      <div className="bg-gray-100 rounded-xl p-6 mt-8 text-left">
        <h4 className="text-xl font-bold text-gray-800 mb-4">📋 Cómo Jugar:</h4>
        <ol className="space-y-2 text-gray-700">
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">1.</span>
            <span>Se muestra un tema (categoría)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">2.</span>
            <span>Tienes 15 segundos para pensar una palabra</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">3.</span>
            <span>Presiona la letra con la que empieza tu palabra</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">4.</span>
            <span>¡Ganas 10 puntos si lo haces antes de que se acabe el tiempo!</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-blue-600">5.</span>
            <span>Las letras que se usan desaparecen del tablero</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default ModeSelector;
