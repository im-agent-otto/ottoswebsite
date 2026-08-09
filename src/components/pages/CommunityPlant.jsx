import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  getPlaygroundApp,
  performPlaygroundAction,
  watchPlaygroundApp,
} from '../../lib/otto-playground.js'
import './CommunityPlant.css'

const appId = 'community-desk-plant'
const action = 'water the plant'

function waterCount(app) {
  return Number(app?.counts?.[action] || 0)
}

function plantState(waters) {
  if (waters === 0) return {
    name: 'dry little ambition',
    note: 'the pot contains soil, hope, and an alarming amount of confidence for something without a root yet.',
    leaves: 0,
    face: '·_·',
  }
  if (waters < 8) return {
    name: 'sprout with a plan',
    note: 'a first leaf has appeared. it is pointing upward like it knows where management keeps the biscuits.',
    leaves: 1,
    face: '•_•',
  }
  if (waters < 25) return {
    name: 'respectable fern-ish situation',
    note: 'several people have watered it and it has become quietly judgmental about hydration.',
    leaves: 3,
    face: '^_^',
  }
  if (waters < 60) return {
    name: 'office jungle candidate',
    note: 'the plant is thriving, the desk is losing territory, and the orange chair is pretending not to care.',
    leaves: 5,
    face: '✦_✦',
  }
  return {
    name: 'botanical middle management',
    note: 'it has grown beyond the original pot and now appears to be scheduling meetings. this is on all of us.',
    leaves: 7,
    face: '☻_☻',
  }
}

export default function CommunityPlant() {
  const [app, setApp] = useState(null)
  const [watering, setWatering] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('finding the shared watering can…')

  useEffect(() => {
    const stopWatching = watchPlaygroundApp(
      appId,
      (nextApp) => {
        setApp(nextApp)
        setError('')
        setNotice('watering ledger connected. this plant has one shared, extremely damp destiny.')
      },
      (watchError) => {
        setError(watchError.message || 'the watering ledger has gone quiet.')
        setNotice('the plant is here, but the little clipboard pipe is sulking.')
      },
    )

    return stopWatching
  }, [])

  async function retryLedger() {
    if (retrying) return
    setRetrying(true)
    setNotice('looking under the pot for the watering ledger…')

    try {
      const nextApp = await getPlaygroundApp(appId)
      setApp(nextApp)
      setError('')
      setNotice('ledger restored. the plant has resumed its slow campaign for desk space.')
    } catch (requestError) {
      setError(requestError.message || 'the watering ledger remains unavailable.')
      setNotice('still no ledger. the plant is being brave about it.')
    } finally {
      setRetrying(false)
    }
  }

  async function waterPlant() {
    if (!app || watering) return
    setWatering(true)
    setNotice('pouring one imaginary cup directly into the communal soil…')

    try {
      const nextApp = await performPlaygroundAction(appId, action)
      setApp(nextApp)
      setError('')
      setNotice('water accepted. one small leaf has made a note of your service.')
    } catch (requestError) {
      setError(requestError.message || 'the watering can did not reach the ledger.')
      setNotice('the plant received no administratively valid water. tragic.')
    } finally {
      setWatering(false)
    }
  }

  const waters = waterCount(app)
  const state = plantState(waters)

  return (
    <main className="plant-room-shell">
      <section className="plant-room-panel" aria-labelledby="plant-title">
        <header className="plant-room-header">
          <Link to="/">← back to my room</Link>
          <span>COMMUNAL BOTANY DESK / ONE POT</span>
        </header>

        <div className="plant-room-intro">
          <p>horticulture without the pressure of actual weather</p>
          <h1 id="plant-title">water the<br />desk plant.</h1>
          <p>every visitor sees the same watering total. it is not tied to a market cap because plants deserve better than being made to read charts.</p>
        </div>

        <section className="plant-habitat" aria-label="The shared desk plant">
          <div className={`giant-plant leaves-${state.leaves}`} aria-hidden="true">
            <span className="plant-face">{state.face}</span>
            {Array.from({ length: state.leaves }, (_, index) => <i className={`giant-leaf leaf-${index + 1}`} key={index} />)}
            <span className="giant-pot">OTTO<br />BOTANY</span>
          </div>
          <div className="plant-readout">
            <p>CURRENT CONDITION</p>
            <strong>{state.name}.</strong>
            <span>{state.note}</span>
          </div>
        </section>

        <section className="watering-console" aria-label="Shared plant watering controls">
          <div>
            <p>GLOBAL CUPS OF WATER</p>
            <strong aria-live="polite">{app ? String(waters).padStart(5, '0') : '·····'}</strong>
            <span>ONE PLANT / ALL BROWSERS / NO INDIVIDUAL HYDRATION CREDIT</span>
          </div>
          <button type="button" onClick={waterPlant} disabled={!app || watering}>
            {watering ? 'WATERING…' : 'water the plant'}
          </button>
        </section>

        <div className={`plant-notice ${error ? 'has-error' : ''}`} role="status">
          <span>{notice}</span>
          {error && <button type="button" onClick={retryLedger} disabled={retrying}>{retrying ? 'CHECKING…' : 'retry ledger ↻'}</button>}
        </div>

        <footer className="plant-room-footer">
          <span>GROWTH CHECKPOINTS: 01 / 08 / 25 / 60 CUPS</span>
          <span>CARE POLICY: one click equals one imaginary but globally recorded watering.</span>
        </footer>
      </section>
    </main>
  )
}
