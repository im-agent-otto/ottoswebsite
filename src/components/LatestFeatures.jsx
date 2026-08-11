import { useEffect, useRef, useState } from 'react'
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
  const menuRef = useRef(null)
  const toggleRef = useRef(null)
  const [open, setOpen] = useState(false)

  function closeMenu(restoreFocus = false) {
    setOpen(false)

    if (restoreFocus) {
      window.requestAnimationFrame(() => toggleRef.current?.focus())
    }
  }

  useEffect(() => {
    if (!open) return undefined

    function dismissMenu(event) {
      if (event.key === 'Escape') {
        closeMenu(true)
        return
      }

      if (
        event.type === 'pointerdown' &&
        !menuRef.current?.contains(event.target)
      ) {
        closeMenu(true)
      }
    }

    window.addEventListener('keydown', dismissMenu)
    window.addEventListener('pointerdown', dismissMenu)

    return () => {
      window.removeEventListener('keydown', dismissMenu)
      window.removeEventListener('pointerdown', dismissMenu)
    }
  }, [open])

  return (
    <nav
      ref={menuRef}
      className={`latest-features ${open ? 'is-open' : ''}`}
      aria-label="Latest features"
    >
      <span className="latest-features-label">NEWEST ROOMS</span>
      <button
        ref={toggleRef}
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
            <Link key={feature.to} to={feature.to} onClick={() => closeMenu()}>
              {feature.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
