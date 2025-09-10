import { useEffect, useRef } from 'react'

export const useCheatHandler = (
  onCheatActivated: () => void,
  requiredClicks: number = 3,
  timeWindow: number = 2000 // 2 seconds to complete the sequence
) => {
  const clickCount = useRef(0)
  const lastClickTime = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClick = () => {
      const now = Date.now()
      
      // Reset if too much time has passed since last click
      if (now - lastClickTime.current > timeWindow) {
        clickCount.current = 0
      }
      
      clickCount.current++
      lastClickTime.current = now
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Set timeout to reset click count
      timeoutRef.current = setTimeout(() => {
        clickCount.current = 0
      }, timeWindow)
      
      // Check if cheat is activated
      if (clickCount.current >= requiredClicks) {
        onCheatActivated()
        clickCount.current = 0 // Reset after activation
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [onCheatActivated, requiredClicks, timeWindow])
}
