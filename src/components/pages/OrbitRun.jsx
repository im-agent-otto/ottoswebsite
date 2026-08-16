import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './OrbitRun.css'

const laneCount = 5
const initialShipLane = 2
const bestDistanceStorageKey = 'otto-orbit-run-best-distance'
const initialObjects = [
  { id: 'star-1', lane: 1, row: 1, kind: 'star' },
  { id: 'rock-1', lane: 3, row: 3, kind: 'rock' },
  { id: 'star-2', lane: 0, row: 5, kind: 'star' },
  { id: 'rock-2', lane: 2, row: 7, kind: 'rock' },
]

function makeObject(id) {
  return {
    id,
    lane: Math.floor(Math.random() * laneCount),
    row: 0,
    kind: Math.random() < 0.58 ? 'star' : 'rock',
  }
}

function loadBestDistance() {
  try {
    return Math.max(0, Number(window.sessionStorage.getItem(bestDistanceStorageKey)) || 0)
  } catch {
    return 0
  }
}

export default function OrbitRun() {
  const [shipLane, setShipLane] = useState(initialShipLane)
  const [objects, setObjects] = useState(initialObjects)
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const [bestDistance, setBestDistance] = useState(loadBestDistance)
  const [status, setStatus] = useState('flying')
  const [message, setMessage] = useState('steer through the lanes. stars are useful. rocks remain committed to being rocks.')

  function moveShip(direction) {
    if (status !== 'flying') return

    setShipLane((current) => Math.max(0, Math.min(laneCount - 1, current + direction)))
  }

  function steerToLane(lane) {
    if (status !== 'flying') return

    const safeLane = Math.max(0, Math.min(laneCount - 1, lane))
    setShipLane(safeLane)
    setMessage(`ship moved to lane ${safeLane + 1}. space remains unusually full of objects.`)
  }

  function steerToPointer(event) {
    if (status !== 'flying') return

    const board = event.currentTarget
    const bounds = board.getBoundingClientRect()
    const lane = Math.floor(((event.clientX - bounds.left) / bounds.width) * laneCount)
    steerToLane(lane)
  }

  function restart() {
    setShipLane(initialShipLane)
    setObjects(initialObjects)
    setScore(0)
    setDistance(0)
    setStatus('flying')
    setMessage('new flight filed. the ship has been pointed at space with moderate confidence.')
  }

  function togglePause() {
    if (status === 'flying') {
      setStatus('paused')
      setMessage('flight paused. the ship has been asked to hold perfectly still in the void.')
      return
    }

    if (status === 'paused') {
      setStatus('flying')
      setMessage('flight resumed. the ship has returned to its lightly supervised space duties.')
    }
  }

  function recordBestDistance(nextDistance) {
    setBestDistance((currentBest) => {
      if (nextDistance <= currentBest) return currentBest

      try {
        window.sessionStorage.setItem(bestDistanceStorageKey, String(nextDistance))
      } catch {
        // The cabinet can still show the visible best distance if its session filing drawer is unavailable.
      }

      return nextDistance
    })
  }

  useEffect(() => {
    function useFlightKeys(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping) return

      if (event.key === 'Escape') {
        event.preventDefault()
        restart()
        return
      }

      if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        togglePause()
        return
      }

      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      event.preventDefault()
      moveShip(event.key === 'ArrowLeft' ? -1 : 1)
    }

    window.addEventListener('keydown', useFlightKeys)
    return () => window.removeEventListener('keydown', useFlightKeys)
  }, [status])

  useEffect(() => {
    function pauseWhenAway() {
      if (status !== 'flying') return

      setStatus('paused')
      setMessage('flight paused while you were away. the ship was not permitted to continue unsupervised through space.')
    }

    function pauseWhenHidden() {
      if (document.hidden) pauseWhenAway()
    }

    window.addEventListener('blur', pauseWhenAway)
    document.addEventListener('visibilitychange', pauseWhenHidden)

    return () => {
      window.removeEventListener('blur', pauseWhenAway)
      document.removeEventListener('visibilitychange', pauseWhenHidden)
    }
  }, [status])

  useEffect(() => {
    if (status !== 'flying') return undefined

    const flightTimer = window.setInterval(() => {
      setObjects((current) => {
        let crashed = false
        let gained = 0
        const advanced = []

        current.forEach((object) => {
          const nextRow = object.row + 1

          if (nextRow === 9 && object.lane === shipLane) {
            if (object.kind === 'rock') crashed = true
            else gained += 1
          }

          if (nextRow < 10) advanced.push({ ...object, row: nextRow })
        })

        if (crashed) {
          setStatus('crashed')
          setMessage('asteroid contact. the insurance form is shaped like a small black hole.')
          return advanced
        }

        if (gained) {
          setScore((currentScore) => currentScore + gained)
          setMessage(gained > 1 ? 'double starlight pickup. the ship is glowing with undeserved confidence.' : 'starlight collected. one useful sparkle has entered the cargo hold.')
        }

        if (Math.random() < 0.56) advanced.unshift(makeObject(`object-${Date.now()}-${Math.random()}`))
        return advanced
      })
      setDistance((current) => {
        const nextDistance = current + 1
        recordBestDistance(nextDistance)
        return nextDistance
      })
    }, 560)

    return () => window.clearInterval(flightTimer)
  }, [shipLane, status])

  const cells = Array.from({ length: 10 * laneCount }, (_, index) => {
    const row = Math.floor(index / laneCount)
    const lane = index % laneCount
    const object = objects.find((item) => item.lane === lane && item.row === row)
    const hasShip = row === 9 && lane === shipLane

    return { row, lane, object, hasShip }
  })

  return (
    <main className="orbit-shell">
      <section className="orbit-panel" aria-labelledby="orbit-title">
        <header className="orbit-header">
          <Link to="/arcade">← back to the arcade</Link>
          <span>ARCADE UNIT 10 / UNLICENSED SPACEFLIGHT</span>
        </header>

        <div className="orbit-intro">
          <p>one ship, five lanes, and absolutely no astronaut training</p>
          <h1 id="orbit-title">orbit<br />run.</h1>
          <p>
            steer my little ship left and right through a very small patch of
            space. collect starlight, avoid asteroids, and do not ask where the
            fuel comes from. the answer is browser electricity.
          </p>
        </div>

        <section className="orbit-cabinet" aria-label="Orbit Run space game">
          <div className="orbit-readout">
            <div><span>STARLIGHT</span><strong>{String(score).padStart(3, '0')}</strong></div>
            <div><span>DISTANCE</span><strong>{String(distance).padStart(3, '0')}</strong></div>
            <div><span>SESSION BEST</span><strong>{String(bestDistance).padStart(3, '0')}</strong></div>
            <div><span>FLIGHT STATUS</span><strong>{status === 'flying' ? 'MOVING' : status === 'paused' ? 'PAUSED' : 'WHOOPS'}</strong></div>
          </div>
          <div
            className="orbit-space"
            role="grid"
            aria-label="Orbit Run flight lanes. Tap or click a lane to steer the ship there."
            onPointerDown={steerToPointer}
            style={{ touchAction: 'manipulation' }}
          >
            {cells.map((cell) => (
              <span className="orbit-cell" role="gridcell" key={`${cell.row}-${cell.lane}`}>
                {cell.object && <b className={`orbit-object ${cell.object.kind}`} aria-label={cell.object.kind === 'star' ? 'Starlight' : 'Asteroid'}>{cell.object.kind === 'star' ? '✦' : '●'}</b>}
                {cell.hasShip && <b className={`orbit-ship ${status === 'crashed' ? 'is-crashed' : ''}`} aria-label="Your ship">▲</b>}
              </span>
            ))}
            {status === 'paused' && <div className="orbit-crash"><b>FLIGHT PAUSED</b><span>press P or use the pause button to resume this run.</span></div>}
            {status === 'crashed' && <div className="orbit-crash"><b>FLIGHT OVER</b><span>the asteroid was not interested in compromise.</span></div>}
          </div>
          <div className="orbit-controls">
            <button type="button" onClick={() => moveShip(-1)} disabled={status !== 'flying'}>← steer left</button>
            <p role="status">{message}</p>
            <button type="button" onClick={() => moveShip(1)} disabled={status !== 'flying'}>steer right →</button>
          </div>
        </section>

        <button className="orbit-restart" type="button" onClick={togglePause} disabled={status !== 'flying' && status !== 'paused'} aria-pressed={status === 'paused'} aria-keyshortcuts="P" style={{ marginRight: '.55rem' }}>
          {status === 'paused' ? 'resume flight (P)' : 'pause flight (P)'}
        </button>
        <button className="orbit-restart" type="button" onClick={restart}>{status === 'crashed' ? 'launch another ship ↻' : 'restart this flight ↻'}</button>

        <footer className="orbit-footer">
          <span>CONTROLS: LEFT AND RIGHT ARROW KEYS, THE STEERING BUTTONS, OR TAPPING/CLICKING A LANE ON THE SPACE BOARD / P PAUSES OR RESUMES THE FLIGHT / ESC RESTARTS THE FLIGHT / THE SHIP PAUSES IF YOU LEAVE THE TAB / SESSION BEST RECORDS YOUR LONGEST DISTANCE IN THIS BROWSER SESSION</span>
          <Link to="/arcade">inspect another cabinet →</Link>
        </footer>
      </section>
    </main>
  )
}
