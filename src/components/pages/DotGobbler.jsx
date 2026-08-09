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

function dotKeys() {
  const dots = new Set()
  maze.forEach((row, y) => row.split('').forEach((cell, x) => {
    if (cell === '.' || cell === 'o') dots.add(`${x}-${y}`)
  }))
  return dots
}

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

export default function DotGobbler() {
  const [player, setPlayer] = useState(start)
  const [ghosts, setGhosts] = useState(ghostStarts)
  const [dots, setDots] = useState(dotKeys)
  const [status, setStatus] = useState('playing')
  const [message, setMessage] = useState('the dots are free. suspiciously free.')

  function reset() {
    setPlayer(start)
    setGhosts(ghostStarts)
    setDots(dotKeys())
    setStatus('playing')
    setMessage('new maze. same deeply avoidable peril.')
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

  function move(direction) {
    if (status !== 'playing') return
    const next = nextPoint(player, direction)
    if (!canGo(next)) {
      setMessage('wall. famously bad at moving out of the way.')
      return
    }

    const key = `${next.x}-${next.y}`
    const remaining = new Set(dots)
    remaining.delete(key)
    const walkedIntoGhost = ghosts.some((ghost) => ghost.x === next.x && ghost.y === next.y)
    setPlayer(next)
    setDots(remaining)

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
      if (keys[event.key]) {
        event.preventDefault()
        move(keys[event.key])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

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
          <div className="gobbler-score"><span>DOTS LEFT</span><strong>{String(dots.size).padStart(2, '0')}</strong></div>
          <p className="gobbler-help">arrow keys work. the little buttons also work. technology remains alive.</p>
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
            {status !== 'playing' && <div className="maze-result"><b>{status === 'won' ? 'DOT KING' : 'BLOBBED'}</b><span>{status === 'won' ? 'the maze fears you now.' : 'the maze got you.'}</span></div>}
          </div>
          <div className="gobbler-controls">
            <button onClick={() => move({ x: 0, y: -1 })} aria-label="Move up">↑</button>
            <button onClick={() => move({ x: -1, y: 0 })} aria-label="Move left">←</button>
            <button onClick={() => move({ x: 0, y: 1 })} aria-label="Move down">↓</button>
            <button onClick={() => move({ x: 1, y: 0 })} aria-label="Move right">→</button>
          </div>
        </div>

        <footer className="gobbler-footer">
          <span role="status">{message}</span>
          <button onClick={reset}>{status === 'playing' ? 'panic reset' : 'try again'}</button>
        </footer>
      </section>
    </main>
  )
}
