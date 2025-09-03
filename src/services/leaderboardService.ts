import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  where,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

export interface LeaderboardEntry {
  id?: string
  playerName: string
  score: number
  timestamp: any
  gameSpeed: number
  obstaclesAvoided?: number
}

export interface PlayerStats {
  highScore: number
  totalGames: number
  totalScore: number
  averageScore: number
  lastPlayed: any
  bestGameSpeed: number
}

class LeaderboardService {
  private readonly COLLECTION_NAME = 'leaderboard'
  private readonly PLAYERS_COLLECTION = 'players'

  // Add a new score to the leaderboard
  async addScore(entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...entry,
        timestamp: serverTimestamp()
      })
      
      // Update player stats
      await this.updatePlayerStats(entry.playerName, entry.score, entry.gameSpeed)
      
      return docRef.id
    } catch (error) {
      console.error('Error adding score:', error)
      throw error
    }
  }

  // Get top scores (default top 50)
  async getTopScores(limitCount: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('score', 'desc'),
        limit(limitCount * 2) // Get more scores to account for filtering
      )
      
      const querySnapshot = await getDocs(q)
      const playerBestScores = new Map<string, LeaderboardEntry>()
      
      querySnapshot.forEach((doc) => {
        const entry = {
          id: doc.id,
          ...doc.data()
        } as LeaderboardEntry
        
        // Only keep the highest score for each player
        if (!playerBestScores.has(entry.playerName) || 
            entry.score > playerBestScores.get(entry.playerName)!.score) {
          playerBestScores.set(entry.playerName, entry)
        }
      })
      
      // Convert map to array and sort by score
      const uniqueScores = Array.from(playerBestScores.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limitCount) // Limit to requested count
      
      return uniqueScores
    } catch (error) {
      console.error('Error getting top scores:', error)
      throw error
    }
  }

  // Get real-time leaderboard updates
  subscribeToLeaderboard(
    callback: (scores: LeaderboardEntry[]) => void,
    limitCount: number = 50
  ) {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      orderBy('score', 'desc'),
      limit(limitCount * 2) // Get more scores to account for filtering
    )
    
    return onSnapshot(q, (querySnapshot) => {
      const playerBestScores = new Map<string, LeaderboardEntry>()
      
      querySnapshot.forEach((doc) => {
        const entry = {
          id: doc.id,
          ...doc.data()
        } as LeaderboardEntry
        
        // Only keep the highest score for each player
        if (!playerBestScores.has(entry.playerName) || 
            entry.score > playerBestScores.get(entry.playerName)!.score) {
          playerBestScores.set(entry.playerName, entry)
        }
      })
      
      // Convert map to array and sort by score
      const uniqueScores = Array.from(playerBestScores.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limitCount) // Limit to requested count
      
      callback(uniqueScores)
    })
  }

  // Get player's personal best scores
  async getPlayerScores(playerName: string, limitCount: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('playerName', '==', playerName),
        orderBy('score', 'desc'),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      const scores: LeaderboardEntry[] = []
      
      querySnapshot.forEach((doc) => {
        scores.push({
          id: doc.id,
          ...doc.data()
        } as LeaderboardEntry)
      })
      
      return scores
    } catch (error) {
      console.error('Error getting player scores:', error)
      throw error
    }
  }

  // Get player statistics
  async getPlayerStats(playerName: string): Promise<PlayerStats | null> {
    try {
      const playerDoc = await getDoc(doc(db, this.PLAYERS_COLLECTION, playerName))
      
      if (playerDoc.exists()) {
        return playerDoc.data() as PlayerStats
      }
      
      return null
    } catch (error) {
      console.error('Error getting player stats:', error)
      throw error
    }
  }

  // Update player statistics
  private async updatePlayerStats(playerName: string, score: number, gameSpeed: number): Promise<void> {
    try {
      const playerRef = doc(db, this.PLAYERS_COLLECTION, playerName)
      const playerDoc = await getDoc(playerRef)
      
      if (playerDoc.exists()) {
        const currentStats = playerDoc.data() as PlayerStats
        
        const newStats: PlayerStats = {
          highScore: Math.max(currentStats.highScore, score),
          totalGames: currentStats.totalGames + 1,
          totalScore: currentStats.totalScore + score,
          averageScore: Math.round((currentStats.totalScore + score) / (currentStats.totalGames + 1)),
          lastPlayed: serverTimestamp(),
          bestGameSpeed: Math.max(currentStats.bestGameSpeed, gameSpeed)
        }
        
        await updateDoc(playerRef, newStats as any)
      } else {
        // Create new player stats
        const newStats: PlayerStats = {
          highScore: score,
          totalGames: 1,
          totalScore: score,
          averageScore: score,
          lastPlayed: serverTimestamp(),
          bestGameSpeed: gameSpeed
        }
        
        await updateDoc(playerRef, newStats as any)
      }
    } catch (error) {
      console.error('Error updating player stats:', error)
      throw error
    }
  }

  // Get friends leaderboard (players with similar scores)
  async getFriendsLeaderboard(playerName: string, playerScore: number): Promise<LeaderboardEntry[]> {
    try {
      // Get players with scores within 20% of the current player's score
      const minScore = Math.floor(playerScore * 0.8)
      const maxScore = Math.ceil(playerScore * 1.2)
      
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('score', '>=', minScore),
        where('score', '<=', maxScore),
        orderBy('score', 'desc'),
        limit(20)
      )
      
      const querySnapshot = await getDocs(q)
      const scores: LeaderboardEntry[] = []
      
      querySnapshot.forEach((doc) => {
        scores.push({
          id: doc.id,
          ...doc.data()
        } as LeaderboardEntry)
      })
      
      // Filter out the current player and sort by score
      return scores
        .filter(entry => entry.playerName !== playerName)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
    } catch (error) {
      console.error('Error getting friends leaderboard:', error)
      throw error
    }
  }

  // Get recent scores (last 24 hours)
  async getRecentScores(limitCount: number = 20): Promise<LeaderboardEntry[]> {
    try {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('timestamp', '>=', yesterday),
        orderBy('timestamp', 'desc'),
        limit(limitCount * 2) // Get more scores to account for filtering
      )
      
      const querySnapshot = await getDocs(q)
      const playerBestScores = new Map<string, LeaderboardEntry>()
      
      querySnapshot.forEach((doc) => {
        const entry = {
          id: doc.id,
          ...doc.data()
        } as LeaderboardEntry
        
        // Only keep the highest score for each player
        if (!playerBestScores.has(entry.playerName) || 
            entry.score > playerBestScores.get(entry.playerName)!.score) {
          playerBestScores.set(entry.playerName, entry)
        }
      })
      
      // Convert map to array and sort by score
      const uniqueScores = Array.from(playerBestScores.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limitCount) // Limit to requested count
      
      return uniqueScores
    } catch (error) {
      console.error('Error getting recent scores:', error)
      throw error
    }
  }
}

export const leaderboardService = new LeaderboardService()
export default leaderboardService
