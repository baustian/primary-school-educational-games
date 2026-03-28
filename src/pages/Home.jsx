import GameCard from '../components/GameCard.jsx'
import { games } from '../data/games.js'

export default function Home() {
  const availableGames = games.filter(game => game.available)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="text-center py-12 px-4 bg-gradient-to-r from-red-600 to-red-700">
        <h1 className="text-6xl font-bold text-white mb-2 font-nunito">
          Aprender Jugando
        </h1>
        <p className="text-2xl text-red-100 font-nunito">
          Aprende divirtiéndote
        </p>
      </header>

      {/* Games Grid */}
      <main className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
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
