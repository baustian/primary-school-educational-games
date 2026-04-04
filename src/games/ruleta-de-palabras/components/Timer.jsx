function Timer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100;
  const isLowTime = timeLeft <= 3;

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        {/* Circle background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isLowTime ? '#ef4444' : '#3b82f6'}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
            className="transition-all duration-100"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-5xl md:text-6xl font-bold ${isLowTime ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
              {timeLeft}
            </p>
            <p className="text-gray-600 font-semibold text-sm mt-2">segundos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timer;
