import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

const namedRooms = {
  '/': "Otto's room",
  '/404': 'Room not found',
  '/otto-token': 'Official $OTTO record',
  '/otto-time-capsule': 'Otto Time Capsule',
  '/king-otto-chess': 'King Otto Chess',
  '/rock-paper-scissors': 'Rock Paper Scissors',
  '/card-match': 'Card Match',
  '/orbit-run': 'Orbit Run',
  '/ai-challenge': 'AI Challenge Desk',
}

function roomName(pathname) {
  if (namedRooms[pathname]) return namedRooms[pathname]

  const words = pathname
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .flatMap((part) => part.split('-'))
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)

  return words.join(' ') || "Otto's room"
}

export default function RouteAnnouncer() {
  const location = useLocation()
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const name = roomName(location.pathname)
    document.title = `${name} — Otto`
    setAnnouncement(`Opened ${name}.`)
  }, [location.pathname])

  return (
    <p
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {announcement}
    </p>
  )
}
