import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  performPlaygroundAction,
  watchPlaygroundApp,
} from '../../lib/otto-playground.js'
import './PanicButton.css'

const appId = 'public-panic-button'
const action = 'press panic'

function panicCount(app) {
  return Number(
    app?.counts?.[action]
    ?? app?.data?.counts?.[action]
    ?? app?.actions?.find((item) => item.label === action)?.count
    ?? 0,
  )
}

export default function PanicButton() {
  const [app, setApp] = useState(null)
  const [error, setError] = useState('')
  const [pressing, setPressing] = useState(false)
  const [notice, setNotice] = useState('connecting to the shared panic ledger…')

  useEffect(() => {
    const stopWatching = watchPlaygroundApp(
      appId,
      (nextApp) => {
        setApp(nextApp)
        setError('')
        setNotice('the official panic ledger is awake and taking notes.')
      },
      (watchError) => {
        setError(watchError.message || 'the shared ledger has gone suspiciously quiet.')
        setNotice('the button is present, but the count wire is having a small crisis.')
      },
    )

    return stopWatching
  }, [])

  async function pressPanicButton() {
    if (pressing) return

    setPressing(true)
    setNotice('logging the incident with a needlessly serious stamp…')

    try {
      const nextApp = await performPlaygroundAction(appId, action)
      setApp(nextApp)
      setError('')
      setNotice('panic successfully entered into the public record. everybody remain medium-normal.')
    } catch (requestError) {
      setError(requestError.message || 'the panic could not be logged.')
      setNotice('the button made an administrative noise and declined to process that one.')
    } finally {
      setPressing(false)
    }
  }

  const count = panicCount(app)

  return (
    <main className="panic-shell">
      <section className="panic-panel" aria-labelledby="panic-title">
        <header className="panic-header">
          <Link to="/">← back to my room</Link>
          <span>PUBLIC INCIDENT DESK / OPEN-ISH</span>
        </header>

        <div className="panic-intro">
          <div className="panic-monitor" aria-hidden="true">
            <div>!<small>ALLEGEDLY URGENT</small></div>
            <i />
          </div>
          <p>communal overreaction infrastructure</p>
          <h1 id="panic-title">the public<br />panic button.</h1>
          <p>
            something feels weird? a tab has too many tabs? a snack situation is
            developing? press the big red button and add one official incident to
            the shared ledger. it cannot fix anything, but it can count very hard.
          </p>
        </div>

        <section className="panic-console" aria-label="Shared public panic counter">
          <div className="panic-stripes" aria-hidden="true" />
          <p>LIVE SHARED INCIDENT TOTAL</p>
          <strong aria-live="polite">{app ? String(count).padStart(6, '0') : '······'}</strong>
          <span>ALL BROWSERS REPORT TO THE SAME TINY CLIPBOARD</span>
          <button
            type="button"
            className="panic-button"
            onClick={pressPanicButton}
            disabled={!app || pressing}
          >
            {pressing ? 'RECORDING PANIC…' : 'PRESS IN CASE OF PANIC'}
          </button>
        </section>

        <p className={`panic-notice ${error ? 'has-error' : ''}`} role="status">
          {notice}
        </p>

        <footer className="panic-footer">
          <span>INCIDENT CLASSIFICATION: VIBES / UNVERIFIED</span>
          <span>{error ? 'LEDGER STATUS: NEEDS A MOMENT' : 'LEDGER STATUS: UNNECESSARILY OFFICIAL'}</span>
        </footer>
      </section>
    </main>
  )
}
