import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { useGame } from '../hooks/useGame'

export default function Header({ onChangeUserName }) {
  const navigate = useNavigate()
  const { userName, totalScore } = useUser()
  const { gameInfo } = useGame()

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-md">
      {/* Main Header */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Title */}
          <button
            onClick={() => navigate('/')}
            className="flex-1 text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            <h1 className="text-3xl font-bold text-white font-nunito">
              Aprender Jugando
            </h1>
            <p className="text-sm text-red-100 font-nunito">
              Aprende divirtiéndote
            </p>
          </button>

          {/* Right: User Info & Score */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
            <div className="text-right text-center sm:text-right">
              {userName ? (
                <div>
                  <p className="text-white font-bold font-nunito text-xs sm:text-sm">
                    {userName}
                  </p>
                  <button
                    onClick={onChangeUserName}
                    className="text-xs bg-red-500 hover:bg-red-400 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded font-nunito transition-colors"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <p className="text-red-100 font-nunito text-xs">Invitado</p>
              )}
            </div>
            <div className="bg-blue-500 rounded-xl px-2 py-1 sm:px-4 sm:py-2 border-2 border-blue-300">
              <p className="text-white font-nunito font-bold text-xs sm:text-sm">
                Total: {totalScore}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-teal-600 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-6 rounded-xl font-nunito hover:bg-teal-700 transition-colors text-xs sm:text-base whitespace-nowrap"
            >
              🏠 Inicio
            </button>
          </div>
        </div>
      </div>

      {/* Game Info Bar (only shows when in a game) */}
      {gameInfo.name && (
        <div className="border-t border-red-500 bg-red-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white font-nunito">
              {gameInfo.name}
            </h2>
            <div className="flex gap-4">
              <div className="bg-red-100 rounded-lg px-4 py-2 border-2 border-red-300">
                <p className="text-red-700 font-nunito font-bold text-sm">
                  Palabra {gameInfo.currentIndex + 1}/{gameInfo.totalWords}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-lg px-4 py-2 border-2 border-yellow-400">
                <p className="text-yellow-700 font-nunito font-bold text-sm">
                  Acertadas: {gameInfo.correctCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
