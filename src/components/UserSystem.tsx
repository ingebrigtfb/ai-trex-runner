import React, { useState, useEffect } from 'react'
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
}

const UserSystem: React.FC<UserSystemProps> = ({ 
  onUserChange, 
  currentUser, 
  currentScore 
}) => {
  const [users, setUsers] = useState<User[]>([])
  const [newUserName, setNewUserName] = useState('')
  const [showLeaderboard, setShowLeaderboard] = useState(false)
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
    }
  }

  const handleUserChange = () => {
    setShowUserInput(true)
    setShowLeaderboard(false)
  }

  const handleLogout = () => {
    onUserChange('')
    setShowUserInput(false)
    setShowLeaderboard(false)
  }

  const sortedUsers = [...users].sort((a, b) => b.highScore - a.highScore)

  if (!currentUser) {
    return (
      <div className="user-system">
        <div className="user-login">
          <h2>Welcome to DINO DASH!</h2>
          <p className="tagline">Epic Dinosaur Adventure</p>
          <p>Enter your name to start playing</p>
          
          <form onSubmit={handleUserSubmit} className="user-form">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              required
              className="user-input"
            />
            <button type="submit" className="user-submit-btn">
              Start Playing
            </button>
          </form>

          <button 
            onClick={() => setShowLeaderboard(true)} 
            className="leaderboard-btn"
          >
            View Leaderboard
          </button>

          {showLeaderboard && (
            <div className="leaderboard-modal">
              <div className="leaderboard-content">
                <h3>🏆 Leaderboard</h3>
                <div className="leaderboard-list">
                  {sortedUsers.length > 0 ? (
                    sortedUsers.map((user, index) => (
                      <div key={user.name} className="leaderboard-item">
                        <span className="rank">#{index + 1}</span>
                        <span className="name">{user.name}</span>
                        <span className="score">{user.highScore}</span>
                        <span className="date">{user.lastPlayed}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-scores">No scores yet. Be the first!</p>
                  )}
                </div>
                <button 
                  onClick={() => setShowLeaderboard(false)}
                  className="close-btn"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="user-system">
      <div className="user-info">
                  <span className="current-user">Dino Runner: <strong>{currentUser}</strong></span>
        <div className="user-actions">
          <button onClick={handleUserChange} className="change-user-btn">
            Change Runner
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          <button 
            onClick={() => setShowLeaderboard(true)} 
            className="leaderboard-btn"
          >
            Leaderboard
          </button>
        </div>
      </div>

      {showUserInput && (
        <div className="user-input-modal">
          <div className="user-input-content">
            <h3>Change Dino Runner</h3>
            <form onSubmit={handleUserSubmit} className="user-form">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter new username"
                maxLength={20}
                required
                className="user-input"
              />
              <div className="user-input-buttons">
                <button type="submit" className="user-submit-btn">
                  Change User
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowUserInput(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <div className="leaderboard-modal">
          <div className="leaderboard-content">
            <h3>🏆 Leaderboard</h3>
            <div className="leaderboard-list">
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user, index) => (
                  <div key={user.name} className={`leaderboard-item ${user.name === currentUser ? 'current-user-highlight' : ''}`}>
                    <span className="rank">#{index + 1}</span>
                    <span className="name">{user.name}</span>
                    <span className="score">{user.highScore}</span>
                    <span className="date">{user.lastPlayed}</span>
                  </div>
                ))
              ) : (
                <p className="no-scores">No scores yet. Be the first!</p>
              )}
            </div>
            <button 
              onClick={() => setShowLeaderboard(false)}
              className="close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserSystem
