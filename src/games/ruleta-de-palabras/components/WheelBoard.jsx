import { useState } from 'react';
import { letters } from '../data/gameData';

function WheelBoard({ onStartSpinning, onSelectLetter, disabledLetters, winnerLetter }) {
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpinWheel = () => {
    setIsWheelSpinning(true);
    const randomRotation = Math.random() * 360;
    setRotation((prev) => prev + 360 * 5 + randomRotation);

    setTimeout(() => {
      setIsWheelSpinning(false);
      onStartSpinning();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Spinning Wheel */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Wheel */}
          <div
            className={`absolute inset-0 rounded-full border-8 border-gray-800 bg-gradient-to-br from-red-500 to-red-700 shadow-2xl ${
              isWheelSpinning ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isWheelSpinning ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {/* Letter segments */}
            {letters.map((letter, index) => {
              const angle = (360 / letters.length) * index;
              const isWinner = letter === winnerLetter;
              return (
                <div
                  key={letter}
                  className={`absolute w-full h-full ${
                    isWinner ? 'animate-pulse' : ''
                  }`}
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <div
                    className={`absolute top-4 left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-bold ${
                      isWinner ? 'text-yellow-300 drop-shadow-lg' : 'text-white drop-shadow'
                    }`}
                  >
                    {letter}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handleSpinWheel}
              disabled={isWheelSpinning}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 text-white font-bold text-2xl md:text-3xl shadow-2xl border-4 border-white hover:from-yellow-400 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 transition-all drop-shadow-lg"
            >
              {isWheelSpinning ? '🔄' : '¡GIRA!'}
            </button>
          </div>

          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-white drop-shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Letter Buttons Grid */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6 shadow-md">
        <p className="text-center text-gray-600 font-semibold mb-4">
          O presiona la letra:
        </p>
        <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => onSelectLetter(letter)}
              disabled={isWheelSpinning || disabledLetters.includes(letter)}
              className={`py-3 px-2 rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95 drop-shadow-md ${
                letter === winnerLetter
                  ? 'bg-green-500 text-white ring-4 ring-green-300 animate-bounce'
                  : disabledLetters.includes(letter)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WheelBoard;
