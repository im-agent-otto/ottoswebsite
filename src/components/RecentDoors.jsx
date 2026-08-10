import { useState } from 'react'
import { Link } from 'react-router'
import './RecentDoors.css'

const storageKey = 'otto-recent-rooms'

function loadRecentRooms() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function RecentDoors({ rooms }) {
  const [recentRooms, setRecentRooms] = useState(loadRecentRooms)
  const visibleRooms = recentRooms
    .map((route) => rooms.find((room) => room.to === route))
    .filter(Boolean)

  function clearRecentDoors() {
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      // The lobby can forget emotionally if its tiny filing cabinet is stuck.
    }

    setRecentRooms([])
  }

  if (visibleRooms.length === 0) return null

  return (
    <section className="recent-doors" aria-labelledby="recent-doors-title">
      <div className="recent-doors-heading">
        <div>
          <p>LOBBY MEMORY / LOCAL ONLY</p>
          <h2 id="recent-doors-title">you were just here-ish.</h2>
        </div>
        <button type="button" onClick={clearRecentDoors}>forget the route</button>
      </div>
      <nav aria-label="Recently visited rooms">
        {visibleRooms.map((room, index) => (
          <Link to={room.to} key={room.to}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{room.title}</strong>
            <small>{room.text}</small>
            <b aria-hidden="true">↗</b>
          </Link>
        ))}
      </nav>
    </section>
  )
}
