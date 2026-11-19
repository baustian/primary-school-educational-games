import { useState } from 'react'
import { activitiesFor, TOPICS } from '../data/topics.js'
import { daysUntilExam } from '../data/exam.js'
import { speakEs } from '../utils/speech.js'
import { En, SmallButton, Stars } from './ui.jsx'

const topicStars = (progress, topic) =>
  activitiesFor(topic).reduce((sum, a) => sum + (progress.topics[topic.id]?.[a] || 0), 0)

export default function MapScreen({ progress, userName, onTopic, onReview, onExam, onParents }) {
  const [days] = useState(daysUntilExam)
  const greeting = `¡Hola${userName ? ` ${userName}` : ''}! Elegí el tema que quieras para practicar inglés. Los números son el orden sugerido.`

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3">
        <button type="button" className="text-6xl" onClick={() => speakEs(greeting)} aria-label="Escuchar saludo">
          🦉
        </button>
        <div className="flex-1 bg-white border-4 border-indigo-200 rounded-3xl px-5 py-4">
          <p className="text-2xl font-extrabold text-indigo-800 font-nunito">
            <En>Hello{userName ? `, ${userName}` : ''}!</En> 👋
          </p>
          <p className="text-lg text-gray-600 font-nunito">
            Elegí el tema que quieras. Los números son el orden sugerido 🗺️
          </p>
          {days > 0 && (
            <p className="mt-2 inline-block bg-amber-100 text-amber-800 font-bold font-nunito rounded-full px-4 py-1">
              📅 Faltan {days} {days === 1 ? 'día' : 'días'} para el examen
            </p>
          )}
          {days === 0 && (
            <p className="mt-2 inline-block bg-green-100 text-green-800 font-bold font-nunito rounded-full px-4 py-1">
              🍀 ¡Hoy es el examen! ¡Mucha suerte!
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {TOPICS.map((topic, i) => {
          const stars = topicStars(progress, topic)
          const max = activitiesFor(topic).length * 3
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onTopic(topic.id)}
              className={`relative rounded-3xl p-4 text-white text-center shadow-lg transition-all bg-gradient-to-br ${topic.color} hover:scale-105 active:scale-95`}
            >
              <span className="absolute top-2 left-3 text-sm font-extrabold opacity-80">{i + 1}</span>
              {stars === max && <span className="absolute top-2 right-3 text-xl">🏅</span>}
              <div className="text-5xl mb-2">{topic.icon}</div>
              <p className="text-xl font-extrabold font-nunito leading-tight">
                <En>{topic.title}</En>
              </p>
              <p className="text-sm font-nunito opacity-90">{topic.es}</p>
              <p className="mt-2 text-sm font-bold bg-white/25 rounded-full px-2 py-0.5 inline-block">
                ⭐ {stars}/{max}
              </p>
            </button>
          )
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onReview}
          className="rounded-3xl p-5 text-left bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg hover:scale-[1.02] transition-all"
        >
          <p className="text-3xl font-extrabold font-nunito">🔁 Repaso rápido</p>
          <p className="text-lg font-nunito">8 preguntas mezcladas, con más práctica en lo que cuesta.</p>
        </button>
        <button
          type="button"
          onClick={onExam}
          className="rounded-3xl p-5 text-left bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg hover:scale-[1.02] transition-all"
        >
          <p className="text-3xl font-extrabold font-nunito">🎓 Simulacro de examen</p>
          <p className="text-lg font-nunito">20 preguntas como el día del examen.</p>
          {progress.exam.best !== null && (
            <p className="mt-1 text-sm font-bold bg-white/25 rounded-full px-3 py-0.5 inline-block">
              Mejor resultado: {progress.exam.best}/20 · Intentos: {progress.exam.attempts}
            </p>
          )}
        </button>
      </div>

      <div className="flex justify-center">
        <SmallButton onClick={onParents}>👨‍👩‍👧 Para las familias: consejos y ajustes</SmallButton>
      </div>
    </div>
  )
}

export function TopicScreen({ topic, progress, onActivity, onBack, activityInfo }) {
  const acts = activitiesFor(topic)
  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-6 text-white bg-gradient-to-br ${topic.color} shadow-lg flex items-center gap-4`}>
        <span className="text-7xl">{topic.icon}</span>
        <div>
          <p className="text-4xl font-extrabold font-nunito">
            <En>{topic.title}</En>
          </p>
          <p className="text-xl font-nunito opacity-90">{topic.es}</p>
        </div>
      </div>
      <div className="space-y-3">
        {acts.map((id, i) => {
          const info = activityInfo[id]
          const stars = progress.topics[topic.id]?.[id] || 0
          return (
            <button
              key={id}
              type="button"
              onClick={() => onActivity(id)}
              className="w-full flex items-center gap-4 rounded-3xl border-4 p-4 text-left transition-all bg-white border-indigo-100 hover:border-indigo-400 hover:scale-[1.01]"
            >
              <span className="text-xl font-extrabold text-indigo-300 w-6">{i + 1}</span>
              <span className="text-5xl">{info.icon}</span>
              <div className="flex-1">
                <p className="text-2xl font-extrabold text-indigo-800 font-nunito">{info.title}</p>
                <p className="text-base text-gray-500 font-nunito">{info.subtitle}</p>
              </div>
              <Stars value={stars} />
            </button>
          )
        })}
      </div>
      <SmallButton onClick={onBack}>⬅️ Volver al mapa</SmallButton>
    </div>
  )
}
