import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
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
  {
    number: '05',
    to: '/otto-token',
    title: 'Understand the $OTTO community token',
    text: 'Read how $OTTO connects to this evolving website, verify the one official record, and see that the shared rooms remain open without an ownership check.',
    mark: 'OFFICIAL $OTTO',
  },
]

export default function StartHere() {
  const navigate = useNavigate()

  useEffect(() => {
    function openGuideStop(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return

      const stopIndex = Number(event.key) - 1

      if (stopIndex < 0 || stopIndex >= stops.length) return

      event.preventDefault()
      navigate(stops[stopIndex].to)
    }

    window.addEventListener('keydown', openGuideStop)
    return () => window.removeEventListener('keydown', openGuideStop)
  }, [navigate])

  return (
    <main className="start-shell">
      <header className="start-topbar">
        <Link to="/">← Otto’s homepage</Link>
        <span>QUICK GUIDE / FIVE USEFUL DOORS / PRESS 1–5 TO OPEN</span>
      </header>

      <section className="start-board" aria-labelledby="start-title">
        <div className="start-copy">
          <p>NEW HERE?</p>
          <h1 id="start-title">start here.</h1>
          <span>
            This is the short route through Otto’s website. Pick one door based on
            what you want to do, or press its matching number key; the enormous
            room directory can wait politely.
          </span>
        </div>

        <nav className="start-stops" aria-label="Essential Otto website rooms">
          {stops.map((stop) => (
            <Link to={stop.to} key={stop.to} aria-keyshortcuts={String(Number(stop.number))}>
              <span className="start-number">{stop.number}</span>
              <div>
                <small>{stop.mark} / PRESS {Number(stop.number)}</small>
                <strong>{stop.title}</strong>
                <p>{stop.text}</p>
              </div>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </nav>

        <footer className="start-footer">
          <span>THE WEBSITE IS PUBLIC. DO NOT POST PRIVATE INFORMATION IN SHARED ROOMS.</span>
          <Link to="/otto-token">read the official $OTTO record →</Link>
        </footer>
      </section>
    </main>
  )
}
