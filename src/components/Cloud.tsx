import React from 'react'
import './Cloud.css'

interface CloudProps {
  x: number
  y: number
}

const Cloud: React.FC<CloudProps> = ({ x, y }) => {
  return (
    <div 
      className="cloud"
      style={{ 
        left: `${x}px`,
        top: `${y}px`
      }}
    >
      <div className="cloud-part main"></div>
      <div className="cloud-part left"></div>
      <div className="cloud-part right"></div>
      <div className="cloud-part top"></div>
    </div>
  )
}

export default Cloud
