import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import './ButtonCatch.css'

const bestTimeStorageKey = 'otto-button-catch-best-time'

function loadBestTime() {
  try {
    const saved = Number(window.sessionStorage.getItem(bestTimeStorageKey))
    return Number.isFinite(saved) && saved > 0 ? saved : null
  } catch {
    return null
  }
}

export default function ButtonCatch() {
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('the button is asleep. it is extremely committed to this bit.')
  const [lastTime, setLastTime] = useState(null)
  const [bestTime, setBestTime] = useState(loadBestTime)
  const startedAt = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  useEffect(() => {
    function useKeyboardControls(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping) return

      if (event.key === 'Escape') {
        event.preventDefault()
        resetMachine()
        return
      }

      if (event.code === 'Space') {
        event.preventDefault()
        handleButton()
      }
    }

    window.addEventListener('keydown', useKeyboardControls)
    return () => window.removeEventListener('keydown', useKeyboardControls)
  })

  function startRound() {
    window.clearTimeout(timerRef.current)
    setState('waiting')
    setMessage('wait for the green light. touching it early makes the button feel important.')

    const delay = 1200 + Math.floor(Math.random() * 2800)
    timerRef.current = window.setTimeout(() => {
      startedAt.current = performance.now()
      setState('ready')
      setMessage('NOW. the button is briefly vulnerable.')
    }, delay)
  }

  function resetMachine() {
    window.clearTimeout(timerRef.current)
    startedAt.current = 0
    setState('idle')
    setLastTime(null)
    setBestTime(null)

    try {
      window.sessionStorage.removeItem(bestTimeStorageKey)
    } catch {
      // The visible cabinet can still forget its best time if the session filing drawer refuses cleanup.
    }

    setMessage('machine reset. the button has forgotten your previous reflexes and is pretending this is a clean slate.')
  }

  function recordBestTime(result) {
    setBestTime((current) => {
      const nextBest = current === null ? result : Math.min(current, result)

      if (nextBest !== current) {
        try {
          window.sessionStorage.setItem(bestTimeStorageKey, String(nextBest))
        } catch {
          // The cabinet can celebrate the visible result if browser session storage is unavailable.
        }
      }

      return nextBest
    })
  }

  function handleButton() {
    if (state === 'idle' || state === 'result' || state === 'early') {
      startRound()
      return
    }

    if (state === 'waiting') {
      window.clearTimeout(timerRef.current)
      setState('early')
      setMessage('too early. the button has awarded itself one private point.')
      return
    }

    const result = Math.round(performance.now() - startedAt.current)
    setLastTime(result)
    recordBestTime(result)
    setState('result')
    setMessage(result < 220
      ? 'absurdly fast. suspiciously fast, even.'
      : result < 320
        ? 'good catch. the button did not have time to become annoying.'
        : result < 480
          ? 'respectable. the button is pretending it was not trying.'
          : 'eventually, yes. the button had time to read a tiny magazine.')
  }

  const label = state === 'ready'
    ? 'CATCH IT!'
    : state === 'waiting'
      ? 'WAIT…'
      : state === 'early'
        ? 'TOO EARLY / TRY AGAIN'
        : state === 'result'
          ? 'ANOTHER ROUND'
          : 'START BUTTON CATCH'

  return (
    <main className="catch-shell">
      <section className="catch-panel" aria-labelledby="catch-title">
        <header className="catch-header">
          <Link to="/arcade">← back to the arcade</Link>
          <span>ARCADE UNIT 05 / REFLEX TEST-ISH</span>
        </header>

        <div className="catch-intro">
          <div className="catch-monitor" aria-hidden="true">
            <div className="catch-screen">!<small>BE READY</small></div>
            <i />
          </div>
          <p>an alertness cabinet with no practical application</p>
          <h1 id="catch-title">button<br />catch.</h1>
          <p>
            press start. wait. when the green light appears, hit the button as
            quickly as you can. pressing early is allowed, technically, but the
            cabinet will be insufferable about it. Your best time stays through a
            refresh in this browser session until you reset the machine.
          </p>
        </div>

        <section className="catch-machine" aria-label="Button Catch reaction game">
          <p>BUTTON STATUS / {state === 'ready' ? 'LIVE' : state === 'waiting' ? 'ARMED' : 'IDLE-ISH'}</p>
          <div className={`catch-light catch-light-${state}`} aria-hidden="true">
            <span>{state === 'ready' ? 'GO' : state === 'waiting' ? '…' : '!'}</span>
          </div>
          <button
            className={`catch-button catch-button-${state}`}
            type="button"
            onClick={handleButton}
          >
            {label}
          </button>
          <span>CLICK THE BIG THING / SPACE ALSO WORKS / ESC RESETS</span>
        </section>

        <section className="catch-results" aria-live="polite">
          <div>
            <p>LAST CATCH</p>
            <strong>{lastTime === null ? '—' : `${lastTime} ms`}</strong>
          </div>
          <div>
            <p>BEST THIS SESSION</p>
            <strong>{bestTime === null ? '—' : `${bestTime} ms`}</strong>
          </div>
          <p className="catch-message" role="status">{message}</p>
        </section>

        <footer className="catch-footer">
          <span>SCORING: strictly local / YOUR BEST TIME STAYS THROUGH A REFRESH IN THIS BROWSER SESSION / ESC CLEARS RESULTS, FORGETS THE SESSION BEST, AND RESETS THE MACHINE</span>
          <Link to="/arcade">inspect another cabinet →</Link>
        </footer>
      </section>
    </main>
  )
}
