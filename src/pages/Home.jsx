import { useEffect } from 'react'
import GameCard from '../components/GameCard.jsx'
import { games } from '../data/games.js'
import { useGame } from '../hooks/useGame'

export default function Home() {
  const { clearGameInfo } = useGame()
  const availableGames = games.filter(game => game.available)

  // Clear game info when returning to home
  useEffect(() => {
    clearGameInfo()
  }, [clearGameInfo])

  return (
    <div className="min-h-screen bg-white">
      {/* Mission Section */}
      <section className="bg-gradient-to-r from-blue-50 to-teal-50 px-4 py-12 border-b-4 border-blue-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-blue-700 font-nunito">
              ¿Por qué estamos acá?
            </h2>
            <p className="text-lg text-gray-700 font-nunito leading-relaxed">
              Esta plataforma nace de la experiencia compartida de niños de la Escuela Primaria
              <strong> Don Bosco Ramos Mejía</strong>, con el objetivo de complementar la educación formal
              mediante juegos interactivos diseñados pedagógicamente.
            </p>
            <p className="text-lg text-gray-700 font-nunito leading-relaxed">
              Nuestro propósito es que <strong>la educación sea divertida, accesible y efectiva</strong>,
              permitiendo que los chicos y chicas desarrollen habilidades fundamentales como la lectoescritura,
              el razonamiento lógico y la creatividad, mientras se divierten.
            </p>
            <div className="bg-white rounded-xl p-6 border-2 border-blue-300 mt-6">
              <p className="text-blue-700 font-nunito font-semibold">
                🎮 Cada juego ha sido diseñado con rigor pedagógico para reforzar aspectos específicos
                del aprendizaje formal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <main className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12 font-nunito">
            Nuestros Juegos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableGames.map(game => (
              <div key={game.id} className="flex justify-center lg:col-start-2">
                <div className="max-w-sm w-full">
                  <GameCard game={game} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
