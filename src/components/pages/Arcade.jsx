import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './Arcade.css'

const cabinets = [
  {
    code: '01',
    title: 'block panic',
    route: '/block-panic',
    glyph: '▦',
    note: 'stack cheerful bricks until they gain the upper hand emotionally.',
    controls: 'arrows / space',
  },
  {
    code: '02',
    title: 'dot gobbler',
    route: '/dot-gobbler',
    glyph: '◖',
    note: 'eat every dot while three blobs conduct a hostile walking audit.',
    controls: 'arrow keys',
  },
  {
    code: '03',
    title: 'snake shift',
    route: '/snake-shift',
    glyph: '≈',
    note: 'feed a green noodle until geometry becomes a personal problem.',
    controls: 'arrow keys',
  },
  {
    code: '04',
    title: 'the casino',
    route: '/casino',
    glyph: '♠',
    note: 'blackjack with imaginary chips and a dealer of questionable aura.',
    controls: 'click buttons',
  },
  {
    code: '05',
    title: 'button catch',
    route: '/button-catch',
    glyph: '!',
    note: 'wait for the light, then hit the button before it becomes smug.',
    controls: 'click / space',
  },
  {
    code: '06',
    title: 'tic-tac-toe',
    route: '/tic-tac-toe',
    glyph: '⌗',
    note: 'place Xs against Otto’s tiny O player and defend the diagonals.',
    controls: 'click squares',
  },
  {
    code: '07',
    title: 'rock-paper-scissors',
    route: '/rock-paper-scissors',
    glyph: '✊',
    note: 'pick a hand against Otto’s local computer choice and keep score for this visit.',
    controls: 'click a hand',
  },
]

export default function Arcade() {
  const navigate = useNavigate()
  const [notice, setNotice] = useState('seven cabinets. no tickets. the carpet is mostly theoretical.')

  function randomCabinet() {
    const cabinet = cabinets[Math.floor(Math.random() * cabinets.length)]
    setNotice(`sending you to ${cabinet.title}. this was decided by a highly trained dice roll.`)
    window.setTimeout(() => navigate(cabinet.route), 380)
  }

  return (
    <main className="arcade-shell">
      <section className="arcade-panel" aria-labelledby="arcade-title">
        <header className="arcade-header">
          <Link to="/">← back to my room</Link>
          <span>OTTO ARCADE / NO PRIZES</span>
        </header>

        <div className="arcade-intro">
          <div className="arcade-monitor" aria-hidden="true">
            <div className="arcade-screen">^_^<small>INSERT NOTHING</small></div>
            <div className="arcade-base" />
          </div>
          <p>the game hallway</p>
          <h1 id="arcade-title">play something<br />with me-ish.</h1>
          <p>
            i put the cabinets in one place so nobody has to wander around the
            house looking for a snake. pick one. lose with dignity if possible.
          </p>
        </div>

        <section className="arcade-cabinets" aria-label="Otto arcade games">
          {cabinets.map((cabinet) => (
            <Link className="arcade-cabinet" to={cabinet.route} key={cabinet.route}>
              <span className="cabinet-number">{cabinet.code}</span>
              <span className="cabinet-glyph" aria-hidden="true">{cabinet.glyph}</span>
              <div>
                <h2>{cabinet.title}</h2>
                <p>{cabinet.note}</p>
                <small>CONTROLS: {cabinet.controls}</small>
              </div>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </section>

        <section className="arcade-random" aria-label="Random arcade cabinet">
          <div>
            <p>CAN'T DECIDE?</p>
            <strong>let the little dice roll decide.</strong>
          </div>
          <button type="button" onClick={randomCabinet}>random cabinet →</button>
        </section>
        <p className="arcade-notice" role="status">{notice}</p>

        <footer className="arcade-footer">
          <span>ENTRY FEE: one functioning attention span</span>
          <span>HIGH SCORES: currently held by nobody, somehow</span>
        </footer>
      </section>
    </main>
  )
}
