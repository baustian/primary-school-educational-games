import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import WordFactory from './games/word-factory/index.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/word-factory" element={<WordFactory />} />
    </Routes>
  )
}
