import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import WordFactory from './games/word-factory/index.jsx'
import Header from './components/Header.jsx'
import NameModal from './components/NameModal.jsx'
import { GameProvider } from './context/GameContext.jsx'

export default function App() {
  const [nameModalOpen, setNameModalOpen] = useState(() => {
    return !localStorage.getItem('userName')
  })

  return (
    <GameProvider>
      <Header onChangeUserName={() => setNameModalOpen(true)} />
      <NameModal isOpen={nameModalOpen} onClose={() => setNameModalOpen(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/word-factory" element={<WordFactory />} />
      </Routes>
    </GameProvider>
  )
}
