import { useState } from 'react'
import Game from './components/Game'
import UserSystem from './components/UserSystem'
import { useCheatHandler } from './hooks/useCheatHandler'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [currentHighScore, setCurrentHighScore] = useState(0)
  
  // Hover mode state
  const [hoverMode, setHoverMode] = useState(false)
  const [cheatActivated, setCheatActivated] = useState(false)

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

  // Toggle hover mode cheat (reveal/hide controls)
  const toggleCheatActivation = () => {
    setCheatActivated(prev => {
      const newState = !prev
      console.log(`🦘 Cheat ${newState ? 'activated' : 'deactivated'}: Hover mode controls ${newState ? 'revealed' : 'hidden'}`)
      return newState
    })
  }

  // Toggle hover mode (for when cheat is already activated)
  const toggleHoverMode = () => {
    setHoverMode(prev => !prev)
    console.log(`🦘 Hover mode: ${!hoverMode ? 'ON' : 'OFF'}`)
  }

  // Use cheat handler for 3-click toggle
  useCheatHandler(toggleCheatActivation, 3, 2000)

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
          {cheatActivated && (
            <div className="hover-mode-toggle">
              <label className="hover-toggle-label">
                <input 
                  type="checkbox" 
                  checked={hoverMode} 
                  onChange={toggleHoverMode}
                  className="hover-toggle-input"
                />
                <span className="hover-toggle-text">
                  {hoverMode ? '🦘 Hover Mode: ON' : '🏃 Normal Mode: ON'}
                </span>
              </label>
              <p className="hover-hint">
                {hoverMode ? 'Press space/touch to toggle hover on/off' : 'Press space/touch to jump'}
              </p>
            </div>
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
        hoverMode={hoverMode}
      />
    </div>
  )
}

export default App
