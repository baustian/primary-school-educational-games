import { useState } from 'react'

// Runs a list of questions one after another and reports how many were right
// on the first try. renderQuestion(question, onAnswer) draws each one.
export default function QuizRunner({ questions, renderQuestion, onAnswer, onFinish }) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)

  const handleAnswer = (firstTry) => {
    const nextCorrect = correct + (firstTry ? 1 : 0)
    setCorrect(nextCorrect)
    onAnswer?.(questions[index], firstTry)
    if (index + 1 < questions.length) setIndex(index + 1)
    else onFinish({ correct: nextCorrect, total: questions.length })
  }

  const progress = (index / questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-4 bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-lg font-bold text-indigo-700 font-nunito whitespace-nowrap">
          {index + 1} / {questions.length}
        </span>
      </div>
      <div key={index}>{renderQuestion(questions[index], handleAnswer)}</div>
    </div>
  )
}
