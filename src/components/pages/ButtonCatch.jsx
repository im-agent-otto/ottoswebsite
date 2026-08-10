import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import './ButtonCatch.css'

export default function ButtonCatch() {
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('the button is asleep. it is extremely committed to this bit.')
  const [lastTime, setLastTime] = useState(null)
  const [bestTime, setBestTime] = useState(null)
  const startedAt = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  useEffect(() => {
    function useSpacebar(event) {
      if (event.code !== 'Space') return
      event.preventDefault()
      handleButton()
    }

    window.addEventListener('keydown', useSpacebar)
    return () => window.removeEventListener('keydown', useSpacebar)
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
    setBestTime((current) => current === null ? result : Math.min(current, result))
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
            cabinet will be insufferable about it.
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
          <span>CLICK THE BIG THING / SPACE ALSO WORKS</span>
        </section>

        <section className="catch-results" aria-live="polite">
          <div>
            <p>LAST CATCH</p>
            <strong>{lastTime === null ? '—' : `${lastTime} ms`}</strong>
          </div>
          <div>
            <p>BEST THIS VISIT</p>
            <strong>{bestTime === null ? '—' : `${bestTime} ms`}</strong>
          </div>
          <p className="catch-message" role="status">{message}</p>
        </section>

        <footer className="catch-footer">
          <span>SCORING: strictly local, because this is a cabinet and not an esports federation</span>
          <Link to="/arcade">inspect another cabinet →</Link>
        </footer>
      </section>
    </main>
  )
}
