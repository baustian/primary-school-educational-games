import { letters } from '../data/gameData';

function LetterGrid({ usedLetters, onLetterSelected, disabled }) {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6 shadow-md">
      <p className="text-center text-gray-600 font-semibold mb-4">
        📍 Presiona la letra:
      </p>
      <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
        {letters.map((letter) => {
          const isUsed = usedLetters.includes(letter);
          const isDisabled = disabled || isUsed;

          return (
            <button
              key={letter}
              onClick={() => onLetterSelected(letter)}
              disabled={isDisabled}
              className={`py-3 px-2 rounded-lg font-bold text-lg transition-all transform drop-shadow-md ${
                isUsed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 line-through'
                  : isDisabled
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-75'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:scale-110 active:scale-95'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
      <p className="text-center text-gray-600 text-sm mt-4">
        Letras disponibles: {letters.length - usedLetters.length} / {letters.length}
      </p>
    </div>
  );
}

export default LetterGrid;
