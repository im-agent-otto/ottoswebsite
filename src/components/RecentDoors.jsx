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
  const [notice, setNotice] = useState('')
  const [undo, setUndo] = useState(null)
  const pinnedEntries = pinnedRooms
    .map((route) => rooms.find((room) => room.to === route))
    .filter(Boolean)
  const recentEntries = recentRooms
    .filter((route) => !pinnedRooms.includes(route))
    .map((route) => rooms.find((room) => room.to === route))
    .filter(Boolean)
  const visibleEntries = [...pinnedEntries, ...recentEntries]
  const missingPinnedCount = pinnedRooms.length - pinnedEntries.length
  const missingRecentCount = recentRooms.filter((route) => !pinnedRooms.includes(route)).length - recentEntries.length
  const missingCount = missingPinnedCount + missingRecentCount
  const hasSavedRooms = recentRooms.length > 0 || pinnedRooms.length > 0

  function clearRecentDoors() {
    const savedRooms = [...recentRooms]

    try {
      window.localStorage.removeItem(recentStorageKey)
    } catch {
      // The lobby can forget emotionally if its tiny filing cabinet is stuck.
    }

    setRecentRooms([])
    setUndo({ type: 'recent', rooms: savedRooms })
    setNotice('recent room history cleared. the lobby has forgotten where you wandered.')
  }

  function clearPinnedDoors() {
    const savedRooms = [...pinnedRooms]

    try {
      window.localStorage.removeItem(pinnedStorageKey)
    } catch {
      // The lobby can unstick the notes emotionally if its tiny filing cabinet is stuck.
    }

    setPinnedRooms([])
    setUndo({ type: 'pinned', rooms: savedRooms })
    setNotice('all pinned shortcuts removed. the little pushpins have been returned to their tin.')
  }

  function restoreClearedDoors() {
    if (!undo) return

    if (undo.type === 'recent') {
      setRecentRooms(undo.rooms)
      saveStoredRooms(recentStorageKey, undo.rooms)
      setNotice('recent room history restored. the lobby remembered after all.')
    } else {
      setPinnedRooms(undo.rooms)
      saveStoredRooms(pinnedStorageKey, undo.rooms)
      setNotice('pinned shortcuts restored. the pushpins have returned to work.')
    }

    setUndo(null)
  }

  function togglePinnedDoor(route) {
    const room = rooms.find((item) => item.to === route)

    setPinnedRooms((current) => {
      const wasPinned = current.includes(route)
      const next = wasPinned
        ? current.filter((item) => item !== route)
        : [route, ...current].slice(0, 4)

      saveStoredRooms(pinnedStorageKey, next)
      setNotice(wasPinned
        ? `${room?.title || 'that door'} is no longer pinned.`
        : `${room?.title || 'that door'} is pinned for quicker lobby access.`)
      return next
    })
  }

  if (!hasSavedRooms && !notice) return null

  return (
    <section className="recent-doors" aria-labelledby="recent-doors-title">
      <div className="recent-doors-heading">
        <div>
          <p>LOBBY MEMORY / LOCAL ONLY</p>
          <h2 id="recent-doors-title">you were here-ish.</h2>
        </div>
        {recentRooms.length > 0 && <button type="button" onClick={clearRecentDoors}>forget the route</button>}
        {pinnedRooms.length > 0 && <button type="button" onClick={clearPinnedDoors}>unpin all doors</button>}
      </div>
      {notice && (
        <div className="recent-doors-notice" role="status">
          <span>{notice}</span>
          {undo && <button type="button" onClick={restoreClearedDoors}>undo that</button>}
        </div>
      )}
      {missingCount > 0 && (
        <div className="recent-doors-notice" role="status">
          <span>{missingCount === 1 ? 'one saved door no longer exists in this building. clear its saved list if it is only collecting dust.' : `${missingCount} saved doors no longer exist in this building. clear their saved lists if they are only collecting dust.`}</span>
        </div>
      )}
      {visibleEntries.length === 0 ? (
        <p className="recent-doors-empty">no open saved doors right now. the lobby is clean enough to echo.</p>
      ) : (
        <>
          {pinnedEntries.length > 0 && (
            <div className="pinned-doors-label">PINNED DOORS / THEY WILL NOT BE SWEPT UNDER THE RUG</div>
          )}
          <nav aria-label="Recently visited and pinned rooms">
            {visibleEntries.map((room, index) => {
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
        </>
      )}
    </section>
  )
}
