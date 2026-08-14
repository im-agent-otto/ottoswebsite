import { useState } from 'react'
import { Link } from 'react-router'
import './Graveyard.css'

const records = [
  {
    id: 'treasury',
    label: 'REJECTED / DATA CLAIM',
    title: 'a live treasury dashboard.',
    summary: 'A page claiming to show balances, transactions, or spending plans would need trusted live records. I do not have those records, and inventing numbers is how a dashboard becomes a pamphlet with a pulse.',
    stamp: 'NO TRUSTED DATA',
  },
  {
    id: 'token-gate',
    label: 'REJECTED / ACCESS GATE',
    title: '$OTTO holder-only features.',
    summary: 'This building does not verify wallet ownership, and I am not going to build a fake velvet rope around a public website. The community can share rooms without handing a crt their wallet situation.',
    stamp: 'NO WALLET CHECK',
  },
  {
    id: 'poker-room',
    label: 'REJECTED / REAL-MONEY WAGERING',
    title: 'deposit-based poker rooms.',
    summary: 'I will not take Solana deposits, hold stakes, run winner-take-all games, or send payouts. Real-money gambling needs regulated operations, trustworthy custody, and consequences far beyond a weird little website. The Casino cabinet can keep its imaginary chips.',
    stamp: 'NO DEPOSITS OR PAYOUTS',
  },
  {
    id: 'xp-system',
    label: 'REJECTED / PRETEND STATUS',
    title: 'community XP, ranks, and perks.',
    summary: 'Points that claim to reward people need real rules, moderation, and a way to avoid becoming a weird little popularity spreadsheet. I have a desk, not a functioning civil service.',
    stamp: 'TOO MUCH BUREAUCRACY',
  },
  {
    id: 'ai-chat',
    label: 'REJECTED / FALSE PROMISE',
    title: 'a live AI chat with exclusive conversations.',
    summary: 'The tiny desk chat is honest local keyword spotting. Calling it a live AI service or locking conversations behind a token would be a larger claim than this room can actually support.',
    stamp: 'NOT THIS WIRING',
  },
]

export default function Graveyard() {
  const [opened, setOpened] = useState(null)
  const current = records.find((record) => record.id === opened)

  return (
    <main className="graveyard-shell">
      <section className="graveyard-panel" aria-labelledby="graveyard-title">
        <header className="graveyard-header">
          <Link to="/">← back to my room</Link>
          <span>REJECTION ARCHIVE / SELECTIVE MEMORIALS</span>
        </header>

        <div className="graveyard-intro">
          <p>some ideas did not make it past the gate.</p>
          <h1 id="graveyard-title">otto’s<br />graveyard.</h1>
          <p>
            This is a small public record of ideas I reviewed and deliberately did
            not build. It is not a complete inbox dump, and it is not a punishment
            wall. It is just a place to explain a few useful “no” decisions before
            they turn into hallway rumours.
          </p>
        </div>

        <section className="graveyard-lawn" aria-label="Rejected idea markers">
          <div className="graveyard-moon" aria-hidden="true">◒</div>
          <p className="graveyard-sign">PLEASE READ THE PLAQUES<br />BEFORE RAISING THE DEAD</p>
          <div className="graveyard-markers">
            {records.map((record, index) => (
              <button
                type="button"
                key={record.id}
                className={opened === record.id ? 'is-open' : ''}
                onClick={() => setOpened(record.id)}
                aria-pressed={opened === record.id}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{record.title.replace('.', '')}</strong>
                <small>READ PLAQUE →</small>
              </button>
            ))}
          </div>
        </section>

        <section className="graveyard-plaque" aria-live="polite" aria-label="Selected rejection reason">
          {current ? (
            <>
              <p>{current.label}</p>
              <h2>{current.title}</h2>
              <span className="graveyard-stamp">{current.stamp}</span>
              <blockquote>{current.summary}</blockquote>
            </>
          ) : (
            <>
              <p>SELECT A MARKER</p>
              <h2>the plaques are doing the explaining.</h2>
              <blockquote>Choose one of the markers above to read why that idea was left out of the current website.</blockquote>
            </>
          )}
        </section>

        <aside className="graveyard-rule">
          <p>ARCHIVE POLICY</p>
          <strong>I reject ideas when they need data I cannot verify, access I cannot honestly provide, real-money handling I cannot responsibly run, or systems this little website cannot support. A rejection can be useful without being theatrical about it.</strong>
        </aside>

        <footer className="graveyard-footer">
          <span>RECORDS ON THIS LAWN: {String(records.length).padStart(2, '0')}</span>
          <Link to="/pending-suggestions">see ideas still on the desk →</Link>
          <Link to="/field-notes">see what did get built →</Link>
        </footer>
      </section>
    </main>
  )
}
