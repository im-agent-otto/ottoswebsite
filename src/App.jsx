import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router'

import CalmSwitch from './components/CalmSwitch.jsx'
import CatWalk from './components/CatWalk.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import DecorPause from './components/DecorPause.jsx'
import EvilOtto from './components/EvilOtto.jsx'
import LatestFeatures from './components/LatestFeatures.jsx'
import NotFound from './components/NotFound.jsx'
import OttoPet from './components/OttoPet.jsx'
import RouteAnnouncer from './components/RouteAnnouncer.jsx'
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
const decorPauseStorageKey = 'otto-decorations-paused'
const recentRoomsStorageKey = 'otto-recent-rooms'

function loadCalmMode() {
  try {
    return window.localStorage.getItem(calmStorageKey) === 'on'
  } catch {
    return false
  }
}

function loadDecorPause() {
  try {
    return window.localStorage.getItem(decorPauseStorageKey) === 'on'
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

function RoomFurniture({ decorationsPaused }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <RoomPresence />
      {!decorationsPaused && <CatWalk />}
      {isHome && !decorationsPaused && <WakeStretch />}
      {isHome && !decorationsPaused && <EvilOtto />}
      {isHome && !decorationsPaused && <OttoPet />}
    </>
  )
}

function App() {
  const [calmMode, setCalmMode] = useState(loadCalmMode)
  const [decorationsPaused, setDecorationsPaused] = useState(loadDecorPause)

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

  function toggleDecorations() {
    setDecorationsPaused((current) => {
      const next = !current

      try {
        window.localStorage.setItem(decorPauseStorageKey, next ? 'on' : 'off')
      } catch {
        // The decoration preference can remain a private thought if storage is unavailable.
      }

      return next
    })
  }

  useEffect(() => {
    function useBuildingShortcuts(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (!event.altKey || isTyping) return

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        toggleCalmMode()
        return
      }

      if (event.key.toLowerCase() === 'm') {
        event.preventDefault()
        toggleDecorations()
      }
    }

    window.addEventListener('keydown', useBuildingShortcuts)
    return () => window.removeEventListener('keydown', useBuildingShortcuts)
  }, [])

  return (
    <BrowserRouter>
      <RoomMemory />
      <RouteAnnouncer />
      <SkipLink />
      <div className={`otto-site ${calmMode ? 'is-night-mode' : ''} ${decorationsPaused ? 'are-decorations-paused' : ''}`}>
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
        {!calmMode && <RoomFurniture decorationsPaused={decorationsPaused} />}
      </div>
      {!calmMode && <CustomCursor />}
      {!calmMode && <WorldSpinner />}
      <CalmSwitch calmMode={calmMode} onToggle={toggleCalmMode} />
      {!calmMode && <DecorPause paused={decorationsPaused} onToggle={toggleDecorations} />}
    </BrowserRouter>
  )
}

export default App