import { useState } from 'react'
import { gameConfig, letters, topics } from '../data/gameData'

const DIFFICULTIES = [
  { id: 'facil', label: 'Fácil', emoji: '🐢' },
  { id: 'normal', label: 'Normal', emoji: '🙂' },
  { id: 'dificil', label: 'Difícil', emoji: '🔥' },
]

const chip = (active) =>
  `px-4 py-2 rounded-full font-bold text-lg transition-all ${
    active ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`

function ModeSelector({ initialSettings, userName, voiceSupported, onStart }) {
  const [settings, setSettings] = useState(initialSettings)
  const update = (patch) => setSettings((s) => ({ ...s, ...patch }))
  const isComputer = settings.mode === 'computer'
  const lettersToPlay = letters.length - gameConfig.lettersLeftToFinish

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-8 animate-pop">
      {userName && (
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 text-center">
          <p className="text-blue-800 font-semibold">¡Hola!</p>
          <p className="text-2xl font-bold text-blue-600">{userName}</p>
        </div>
      )}

      {/* Modo */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center">¿Cómo querés jugar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => update({ mode: 'computer' })}
            className={`rounded-2xl p-6 text-white shadow-xl transition transform hover:scale-[1.02] bg-gradient-to-br from-orange-500 to-orange-700 ${
              isComputer ? 'ring-8 ring-yellow-300' : 'opacity-70'
            }`}
          >
            <div className="text-5xl mb-2">🤖</div>
            <h3 className="text-2xl font-bold">Contra la computadora</h3>
          </button>
          <button
            onClick={() => update({ mode: '2players' })}
            className={`rounded-2xl p-6 text-white shadow-xl transition transform hover:scale-[1.02] bg-gradient-to-br from-blue-500 to-blue-700 ${
              !isComputer ? 'ring-8 ring-yellow-300' : 'opacity-70'
            }`}
          >
            <div className="text-5xl mb-2">👥</div>
            <h3 className="text-2xl font-bold">Dos jugadores</h3>
          </button>
        </div>

        {isComputer ? (
          <div className="text-center space-y-2">
            <p className="font-semibold text-gray-700">Nivel de la computadora</p>
            <div className="flex flex-wrap justify-center gap-2">
              {DIFFICULTIES.map((d) => (
                <button key={d.id} onClick={() => update({ difficulty: d.id })} className={chip(settings.difficulty === d.id)}>
                  {d.emoji} {d.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <label htmlFor="player2" className="font-semibold text-gray-700 block">
              Nombre del jugador 2
            </label>
            <input
              id="player2"
              type="text"
              maxLength={20}
              value={settings.player2Name}
              onChange={(e) => update({ player2Name: e.target.value })}
              placeholder="Jugador 2"
              className="w-full max-w-xs px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg text-center"
            />
          </div>
        )}
      </section>

      {/* Tiempo */}
      <section className="text-center space-y-2">
        <p className="font-semibold text-gray-700">⏱️ Tiempo para responder</p>
        <div className="flex flex-wrap justify-center gap-2">
          {gameConfig.timeOptions.map((seconds) => (
            <button key={seconds} onClick={() => update({ time: seconds })} className={chip(settings.time === seconds)}>
              {seconds} s
            </button>
          ))}
        </div>
      </section>

      {/* Leer en voz alta */}
      <section className="flex justify-center">
        <label className="flex items-center gap-3 cursor-pointer select-none bg-gray-100 rounded-xl px-4 py-3">
          <input
            type="checkbox"
            checked={settings.readAloud}
            onChange={(e) => update({ readAloud: e.target.checked })}
            className="w-6 h-6 accent-blue-600"
          />
          <span className="font-semibold text-gray-700">🔊 Leer el tema en voz alta</span>
        </label>
      </section>

      <button
        onClick={() => onStart(settings)}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl text-2xl shadow-lg transition transform hover:scale-[1.02] active:scale-95"
      >
        🎡 ¡A jugar!
      </button>

      {/* Cómo jugar */}
      <div className="bg-gray-100 rounded-xl p-6 text-left">
        <h4 className="text-xl font-bold text-gray-800 mb-4">📋 Cómo se juega</h4>
        <ol className="space-y-2 text-gray-700 list-decimal list-inside">
          <li>La ruleta elige un tema (hay {topics.length} temas distintos).</li>
          <li>Tenés {settings.time} segundos para pensar una palabra de ese tema.</li>
          <li>Tocá la letra con la que empieza tu palabra (también podés usar el teclado).</li>
          {voiceSupported && (
            <li>
              O tocá el 🎤 y <strong>decí la palabra</strong>: el juego se fija si es del tema y marca la letra solo.
            </li>
          )}
          <li>Cada palabra vale {gameConfig.pointsPerWord} puntos. Las letras usadas ya no se pueden repetir.</li>
          <li>Si no se te ocurre nada, podés pasar el turno.</li>
          <li>
            La partida termina cuando quedan solo {gameConfig.lettersLeftToFinish} letras libres (se juegan{' '}
            {lettersToPlay} letras).
          </li>
        </ol>
      </div>
    </div>
  )
}

export default ModeSelector
