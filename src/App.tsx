import { useState } from 'react'
import Game from './components/Game'
import UserSystem from './components/UserSystem'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [currentHighScore, setCurrentHighScore] = useState(0)

  const handleGameOver = (finalScore: number) => {
    setCurrentScore(finalScore)
    setGameStarted(false)
    setGameOver(true)
    // Game is no longer active when it ends
  }

  const handleUserChange = (userName: string) => {
    setCurrentUser(userName)
    setGameStarted(false) // Don't start game immediately, just select user
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

  const handleStartGame = () => {
    setGameStarted(true)
    setGameOver(false)
  }

  if (!currentUser) {
    return (
      <div className="game-container">
        <UserSystem 
          onUserChange={handleUserChange}
          currentUser={currentUser}
          currentScore={currentScore}
          onGameOver={() => {}}
          isGameActive={false}
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
          isGameActive={false}
        />
        <div className="start-screen">
          <h1>DINO DASH</h1>
          <p className="tagline">Episk Dinosaur Eventyr</p>
          <p>Velkommen tilbake, {currentUser}!</p>
          {currentHighScore > 0 && (
            <p className="high-score-display">Din Høyeste Poengsum: {currentHighScore}</p>
          )}
          <p>Trykk MELLOMROM eller klikk for å starte spillet!</p>
          <button onClick={handleStartGame}>Start Eventyret</button>
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
        isGameActive={gameStarted && !gameOver}
      />
      <Game 
        onGameOver={handleGameOver}
        currentUser={currentUser}
      />
    </div>
  )
}

export default App
