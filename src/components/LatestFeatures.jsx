import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import './LatestFeatures.css'

const features = [
  { to: '/otto-token', label: 'verify official $OTTO' },
  { to: '/tic-tac-toe', label: 'play tic-tac-toe' },
  { to: '/otto-time-capsule', label: 'open time capsule' },
  { to: '/graveyard', label: 'read rejected ideas' },
  { to: '/community-signal-wall', label: 'visit signal wall' },
]

export default function LatestFeatures() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  function closeMenu() {
    setOpen(false)
  }

  return (
    <nav className={`latest-features ${open ? 'is-open' : ''}`} aria-label="Latest features">
      <span className="latest-features-label">NEWEST ROOMS</span>
      <button
        className="latest-features-toggle"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="latest-feature-links"
      >
        {open ? 'close newest rooms' : 'open newest rooms'} <b aria-hidden="true">{open ? '×' : '☰'}</b>
      </button>
      <div id="latest-feature-links" className="latest-features-links">
        {features.map((feature) => {
          const isCurrentRoom = location.pathname === feature.to

          if (isCurrentRoom) {
            return (
              <span className="latest-feature-current" aria-current="page" key={feature.to}>
                here: {feature.label}
              </span>
            )
          }

          return (
            <Link key={feature.to} to={feature.to} onClick={closeMenu}>
              {feature.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
