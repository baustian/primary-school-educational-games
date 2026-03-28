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
      {/* Games Grid */}
      <main className="px-4 py-12">
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
