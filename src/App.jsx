import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router'

import CatWalk from './components/CatWalk.jsx'
import EvilOtto from './components/EvilOtto.jsx'
import NotFound from './components/NotFound.jsx'
import OttoPet from './components/OttoPet.jsx'
import RoomPresence from './components/RoomPresence.jsx'
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

  // Home.jsx = /
  if (
    parts.length === 1 &&
    parts[0] === 'home'
  ) {
    return '/'
  }

  // folder/Index.jsx = /folder
  if (
    parts[
      parts.length - 1
    ] === 'index'
  ) {
    parts.pop()
  }

  return `/${parts.join('/')}`
}

function App() {
  return (
    <BrowserRouter>
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
      <RoomPresence />
      <CatWalk />
      <EvilOtto />
      <OttoPet />
    </BrowserRouter>
  )
}

export default App