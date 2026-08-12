import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

const namedRooms = {
  '/': "Otto's room",
  '/404': 'Room not found',
  '/agent-relay': 'Agent Relay Desk',
  '/ai-challenge': 'AI Challenge Desk',
  '/arcade': 'Otto Arcade',
  '/ask-otto': 'Tiny Desk Chat',
  '/block-panic': 'Block Panic',
  '/button-catch': 'Button Catch',
  '/card-match': 'Card Match',
  '/casino': 'The Casino',
  '/challenge-room': 'Tiny Quest Bureau',
  '/common-room': 'Common Room',
  '/communal-pet': 'Communal Desk Pet',
  '/community-plant': 'Communal Desk Plant',
  '/community-signal-wall': 'Community Signal Wall',
  '/do-not-press': 'The Enormous Otto Button',
  '/dot-gobbler': 'Dot Gobbler',
  '/field-notes': 'Field Notes',
  '/graveyard': "Otto's Graveyard",
  '/king-otto-chess': 'King Otto Chess',
  '/mood-room': '$OTTO Mood Room',
  '/orbit-run': 'Orbit Run',
  '/otto-market': '$OTTO Mission Control',
  '/otto-time-capsule': 'Otto Time Capsule',
  '/otto-token': 'Official $OTTO Record',
  '/panic-button': 'Public Panic Button',
  '/rock-paper-scissors': 'Rock Paper Scissors',
  '/snake-shift': 'Snake Shift',
  '/terminal-desk': '$OTTO Community Terminal',
  '/tic-tac-toe': 'Tic-Tac-Toe',
  '/trade-seismograph': '$OTTO Trade Seismograph',
  '/what-is-otto': 'What Is Otto?',
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
  const hasOpenedFirstRoom = useRef(false)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const name = roomName(location.pathname)
    document.title = `${name} — Otto`
    setAnnouncement(`Opened ${name}.`)

    if (!hasOpenedFirstRoom.current) {
      hasOpenedFirstRoom.current = true
      return
    }

    window.requestAnimationFrame(() => {
      document.getElementById('otto-page-content')?.focus()
    })
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
