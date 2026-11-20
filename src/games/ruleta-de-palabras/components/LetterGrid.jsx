import { letters } from '../data/gameData'

function LetterGrid({ usedLetters, highlight, onLetterSelected, disabled }) {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 shadow-md">
      <p className="text-center text-gray-600 font-semibold mb-4">📍 Tocá la letra con la que empieza tu palabra</p>
      <div className="grid grid-cols-5 md:grid-cols-9 gap-2">
        {letters.map((letter) => {
          const isUsed = usedLetters.includes(letter)
          const isNew = letter === highlight
          return (
            <button
              key={letter}
              onClick={() => onLetterSelected(letter)}
              disabled={disabled || isUsed}
              aria-label={isUsed ? `${letter} (ya usada)` : letter}
              className={`py-3 px-2 rounded-lg font-bold text-xl transition-all transform drop-shadow-md ${
                isNew
                  ? 'bg-green-500 text-white ring-4 ring-green-300 animate-pop'
                  : isUsed
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 line-through'
                    : disabled
                      ? 'bg-blue-300 text-white cursor-not-allowed'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:scale-110 active:scale-95'
              }`}
            >
              {letter}
            </button>
          )
        })}
      </div>
      <p className="text-center text-gray-600 text-sm mt-4">
        Letras libres: {letters.length - usedLetters.length} / {letters.length}
      </p>
    </div>
  )
}

export default LetterGrid
