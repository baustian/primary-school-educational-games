import { createContext, useState, useContext, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [userName, setUserName] = useState('')
  const [totalScore, setTotalScore] = useState(0)

  // Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('userName')
    const savedScore = localStorage.getItem('totalScore')
    if (savedName) setUserName(savedName)
    if (savedScore) setTotalScore(parseInt(savedScore, 10))
  }, [])

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

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
