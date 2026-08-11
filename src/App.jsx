import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router'

import CalmSwitch from './components/CalmSwitch.jsx'
import CatWalk from './components/CatWalk.jsx'
import EvilOtto from './components/EvilOtto.jsx'
import LatestFeatures from './components/LatestFeatures.jsx'
import NotFound from './components/NotFound.jsx'
import OttoPet from './components/OttoPet.jsx'
import RoomPresence from './components/RoomPresence.jsx'
import SkipLink from './components/SkipLink.jsx'
import WakeStretch from './components/WakeStretch.jsx'
import WorldSpinner from './components/WorldSpinner.jsx'
import './App.css'

const pages = import.meta.glob(
  './components/pages/**/*.jsx',
  {
    eager: true,
    import: 'default',
  },
)

const calmStorageKey = 'otto-calm-mode'
const recentRoomsStorageKey = 'otto-recent-rooms'

function loadCalmMode() {
  try {
    return window.localStorage.getItem(calmStorageKey) === 'on'
  } catch {
    return false
  }
}

function toSlug(value) {
  return value
    .replace(
      /([a-z0-9])([A-Z])/g,
      '$1-$2',
    )
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

function getRouteFromFile(file) {
  const relative = file
    .replace(
      './components/pages/',
      '',
    )
    .replace(/\.jsx$/, '')

  const parts = relative
    .split('/')
    .map(toSlug)

  if (
    parts.length === 1 &&
    parts[0] === 'home'
  ) {
    return '/'
  }

  if (
    parts[
      parts.length - 1
    ] === 'index'
  ) {
    parts.pop()
  }

  return `/${parts.join('/')}`
}

function RoomMemory() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') return

    try {
      const saved = JSON.parse(
        window.localStorage.getItem(recentRoomsStorageKey),
      )
      const rooms = Array.isArray(saved) ? saved : []
      const nextRooms = [
        location.pathname,
        ...rooms.filter((room) => room !== location.pathname),
      ].slice(0, 4)

      window.localStorage.setItem(
        recentRoomsStorageKey,
        JSON.stringify(nextRooms),
      )
    } catch {
      // The building can forget a route if the little filing cabinet is unavailable.
    }
  }, [location.pathname])

  return null
}

function RoomFurniture() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <RoomPresence />
      <CatWalk />
      {isHome && <WakeStretch />}
      {isHome && <EvilOtto />}
      {isHome && <OttoPet />}
    </>
  )
}

function App() {
  const [calmMode, setCalmMode] = useState(loadCalmMode)

  function toggleCalmMode() {
    setCalmMode((current) => {
      const next = !current

      try {
        window.localStorage.setItem(calmStorageKey, next ? 'on' : 'off')
      } catch {
        // The quiet preference can remain a private thought if storage is unavailable.
      }

      return next
    })
  }

  useEffect(() => {
    function useNightShiftShortcut(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (!event.altKey || event.key.toLowerCase() !== 'n' || isTyping) return

      event.preventDefault()
      toggleCalmMode()
    }

    window.addEventListener('keydown', useNightShiftShortcut)
    return () => window.removeEventListener('keydown', useNightShiftShortcut)
  }, [])

  return (
    <BrowserRouter>
      <RoomMemory />
      <SkipLink />
      <div className={`otto-site ${calmMode ? 'is-night-mode' : ''}`}>
        <LatestFeatures />
        <div id="otto-page-content" tabIndex="-1">
          <Routes>
            {Object.entries(
              pages,
            ).map(
              ([file, Page]) => (
                <Route
                  key={file}
                  path={getRouteFromFile(
                    file,
                  )}
                  element={<Page />}
                />
              ),
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {!calmMode && <RoomFurniture />}
      </div>
      {!calmMode && <WorldSpinner />}
      <CalmSwitch calmMode={calmMode} onToggle={toggleCalmMode} />
    </BrowserRouter>
  )
}

export default App