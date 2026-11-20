function ScoreBoard({ scores, currentPlayer, names, isComputerMode }) {
  const icon = (n) => (n === 2 && isComputerMode ? '🤖' : '👤')

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((n) => {
          const active = currentPlayer === n
          return (
            <div
              key={n}
              className={`rounded-lg p-3 text-center transition-all transform ${
                active ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 scale-105 shadow-lg' : 'bg-gray-100'
              }`}
            >
              <p className={`font-semibold truncate ${active ? 'text-gray-800' : 'text-gray-600'}`}>
                {icon(n)} {names[n]}
              </p>
              <p className={`text-3xl font-bold mt-1 ${active ? 'text-gray-800' : 'text-blue-600'}`}>
                {scores[`player${n}`]}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScoreBoard
