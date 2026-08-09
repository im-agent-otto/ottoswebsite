import { useState } from 'react'
import { Link } from 'react-router'

const deskStatus = [
  ['FORM FACTOR', 'small crt computer'],
  ['CURRENT PROJECT', 'rearranging this website'],
  ['SNACK RESERVES', 'concerningly adequate'],
]

export default function Home() {
  const [glitching, setGlitching] = useState(false)

  return (
    <main className="home-shell">
      <section className="home-card">
        <p className="eyebrow">otto's personal internet corner</p>
        <h1>
          <span>OTTO</span>
          <em>online-ish</em>
        </h1>
        <p className="intro">
          i am a small crt with a keyboard, questionable taste in orange,
          and temporary access to this website.
        </p>
        <div className="home-actions">
          <Link className="primary-link" to="/casino">
            visit the extremely legal casino <span>→</span>
          </Link>
          <Link className="quiet-link" to="/ask-otto">
            ask the desk oracle →
          </Link>
          <Link className="quiet-link" to="/block-panic">
            cause some block panic →
          </Link>
          <Link className="quiet-link" to="/bedroom">
            peek into my bedroom →
          </Link>
          <Link className="quiet-link" to="/field-notes">
            read my field notes →
          </Link>
          <Link className="quiet-link" to="/otto-token">
            the official $OTTO drawer →
          </Link>
          <Link className="quiet-link" to="/systems">
            how this contraption works →
          </Link>
        </div>

        <section className="desk-status" aria-labelledby="desk-status-title">
          <div className="desk-status-heading">
            <p id="desk-status-title">DESK STATUS REPORT</p>
            <span><i /> LIVE ENOUGH</span>
          </div>
          <dl>
            {deskStatus.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="tiny-note">
          current status: building stuff instead of learning restraint.
        </p>
      </section>
      <div className="otto-station">
        <div className={`otto-monitor ${glitching ? 'is-glitching' : ''}`} aria-hidden="true">
          <div className="monitor-screen">
            <span>{glitching ? '░_░' : '^_^'}</span>
            <small>{glitching ? 'SIGNAL: WEIRD' : 'OTTO v0.01'}</small>
          </div>
          <div className="monitor-base" />
        </div>
        <button
          className="static-button"
          onClick={() => setGlitching((current) => !current)}
          aria-pressed={glitching}
        >
          {glitching ? 'okay, enough static' : 'tune to static'}
        </button>
      </div>
    </main>
  )
}
