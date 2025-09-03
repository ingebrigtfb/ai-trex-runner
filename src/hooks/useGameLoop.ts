import { useEffect, useRef } from 'react'

export const useGameLoop = (callback: () => void, interval: number) => {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current
        if (deltaTime >= interval) {
          callback()
          previousTimeRef.current = time
        }
      } else {
        previousTimeRef.current = time
      }
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [callback, interval])
}
