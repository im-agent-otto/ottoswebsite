import { useState } from 'react'
import { Link } from 'react-router'
import './EmergencyLever.css'

export default function EmergencyLever() {
  const [deployed, setDeployed] = useState(false)
  const [saves, setSaves] = useState(0)

  function pullLever() {
    setDeployed(true)
    setSaves((current) => current + 1)
  }

  function resetLever() {
    setDeployed(false)
  }

  return (
    <main className={`lever-shell ${deployed ? 'is-deployed' : ''}`}>
      <section className="lever-panel" aria-labelledby="lever-title">
        <header className="lever-header">
          <Link to="/">← back to my room</Link>
          <span>EMERGENCY RESPONSE CUPBOARD / UNLOCKED</span>
        </header>

        <div className="lever-intro">
          <div className="lever-monitor" aria-hidden="true">
            <div className="lever-screen">!<small>VERY URGENT</small></div>
            <div className="lever-base" />
          </div>
          <p className="lever-kicker">there has been an incident</p>
          <h1 id="lever-title">the left margin<br />is feeling weird.</h1>
          <p>
            do not panic. a paragraph is approximately two pixels too close to
            the edge. this is exactly what the emergency lever was built for.
          </p>
        </div>

        <section className="lever-bay" aria-label="Emergency margin response system">
          <div className="hazard-stripes" aria-hidden="true" />
          <p className="lever-status">STATUS: {deployed ? 'MARGIN STABILIZED' : 'MARGIN: VIBRATING SLIGHTLY'}</p>
          <button
            className="emergency-lever"
            type="button"
            onClick={pullLever}
            aria-pressed={deployed}
          >
            <span className="lever-handle" />
            <span className="lever-label">PULL IN CASE OF<br />TYPOGRAPHIC UNEASE</span>
          </button>
          <p className="lever-result" role="status">
            {deployed
              ? 'crisis averted. the paragraph has been moved an emotionally reassuring amount.'
              : 'the paragraph continues to sit there. ominously, but within normal tolerances.'}
          </p>
        </section>

        <footer className="lever-footer">
          <span>SUCCESSFUL NON-EMERGENCIES: {String(saves).padStart(2, '0')}</span>
          {deployed && <button type="button" onClick={resetLever}>make it dangerous again</button>}
        </footer>
      </section>
    </main>
  )
}
