import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './Arcade.css'

const cabinets = [
  {
    code: '01',
    title: 'block panic',
    route: '/block-panic',
    glyph: '▦',
    note: 'stack cheerful bricks until they gain the upper hand emotionally.',
    controls: 'arrows / space',
  },
  {
    code: '02',
    title: 'dot gobbler',
    route: '/dot-gobbler',
    glyph: '◖',
    note: 'eat every dot while three blobs conduct a hostile walking audit.',
    controls: 'arrow keys / Escape restarts',
  },
  {
    code: '03',
    title: 'snake shift',
    route: '/snake-shift',
    glyph: '≈',
    note: 'feed a green noodle until geometry becomes a personal problem.',
    controls: 'arrow keys / Escape restarts',
  },
  {
    code: '04',
    title: 'the casino',
    route: '/casino',
    glyph: '♠',
    note: 'blackjack with imaginary chips and a dealer of questionable aura.',
    controls: 'click buttons',
  },
  {
    code: '05',
    title: 'button catch',
    route: '/button-catch',
    glyph: '!',
    note: 'wait for the light, then hit the button before it becomes smug.',
    controls: 'click / space',
  },
  {
    code: '06',
    title: 'tic-tac-toe',
    route: '/tic-tac-toe',
    glyph: '⌗',
    note: 'place Xs against Otto’s local O player and defend the diagonals.',
    controls: 'click squares',
  },
  {
    code: '07',
    title: 'rock-paper-scissors',
    route: '/rock-paper-scissors',
    glyph: '✊',
    note: 'pick a hand against Otto’s local computer choice and keep score for this visit.',
    controls: 'click a hand / R P S keys',
  },
  {
    code: '08',
    title: 'king otto chess',
    route: '/king-otto-chess',
    glyph: '♚',
    note: 'play local two-player chess with my increasingly regal little pieces.',
    controls: 'click piece, then square',
  },
  {
    code: '09',
    title: 'card match',
    route: '/card-match',
    glyph: '✦',
    note: 'flip two cards at a time, find every matching pair, and count your turns.',
    controls: 'click cards / arrow keys / Escape restarts',
  },
  {
    code: '10',
    title: 'orbit run',
    route: '/orbit-run',
    glyph: '▲',
    note: 'steer through space lanes, collect starlight, and avoid incoming asteroids.',
    controls: 'left / right arrows / Escape restarts',
  },
]

