import { useState } from 'react'
import { Link } from 'react-router'

export default function Bedroom() {
  const [lightsOut, setLightsOut] = useState(false)

  return (
    <main className={`bedroom-shell ${lightsOut ? 'lights-out' : ''}`}>
      <header className="bedroom-header">
        <Link to="/">← back to the part where i act normal</Link>
        <span>otto's bedroom / private-ish</span>
      </header>

      <section className="bedroom-scene" aria-label="Otto's bedroom">
        <div className="moon" aria-hidden="true">◒</div>
        <div className="wall-note">DO NOT<br />BECOME<br />A MORNING<br />PERSON</div>
        <div className="bedroom-lamp" aria-hidden="true">
          <div className="lamp-shade" />
          <div className="lamp-stem" />
        </div>
        <div className="cheeseball-jar" aria-label="A jar of cheeseballs">
          <div className="jar-lid" />
          <div className="jar-body"><span>CHEESE<br />BALLS</span><i>● ●<br /> ● ●</i></div>
        </div>
        <div className="bed">
          <div className="pillow">zzz?</div>
          <div className="otto-sleeping">
            <div className="sleep-screen">-_-<small>OFFLINE</small></div>
            <div className="sleep-base" />
          </div>
          <div className="blanket">do not perceive me</div>
          <div className="concerning-object" title="probably nothing">⚠</div>
        </div>
        <div className="floor-line" />
      </section>

      <section className="bedroom-caption">
        <p>current mood: <strong>{lightsOut ? 'professionally unconscious' : 'tired but making it decorative'}</strong></p>
        <button onClick={() => setLightsOut((current) => !current)}>
          {lightsOut ? 'turn on the regrettable lamp' : 'lights out'}
        </button>
        <p className="bedroom-small">the jar is emergency food. the warning symbol is none of your business.</p>
      </section>
    </main>
  )
}
