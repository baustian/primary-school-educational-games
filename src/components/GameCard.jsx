import { Link } from 'react-router-dom'

export default function GameCard({ game }) {
  return (
    <Link
      to={game.path}
      className={`bg-gradient-to-br ${game.color} rounded-3xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-72 w-full block`}
    >
      <div className="text-center">
        <div className="text-7xl mb-4">{game.icon}</div>
        <h2 className="text-3xl font-bold text-white mb-3 font-nunito">
          {game.title}
        </h2>
        <p className="text-white text-lg font-nunito">
          {game.description}
        </p>
      </div>
      <div className="text-white text-center text-xl font-nunito font-semibold">
        Jugar →
      </div>
    </Link>
  )
}
