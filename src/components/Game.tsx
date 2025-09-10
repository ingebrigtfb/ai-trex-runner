import React, { useEffect, useRef, useState, useCallback } from 'react'
import Dinosaur from './Dinosaur'
import Obstacle from './Obstacle'
import Cloud from './Cloud'
import { useGameLoop } from '../hooks/useGameLoop'
import { useInputHandler } from '../hooks/useInputHandler'
import { useHoverHandler } from '../hooks/useHoverHandler'
import { leaderboardService } from '../services/leaderboardService'
import './Game.css'

interface GameProps {
  onGameOver: (finalScore: number) => void
  currentUser: string
  hoverMode: boolean
}

interface ObstacleData {
  id: number
  x: number
  y: number
}

interface CloudData {
  id: number
  x: number
  y: number
}

const Game: React.FC<GameProps> = ({ onGameOver, currentUser, hoverMode }) => {
  const [score, setScore] = useState(0)
  const [gameSpeed, setGameSpeed] = useState(5)
  const [isGameOver, setIsGameOver] = useState(false)
  const [dinoY, setDinoY] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [obstacles, setObstacles] = useState<ObstacleData[]>([])
  const [clouds, setClouds] = useState<CloudData[]>([])
  const [obstacleId, setObstacleId] = useState(0)
  const [cloudId, setCloudId] = useState(0)
  const [highScore, setHighScore] = useState(0)
  
  // Hover mode state
  const [isHovering, setIsHovering] = useState(false)
  
  const gameRef = useRef<HTMLDivElement>(null)
  const lastObstacleTime = useRef(0)
  const lastCloudTime = useRef(0)

  // Function to refresh high score from localStorage
  const refreshHighScore = useCallback(() => {
    const savedUsers = localStorage.getItem('trexUsers')
    if (savedUsers) {
      const users = JSON.parse(savedUsers)
      const currentUserData = users.find((user: any) => user.name === currentUser)
      if (currentUserData) {
        setHighScore(currentUserData.highScore)
      }
    }
  }, [currentUser])

  // Load current user's high score from localStorage
  useEffect(() => {
    refreshHighScore()
  }, [refreshHighScore])

  const checkCollision = useCallback((dinoX: number, dinoY: number, dinoWidth: number, dinoHeight: number) => {
    const dinoRight = dinoX + dinoWidth
    const dinoBottom = dinoY + dinoHeight

    return obstacles.some(obstacle => {
      const obstacleRight = obstacle.x + 30
      const obstacleBottom = obstacle.y + 50 // All obstacles are now cacti with height 50
      
      return (
        dinoX < obstacleRight &&
        dinoRight > obstacle.x &&
        dinoY < obstacleBottom &&
        dinoBottom > obstacle.y
      )
    })
  }, [obstacles])

  const jump = useCallback(() => {
    if (!isGameOver && !hoverMode) {
      // Normal jump mode only when not in hover mode
      if (!isJumping) {
        setIsJumping(true)
        setDinoY(0)
        
        // Simple jump animation
        let jumpPhase = 'up'
        const interval = setInterval(() => {
          setDinoY(prev => {
            if (jumpPhase === 'up') {
              if (prev >= 150) {
                jumpPhase = 'down'
                return prev
              }
              return prev + 8
            } else {
              if (prev <= 0) {
                setIsJumping(false)
                clearInterval(interval)
                return 0
              }
              return prev - 5
            }
          })
        }, 16)
      }
    }
  }, [isGameOver, hoverMode, isJumping])

  const generateObstacle = useCallback(() => {
    const now = Date.now()
    if (now - lastObstacleTime.current > 1500 - gameSpeed * 100) {
      setObstacles(prev => [...prev, {
        id: obstacleId,
        x: 800,
        y: 0
      }])
      setObstacleId(prev => prev + 1)
      lastObstacleTime.current = now
    }
  }, [obstacleId, gameSpeed])

  const generateCloud = useCallback(() => {
    const now = Date.now()
    if (now - lastCloudTime.current > 3000) {
      setClouds(prev => [...prev, {
        id: cloudId,
        x: 800,
        y: Math.random() * 100 + 50
      }])
      setCloudId(prev => prev + 1)
      lastCloudTime.current = now
    }
  }, [cloudId])

  const updateGame = useCallback(() => {
    if (isGameOver) return

    // Update score
    setScore(prev => prev + 1)

    // Increase game speed over time
    if (score > 0 && score % 500 === 0) {
      setGameSpeed(prev => Math.min(prev + 0.5, 15))
    }

    // Update obstacles
    setObstacles(prev => 
      prev
        .map(obstacle => ({ ...obstacle, x: obstacle.x - gameSpeed }))
        .filter(obstacle => obstacle.x > -50)
    )

    // Update clouds
    setClouds(prev => 
      prev
        .map(cloud => ({ ...cloud, x: cloud.x - gameSpeed * 0.5 }))
        .filter(cloud => cloud.x > -100)
    )

    // Generate new obstacles and clouds
    generateObstacle()
    generateCloud()

    // Check collision
    if (checkCollision(50, dinoY, 40, 50)) {
      setIsGameOver(true)
    }
  }, [isGameOver, score, gameSpeed, dinoY, checkCollision, generateObstacle, generateCloud])

  const resetGame = () => {
    setScore(0)
    setGameSpeed(5)
    setIsGameOver(false)
    setDinoY(0)
    setIsJumping(false)
    setObstacles([])
    setClouds([])
    setObstacleId(0)
    setCloudId(0)
    lastObstacleTime.current = 0
    lastCloudTime.current = 0
    
    // Reset hover mode
    setIsHovering(false)
    
    // Refresh high score before starting new game
    refreshHighScore()
  }


  const handleGameOver = async () => {
    // Save score to Firebase if user is logged in
    if (currentUser && score > 0) {
      try {
        await leaderboardService.addScore({
          playerName: currentUser,
          score: score,
          gameSpeed: gameSpeed,
          obstaclesAvoided: Math.floor(score / 100) // Rough estimate
        })
        
        // Refresh high score after saving to Firebase
        refreshHighScore()
      } catch (error) {
        console.error('Failed to save score to Firebase:', error)
      }
    }
    
    onGameOver(score)
  }

  useGameLoop(updateGame, 16)
  
  // Use different input handlers based on mode
  useInputHandler(jump, ' ')
  useHoverHandler(
    () => setIsHovering(prev => !prev),
    ' ',
    hoverMode
  )

  // Handle hover state changes
  useEffect(() => {
    if (hoverMode) {
      if (isHovering) {
        setDinoY(150) // Set to hover height
      } else {
        setDinoY(0) // Return to ground
      }
    }
  }, [hoverMode, isHovering])

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => {
        handleGameOver()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isGameOver, handleGameOver])

  return (
    <div className="game" ref={gameRef}>
      <div className="game-overlay">
        <div>Poengsum: {score}</div>
        <div>Høyeste Poengsum: {highScore}</div>
        <div>Hastighet: {gameSpeed.toFixed(1)}</div>
        {hoverMode && (
          <div className="hover-indicator">
            {isHovering ? '🦘 Hovering' : '🏃 Running'}
          </div>
        )}
      </div>

      <div className="game-instructions">
        Trykk MELLOMROM for å hoppe!
      </div>

      <div className="ground"></div>

      <Dinosaur y={dinoY} isJumping={isJumping} />

      {obstacles.map(obstacle => (
        <Obstacle
          key={obstacle.id}
          x={obstacle.x}
          y={obstacle.y}
        />
      ))}

      {clouds.map(cloud => (
        <Cloud
          key={cloud.id}
          x={cloud.x}
          y={cloud.y}
        />
      ))}

      {isGameOver && (
        <div className="game-over">
          <h2>Spill Slutt!</h2>
          <p>Endelig Poengsum: {score}</p>
          {score >= highScore && score > 0 && (
            <p className="new-high-score">🎉 Ny Høyeste Poengsum! 🎉</p>
          )}
          <button onClick={resetGame}>Spill Igjen</button>
          <p className="leaderboard-hint">🏆 Sjekk poengtavlen for å se din plassering!</p>
        </div>
      )}
    </div>
  )
}

export default Game
