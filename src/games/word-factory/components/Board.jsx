import { useState } from 'react'
import SyllableCard from './SyllableCard.jsx'

export default function Board({ correctSyllables, allSyllables, onCorrect, onIncorrect, onSkip }) {
  const [slots, setSlots] = useState(['', ''])
  const [feedbackSlot, setFeedbackSlot] = useState(null)
  const [isShaking, setIsShaking] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (slotIndex, e) => {
    e.preventDefault()
    const syllable = e.dataTransfer.getData('syllable')
    placeSyllable(slotIndex, syllable)
  }

  const placeSyllable = (slotIndex, syllable) => {
    const newSlots = [...slots]
    newSlots[slotIndex] = syllable
    setSlots(newSlots)
    setFeedbackSlot(slotIndex)

    // Check if correct
    if (syllable === correctSyllables[slotIndex]) {
      // Check if word is complete
      if (slotIndex === 0 && newSlots[1] === correctSyllables[1]) {
        setTimeout(() => onCorrect(), 600)
      } else if (slotIndex === 1 && newSlots[0] === correctSyllables[0]) {
        setTimeout(() => onCorrect(), 600)
      }
    } else {
      // Wrong answer - shake and reset
      setIsShaking(true)
      setTimeout(() => {
        setSlots(['', ''])
        setIsShaking(false)
        setFeedbackSlot(null)
        onIncorrect()
      }, 600)
    }
  }

  const handleSyllableClick = (syllable) => {
    if (slots.includes('')) {
      const emptyIndex = slots.indexOf('')
      placeSyllable(emptyIndex, syllable)
    }
  }

  const getFeedbackClass = (slotIndex) => {
    if (slots[slotIndex] === '') return ''
    if (slots[slotIndex] === correctSyllables[slotIndex]) {
      return 'ring-4 ring-green-500 bg-green-100'
    } else {
      return 'ring-4 ring-red-500 bg-red-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Syllable Slots */}
      <div className="flex gap-6 justify-center">
        {slots.map((syllable, index) => (
          <div
            key={index}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(index, e)}
            className={`
              border-4 border-dashed border-teal-600 rounded-2xl
              w-28 h-28
              flex items-center justify-center
              bg-teal-50
              transition-all duration-200
              ${isShaking && feedbackSlot === index ? 'animate-bounce' : ''}
              ${getFeedbackClass(index)}
            `}
          >
            {syllable && (
              <div className="text-3xl font-bold text-center font-nunito">
                {syllable}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Syllable Options */}
      <div className="flex gap-4 justify-center flex-wrap max-w-2xl mx-auto">
        {allSyllables.map((syllable, index) => (
          <SyllableCard
            key={index}
            syllable={syllable}
            onDragStart={() => {
              // Enable drag start
            }}
            onClick={() => handleSyllableClick(syllable)}
            isSelected={false}
          />
        ))}
      </div>

      {/* Skip Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onSkip}
          className="bg-orange-500 text-white font-bold py-3 px-8 rounded-xl text-lg font-nunito hover:bg-orange-600 transition-colors shadow-lg"
        >
          Saltar Palabra
        </button>
      </div>
    </div>
  )
}
