import { Link } from 'react-router-dom'

export default function ResultScreen({ correctCount, totalWords }) {
  const percentage = Math.round((correctCount / totalWords) * 100)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border-4 border-red-600">
        {/* Celebration Emoji */}
        <div className="text-9xl mb-6">🎉</div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-red-600 mb-4 font-nunito">
          ¡Excelente!
        </h1>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-red-200 to-teal-200 rounded-2xl p-8 mb-8">
          <p className="text-gray-700 text-xl font-nunito mb-2">
            Palabras acertadas
          </p>
          <p className="text-5xl font-bold text-red-600 font-nunito">
            {correctCount}/{totalWords}
          </p>
          <p className="text-lg text-gray-600 font-nunito mt-2">
            {percentage}%
          </p>
        </div>

        {/* Message based on performance */}
        <div className="mb-8">
          {percentage === 100 && (
            <p className="text-2xl text-red-600 font-bold font-nunito mb-2">
              ¡Perfecto!
            </p>
          )}
          {percentage >= 75 && percentage < 100 && (
            <p className="text-2xl text-teal-600 font-bold font-nunito mb-2">
              ¡Muy bien!
            </p>
          )}
          {percentage >= 50 && percentage < 75 && (
            <p className="text-2xl text-red-500 font-bold font-nunito mb-2">
              ¡Buen intento!
            </p>
          )}
          {percentage < 50 && (
            <p className="text-2xl text-red-700 font-bold font-nunito mb-2">
              ¡Sigue practicando!
            </p>
          )}
          <p className="text-gray-600 text-lg font-nunito">
            Haz clic para jugar de nuevo
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 rounded-2xl text-2xl font-nunito shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Jugar de Nuevo
          </button>
          <Link
            to="/"
            className="block w-full bg-teal-600 text-white font-bold py-4 rounded-2xl text-2xl font-nunito shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Ir a Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
