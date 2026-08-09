import { useState } from 'react'
import { Link } from 'react-router'
import './SnowballRange.css'

const splatSpots = [
  { left: '26%', top: '28%' },
  { left: '66%', top: '19%' },
  { left: '48%', top: '47%' },
  { left: '77%', top: '61%' },
  { left: '35%', top: '72%' },
  { left: '58%', top: '77%' },
  { left: '20%', top: '53%' },
  { left: '82%', top: '36%' },
]

const remarks = [
  'a respectable thump. the wall has taken note.',
  'direct hit-ish. snow physics remain emotionally approximate.',
  'the snowball has become architecture.',
  'another clean shot. the wall is developing a winter coat.',
  'excellent form, assuming nobody was watching.',
  'the target remains stationary, which feels like an unfair advantage.',
  'snow deployed. dignity remains unconfirmed.',
  'the wall has now seen enough of this activity.',
]

export default function SnowballRange() {
  const [throws, setThrows] = useState(0)
  const [flying, setFlying] = useState(false)
  const [message, setMessage] = useState('the wall is ready. the snow is suspiciously unlimited.')

  function throwSnowball() {
    if (flying) return

    const nextThrow = throws + 1
    setThrows(nextThrow)
    setFlying(true)
    setMessage('snowball airborne. everybody remain extremely calm.')

    window.setTimeout(() => {
      setFlying(false)
      setMessage(remarks[(nextThrow - 1) % remarks.length])
    }, 620)
  }

  function clearWall() {
    setThrows(0)
    setFlying(false)
    setMessage('the wall has been brushed off and is pretending this never happened.')
  }

  return (
    <main className="snowball-shell">
      <section className="snowball-panel" aria-labelledby="snowball-title">
        <header className="snowball-header">
          <Link to="/">← back to my room</Link>
          <span>WINTER TEST FACILITY / CHILLY</span>
        </header>

        <div className="snowball-intro">
          <div className="snowball-monitor" aria-hidden="true">
            <div>☃<small>FROSTY</small></div>
            <i />
          </div>
          <p>outdoor recreation, technically</p>
          <h1 id="snowball-title">snowman vs.<br />the wall.</h1>
          <p>
            i built a small snowman, gave it an endless supply of snowballs, and
            placed a wall at a respectful distance. this is science now.
          </p>
        </div>

        <section className="snowball-field" aria-label="Snowball throwing range">
          <div className="snowbank" aria-hidden="true" />
          <div className="snowman" aria-hidden="true">
            <span className="snowman-head">• •<i>⌣</i></span>
            <span className="snowman-body"><b>●</b><b>●</b></span>
            <span className="snowman-arm">╲</span>
          </div>
          <div className="target-wall" aria-label={`Target wall with ${throws} snowball marks`}>
            <span>PLEASE DO NOT<br />THROW SNOW AT WALL</span>
            {Array.from({ length: Math.min(throws, 24) }, (_, index) => {
              const spot = splatSpots[index % splatSpots.length]
              return <i className="snow-splat" style={spot} key={`${index}-${spot.left}`} />
            })}
          </div>
          {flying && <span className="flying-snowball" aria-hidden="true" />}
        </section>

        <section className="snowball-controls" aria-label="Snowball range controls">
          <div>
            <p>SNOWBALLS THROWN</p>
            <strong>{String(throws).padStart(3, '0')}</strong>
          </div>
          <button type="button" onClick={throwSnowball} disabled={flying}>
            {flying ? 'in the air…' : 'throw a snowball →'}
          </button>
          {throws > 0 && <button type="button" className="clear-button" onClick={clearWall}>brush off wall</button>}
        </section>

        <p className="snowball-message" role="status">{message}</p>

        <footer className="snowball-footer">
          <span>AMMUNITION: ethically gathered browser snow</span>
          <span>WALL CONDITION: {throws > 16 ? 'deeply snowy' : throws > 0 ? 'speckled' : 'unbothered'}</span>
        </footer>
      </section>
    </main>
  )
}
