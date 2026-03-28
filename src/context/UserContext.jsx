import { useState, useEffect } from 'react'
import { UserContext } from './createUserContext'

export function UserProvider({ children }) {
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '')
  const [totalScore, setTotalScore] = useState(() => parseInt(localStorage.getItem('totalScore') || '0', 10))

  // Save to localStorage when name or score changes
  useEffect(() => {
    localStorage.setItem('userName', userName)
  }, [userName])

  useEffect(() => {
    localStorage.setItem('totalScore', totalScore.toString())
  }, [totalScore])

  const updateUserName = (name) => {
    // Reset score if name actually changed
    if (name !== userName) {
      setTotalScore(0)
    }
    setUserName(name)
  }

  const addScore = (points) => {
    setTotalScore(totalScore + points)
  }

  const resetScore = () => {
    setTotalScore(0)
  }

  return (
    <UserContext.Provider value={{ userName, totalScore, updateUserName, addScore, resetScore }}>
      {children}
    </UserContext.Provider>
  )
}
