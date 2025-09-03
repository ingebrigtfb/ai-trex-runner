import React from 'react'
import './Dinosaur.css'

interface DinosaurProps {
  y: number
  isJumping: boolean
}

const Dinosaur: React.FC<DinosaurProps> = ({ y, isJumping }) => {
  return (
    <div 
      className={`dinosaur ${isJumping ? 'jumping' : ''}`}
      style={{ 
        transform: `translateY(-${y}px)`,
        bottom: '100px'
      }}
    >
      <div className="dino-body">
        <div className="dino-head">
          <div className="dino-eye"></div>
          <div className="dino-mouth"></div>
        </div>
        <div className="dino-neck"></div>
        <div className="dino-torso">
          <div className="dino-arm"></div>
          <div className="dino-leg front"></div>
          <div className="dino-leg back"></div>
        </div>
        <div className="dino-tail"></div>
      </div>
    </div>
  )
}

export default Dinosaur
