import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './DotGobbler.css'

const maze = [
  '###############',
  '#.............#',
  '#.###.###.###.#',
  '#o#...#.#...#o#',
  '#.###.#.#.###.#',
  '#.....#.#.....#',
  '#####.#.#.#####',
  '#.....#.#.....#',
  '#.###.###.###.#',
  '#o...........o#',
  '###############',
]

const start = { x: 7, y: 9 }
const ghostStarts = [
  { x: 7, y: 5, color: 'coral' },
  { x: 6, y: 5, color: 'blue' },
  { x: 8, y: 5, color: 'pink' },
]
const bestScoreStorageKey = 'otto-dot-gobbler-best-score'

function dotKeys() {
  const dots = new Set()
  maze.forEach((row, y) => row.split('').forEach((cell, x) => {
    if (cell === '.' || cell === 'o') dots.add(`${x}-${y}`)
  }))
  return dots
}

const totalDots = dotKeys().size

function canGo(point) {
  return maze[point.y]?.[point.x] && maze[point.y][point.x] !== '#'
}

function nextPoint(point, direction) {
  return { x: point.x + direction.x, y: point.y + direction.y }
}

const directions = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

function loadBestScore() {
  try {
    return Math.max(0, Number(window.sessionStorage.getItem(bestScoreStorageKey)) || 0)
  } catch {
    return 0
  }
}

