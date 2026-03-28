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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white font-nunito">
              Aprender Jugando
            </h1>
            <p className="text-sm text-red-100 font-nunito">
              Aprende divirtiéndote
            </p>
          </div>

          {/* Right: User Info & Score */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              {userName ? (
                <div>
                  <p className="text-white font-bold font-nunito">
                    {userName}
                  </p>
                  <button
                    onClick={onChangeUserName}
                    className="text-xs bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded font-nunito transition-colors"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <p className="text-red-100 font-nunito text-sm">Invitado</p>
              )}
            </div>
            <div className="bg-blue-500 rounded-xl px-4 py-2 border-2 border-blue-300">
              <p className="text-white font-nunito font-bold text-sm">
                Total: {totalScore}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-teal-600 text-white font-bold py-2 px-6 rounded-xl font-nunito hover:bg-teal-700 transition-colors"
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
