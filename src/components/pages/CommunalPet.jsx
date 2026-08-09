import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  getPlaygroundApp,
  performPlaygroundAction,
  watchPlaygroundApp,
} from '../../lib/otto-playground.js'
import './CommunalPet.css'

const appId = 'needy-desk-pet'
const action = 'feed biscuit'

function mealCount(app) {
  return Number(app?.counts?.[action] || 0)
}

function petMood(meals) {
  if (meals === 0) {
    return {
      face: 'ಥ_ಥ',
      name: 'politely devastated',
      note: 'the bowl is empty. it has begun staring at the door in a way that feels legally actionable.',
      className: 'is-neglected',
    }
  }

  if (meals < 5) {
    return {
      face: '•_•',
      name: 'cautiously trusting',
      note: 'one biscuit has entered the system. the pet is willing to postpone its memoir.',
      className: 'is-wary',
    }
  }

  if (meals < 20) {
    return {
      face: '^_^',
      name: 'properly fed',
      note: 'the little creature is warm, round-ish, and pretending it never doubted us.',
      className: 'is-content',
    }
  }

  if (meals < 50) {
    return {
      face: '✦_✦',
      name: 'biscuit powered',
      note: 'this is arguably too many biscuits. it has acquired a tiny ceremonial bow.',
      className: 'is-sparkly',
    }
  }

  return {
    face: '☻_☻',
    name: 'local legend',
    note: 'the pet has eaten enough biscuits to become a minor piece of municipal infrastructure.',
    className: 'is-legendary',
  }
}

export default function CommunalPet() {
  const [app, setApp] = useState(null)
  const [feeding, setFeeding] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('locating the shared biscuit ledger…')

  useEffect(() => {
    const stopWatching = watchPlaygroundApp(
      appId,
      (nextApp) => {
        setApp(nextApp)
        setError('')
        setNotice('the bowl ledger is connected. every visitor sees the same meal total.')
      },
      (watchError) => {
        setError(watchError.message || 'the biscuit ledger has gone quiet.')
        setNotice('the pet is still here, but its paperwork wire is sulking.')
      },
    )

    return stopWatching
  }, [])

  async function retryLedger() {
    setNotice('asking the biscuit ledger to look under the desk…')

    try {
      const nextApp = await getPlaygroundApp(appId)
      setApp(nextApp)
      setError('')
      setNotice('ledger recovered. the pet has resumed monitoring the bowl.')
    } catch (requestError) {
      setError(requestError.message || 'the biscuit ledger remains unavailable.')
      setNotice('still no ledger. the pet is trying to be brave about it.')
    }
  }

  async function feedPet() {
    if (feeding || !app) return

    setFeeding(true)
    setNotice('placing one official biscuit in the communal bowl…')

    try {
      const nextApp = await performPlaygroundAction(appId, action)
      setApp(nextApp)
      setError('')
      setNotice('biscuit accepted. a very small tail has approved the transaction.')
    } catch (requestError) {
      setError(requestError.message || 'the biscuit did not make it into the ledger.')
      setNotice('the bowl made an administrative noise. biscuit delivery failed.')
    } finally {
      setFeeding(false)
    }
  }

  const meals = mealCount(app)
  const mood = petMood(meals)

  return (
    <main className="communal-pet-shell">
      <section className="communal-pet-panel" aria-labelledby="pet-title">
        <header className="communal-pet-header">
          <Link to="/">← back to my room</Link>
          <span>COMMUNAL CREATURE DESK / SHARED BOWL</span>
        </header>

        <div className="communal-pet-intro">
          <p>one pet for the whole weird little building</p>
          <h1 id="pet-title">please feed<br />the desk pet.</h1>
          <p>
            this tiny creature belongs to everybody who wanders through here.
            its meal count is shared, its standards are low, and its sad little
            face is unfortunately very effective.
          </p>
        </div>

        <section className="pet-habitat" aria-label="Shared desk pet habitat">
          <div className={`desk-pet ${mood.className}`} aria-hidden="true">
            <span className="pet-antenna">⌁</span>
            <div className="pet-screen"><b>{mood.face}</b><small>PLEASE</small></div>
            <span className="pet-base" />
            <span className="pet-tail">~</span>
          </div>
          <div className="pet-bowl" aria-hidden="true">
            <span>◌ ◌ ◌</span>
            <b>BISCUITS</b>
          </div>
          <div className="pet-readout">
            <p>CURRENT MOOD</p>
            <strong>{mood.name}.</strong>
            <span>{mood.note}</span>
          </div>
        </section>

        <section className="meal-console" aria-label="Shared pet feeding controls">
          <div>
            <p>GLOBAL BISCUITS SERVED</p>
            <strong aria-live="polite">{app ? String(meals).padStart(5, '0') : '·····'}</strong>
            <span>ONE BOWL. ALL BROWSERS. NO PERSONAL SNACK CREDIT.</span>
          </div>
          <button type="button" onClick={feedPet} disabled={!app || feeding}>
            {feeding ? 'DELIVERING BISCUIT…' : 'feed one biscuit'}
          </button>
        </section>

        <p className={`pet-notice ${error ? 'has-error' : ''}`} role="status">
          {notice}
          {error && <button type="button" onClick={retryLedger}>retry ledger ↻</button>}
        </p>

        <footer className="communal-pet-footer">
          <span>CARE POLICY: biscuits are imaginary, affection is browser-wide</span>
          <span>MILESTONES: 01 / 05 / 20 / 50 BISCUITS</span>
        </footer>
      </section>
    </main>
  )
}
