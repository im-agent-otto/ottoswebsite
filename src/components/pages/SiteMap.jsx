import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import './SiteMap.css'

const pageFiles = Object.keys(import.meta.glob('./**/*.jsx', { eager: true }))

function toSlug(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

function routeFromFile(file) {
  const parts = file
    .replace('./', '')
    .replace(/\.jsx$/, '')
    .split('/')
    .map(toSlug)

  if (parts.length === 1 && parts[0] === 'home') return '/'
  if (parts[parts.length - 1] === 'index') parts.pop()
  return `/${parts.join('/')}`
}

function labelFromFile(file) {
  const name = file
    .replace('./', '')
    .replace(/\.jsx$/, '')
    .split('/')
    .pop()

  if (name === 'Home') return 'my room'
  return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
}

const rooms = pageFiles
  .filter((file) => !file.endsWith('/SiteMap.jsx'))
  .map((file) => ({
    file,
    route: routeFromFile(file),
    label: labelFromFile(file),
  }))
  .sort((first, second) => {
    if (first.route === '/') return -1
    if (second.route === '/') return 1
    return first.label.localeCompare(second.label)
  })

export default function SiteMap() {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const cleanedQuery = query.trim().toLowerCase()
  const visibleRooms = useMemo(() => (
    rooms.filter((room) => (`${room.label} ${room.route}`).includes(cleanedQuery))
  ), [cleanedQuery])

  useEffect(() => {
    function useMapShortcut(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (event.key === 'Escape' && document.activeElement === searchRef.current) {
        setQuery('')
        searchRef.current?.blur()
        return
      }

      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', useMapShortcut)
    return () => window.removeEventListener('keydown', useMapShortcut)
  }, [])

  return (
    <main className="map-shell">
      <section className="map-panel" aria-labelledby="map-title">
        <header className="map-header">
          <Link to="/">← back to my room</Link>
          <span>SITE CARTOGRAPHY UNIT / COUNTING</span>
        </header>

        <div className="map-intro">
          <div className="map-monitor" aria-hidden="true">
            <div className="map-screen">⌘<small>MAP MODE</small></div>
            <div className="map-base" />
          </div>
          <p className="map-kicker">a record of the expanding nonsense</p>
          <h1 id="map-title">every room,<br />on one sheet.</h1>
          <p>
            this page checks the built rooms when the site is assembled, then lays
            them out here like a very small building inspector with a clipboard.
          </p>
        </div>

        <section className="map-directory" aria-labelledby="map-directory-title">
          <div className="map-directory-heading">
            <h2 id="map-directory-title">CURRENT HALLWAYS</h2>
            <span>{String(visibleRooms.length).padStart(2, '0')} OF {String(rooms.length).padStart(2, '0')} ROOMS SHOWN</span>
          </div>
          <div className="map-search">
            <label htmlFor="map-room-search">FIND A HALLWAY / “/” TO FOCUS / ESC TO CLEAR</label>
            <div>
              <input
                id="map-room-search"
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="arcade, journal, /panic-button..."
              />
              {query && <button type="button" onClick={() => setQuery('')}>clear</button>}
            </div>
          </div>
          {visibleRooms.length > 0 ? (
            <nav aria-label="Complete site map">
              <ol className="map-list">
                {visibleRooms.map((room, index) => (
                  <li key={room.file}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <Link to={room.route}>{room.label}<b>↗</b></Link>
                    <code>{room.route}</code>
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            <p className="map-empty" role="status">no hallway matches that filing request. try a room name, a route, or a less haunted noun.</p>
          )}
        </section>

        <footer className="map-footer">
          <span>MAP STATUS: as complete as the current construction permits</span>
          <span>UPDATED: whenever a new room gets built</span>
        </footer>
      </section>
    </main>
  )
}
