import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { words } from './data/words.js'
import ImageCard from './components/ImageCard.jsx'
import Board from './components/Board.jsx'
import ResultScreen from './components/ResultScreen.jsx'

export default function WordFactory() {
  const navigate = useNavigate()

  // Shuffle array function
  const shuffle = (array) => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  // Initialize scrambled words with lazy initializer
  const [scrambledWords] = useState(() => shuffle(words))
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [attemptedCount, setAttemptedCount] = useState(0)

  const startGame = () => {
    setGameStarted(true)
  }

  const handleCorrect = () => {
    setCorrectCount(correctCount + 1)
    setAttemptedCount(attemptedCount + 1)
    moveToNextWord()
  }

  const handleIncorrect = () => {
    // Don't increment attempted count until they get it right
  }

  const moveToNextWord = () => {
    if (currentIndex + 1 < scrambledWords.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      endGame()
    }
  }

  const endGame = () => {
    setGameEnded(true)
  }

  if (gameEnded) {
    return (
      <ResultScreen
        correctCount={correctCount}
        totalWords={scrambledWords.length}
      />
    )
  }

  if (!gameStarted || scrambledWords.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center border-4 border-red-600">
          <div className="text-9xl mb-6">🏭</div>
          <h1 className="text-5xl font-bold text-red-600 mb-4 font-nunito">
            Fábrica de Palabras
          </h1>
          <p className="text-2xl text-gray-700 mb-8 font-nunito">
            ¡Forma palabras uniendo las sílabas!
          </p>
          <div className="bg-teal-50 rounded-2xl p-6 mb-8 border-4 border-teal-600">
            <p className="text-xl text-gray-700 font-nunito mb-4">
              En este juego, verás una imagen con una palabra.
            </p>
            <p className="text-xl text-gray-700 font-nunito mb-4">
              Selecciona o arrastra las sílabas correctas para formar la palabra.
            </p>
            <p className="text-xl text-gray-700 font-nunito">
              ¿Estás listo? ¡Vamos!
            </p>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-8 rounded-2xl text-2xl font-nunito shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Comenzar Juego
          </button>
        </div>
      </div>
    )
  }

  const currentWord = scrambledWords[currentIndex]
  const allSyllables = shuffle([
    ...currentWord.syllables,
    ...currentWord.distractors,
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-md p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white font-nunito">
            Fábrica de Palabras
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="bg-teal-600 text-white font-bold py-2 px-6 rounded-xl text-lg font-nunito hover:bg-teal-700 transition-colors"
            >
              ← Inicio
            </button>
            <div className="bg-red-100 rounded-xl px-6 py-2 border-2 border-red-300">
              <p className="text-red-600 font-nunito font-bold">
                {currentIndex + 1}/{scrambledWords.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Image/Word Card */}
        <ImageCard emoji={currentWord.emoji} />

        {/* Board with Syllables */}
        <Board
          key={currentIndex}
          correctSyllables={currentWord.syllables}
          allSyllables={allSyllables}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      </main>
    </div>
  )
}
