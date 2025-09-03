import React, { useState, useEffect } from 'react'
import { leaderboardService, LeaderboardEntry, PlayerStats } from '../services/leaderboardService'
import './FirebaseLeaderboard.css'

interface FirebaseLeaderboardProps {
  currentUser: string | null
  currentScore: number
  onClose: () => void
}



const FirebaseLeaderboard: React.FC<FirebaseLeaderboardProps> = ({ 
  currentUser, 
  currentScore, 
  onClose 
}) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)

  const loadLeaderboard = async () => {
    let unsubscribe: (() => void) | null = null

    try {
      setLoading(true)
      setError(null)

      // Always load global leaderboard
      try {
        unsubscribe = leaderboardService.subscribeToLeaderboard((scores) => {
          setLeaderboardData(scores)
          setLoading(false)
        })
      } catch (err) {
        console.error('Error subscribing to global leaderboard:', err)
                    setError('Firebase-tilkobling mislyktes. Sjekk internettforbindelsen din.')
        setLoading(false)
      }

      // Load player stats if available
      if (currentUser) {
        try {
          const stats = await leaderboardService.getPlayerStats(currentUser)
          setPlayerStats(stats)
        } catch (err) {
          console.error('Error loading player stats:', err)
          // Don't show error for stats, just continue
        }
      }
    } catch (err) {
      setError('Kunne ikke laste poengtavledata. Prøv igjen.')
      setLoading(false)
      console.error('Error loading leaderboard:', err)
    }

    return unsubscribe
  }

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const loadData = async () => {
      unsubscribe = await loadLeaderboard()
    }

    loadData()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [currentUser, currentScore])

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown'
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    return date.toLocaleDateString()
  }



  if (loading && leaderboardData.length === 0) {
    return (
      <div className="firebase-leaderboard-modal">
        <div className="firebase-leaderboard-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Laster poengtavle...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="firebase-leaderboard-modal">
      <div className="firebase-leaderboard-content">
        <div className="leaderboard-header">
          <h2>🏆 Poengtavle</h2>
          <p className="leaderboard-note">Viser beste poengsum per spiller</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={() => loadLeaderboard()}>Prøv Igjen</button>
              <button onClick={() => setError(null)} className="dismiss-btn">Avvis</button>
            </div>
            {error.includes('Firebase') && (
              <p className="firebase-help">
                🔧 Firebase-tilkoblingsproblem oppdaget. Dette kan være på grunn av:
                <br />• Nettverksforbindelsesproblemer
                <br />• Firebase-prosjektkonfigurasjon
                <br />• Firestore-database ikke aktivert
              </p>
            )}
          </div>
        )}

        {playerStats && currentUser && (
          <div className="player-stats">
            <h3>Dine Statistikk</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Høyeste Poengsum</span>
                <span className="stat-value">{playerStats.highScore}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Spill Spilt</span>
                <span className="stat-value">{playerStats.totalGames}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Gjennomsnittlig Poengsum</span>
                <span className="stat-value">{playerStats.averageScore}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Beste Hastighet</span>
                <span className="stat-value">{playerStats.bestGameSpeed.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}



        <div className="leaderboard-list">
          {leaderboardData.length > 0 ? (
            leaderboardData.map((entry, index) => (
              <div 
                key={entry.id} 
                className={`leaderboard-item ${entry.playerName === currentUser ? 'current-user-highlight' : ''}`}
              >
                <span className="rank">#{index + 1}</span>
                <span className="name">{entry.playerName}</span>
                <span className="score">{entry.score.toLocaleString()}</span>
                <span className="speed">{entry.gameSpeed.toFixed(1)}</span>
                <span className="date">{formatTimestamp(entry.timestamp)}</span>
              </div>
            ))
          ) : (
            <div className="no-scores">
              <p>Ingen poengsummer tilgjengelige</p>
            </div>
          )}
        </div>

        <div className="leaderboard-footer">
          <p className="last-updated">
            Sist oppdatert: {new Date().toLocaleTimeString()}
          </p>
          <button onClick={onClose} className="close-btn">
            Lukk Poengtavle
          </button>
        </div>
      </div>
    </div>
  )
}

export default FirebaseLeaderboard
