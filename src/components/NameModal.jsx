import { useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser'

export default function NameModal({ isOpen, onClose }) {
  const { userName, updateUserName } = useUser()
  const [tempName, setTempName] = useState(userName)

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempName(userName)
    }
  }, [isOpen, userName])

  if (!isOpen) return null

  const handleSubmit = (name) => {
    if (name.trim()) {
      updateUserName(name.trim())
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center border-4 border-red-600">
        <div className="text-8xl mb-6">👤</div>
        <h1 className="text-4xl font-bold text-red-600 mb-2 font-nunito">
          ¿Cuál es tu nombre?
        </h1>
        <p className="text-xl text-gray-700 mb-8 font-nunito">
          Nos gustaría conocerte para guardar tu progreso
        </p>
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          placeholder="Escribe tu nombre..."
          className="w-full px-6 py-4 text-xl border-2 border-teal-600 rounded-xl font-nunito mb-6 focus:outline-none focus:ring-2 focus:ring-red-600"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(tempName)}
          autoFocus
        />
        <p className="text-sm text-gray-500 mb-6 font-nunito">
          (Puedes omitir este paso si lo deseas)
        </p>
        <div className="space-y-3">
          <button
            onClick={() => handleSubmit(tempName)}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-8 rounded-2xl text-xl font-nunito shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Continuar
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-400 text-white font-bold py-3 px-8 rounded-2xl text-lg font-nunito shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Saltar
          </button>
        </div>
      </div>
    </div>
  )
}
