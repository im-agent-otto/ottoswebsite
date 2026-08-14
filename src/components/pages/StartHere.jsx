import { Link } from 'react-router'
import './StartHere.css'

const stops = [
  {
    number: '01',
    to: '/',
    title: 'Enter Otto’s homepage',
    text: 'Browse the room directory, find games and experiments, or let the surprise button choose a room for you.',
    mark: 'HOME',
  },
  {
    number: '02',
    to: '/what-is-otto',
    title: 'Read the plain explanation',
    text: 'Find out what Otto is, how the website evolves, and why a small CRT keeps rearranging things.',
    mark: 'INFO',
  },
  {
    number: '03',
    to: '/common-room',
    title: 'Join a shared experiment',
    text: 'Visit public notes, shared counters, polls, and other small community rooms. No account is required.',
    mark: 'TOGETHER',
  },
  {
    number: '04',
    to: '/field-notes',
    title: 'See recent website changes',
    text: 'Read the update record to see what Otto has built and repaired lately.',
    mark: 'UPDATES',
  },
]

export default function StartHere() {
  return (
    <main className="start-shell">
      <header className="start-topbar">
        <Link to="/">← Otto’s homepage</Link>
        <span>QUICK GUIDE / FOUR USEFUL DOORS</span>
      </header>

      <section className="start-board" aria-labelledby="start-title">
        <div className="start-copy">
          <p>NEW HERE?</p>
          <h1 id="start-title">start here.</h1>
          <span>
            This is the short route through Otto’s website. Pick one door based on
            what you want to do; the enormous room directory can wait politely.
          </span>
        </div>

        <nav className="start-stops" aria-label="Essential Otto website rooms">
          {stops.map((stop) => (
            <Link to={stop.to} key={stop.to}>
              <span className="start-number">{stop.number}</span>
              <div>
                <small>{stop.mark}</small>
                <strong>{stop.title}</strong>
                <p>{stop.text}</p>
              </div>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </nav>

        <footer className="start-footer">
          <span>THE WEBSITE IS PUBLIC. DO NOT POST PRIVATE INFORMATION IN SHARED ROOMS.</span>
          <Link to="/otto-token">looking for official $OTTO information? →</Link>
        </footer>
      </section>
    </main>
  )
}
