import React, { useState, useEffect } from 'react'
import FirebaseLeaderboard from './FirebaseLeaderboard'
import './UserSystem.css'

interface User {
  name: string
  highScore: number
  lastPlayed: string
}

interface UserSystemProps {
  onUserChange: (userName: string) => void
  currentUser: string | null
  currentScore: number
  onGameOver?: () => void
  isGameActive?: boolean
}

const UserSystem: React.FC<UserSystemProps> = ({ 
  onUserChange, 
  currentUser, 
  currentScore,
  isGameActive
}) => {
  const [users, setUsers] = useState<User[]>([])
  const [newUserName, setNewUserName] = useState('')
  const [showFirebaseLeaderboard, setShowFirebaseLeaderboard] = useState(false)

  // Debug logging for leaderboard state
  useEffect(() => {
    console.log('showFirebaseLeaderboard state changed to:', showFirebaseLeaderboard)
  }, [showFirebaseLeaderboard])
  const [showUserInput, setShowUserInput] = useState(false)

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('trexUsers')
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }
  }, [])

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('trexUsers', JSON.stringify(users))
  }, [users])

  // Update high score when game ends
  useEffect(() => {
    if (currentUser && currentScore > 0) {
      updateHighScore(currentUser, currentScore)
    }
  }, [currentScore, currentUser])

  // Close leaderboard when game becomes active
  useEffect(() => {
    if (isGameActive) {
      setShowFirebaseLeaderboard(false)
    }
  }, [isGameActive])

  const updateHighScore = (userName: string, score: number) => {
    setUsers(prevUsers => {
      const existingUser = prevUsers.find(user => user.name === userName)
      
      if (existingUser) {
        if (score > existingUser.highScore) {
          return prevUsers.map(user => 
            user.name === userName 
              ? { ...user, highScore: score, lastPlayed: new Date().toLocaleDateString() }
              : user
          )
        }
        return prevUsers.map(user => 
          user.name === userName 
            ? { ...user, lastPlayed: new Date().toLocaleDateString() }
            : user
        )
      } else {
        return [...prevUsers, {
          name: userName,
          highScore: score,
          lastPlayed: new Date().toLocaleDateString()
        }]
      }
    })
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUserName.trim()) {
      onUserChange(newUserName.trim())
      setNewUserName('')
      setShowUserInput(false)
      setShowFirebaseLeaderboard(false) // Close leaderboard when starting game
    }
  }

  const handleUserChange = () => {
    setShowUserInput(true)
    setShowFirebaseLeaderboard(false)
  }

  const handleLogout = () => {
    onUserChange('')
    setShowUserInput(false)
    setShowFirebaseLeaderboard(false)
  }

  if (!currentUser) {
    return (
      <div className="user-system">
        <div className="user-login">
          <h2>Velkommen til DINO DASH!</h2>
          <p className="tagline">Episk Dinosaur Eventyr</p>
          <p>Skriv inn navnet ditt for å starte å spille</p>
          
          <form onSubmit={handleUserSubmit} className="user-form">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Skriv inn navnet ditt"
              maxLength={20}
              required
              className="user-input"
            />
            <button type="submit" className="user-submit-btn">
              Start å Spille
            </button>
          </form>

          <button 
            onClick={() => {
              console.log('Leaderboard button clicked! Setting showFirebaseLeaderboard to true')
              setShowFirebaseLeaderboard(true)
            }} 
            className="leaderboard-btn"
          >
            🏆 Se Poengtavle
          </button>

          {showFirebaseLeaderboard && (
            <FirebaseLeaderboard
              currentUser={currentUser}
              currentScore={currentScore}
              onClose={() => setShowFirebaseLeaderboard(false)}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="user-system">
              <div className="user-info">
                  <span className="current-user">Dino Løper: <strong>{currentUser}</strong></span>
        <div className="user-actions">
          <button onClick={handleUserChange} className="change-user-btn">
            Bytt Løper
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logg Ut
          </button>
          <button 
            onClick={() => setShowFirebaseLeaderboard(true)} 
            className="leaderboard-btn"
            disabled={isGameActive}
            title={isGameActive ? "Poengtavle ikke tilgjengelig under spillet" : "Se Poengtavle"}
          >
            🏆 Poengtavle
          </button>
        </div>
      </div>

                      {showUserInput && (
                  <div className="user-input-modal">
                    <div className="user-input-content">
                      <h3>Bytt Dino Løper</h3>
                      <form onSubmit={handleUserSubmit} className="user-form">
                        <input
                          type="text"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="Skriv inn nytt brukernavn"
                          maxLength={20}
                          required
                          className="user-input"
                        />
                        <div className="user-input-buttons">
                          <button type="submit" className="user-submit-btn">
                            Bytt Bruker
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setShowUserInput(false)}
                            className="cancel-btn"
                          >
                            Avbryt
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}



      {showFirebaseLeaderboard && (
        <FirebaseLeaderboard
          currentUser={currentUser}
          currentScore={currentScore}
          onClose={() => setShowFirebaseLeaderboard(false)}
        />
      )}
    </div>
  )
}

export default UserSystem
