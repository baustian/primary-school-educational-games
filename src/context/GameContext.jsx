import { useState, useCallback } from 'react'
import { GameContext } from './createGameContext'

const INITIAL_GAME_INFO = {
  name: null,
  currentIndex: 0,
  totalWords: 0,
  correctCount: 0,
}

export function GameProvider({ children }) {
  const [gameInfo, setGameInfo] = useState(INITIAL_GAME_INFO)

  const updateGameInfo = useCallback((info) => {
    setGameInfo(prev => ({ ...prev, ...info }))
  }, [])

  const clearGameInfo = useCallback(() => {
    setGameInfo(prev => {
      const isAlreadyClear =
        prev.name === null &&
        prev.currentIndex === 0 &&
        prev.totalWords === 0 &&
        prev.correctCount === 0

      return isAlreadyClear ? prev : INITIAL_GAME_INFO
    })
  }, [])

  return (
    <GameContext.Provider value={{ gameInfo, updateGameInfo, clearGameInfo }}>
      {children}
    </GameContext.Provider>
  )
}