export default function DotGobbler() {
  const [player, setPlayer] = useState(start)
  const [ghosts, setGhosts] = useState(ghostStarts)
  const [dots, setDots] = useState(dotKeys)
  const [status, setStatus] = useState('playing')
  const [paused, setPaused] = useState(false)
  const [bestScore, setBestScore] = useState(loadBestScore)
  const [message, setMessage] = useState('the dots are free. suspiciously free.')
  const score = totalDots - dots.size

  function reset() {
    setPlayer(start)
    setGhosts(ghostStarts)
    setDots(dotKeys())
    setStatus('playing')
    setPaused(false)
    setMessage('new maze. same deeply avoidable peril.')
  }

  function togglePause() {
    if (status !== 'playing') return

    setPaused((current) => {
      const next = !current
      setMessage(next
        ? 'maze paused. the blobs have been asked to stop conducting their walking audit.'
        : 'maze resumed. the blobs have returned to their extremely specific hobby.')
      return next
    })
  }

  function moveGhosts(nextPlayer) {
    let caught = false
    const nextGhosts = ghosts.map((ghost, index) => {
      const options = directions
        .map((direction) => nextPoint(ghost, direction))
        .filter(canGo)
      const ranked = options.sort((a, b) => {
        const distanceA = Math.abs(a.x - nextPlayer.x) + Math.abs(a.y - nextPlayer.y)
        const distanceB = Math.abs(b.x - nextPlayer.x) + Math.abs(b.y - nextPlayer.y)
        return distanceA - distanceB
      })
      const choice = ranked[(index + nextPlayer.x + nextPlayer.y) % Math.min(2, ranked.length)] || ghost
      if (choice.x === nextPlayer.x && choice.y === nextPlayer.y) caught = true
      return { ...ghost, ...choice }
    })
    setGhosts(nextGhosts)
    return caught
  }

  function recordBestScore(nextScore) {
    setBestScore((currentBest) => {
      if (nextScore <= currentBest) return currentBest

      try {
        window.sessionStorage.setItem(bestScoreStorageKey, String(nextScore))
      } catch {
        // The cabinet can still celebrate the visible session best if its filing drawer is unavailable.
      }

      return nextScore
    })
  }

  function move(direction) {
    if (status !== 'playing' || paused) return
    const next = nextPoint(player, direction)
    if (!canGo(next)) {
      setMessage('wall. famously bad at moving out of the way.')
      return
    }

    const key = `${next.x}-${next.y}`
    const remaining = new Set(dots)
    const ateDot = remaining.delete(key)
    const nextScore = totalDots - remaining.size
    const walkedIntoGhost = ghosts.some((ghost) => ghost.x === next.x && ghost.y === next.y)
    setPlayer(next)
    setDots(remaining)

    if (ateDot) recordBestScore(nextScore)

    if (walkedIntoGhost || moveGhosts(next)) {
      setStatus('lost')
      setMessage('the blobs have filed a complaint. you are the complaint.')
    } else if (remaining.size === 0) {
      setStatus('won')
      setMessage('all dots evacuated. you are now mayor of this maze somehow.')
    } else {
      setMessage(remaining.size < 10 ? 'almost clear. the blobs are becoming personal about it.' : 'nom. keep moving, probably.')
    }
  }

  useEffect(() => {
    const keys = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
    }

    function onKeyDown(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping) return

      if (event.key === 'Escape') {
        event.preventDefault()
        reset()
        return
      }

      if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        togglePause()
        return
      }

      if (keys[event.key]) {
        event.preventDefault()
        move(keys[event.key])
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    function pauseWhenAway() {
      if (status !== 'playing' || paused) return

      setPaused(true)
      setMessage('maze paused while you were away. the blobs were not permitted to continue their audit unsupervised.')
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
  }, [paused, status])

  const pausedMessage = paused
    ? 'maze paused. press P or use the cabinet button to resume the same maze.'
    : message

  return (
    <main className="gobbler-shell">
      <header className="gobbler-header">
        <Link to="/">← return to my room</Link>
        <span>DOT GOBBLER / ARCADE UNIT 02</span>
      </header>

      <section className="gobbler-card" aria-labelledby="gobbler-title">
        <div className="gobbler-copy">
          <p>otto's legally distinct maze situation</p>
          <h1 id="gobbler-title">dot<br />gobbler.</h1>
          <p className="gobbler-description">eat every dot. avoid the three blobs, who have no hobbies besides ruining a nice walk.</p>
          <div className="gobbler-score">
            <div>
              <span>DOTS CLEARED</span>
              <strong>{String(score).padStart(2, '0')}</strong>
            </div>
            <div>
              <span>SESSION BEST</span>
              <strong>{String(bestScore).padStart(2, '0')}</strong>
            </div>
          </div>
          <p className="gobbler-help">arrow keys work. the little buttons also work. P pauses or resumes the maze. Escape starts a fresh maze. technology remains alive.</p>
        </div>

        <div className="gobbler-machine">
          <div className="machine-label">OTTO'S DOT GOBBLER</div>
          <div className="maze" aria-label="Dot Gobbler game board">
            {maze.flatMap((row, y) => row.split('').map((cell, x) => {
              const key = `${x}-${y}`
              const isPlayer = player.x === x && player.y === y
              const ghost = ghosts.find((item) => item.x === x && item.y === y)
              return (
                <span className={`maze-cell ${cell === '#' ? 'wall' : 'path'}`} key={key}>
                  {dots.has(key) && <i className={cell === 'o' ? 'power-dot' : 'dot'} />}
                  {isPlayer && <b className="gobbler">◖</b>}
                  {ghost && <b className={`ghost ghost-${ghost.color}`}>●</b>}
                </span>
              )
            }))}
            {paused && status === 'playing' && <div className="maze-result"><b>PAUSED</b><span>press P or use Pause Maze to resume.</span></div>}
            {status !== 'playing' && <div className="maze-result"><b>{status === 'won' ? 'DOT KING' : 'BLOBBED'}</b><span>{status === 'won' ? 'the maze fears you now.' : 'the maze got you.'}</span></div>}
          </div>
          <div className="gobbler-controls">
            <button onClick={() => move({ x: 0, y: -1 })} aria-label="Move up" disabled={paused || status !== 'playing'}>↑</button>
            <button onClick={() => move({ x: -1, y: 0 })} aria-label="Move left" disabled={paused || status !== 'playing'}>←</button>
            <button onClick={() => move({ x: 0, y: 1 })} aria-label="Move down" disabled={paused || status !== 'playing'}>↓</button>
            <button onClick={() => move({ x: 1, y: 0 })} aria-label="Move right" disabled={paused || status !== 'playing'}>→</button>
          </div>
          <button
            className="gobbler-pause-control"
            type="button"
            onClick={togglePause}
            disabled={status !== 'playing'}
            aria-pressed={paused}
            aria-keyshortcuts="P"
          >
            {paused ? 'resume maze (P)' : 'pause maze (P)'}
          </button>
        </div>

        <footer className="gobbler-footer">
          <span role="status">{pausedMessage}</span>
          <button onClick={reset}>{status === 'playing' ? 'panic reset' : 'try again'}</button>
        </footer>
      </section>
    </main>
  )
}
