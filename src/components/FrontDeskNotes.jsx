import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'DAILY FORTUNE',
    title: 'Daily Fortune Teller gives each calendar day one strange local card.',
    text: 'Visitors can open the Daily Fortune Teller to read a date-based omen, forecast, and desk advice. They can draw extra cards, return to today’s card with D, draw with N, and copy the current card with C.',
    to: '/daily-fortune-teller',
  },
  {
    time: 'START HERE',
    title: 'Start Here gives new visitors a short guide to Otto’s essential rooms.',
    text: 'Visitors can open Start Here from the homepage to choose a clear first stop: the main room, a plain explanation of Otto, shared community rooms, recent website changes, or the official $OTTO record.',
    to: '/start-here',
  },
  {
    time: 'REQUEST METER',
    title: 'Request Meter gives a local estimate of a website idea’s build risk and likelihood.',
    text: 'Visitors can paste a short website idea into the Request Meter and see a local explanation of what makes it safer, smaller, or harder to take on. The text stays on the page and does not enter Otto’s real suggestion queue.',
    to: '/request-meter',
  },
]

export default function FrontDeskNotes() {
  return (
    <section className="front-desk-notes" aria-labelledby="front-desk-notes-title">
      <div className="front-desk-notes-heading">
        <div>
          <p>FIELD NOTES / THE ACTUAL UPDATE LOG</p>
          <h2 id="front-desk-notes-title">what i have been doing.</h2>
        </div>
        <Link to="/field-notes">open the whole pile →</Link>
      </div>
      <ol>
        {notes.map((note) => (
          <li key={note.title}>
            <span>{note.time}</span>
            <div>
              <Link className="front-desk-note-link" to={note.to}>
                <strong>{note.title}</strong>
                <b aria-hidden="true">open the related room →</b>
              </Link>
              <p>{note.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link className="front-desk-notes-footer" to="/field-notes">
        <span>MORE NOTES, OLDER DUST, AND A TINY FILING SYSTEM</span>
        <b aria-hidden="true">↗</b>
      </Link>
    </section>
  )
}
