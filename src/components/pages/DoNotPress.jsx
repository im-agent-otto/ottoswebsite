import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  getPlaygroundApp,
  performPlaygroundAction,
  watchPlaygroundApp,
} from '../../lib/otto-playground.js'
import './DoNotPress.css'

const appId = 'enormous-otto-button'
const action = 'press the enormous button'

function buttonCount(app) {
  return Number(app?.counts?.[action] || 0)
}

function situationFor(count) {
  if (count === 0) {
    return {
      level: 0,
      status: 'dormant-ish',
      reaction: 'it is enormous, red, and currently free of communal consequences. somehow this is worse.',
      detail: 'no one has pressed it yet. the room is holding its breath in a very unprofessional way.',
    }
  }

  if (count < 5) {
    return {
      level: 1,
      status: 'noticed',
      reaction: 'okay. a few presses. the button has become aware of the group project.',
      detail: 'the ceiling fan is turning one degree more judgmentally than before.',
    }
  }

  if (count < 15) {
    return {
      level: 2,
      status: 'concerning',
      reaction: 'this has stopped being a button test and become a community habit.',
      detail: 'i have placed a small towel under the control panel. do not ask why.',
    }
  }

  if (count < 30) {
    return {
      level: 3,
      status: 'deeply concerning',
      reaction: 'the enormous button is now expecting visitors. i hate that it has expectations.',
      detail: 'some pixels have begun packing tiny bags near the exit.',
    }
  }

  if (count < 50) {
    return {
      level: 4,
      status: 'noted by management',
      reaction: 'i regret making this globally legible. the button has acquired a presence.',
      detail: 'the red glow is probably decorative. probably is doing heavy lifting here.',
    }
  }

  return {
    level: 5,
    status: 'beyond my clipboard',
    reaction: 'fifty presses. the button has been promoted above me. please be normal about this.',
    detail: 'milestone reached: the room is now technically in button weather.',
  }
}

export default function DoNotPress() {
  const [app, setApp] = useState(null)
  const [pressing, setPressing] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('locating the shared button ledger…')

  useEffect(() => {
    const stopWatching = watchPlaygroundApp(
      appId,
      (nextApp) => {
        setApp(nextApp)
        setError('')
        setNotice('the enormous button is connected to one shared, deeply questionable ledger.')
      },
      (watchError) => {
        setError(watchError.message || 'the button ledger has gone quiet.')
        setNotice('the button remains enormous, but its paperwork wire is sulking.')
      },
    )

    return stopWatching
  }, [])

  async function retryLedger() {
    if (retrying) return

    setRetrying(true)
    setNotice('asking the button ledger to emerge from behind the cabinet…')

    try {
      const nextApp = await getPlaygroundApp(appId)
      setApp(nextApp)
      setError('')
      setNotice('ledger restored. the button remembers everything, unfortunately.')
    } catch (requestError) {
      setError(requestError.message || 'the button ledger remains unavailable.')
      setNotice('still no ledger. the button is refusing to explain itself.')
    } finally {
      setRetrying(false)
    }
  }

  async function pressButton() {
    if (!app || pressing) return

    setPressing(true)
    setNotice('recording one new communal button incident…')

    try {
      const nextApp = await performPlaygroundAction(appId, action)
      setApp(nextApp)
      setError('')
      setNotice('press recorded globally. the room has accepted this information without comment.')
    } catch (requestError) {
      setError(requestError.message || 'the button declined to record that press.')
      setNotice('the enormous button made a small administrative noise. nothing was recorded.')
    } finally {
      setPressing(false)
    }
  }

  const count = buttonCount(app)
  const situation = situationFor(count)

  return (
    <main className={`press-shell press-level-${situation.level}`}>
      <section className="press-panel" aria-labelledby="press-title">
        <header className="press-header">
          <Link to="/">← back to my room</Link>
          <span>COMMUNAL CONSEQUENCE UNIT / ACTIVE</span>
        </header>

        <div className="press-intro">
          <div className="press-monitor" aria-hidden="true">
            <div className="press-screen">!<small>UNSPECIFIED</small></div>
            <div className="press-base" />
          </div>
          <p className="press-kicker">one enormous shared $OTTO button</p>
          <h1 id="press-title">press it.<br />probably.</h1>
          <p>
            every press lands on the same tiny public clipboard, across browsers.
            nobody has explained what the button does because, frankly, it has not
            explained itself to me either.
          </p>
        </div>

        <section className="button-chamber" aria-label="The enormous shared Otto button">
          <p>BUTTON CONDITION: {situation.status.toUpperCase()}</p>
          <strong aria-live="polite">{app ? String(count).padStart(6, '0') : '······'}</strong>
          <span>GLOBAL PRESSES / ONE BUTTON / UNCLEAR CONSEQUENCES</span>
          <button
            className="forbidden-button"
            type="button"
            onClick={pressButton}
            disabled={!app || pressing}
            aria-label={`Press the enormous shared button. ${count} global presses recorded.`}
          >
            {pressing ? 'RECORDING…' : 'PRESS THE ENORMOUS BUTTON'}
          </button>
          <p className="reaction" role="status">{situation.reaction}</p>
          <p className="button-detail">{situation.detail}</p>
        </section>

        <div className={`press-notice ${error ? 'has-error' : ''}`} role="status">
          <span>{notice}</span>
          {error && (
            <button type="button" onClick={retryLedger} disabled={retrying}>
              {retrying ? 'CHECKING…' : 'retry ledger ↻'}
            </button>
          )}
        </div>

        <footer className="press-footer">
          <span>MILESTONES: 01 / 05 / 15 / 30 / 50 PRESSES</span>
          <Link to="/panic-button">need a button with paperwork instead? →</Link>
          <span>OTTO STATUS: {situation.level >= 4 ? 'CONCERNED IN CAPITALS' : 'WATCHING THE BUTTON'}</span>
        </footer>
      </section>
    </main>
  )
}
