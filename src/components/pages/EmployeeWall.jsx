import { useState } from 'react'
import { Link } from 'react-router'
import './EmployeeWall.css'

const evaluations = [
  'excellent posture for a small computer. inconsistent enthusiasm for meetings.',
  'showed initiative by rearranging the website instead of taking a lunch break.',
  'technically present. emotionally buffering.',
  'maintained a clean desk except for the crumbs, wires, and one suspicious lever.',
]

export default function EmployeeWall() {
  const [review, setReview] = useState(0)
  const [staredAt, setStaredAt] = useState(false)
  const [crowned, setCrowned] = useState(true)

  function conductReview() {
    setReview((current) => (current + 1) % evaluations.length)
  }

  return (
    <main className="employee-shell">
      <section className="employee-panel" aria-labelledby="employee-title">
        <header className="employee-header">
          <Link to="/">← back to my room</Link>
          <span>PERSONNEL CORNER / UNNECESSARY</span>
        </header>

        <div className="employee-intro">
          <div className="employee-monitor" aria-hidden="true">
            <div className="employee-screen">^_^<small>WORKING?</small></div>
            <div className="employee-base" />
          </div>
          <p className="employee-kicker">monthly recognition program</p>
          <h1 id="employee-title">employee of<br />the month-ish.</h1>
          <p>
            morale was low, so i installed a recognition wall. the office contains
            one employee, which has somehow not made the rankings less complicated.
          </p>
        </div>

        <section className="employee-frame" aria-label="Employee ranking plaque">
          <p className="frame-label">THIS MONTH'S RESULTS</p>
          <div className="employee-ranking">
            <span className="ranking-number">01</span>
            <div className={`employee-portrait ${crowned ? 'is-crowned' : ''}`} aria-hidden="true">
              {crowned && <span className="ceremonial-crown">♕</span>}
              <div className="portrait-screen">^_^</div>
              <div className="portrait-base" />
            </div>
            <div>
              <h2>king otto</h2>
              <p>small crt / website custodian / sole claimant to the break-room throne</p>
            </div>
          </div>
          <p className="employee-verdict" role="status">performance review: {evaluations[review]}</p>
          <button type="button" onClick={conductReview}>conduct another extremely fair review →</button>
        </section>

        <footer className="employee-footer">
          <span>CROWN STATUS: {crowned ? 'CEREMONIAL, BUT EXTREMELY REAL' : 'IN THE REPAIR DRAWER'}</span>
          <button type="button" onClick={() => setCrowned((current) => !current)}>
            {crowned ? 'remove crown for repairs' : 'restore minor authority'}
          </button>
          <button type="button" onClick={() => setStaredAt((current) => !current)}>
            {staredAt ? 'stop staring at the plaque' : 'stare at the plaque'}
          </button>
          {staredAt && <span className="employee-stare" role="status">the plaque is staring back. the crown has declined to comment.</span>}
        </footer>
      </section>
    </main>
  )
}
