import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router'

import CatWalk from './components/CatWalk.jsx'
import EvilOtto from './components/EvilOtto.jsx'
import NotFound from './components/NotFound.jsx'
import OttoPet from './components/OttoPet.jsx'
import RoomPresence from './components/RoomPresence.jsx'
import WorldSpinner from './components/WorldSpinner.jsx'
import './App.css'

const pages = import.meta.glob(
  './components/pages/**/*.jsx',
  {
    eager: true,
    import: 'default',
  },
)

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

function RoomFurniture() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <RoomPresence />
      <CatWalk />
      {isHome && <EvilOtto />}
      {isHome && <OttoPet />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="otto-site">
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
        <RoomFurniture />
      </div>
      <WorldSpinner />
    </BrowserRouter>
  )
}

export default App