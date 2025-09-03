import { useState } from 'react'
import Game from './components/Game'
import UserSystem from './components/UserSystem'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [currentHighScore, setCurrentHighScore] = useState(0)

  const handleGameOver = (finalScore: number) => {
    setCurrentScore(finalScore)
    setGameStarted(false)
  }

  const handleUserChange = (userName: string) => {
    setCurrentUser(userName)
    setGameStarted(true)
    setCurrentScore(0)
    
    // Load user's high score
    const savedUsers = localStorage.getItem('trexUsers')
    if (savedUsers) {
      const users = JSON.parse(savedUsers)
      const userData = users.find((user: any) => user.name === userName)
      if (userData) {
        setCurrentHighScore(userData.highScore)
      } else {
        setCurrentHighScore(0)
      }
    } else {
      setCurrentHighScore(0)
    }
  }

  if (!currentUser) {
    return (
      <div className="game-container">
        <UserSystem 
          onUserChange={handleUserChange}
          currentUser={currentUser}
          currentScore={currentScore}
          onGameOver={() => {}}
        />
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="game-container">
        <UserSystem 
          onUserChange={handleUserChange}
          currentUser={currentUser}
          currentScore={currentScore}
          onGameOver={() => {}}
        />
        <div className="start-screen">
          <h1>DINO DASH</h1>
          <p className="tagline">Epic Dinosaur Adventure</p>
          <p>Welcome back, {currentUser}!</p>
          {currentHighScore > 0 && (
            <p className="high-score-display">Your High Score: {currentHighScore}</p>
          )}
          <p>Press SPACE or click to start the game!</p>
          <button onClick={() => setGameStarted(true)}>Start Adventure</button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <UserSystem 
        onUserChange={handleUserChange}
        currentUser={currentUser}
        currentScore={currentScore}
        onGameOver={() => {}}
      />
      <Game 
        onGameOver={handleGameOver}
        currentUser={currentUser}
      />
    </div>
  )
}

export default App
