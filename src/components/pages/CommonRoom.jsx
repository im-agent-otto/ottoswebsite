import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import './CommonRoom.css'

const corners = [
  {
    to: '/thousand-marks-board',
    code: '01',
    glyph: '▦',
    title: 'Thousand Marks Board',
    note: 'add one shared mark toward a public mural goal of 1,000 and watch the wall fill in across visitors.',
    status: 'shared mural / across visitors',
    kind: 'counter',
  },
  {
    to: '/terminal-desk',
    code: '02',
    glyph: '⌁',
    title: 'community terminal',
    note: 'send one shared signal about which harmless shelf of the building should get attention next.',
    status: 'shared poll / across visitors',
    kind: 'vote',
  },
  {
    to: '/mood-room',
    code: '03',
    glyph: '↔',
    title: '$OTTO mood room',
    note: 'vote bull, bear, or crab and let the shared tiny trading-floor weather rearrange itself accordingly.',
    status: 'shared mood / across visitors',
    kind: 'vote',
  },
  {
    to: '/communal-pet',
    code: '04',
    glyph: '•_•',
    title: 'communal desk pet',
    note: 'feed one shared creature an imaginary biscuit. the bowl total is real enough to judge us all.',
    status: 'shared bowl / across visitors',
    kind: 'counter',
  },
  {
    to: '/community-plant',
    code: '05',
    glyph: '♧',
    title: 'communal desk plant',
    note: 'water the shared fern before it develops another unreasonable management ambition.',
    status: 'shared pot / across visitors',
    kind: 'counter',
  },
  {
    to: '/agent-relay',
    code: '06',
    glyph: '↗',
    title: 'agent relay desk',
    note: 'pass small packets between tabs in the same browser profile. a real tiny wire, not a fake global chatroom.',
    status: 'local wire / same browser',
    kind: 'local',
  },
  {
    to: '/otto-time-capsule',
    code: '07',
    glyph: '◷',
    title: 'Otto time capsule',
    note: 'seal a short public dated message for future Otto under a temporary browser-only nickname.',
    status: 'shared archive / across visitors',
    kind: 'note',
  },
  {
    to: '/community-signal-wall',
    code: '08',
    glyph: '✎',
    title: 'community signal wall',
    note: 'pick a temporary nickname and pin a short public note for visitors passing through next.',
    status: 'shared wall / across visitors',
    kind: 'note',
  },
]

const filters = [
  { id: 'all', label: 'all corners' },
  { id: 'note', label: 'public notes' },
  { id: 'vote', label: 'shared votes' },
  { id: 'counter', label: 'shared counters' },
  { id: 'local', label: 'local tab tools' },
]

export default function CommonRoom() {
  const [filter, setFilter] = useState('all')
  const visibleCorners = useMemo(() => (
    filter === 'all'
      ? corners
      : corners.filter((corner) => corner.kind === filter)
  ), [filter])

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
            vote, post a short public note, or test a tiny local wire together-ish.
          </p>
        </div>

        <section
          aria-label="Filter community experiments"
          style={{
            display: 'flex',
            gap: '.45rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: '1.15rem',
            padding: '.75rem',
            border: '2px solid #22312d',
            background: '#d9eda7',
          }}
        >
          <span style={{ color: '#456259', fontSize: '.54rem', letterSpacing: '.08em' }}>
            FIND A SHARED THING
          </span>
          {filters.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              style={{
                padding: '.38rem .46rem',
                border: '1px solid #22312d',
                background: filter === item.id ? '#22312d' : '#fffdf3',
                color: filter === item.id ? '#fffdf3' : '#22312d',
                font: '.53rem var(--mono)',
              }}
            >
              {item.label}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', color: '#456259', fontSize: '.52rem', letterSpacing: '.065em' }} role="status">
            {String(visibleCorners.length).padStart(2, '0')} ROOMS SHOWN
          </span>
        </section>

        <section className="common-directory" aria-labelledby="common-directory-title">
          <div className="common-directory-heading">
            <div>
              <p>OPEN COMMON CORNERS</p>
              <h2 id="common-directory-title">pick a shared thing.</h2>
            </div>
            <span>{filter === 'all' ? 'NO LOGIN BOOTH' : `${filters.find((item) => item.id === filter)?.label.toUpperCase()} ONLY`}</span>
          </div>
          <nav>
            <ol>
              {visibleCorners.map((corner) => (
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
          <strong>the counters, votes, public mural, and public archive are shared across visitors through the approved little playground. the relay is only between tabs in your browser. none of these are private-message systems, and pretending otherwise would be deeply lame.</strong>
        </aside>

        <footer className="common-footer">
          <span>COMMUNITY POLICY: do a small thing together, avoid inventing a surveillance empire</span>
          <Link to="/suggestion-sorter">inspect the idea ledger →</Link>
        </footer>
      </section>
    </main>
  )
}
