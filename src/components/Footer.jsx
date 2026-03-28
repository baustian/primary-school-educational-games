export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* About Section */}
          <div className="md:flex-1">
            <h3 className="text-xl font-bold text-white mb-4 font-nunito">
              Plataforma de Juegos Educativos
            </h3>
            <p className="text-gray-400 font-nunito leading-relaxed">
              Juegos educativos diseñados especialmente para acompañar el aprendizaje de niños
              y niñas en la escuela primaria, con un enfoque pedagógico integral.
            </p>
          </div>

          {/* Developer Info */}
          <div className="md:text-right">
            <h3 className="text-xl font-bold text-white mb-4 font-nunito">
              Desarrollado por
            </h3>
            <div className="space-y-2 text-gray-400 font-nunito">
              <p>
                <strong className="text-white">Pablo Baustian</strong>
              </p>
              <p>
                📧 <a
                  href="mailto:pablo.baustia@gmail.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  pablo.baustia@gmail.com
                </a>
              </p>
              <p>
                🔗 <a
                  href="https://github.com/baustian/primary-school-educational-games"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  GitHub Repository
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <p className="text-center text-gray-500 font-nunito text-sm">
            © 2026 Plataforma de Juegos Educativos. Creado con ❤️ para la educación.
          </p>
        </div>
      </div>
    </footer>
  )
}
