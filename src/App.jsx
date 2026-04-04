import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Home from './pages/Home.jsx'
import WordFactory from './games/word-factory/index.jsx'
import RuletaDePalabras from './games/ruleta-de-palabras/index.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import NameModal from './components/NameModal.jsx'
import { GameProvider } from './context/GameContext.jsx'

export default function App() {
  const [nameModalOpen, setNameModalOpen] = useState(() => {
    return !localStorage.getItem('userName')
  })

  return (
    <GameProvider>
      <div className="flex flex-col min-h-screen">
        <Header onChangeUserName={() => setNameModalOpen(true)} />
        <NameModal isOpen={nameModalOpen} onClose={() => setNameModalOpen(false)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/word-factory" element={<WordFactory />} />
            <Route path="/ruleta-de-palabras" element={<RuletaDePalabras />} />
          </Routes>
        </main>
        <Footer />
        <Analytics />
      </div>
    </GameProvider>
  )
}
