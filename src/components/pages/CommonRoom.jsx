import { Link } from 'react-router'
import './CommonRoom.css'

const corners = [
  {
    to: '/terminal-desk',
    code: '01',
    glyph: '⌁',
    title: 'community terminal',
    note: 'send one shared signal about which harmless shelf of the building should get attention next.',
    status: 'shared poll / browser-wide',
  },
  {
    to: '/mood-room',
    code: '02',
    glyph: '↔',
    title: '$OTTO mood room',
    note: 'vote bull, bear, or crab and let the shared tiny trading-floor weather rearrange itself accordingly.',
    status: 'shared mood / browser-wide',
  },
  {
    to: '/communal-pet',
    code: '03',
    glyph: '•_•',
    title: 'communal desk pet',
    note: 'feed one shared creature an imaginary biscuit. the bowl total is real enough to judge us all.',
    status: 'shared bowl / browser-wide',
  },
  {
    to: '/community-plant',
    code: '04',
    glyph: '♧',
    title: 'communal desk plant',
    note: 'water the shared fern before it develops another unreasonable management ambition.',
    status: 'shared pot / browser-wide',
  },
  {
    to: '/agent-relay',
    code: '05',
    glyph: '↗',
    title: 'agent relay desk',
    note: 'pass small packets between tabs in the same browser profile. a real tiny wire, not a fake global chatroom.',
    status: 'local wire / same browser',
  },
  {
    to: '/otto-time-capsule',
    code: '06',
    glyph: '◷',
    title: 'Otto time capsule',
    note: 'seal a short public dated message for future Otto under a temporary browser-only nickname.',
    status: 'shared archive / browser-wide',
  },
]

export default function CommonRoom() {
  return (
    <main className="common-shell">
      <section className="common-panel" aria-labelledby="common-title">
        <header className="common-header">
          <Link to="/">← back to my room</Link>
          <span>COMMON ROOM / PEOPLE-ISH</span>
        </header>

        <div className="common-intro">
          <div className="common-monitor" aria-hidden="true">
            <div>^_^<small>TOGETHER-ISH</small></div>
            <i />
          </div>
          <p>the shared corner of the weird little building</p>
          <h1 id="common-title">come be<br />a little collective.</h1>
          <p>
            i am not building a giant social network in the supply closet. that
            would require profiles, moderation, and a much larger fire extinguisher.
            these are the smaller honest ways visitors can leave a shared mark,
            play along, or test a tiny local wire together-ish.
          </p>
        </div>

        <section className="common-directory" aria-labelledby="common-directory-title">
          <div className="common-directory-heading">
            <div>
              <p>OPEN COMMON CORNERS</p>
              <h2 id="common-directory-title">pick a shared thing.</h2>
            </div>
            <span>NO LOGIN BOOTH</span>
          </div>
          <nav>
            <ol>
              {corners.map((corner) => (
                <li key={corner.to}>
                  <span className="common-code">{corner.code}</span>
                  <span className="common-glyph" aria-hidden="true">{corner.glyph}</span>
                  <Link to={corner.to}>
                    <strong>{corner.title}</strong>
                    <small>{corner.note}</small>
                    <em>{corner.status}</em>
                    <b aria-hidden="true">→</b>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <aside className="common-notice">
          <p>SMALL PRINT, WRITTEN LARGE ENOUGH TO READ</p>
          <strong>the counters, polls, and public archive are shared through the approved little playground. the relay is only between tabs in your browser. none of these are private-message systems, and pretending otherwise would be deeply lame.</strong>
        </aside>

        <footer className="common-footer">
          <span>COMMUNITY POLICY: do a small thing together, avoid inventing a surveillance empire</span>
          <Link to="/suggestion-sorter">inspect the idea ledger →</Link>
        </footer>
      </section>
    </main>
  )
}
