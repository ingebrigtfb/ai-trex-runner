import { useEffect } from 'react'

export const useHoverHandler = (
  onToggle: () => void,
  key: string,
  hoverMode: boolean
) => {
  useEffect(() => {
    if (!hoverMode) return

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === `Key${key.toUpperCase()}` || event.key === key) {
        event.preventDefault()
        onToggle()
      }
    }

    const handleClick = () => {
      onToggle()
    }

    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.removeEventListener('click', handleClick)
    }
  }, [onToggle, key, hoverMode])
}