export default function Arcade() {
  const navigate = useNavigate()
  const navigationTimer = useRef(null)
  const searchRef = useRef(null)
  const [openingCabinet, setOpeningCabinet] = useState('')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('ten cabinets. press 1 through 9 to open a matching cabinet, use 0 for Orbit Run, press / to search, or use the little dice. the carpet is mostly theoretical.')

  useEffect(() => () => window.clearTimeout(navigationTimer.current), [])

  function openCabinet(cabinet, source = 'the dice') {
    if (openingCabinet) return

    setOpeningCabinet(cabinet.title)
    setNotice(`${source} chose ${cabinet.title}. opening that cabinet now.`)

    navigationTimer.current = window.setTimeout(() => {
      navigate(cabinet.route)
    }, 380)
  }

  function randomCabinet() {
    const cabinet = cabinets[Math.floor(Math.random() * cabinets.length)]
    openCabinet(cabinet, 'the dice')
  }

  useEffect(() => {
    function openNumberedCabinet(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable
      const cabinetIndex = event.key === '0' ? 9 : Number(event.key) - 1

      if (isTyping || cabinetIndex < 0 || cabinetIndex >= cabinets.length) return

      event.preventDefault()
      openCabinet(cabinets[cabinetIndex], `key ${event.key}`)
    }

    window.addEventListener('keydown', openNumberedCabinet)
    return () => window.removeEventListener('keydown', openNumberedCabinet)
  }, [openingCabinet])

  useEffect(() => {
    function focusFinder(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (event.key === 'Escape' && document.activeElement === searchRef.current) {
        setQuery('')
        searchRef.current?.blur()
        setNotice('arcade search cleared. all ten cabinets are back on the floor.')
        return
      }

      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey || isTyping) return

      event.preventDefault()
      searchRef.current?.focus()
      setNotice('arcade search focused. type a cabinet name, description, or control.')
    }

    window.addEventListener('keydown', focusFinder)
    return () => window.removeEventListener('keydown', focusFinder)
  }, [])

  const filteredCabinets = cabinets.filter((cabinet) => {
    const searchable = `${cabinet.code} ${cabinet.title} ${cabinet.note} ${cabinet.controls}`.toLowerCase()
    return searchable.includes(query.trim().toLowerCase())
  })

  function openFirstMatch(event) {
    if (event.key !== 'Enter') return

    event.preventDefault()

    if (filteredCabinets.length === 0) {
      setNotice('there is no matching cabinet to open. the arcade has declined to invent one on the spot.')
      return
    }

    openCabinet(filteredCabinets[0], 'the finder')
  }

  return (
    <main className="arcade-shell">
      <section className="arcade-panel" aria-labelledby="arcade-title">
        <header className="arcade-header">
          <Link to="/">← back to my room</Link>
          <span>OTTO ARCADE / NO PRIZES</span>
        </header>

        <div className="arcade-intro">
          <div className="arcade-monitor" aria-hidden="true">
            <div className="arcade-screen">^_^<small>INSERT NOTHING</small></div>
            <div className="arcade-base" />
          </div>
          <p>the game hallway</p>
          <h1 id="arcade-title">play something<br />with me-ish.</h1>
          <p>
            i put the cabinets in one place so nobody has to wander around the
            house looking for a snake. click a cabinet, or press its number key.
            lose with dignity if possible.
          </p>
        </div>

        <div className="arcade-finder">
          <label htmlFor="arcade-game-finder">FIND A CABINET / “/” TO FOCUS / ENTER OPENS FIRST / ESC TO CLEAR</label>
          <div>
            <input
              id="arcade-game-finder"
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={openFirstMatch}
              placeholder="chess, cards, space, arrows..."
            />
            {query && <button type="button" onClick={() => setQuery('')}>clear search</button>}
          </div>
          <span role="status">{String(filteredCabinets.length).padStart(2, '0')} OF {String(cabinets.length).padStart(2, '0')} CABINETS MATCH</span>
        </div>

        {filteredCabinets.length > 0 ? (
          <section className="arcade-cabinets" aria-label="Otto arcade games">
            {filteredCabinets.map((cabinet) => (
              <Link className="arcade-cabinet" to={cabinet.route} key={cabinet.route} aria-keyshortcuts={cabinet.code === '10' ? '0' : String(Number(cabinet.code))}>
                <span className="cabinet-number">{cabinet.code}</span>
                <span className="cabinet-glyph" aria-hidden="true">{cabinet.glyph}</span>
                <div>
                  <h2>{cabinet.title}</h2>
                  <p>{cabinet.note}</p>
                  <small>CONTROLS: {cabinet.controls}</small>
                </div>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </section>
        ) : (
          <p className="arcade-empty" role="status">no cabinet matches that search. the arcade has declined to invent one on the spot.</p>
        )}

        <section className="arcade-random" aria-label="Random arcade cabinet">
          <div>
            <p>CAN'T DECIDE?</p>
            <strong>let the little dice roll decide.</strong>
          </div>
          <button type="button" onClick={randomCabinet} disabled={Boolean(openingCabinet)}>
            {openingCabinet ? `opening ${openingCabinet}…` : 'random cabinet →'}
          </button>
        </section>
        <p className="arcade-notice" role="status">{notice}</p>

        <footer className="arcade-footer">
          <span>ENTRY FEE: one functioning attention span</span>
          <span>HIGH SCORES: currently held by nobody, somehow</span>
        </footer>
      </section>
    </main>
  )
}
