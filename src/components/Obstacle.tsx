import React from 'react'
import './Obstacle.css'

interface ObstacleProps {
  x: number
  y: number
}

const Obstacle: React.FC<ObstacleProps> = ({ x, y }) => {
  return (
    <div 
      className="obstacle cactus"
      style={{ 
        left: `${x}px`,
        bottom: `${y + 100}px`
      }}
    >
      <div className="cactus-main">
        <div className="cactus-branch left"></div>
        <div className="cactus-branch right"></div>
        <div className="cactus-branch top"></div>
      </div>
    </div>
  )
}

export default Obstacle
