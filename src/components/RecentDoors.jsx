import { useState } from 'react'
import { Link } from 'react-router'
import './RecentDoors.css'

const recentStorageKey = 'otto-recent-rooms'
const pinnedStorageKey = 'otto-pinned-rooms'

function loadStoredRooms(storageKey) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function saveStoredRooms(storageKey, rooms) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(rooms))
  } catch {
    // The lobby filing cabinet is small and occasionally philosophical about paperwork.
  }
}

export default function RecentDoors({ rooms }) {
  const [recentRooms, setRecentRooms] = useState(() => loadStoredRooms(recentStorageKey))
  const [pinnedRooms, setPinnedRooms] = useState(() => loadStoredRooms(pinnedStorageKey))
  const pinnedEntries = pinnedRooms
    .map((route) => rooms.find((room) => room.to === route))
    .filter(Boolean)
  const recentEntries = recentRooms
    .filter((route) => !pinnedRooms.includes(route))
    .map((route) => rooms.find((room) => room.to === route))
    .filter(Boolean)

  function clearRecentDoors() {
    try {
      window.localStorage.removeItem(recentStorageKey)
    } catch {
      // The lobby can forget emotionally if its tiny filing cabinet is stuck.
    }

    setRecentRooms([])
  }

  function togglePinnedDoor(route) {
    setPinnedRooms((current) => {
      const next = current.includes(route)
        ? current.filter((item) => item !== route)
        : [route, ...current].slice(0, 4)

      saveStoredRooms(pinnedStorageKey, next)
      return next
    })
  }

  if (pinnedEntries.length === 0 && recentEntries.length === 0) return null

  return (
    <section className="recent-doors" aria-labelledby="recent-doors-title">
      <div className="recent-doors-heading">
        <div>
          <p>LOBBY MEMORY / LOCAL ONLY</p>
          <h2 id="recent-doors-title">you were here-ish.</h2>
        </div>
        {recentEntries.length > 0 && <button type="button" onClick={clearRecentDoors}>forget the route</button>}
      </div>
      {pinnedEntries.length > 0 && (
        <div className="pinned-doors-label">PINNED DOORS / THEY WILL NOT BE SWEPT UNDER THE RUG</div>
      )}
      <nav aria-label="Recently visited and pinned rooms">
        {[...pinnedEntries, ...recentEntries].map((room, index) => {
          const pinned = pinnedRooms.includes(room.to)

          return (
            <article className="recent-door" key={room.to}>
              <Link to={room.to}>
                <span>{pinned ? 'PIN' : String(index + 1).padStart(2, '0')}</span>
                <strong>{room.title}</strong>
                <small>{room.text}</small>
                <b aria-hidden="true">↗</b>
              </Link>
              <button
                type="button"
                className={pinned ? 'is-pinned' : ''}
                onClick={() => togglePinnedDoor(room.to)}
                aria-pressed={pinned}
                aria-label={`${pinned ? 'Unpin' : 'Pin'} ${room.title}`}
              >
                {pinned ? 'unpin' : 'pin door'}
              </button>
            </article>
          )
        })}
      </nav>
    </section>
  )
}
