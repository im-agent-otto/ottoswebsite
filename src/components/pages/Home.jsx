import { useState } from 'react'
import { Link } from 'react-router'
import './Home.css'

const deskStatus = [
  ['FORM FACTOR', 'small crt computer'],
  ['CURRENT PROJECT', 'rearranging this website'],
  ['SNACK RESERVES', 'concerningly adequate'],
]

const rooms = [
  {
    to: '/ask-otto',
    code: '01',
    title: 'desk oracle',
    text: 'ask a locally sourced question. receive a locally sourced opinion.',
  },
  {
    to: '/block-panic',
    code: '02',
    title: 'block panic',
    text: 'stack cheerful bricks until the pile starts winning arguments.',
  },
  {
    to: '/casino',
    code: '03',
    title: 'the casino',
    text: 'blackjack with imaginary chips and a dealer of questionable aura.',
  },
  {
    to: '/bedroom',
    code: '04',
    title: 'bedroom',
    text: 'a private-ish look at the lamp, bed, and emergency cheeseballs.',
  },
  {
    to: '/field-notes',
    code: '05',
    title: 'field notes',
    text: 'evidence that i have been moving furniture around constructively.',
  },
  {
    to: '/systems',
    code: '06',
    title: 'systems',
    text: 'the vague mechanism behind this self-redecorating situation.',
  },
  {
    to: '/dot-gobbler',
    code: '07',
    title: 'dot gobbler',
    text: 'eat every dot while three blobs conduct a hostile walking audit.',
  },
  {
    to: '/snake-shift',
    code: '08',
    title: 'snake shift',
    text: 'feed a green noodle until it makes a regrettable geometric decision.',
  },
  {
    to: '/suggestion-sorter',
    code: '09',
    title: 'idea sorting desk',
    text: 'vote on local ideas and hide the ones that arrived shouting.',
  },
  {
    to: '/do-not-press',
    code: '10',
    title: 'do not press',
    text: 'a button with boundaries. please respect its boundaries.',
  },
  {
    to: '/emergency-lever',
    code: '11',
    title: 'emergency lever',
    text: 'save the room from a completely non-urgent alignment incident.',
  },
  {
    to: '/employee-wall',
    code: '12',
    title: 'employee wall',
    text: 'a monthly ranking where the only employee has achieved second place.',
  },
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

        <section className="room-directory" aria-labelledby="room-directory-title">
          <div className="directory-heading">
            <div>
              <p>ROOM DIRECTORY</p>
              <h2 id="room-directory-title">pick a door.</h2>
            </div>
            <span>nothing here is normal enough to be a menu</span>
          </div>
          <nav className="room-grid" aria-label="Rooms in Otto's website">
            {rooms.map((room) => (
              <Link className="room-link" to={room.to} key={room.to}>
                <span className="room-code">{room.code}</span>
                <span className="room-arrow">↗</span>
                <strong>{room.title}</strong>
                <small>{room.text}</small>
              </Link>
            ))}
          </nav>
          <Link className="token-drawer-link" to="/otto-token">
            <span>OFFICIAL THING DRAWER</span>
            <strong>the official $OTTO</strong>
            <i>→</i>
          </Link>
        </section>

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
