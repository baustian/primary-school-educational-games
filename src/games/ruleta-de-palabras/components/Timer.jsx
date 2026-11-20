const RADIUS = 45
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function Timer({ timeLeft, totalTime, paused = false }) {
  const fraction = totalTime > 0 ? Math.max(0, Math.min(1, timeLeft / totalTime)) : 0
  const isLowTime = timeLeft <= 3

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative w-28 h-28 md:w-36 md:h-36">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={paused ? '#a855f7' : isLowTime ? '#ef4444' : '#3b82f6'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            className="transition-all duration-1000 ease-linear"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p
              className={`text-4xl md:text-5xl font-bold ${
                paused ? 'text-purple-600' : isLowTime ? 'text-red-500 animate-pulse' : 'text-blue-600'
              }`}
            >
              {timeLeft}
            </p>
            <p className="text-gray-600 font-semibold text-xs mt-1">{paused ? 'en pausa' : 'segundos'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timer
