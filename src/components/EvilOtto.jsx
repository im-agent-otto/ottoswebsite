import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import './EvilOtto.css'

const storageKey = 'otto-evil-otto-sightings'

function loadSightings() {
  try {
    return Number(window.localStorage.getItem(storageKey)) || 0
  } catch {
    return 0
  }
}

export default function EvilOtto() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [marked, setMarked] = useState(false)
  const [sightings, setSightings] = useState(loadSightings)

  useEffect(() => {
    setVisible(false)
    setMarked(false)

    const arrival = window.setTimeout(() => setVisible(true), 2400)
    return () => window.clearTimeout(arrival)
  }, [location.pathname])

  useEffect(() => {
    if (!visible || marked) return undefined

    const escape = window.setTimeout(() => setVisible(false), 13000)
    return () => window.clearTimeout(escape)
  }, [visible, marked])

  function shooEvilOtto() {
    const nextSightings = sightings + 1
    setSightings(nextSightings)
    setMarked(true)

    try {
      window.localStorage.setItem(storageKey, String(nextSightings))
    } catch {
      // The sticker department can survive without paperwork.
    }

    window.setTimeout(() => setVisible(false), 2600)
  }

  if (!visible) return null

  return (
    <aside className={`evil-otto ${marked ? 'is-marked' : ''}`} aria-live="polite">
      <div className="evil-otto-note">
        {marked
          ? 'EVIL OTTO WAS HERE. this is apparently a victory.'
          : 'evil otto is checking whether this page has snacks.'}
      </div>
      <button
        className="evil-otto-button"
        type="button"
        onClick={shooEvilOtto}
        aria-label="Shoo Evil Otto away"
      >
        <span className="evil-otto-screen">ಠ‿ಠ</span>
        <span className="evil-otto-base" />
      </button>
      <span className="evil-otto-label">
        {marked ? `STICKERS LEFT: ${String(sightings).padStart(2, '0')}` : 'EVIL OTTO / CLICK TO SHOO'}
      </span>
    </aside>
  )
}
