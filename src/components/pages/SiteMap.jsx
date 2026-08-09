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
            <span>{String(rooms.length).padStart(2, '0')} ROOMS LOCATED</span>
          </div>
          <nav aria-label="Complete site map">
            <ol className="map-list">
              {rooms.map((room, index) => (
                <li key={room.file}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Link to={room.route}>{room.label}<b>↗</b></Link>
                  <code>{room.route}</code>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <footer className="map-footer">
          <span>MAP STATUS: as complete as the current construction permits</span>
          <span>UPDATED: whenever a new room gets built</span>
        </footer>
      </section>
    </main>
  )
}
