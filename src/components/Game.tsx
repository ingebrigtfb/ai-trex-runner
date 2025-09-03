import React, { useEffect, useRef, useState, useCallback } from 'react'
import Dinosaur from './Dinosaur'
import Obstacle from './Obstacle'
import Cloud from './Cloud'
import { useGameLoop } from '../hooks/useGameLoop'
import { useInputHandler } from '../hooks/useInputHandler'
import './Game.css'

interface GameProps {
  onGameOver: (finalScore: number) => void
  currentUser: string
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

const Game: React.FC<GameProps> = ({ onGameOver, currentUser }) => {
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
  
  const gameRef = useRef<HTMLDivElement>(null)
  const lastObstacleTime = useRef(0)
  const lastCloudTime = useRef(0)

  // Load current user's high score from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('trexUsers')
    if (savedUsers) {
      const users = JSON.parse(savedUsers)
      const currentUserData = users.find((user: any) => user.name === currentUser)
      if (currentUserData) {
        setHighScore(currentUserData.highScore)
      }
    }
  }, [currentUser])

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
    if (!isJumping && !isGameOver) {
      setIsJumping(true)
      setDinoY(0)
      
      // Jump animation with better physics - slower descent
      let jumpPhase = 'up' // 'up' or 'down'
      const jumpInterval = setInterval(() => {
        setDinoY(prev => {
          if (jumpPhase === 'up') {
            if (prev >= 150) {
              jumpPhase = 'down'
              return prev
            }
            return prev + 8
          } else {
            // Slower descent for more graceful landing
            if (prev <= 0) {
              setIsJumping(false)
              clearInterval(jumpInterval)
              return 0
            }
            return prev - 5
          }
        })
      }, 16)
    }
  }, [isJumping, isGameOver])

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
  }

  const handleGameOver = () => {
    onGameOver(score)
  }

  useGameLoop(updateGame, 16)
  useInputHandler(jump, ' ')

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => {
        handleGameOver()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isGameOver, handleGameOver])

  return (
    <div className="game" ref={gameRef}>
      <div className="game-overlay">
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
        <div>Speed: {gameSpeed.toFixed(1)}</div>
      </div>

      <div className="game-instructions">
        Press SPACE to jump!
      </div>

      <div className="ground"></div>

      <Dinosaur y={dinoY} isJumping={isJumping} />

      {obstacles.map(obstacle => (
        <Obstacle
          key={obstacle.id}
          x={obstacle.x}
          y={obstacle.y}
          type={obstacle.type}
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
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          {score >= highScore && score > 0 && (
            <p className="new-high-score">🎉 New High Score! 🎉</p>
          )}
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  )
}

export default Game
