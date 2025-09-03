import { useEffect } from 'react'

export const useInputHandler = (callback: () => void, key: string) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === `Key${key.toUpperCase()}` || event.key === key) {
        event.preventDefault()
        callback()
      }
    }

    const handleClick = () => {
      callback()
    }

    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.removeEventListener('click', handleClick)
    }
  }, [callback, key])
}
