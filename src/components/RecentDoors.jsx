import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './RecentDoors.css'

const recentStorageKey = 'otto-recent-rooms'
const pinnedStorageKey = 'otto-pinned-rooms'
const maximumPinnedDoors = 4

function loadStoredRooms(storageKey) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function readStoredRoomValue(value) {
  try {
    const saved = JSON.parse(value || '[]')
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

  useEffect(() => {
    function syncLobbyMemory(event) {
      if (event.key === recentStorageKey) {
        setRecentRooms(readStoredRoomValue(event.newValue))
        setUndo(null)
        setNotice('recent room history changed in another open tab. the lobby filing cabinet has synchronized its notes.')
        return
      }

      if (event.key === pinnedStorageKey) {
        setPinnedRooms(readStoredRoomValue(event.newValue))
        setUndo(null)
        setNotice('pinned shortcuts changed in another open tab. the lobby has moved the little pushpins to match.')
      }
    }

    window.addEventListener('storage', syncLobbyMemory)
    return () => window.removeEventListener('storage', syncLobbyMemory)
  }, [])

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

  function clearLobbyMemory() {
    const savedRecentRooms = [...recentRooms]
    const savedPinnedRooms = [...pinnedRooms]

    try {
      window.localStorage.removeItem(recentStorageKey)
      window.localStorage.removeItem(pinnedStorageKey)
    } catch {
      // The lobby can still clear its notes on screen if storage decides to be dramatic.
    }

    setRecentRooms([])
    setPinnedRooms([])
    setUndo({
      type: 'all',
      recentRooms: savedRecentRooms,
      pinnedRooms: savedPinnedRooms,
    })
    setNotice('lobby memory cleared: recent routes and pinned doors are gone together. the filing cabinet has been made blank on purpose.')
  }

  function removeMissingDoors() {
    const savedRecentRooms = [...recentRooms]
    const savedPinnedRooms = [...pinnedRooms]
    const roomExists = (route) => rooms.some((room) => room.to === route)
    const nextRecentRooms = recentRooms.filter(roomExists)
    const nextPinnedRooms = pinnedRooms.filter(roomExists)

    setRecentRooms(nextRecentRooms)
    setPinnedRooms(nextPinnedRooms)
    saveStoredRooms(recentStorageKey, nextRecentRooms)
    saveStoredRooms(pinnedStorageKey, nextPinnedRooms)
    setUndo({
      type: 'missing',
      recentRooms: savedRecentRooms,
      pinnedRooms: savedPinnedRooms,
    })
    setNotice(`${missingCount === 1 ? 'one stale shortcut was' : `${missingCount} stale shortcuts were`} removed. the hallway filing cabinet is less haunted now.`)
  }

  function restoreClearedDoors() {
    if (!undo) return

    if (undo.type === 'recent') {
      setRecentRooms(undo.rooms)
      saveStoredRooms(recentStorageKey, undo.rooms)
      setNotice('recent room history restored. the lobby remembered after all.')
    } else if (undo.type === 'pinned') {
      setPinnedRooms(undo.rooms)
      saveStoredRooms(pinnedStorageKey, undo.rooms)
      setNotice('pinned shortcuts restored. the pushpins have returned to work.')
    } else {
      setRecentRooms(undo.recentRooms)
      setPinnedRooms(undo.pinnedRooms)
      saveStoredRooms(recentStorageKey, undo.recentRooms)
      saveStoredRooms(pinnedStorageKey, undo.pinnedRooms)
      setNotice(undo.type === 'all'
        ? 'lobby memory restored. the filing cabinet has recovered its previous opinions.'
        : 'stale shortcuts restored. the filing cabinet has returned to its previous, slightly haunted state.')
    }

    setUndo(null)
  }

  function togglePinnedDoor(route) {
    const room = rooms.find((item) => item.to === route)

    setPinnedRooms((current) => {
      const wasPinned = current.includes(route)
      const displacedRoute = !wasPinned && current.length >= maximumPinnedDoors
        ? current[current.length - 1]
        : ''
      const displacedRoom = rooms.find((item) => item.to === displacedRoute)
      const next = wasPinned
        ? current.filter((item) => item !== route)
        : [route, ...current].slice(0, maximumPinnedDoors)

      saveStoredRooms(pinnedStorageKey, next)

      if (wasPinned) {
        setNotice(`${room?.title || 'that door'} is no longer pinned.`)
      } else if (displacedRoute) {
        setNotice(`${room?.title || 'that door'} is pinned. ${displacedRoom?.title || 'the oldest saved door'} was unpinned to keep the four-door shortcut limit.`)
      } else {
        setNotice(`${room?.title || 'that door'} is pinned for quicker lobby access.`)
      }

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
        {hasSavedRooms && <button type="button" onClick={clearLobbyMemory}>clear lobby memory</button>}
      </div>
      {notice && (
        <div className="recent-doors-notice" role="status">
          <span>{notice}</span>
          {undo && <button type="button" onClick={restoreClearedDoors}>undo that</button>}
        </div>
      )}
      {missingCount > 0 && (
        <div className="recent-doors-notice" role="status">
          <span>{missingCount === 1 ? 'one saved door no longer exists in this building. remove only that stale shortcut, or leave it in the filing cabinet.' : `${missingCount} saved doors no longer exist in this building. remove only those stale shortcuts, or leave them in the filing cabinet.`}</span>
          <button type="button" onClick={removeMissingDoors}>remove missing doors</button>
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
