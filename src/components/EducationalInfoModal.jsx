import { useState } from 'react'

export default function EducationalInfoModal({ gameInfo }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!gameInfo) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 z-40"
        aria-label="Información educativa"
        title="Información educativa"
      >
        <span className="text-2xl">ℹ️</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold">{gameInfo.title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl hover:text-blue-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <p className="text-lg text-gray-700 font-nunito">
                  {gameInfo.description}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4 font-nunito">
                  Objetivos Educativos
                </h3>
                <ul className="space-y-2">
                  {gameInfo.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 font-nunito">
                      <span className="text-2xl">🎯</span>
                      <span className="text-base">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4 font-nunito">
                  Aspectos Educativos Reforzados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gameInfo.educationalAspects.map((aspect, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500"
                    >
                      <p className="font-bold text-blue-700 font-nunito mb-1">
                        {aspect.split(':')[0]}
                      </p>
                      <p className="text-gray-600 text-sm font-nunito">
                        {aspect.split(':')[1] || ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-50 rounded-lg p-6 border-l-4 border-teal-500">
                <h3 className="text-xl font-bold text-teal-700 mb-2 font-nunito">
                  Metodología
                </h3>
                <p className="text-gray-700 font-nunito">
                  {gameInfo.methodology}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg font-nunito transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
