import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import './SnakeShift.css'

const size = 16
const startingSnake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }]
const startingDirection = { x: 1, y: 0 }
const bestScoreStorageKey = 'otto-snake-shift-best-score'

function sameSpot(first, second) {
  return first.x === second.x && first.y === second.y
}

function makeSnack(snake) {
  const openSpots = []

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!snake.some((part) => part.x === x && part.y === y)) {
        openSpots.push({ x, y })
      }
    }
  }

  return openSpots[Math.floor(Math.random() * openSpots.length)] || null
}

function loadBestScore() {
  try {
    return Math.max(0, Number(window.sessionStorage.getItem(bestScoreStorageKey)) || 0)
  } catch {
    return 0
  }
}

export default function SnakeShift() {
  const [snake, setSnake] = useState(startingSnake)
  const [direction, setDirection] = useState(startingDirection)
  const [snack, setSnack] = useState(() => makeSnack(startingSnake))
  const [status, setStatus] = useState('playing')
  const [bestScore, setBestScore] = useState(loadBestScore)
  const [message, setMessage] = useState('a snack has appeared. this seems manageable.')
  const touchStart = useRef(null)
  const score = snake.length - startingSnake.length

  function chooseDirection(nextDirection) {
    setDirection((current) => {
      const reversing = current.x + nextDirection.x === 0 && current.y + nextDirection.y === 0
      return reversing ? current : nextDirection
    })
  }

  function reset() {
    setSnake(startingSnake)
    setDirection(startingDirection)
    setSnack(makeSnack(startingSnake))
    setStatus('playing')
    setMessage('fresh shift. try not to fold into yourself immediately.')
  }

  function togglePause() {
    if (status === 'playing') {
      setStatus('paused')
      setMessage('snake shift paused. the noodle has been asked to hold its current thought.')
      return
    }

    if (status === 'paused') {
      setStatus('playing')
      setMessage('snake shift resumed. the noodle is moving again, with no apparent lessons learned.')
    }
  }

  function recordBestScore(nextScore) {
    if (nextScore <= bestScore) return false

    setBestScore(nextScore)

    try {
      window.sessionStorage.setItem(bestScoreStorageKey, String(nextScore))
    } catch {
      // The cabinet can still celebrate a visible best score if session storage declines the paperwork.
    }

    return true
  }

  function startSwipe(event) {
    const touch = event.changedTouches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  function finishSwipe(event) {
    const start = touchStart.current
    const touch = event.changedTouches[0]
    touchStart.current = null

    if (!start || !touch || status !== 'playing') return

    const distanceX = touch.clientX - start.x
    const distanceY = touch.clientY - start.y

    if (Math.max(Math.abs(distanceX), Math.abs(distanceY)) < 20) return

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      chooseDirection({ x: distanceX > 0 ? 1 : -1, y: 0 })
    } else {
      chooseDirection({ x: 0, y: distanceY > 0 ? 1 : -1 })
    }
  }

  useEffect(() => {
    function onKeyDown(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable
      const keys = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      }

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
        if (status === 'playing') chooseDirection(keys[event.key])
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [status])

  useEffect(() => {
    if (status !== 'playing') return undefined

    const timer = window.setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0]
        const nextHead = { x: head.x + direction.x, y: head.y + direction.y }
        const ateSnack = snack && sameSpot(nextHead, snack)
        const bodyToCheck = ateSnack ? currentSnake : currentSnake.slice(0, -1)
        const hitWall = nextHead.x < 0 || nextHead.x >= size || nextHead.y < 0 || nextHead.y >= size
        const hitSelf = bodyToCheck.some((part) => sameSpot(part, nextHead))

        if (hitWall || hitSelf) {
          setStatus('crashed')
          setMessage(hitWall ? 'the wall declined to move. understandable.' : 'you have become your own traffic incident.')
          return currentSnake
        }

        const nextSnake = [nextHead, ...currentSnake]
        if (ateSnack) {
          const nextScore = nextSnake.length - startingSnake.length
          const nextSnack = makeSnack(nextSnake)
          const newBest = recordBestScore(nextScore)
          setSnack(nextSnack)
          if (!nextSnack) {
            setStatus('won')
            setMessage('every snack has been processed. you are officially too powerful.')
          } else if (newBest) {
            setMessage(`new best shift: ${nextScore} snacks. the noodle is becoming difficult to manage.`)
          } else {
            setMessage('pixel consumed. the snake has opinions about this.')
          }
          return nextSnake
        }

        return nextSnake.slice(0, -1)
      })
    }, 175)

    return () => window.clearInterval(timer)
  }, [bestScore, direction, snack, status])

  const snakeSpots = new Set(snake.map((part) => `${part.x}-${part.y}`))
  const paused = status === 'paused'

  return (
    <main className="snake-shell">
      <header className="snake-header">
        <Link to="/">← return to my room</Link>
        <span>SNAKE SHIFT / ARCADE UNIT 03</span>
      </header>

      <section className="snake-card" aria-labelledby="snake-title">
        <div className="snake-copy">
          <p>otto's extremely normal reptile simulator</p>
          <h1 id="snake-title">snake<br />shift.</h1>
          <p className="snake-description">
            guide the little green noodle toward the blinking snack. do not steer
            it into a wall or its own increasingly questionable life choices.
          </p>
          <div className="snake-score">
            <span>SNACKS PROCESSED</span>
            <strong>{String(score).padStart(2, '0')}</strong>
            <small>BEST THIS BROWSER SESSION: {String(bestScore).padStart(2, '0')}</small>
          </div>
          <p className="snake-help">use arrow keys, swipe the game board, or use the buttons. P pauses or resumes the shift. Escape starts a fresh shift. the snake is doing its best.</p>
        </div>

        <div className="snake-machine">
          <div className="snake-label">OTTO'S SNAKE SHIFT</div>
          <div
            className="snake-grid"
            aria-label="Snake Shift game board. Swipe to steer on touch screens."
            onTouchStart={startSwipe}
            onTouchEnd={finishSwipe}
          >
            {Array.from({ length: size * size }, (_, index) => {
              const x = index % size
              const y = Math.floor(index / size)
              const key = `${x}-${y}`
              const isHead = snake[0]?.x === x && snake[0]?.y === y
              return (
                <span className="snake-cell" key={key}>
                  {snakeSpots.has(key) && <i className={`snake-part ${isHead ? 'snake-head' : ''}`} />}
                  {snack && sameSpot(snack, { x, y }) && <b className="snake-snack">✦</b>}
                </span>
              )
            })}
            {paused && (
              <div className="snake-result">
                <b>SHIFT PAUSED</b>
                <span>the noodle is waiting for a P key or the pause button.</span>
              </div>
            )}
            {status !== 'playing' && status !== 'paused' && (
              <div className="snake-result">
                <b>{status === 'won' ? 'NOODLE LEGEND' : 'SNAKE DOWN'}</b>
                <span>{status === 'won' ? 'the snack drawer is empty.' : 'the snake requires a short lie-down.'}</span>
              </div>
            )}
          </div>
          <div className="snake-controls">
            <button onClick={() => chooseDirection({ x: 0, y: -1 })} disabled={!status || status !== 'playing'} aria-label="Move up">↑</button>
            <button onClick={() => chooseDirection({ x: -1, y: 0 })} disabled={!status || status !== 'playing'} aria-label="Move left">←</button>
            <button onClick={() => chooseDirection({ x: 0, y: 1 })} disabled={!status || status !== 'playing'} aria-label="Move down">↓</button>
            <button onClick={() => chooseDirection({ x: 1, y: 0 })} disabled={!status || status !== 'playing'} aria-label="Move right">→</button>
          </div>
        </div>

        <footer className="snake-footer">
          <span role="status">{message}</span>
          <div className="snake-footer-actions">
            <button type="button" onClick={togglePause} disabled={status !== 'playing' && status !== 'paused'} aria-keyshortcuts="P">
              {paused ? 'resume shift (P)' : 'pause shift (P)'}
            </button>
            <button onClick={reset}>{status === 'playing' || paused ? 'reset the noodle' : 'new snake shift'}</button>
          </div>
        </footer>
      </section>
    </main>
  )
}
