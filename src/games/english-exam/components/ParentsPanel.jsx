import { useState } from 'react'
import { Card, SmallButton } from './ui.jsx'
import { canListen, canSpeak, pickVoice, speak, speakEs } from '../utils/speech.js'
import { EXAM_DATE } from '../data/exam.js'
import { findTopic, mistakeKey } from '../data/topics.js'

function Toggle({ label, help, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input type="checkbox" className="mt-1 w-6 h-6 accent-indigo-600" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span className="block text-lg font-bold text-gray-800">{label}</span>
        {help && <span className="block text-sm text-gray-500">{help}</span>}
      </span>
    </label>
  )
}

export default function ParentsPanel({ progress, setSetting, resetProgress, onBack }) {
  const { settings } = progress
  const [confirmReset, setConfirmReset] = useState(false)
  const [voices] = useState(() => ({ en: pickVoice('en')?.name, es: pickVoice('es')?.name }))
  const [d, m, y] = EXAM_DATE.split('-').reverse()

  const hardest = Object.entries(progress.mistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key]) => {
      const [topicId, en] = key.split(':')
      const item = findTopic(topicId)?.items.find((i) => mistakeKey(topicId, i.en) === key)
      return item ? { en, es: item.es, emoji: item.emoji || '🎨' } : null
    })
    .filter(Boolean)

  return (
    <div className="space-y-6 font-nunito">
      <Card className="space-y-4">
        <h2 className="text-3xl font-extrabold text-indigo-800">👨‍👩‍👧 Para las familias</h2>
        <p className="text-lg text-gray-700">
          Examen AACI: <strong>lunes {d}/{m}/{y}</strong>, en el horario habitual de JEO. Los chicos de{' '}
          <strong>1.º y 2.º grado rinden solo el examen oral</strong>, por eso el juego pone el foco en escuchar y
          hablar. Escribir sirve de refuerzo.
        </p>
        <ul className="space-y-2 text-gray-700 text-lg list-none">
          <li>⏱️ <strong>10 a 15 minutos por día</strong> rinden más que una hora el fin de semana. Un tema por día alcanza.</li>
          <li>🗺️ Seguí el camino en orden: cada tema se desbloquea al completar «Escuchar» del anterior.</li>
          <li>🎤 Para hablar, usá <strong>Chrome o Edge</strong> (en compu, Android o iPhone) y aceptá el permiso del micrófono. En otros navegadores el juego pasa a modo «decilo en voz alta y compará».</li>
          <li>🧑‍🤝‍🧑 Acompañala/o al principio: si el reconocimiento de voz no la/lo entiende pero lo dijo bien, tocá «👍 Lo dijo bien (adulto)».</li>
          <li>💬 El botón «Ayuda» lee la consigna en castellano. Usalo al principio y después intentá que no haga falta.</li>
          <li>🎓 La última semana hagan el <strong>Simulacro</strong> varias veces: tiene las 20 preguntas de la guía de la maestra con dibujos distintos cada vez.</li>
          <li>💬 En el examen conviene responder con frases cortas: <em>«It’s a cat»</em>, <em>«Yes, I do»</em>, <em>«No, I can’t»</em>. El juego siempre repite la respuesta modelo.</li>
        </ul>
      </Card>

      {hardest.length > 0 && (
        <Card className="space-y-3">
          <h3 className="text-2xl font-extrabold text-indigo-800">🧩 Las palabras que más cuestan</h3>
          <p className="text-gray-600">El «Repaso rápido» las pregunta más seguido. Tocá una para escucharla.</p>
          <div className="flex flex-wrap gap-2">
            {hardest.map((w) => (
              <button
                key={w.en}
                type="button"
                onClick={() => speak(w.en)}
                className="bg-amber-50 border-2 border-amber-200 rounded-full px-4 py-1 text-lg"
              >
                {w.emoji} <strong>{w.en}</strong> · {w.es}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card className="space-y-4">
        <h3 className="text-2xl font-extrabold text-indigo-800">⚙️ Ajustes</h3>
        <Toggle
          label="Mostrar el inglés en MAYÚSCULAS"
          help="En 1.º grado suelen leer en imprenta mayúscula. Desactivalo cuando ya lean minúscula."
          checked={settings.uppercase}
          onChange={(v) => setSetting('uppercase', v)}
        />
        <Toggle
          label="Escribir con teclado en vez de fichas de letras"
          help="Más difícil. Recomendado solo si ya escribe con soltura."
          checked={settings.keyboard}
          onChange={(v) => setSetting('keyboard', v)}
        />
        <Toggle
          label="Desbloquear todos los temas"
          help="Útil si querés saltar directo a un tema puntual."
          checked={settings.unlockAll}
          onChange={(v) => setSetting('unlockAll', v)}
        />
        <label className="flex items-center gap-3 text-lg font-bold text-gray-800">
          Edad (para la respuesta modelo «I’m …»):
          <select
            value={settings.age}
            onChange={(e) => setSetting('age', Number(e.target.value))}
            className="border-2 border-indigo-200 rounded-xl px-3 py-1"
          >
            {[5, 6, 7, 8, 9].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-2xl font-extrabold text-indigo-800">🔧 Voz y micrófono en este dispositivo</h3>
        <p className="text-gray-700">
          🔊 Voz en inglés: <strong>{canSpeak ? voices.en || 'la predeterminada' : 'no disponible'}</strong>
        </p>
        <p className="text-gray-700">
          💬 Voz en castellano: <strong>{canSpeak ? voices.es || 'la predeterminada' : 'no disponible'}</strong>
        </p>
        <p className="text-gray-700">
          🎤 Reconocimiento de voz:{' '}
          <strong>{canListen ? 'disponible ✅' : 'no disponible en este navegador (se usa el modo «decilo en voz alta»)'}</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          <SmallButton onClick={() => speak('Hello! What is your name?')}>Probar voz en inglés</SmallButton>
          <SmallButton onClick={() => speakEs('¡Hola! ¿Cómo estás?')}>Probar voz en castellano</SmallButton>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-2xl font-extrabold text-red-700">Reiniciar progreso</h3>
        <p className="text-gray-600">Borra estrellas y estadísticas de este jugador (los ajustes se mantienen).</p>
        {confirmReset ? (
          <div className="flex gap-2">
            <SmallButton
              className="border-red-400! text-red-700!"
              onClick={() => {
                resetProgress()
                setConfirmReset(false)
              }}
            >
              Sí, borrar todo
            </SmallButton>
            <SmallButton onClick={() => setConfirmReset(false)}>Cancelar</SmallButton>
          </div>
        ) : (
          <SmallButton onClick={() => setConfirmReset(true)}>🗑️ Reiniciar</SmallButton>
        )}
      </Card>

      <SmallButton onClick={onBack}>⬅️ Volver al mapa</SmallButton>
    </div>
  )
}
