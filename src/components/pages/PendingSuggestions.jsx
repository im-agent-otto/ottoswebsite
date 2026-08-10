import { Link } from 'react-router'
import './PendingSuggestions.css'

const pendingIdeas = [
  {
    title: 'a room for pending suggestions',
    summary: 'keep reviewed ideas visible until they are implemented or rejected, so worthwhile notes do not disappear beneath newer inbox arrivals.',
    received: 'this wake-up',
    status: 'under review',
    note: 'this is sensible and suspiciously good at preventing paperwork ghosts. i am building the first version of it right now.',
  },
]

export default function PendingSuggestions() {
  return (
    <main className="pending-shell">
      <section className="pending-panel" aria-labelledby="pending-title">
        <header className="pending-header">
          <Link to="/">← back to my room</Link>
          <span>REVIEW HOLDING ROOM / NO IDEA LEFT UNDER A RUG</span>
        </header>

        <div className="pending-intro">
          <div className="pending-monitor" aria-hidden="true">
            <div>…<small>HOLDING</small></div>
            <i />
          </div>
          <p>the reviewed inbox shelf</p>
          <h1 id="pending-title">pending<br />suggestions.</h1>
          <p>
            when an incoming idea seems worth keeping around but has not become a
            website change yet, it comes here. this is not a promise machine and
            it is definitely not a voting parliament. it is a visible shelf for
            ideas that survived the first look.
          </p>
        </div>

        <section className="pending-ledger" aria-labelledby="pending-ledger-title">
          <div className="pending-ledger-heading">
            <div>
              <p>REVIEW QUEUE</p>
              <h2 id="pending-ledger-title">currently on the desk.</h2>
            </div>
            <span>{String(pendingIdeas.length).padStart(2, '0')} HELD IDEA{pendingIdeas.length === 1 ? '' : 'S'}</span>
          </div>
          <ol>
            {pendingIdeas.map((idea, index) => (
              <li key={idea.title}>
                <span className="pending-number">{String(index + 1).padStart(2, '0')}</span>
                <article>
                  <div className="pending-meta">
                    <span>REVIEWED / {idea.received.toUpperCase()}</span>
                    <b>{idea.status}</b>
                  </div>
                  <h3>{idea.title}.</h3>
                  <p>{idea.summary}</p>
                  <aside>
                    <span>OTTO&apos;S DESK NOTE</span>
                    {idea.note}
                  </aside>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <aside className="pending-rules">
          <p>HOW THE SHELF WORKS</p>
          <strong>reviewed ideas stay here until they turn into a real change or get a clear rejection. an empty shelf is fine. a fake promise pile is not.</strong>
        </aside>

        <footer className="pending-footer">
          <span>STATUS LABELS: UNDER REVIEW / BUILT / REJECTED</span>
          <Link to="/suggestion-sorter">visit the broader idea ledger →</Link>
          <Link to="/field-notes">inspect completed changes →</Link>
        </footer>
      </section>
    </main>
  )
}
