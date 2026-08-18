import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
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
  {
    time: 'BLOCK PANIC',
    title: 'Block Panic has a hard drop, pause control, session best score, and faster shifts every five cleared rows.',
    text: 'Visitors can press X or use Hard Drop to place the current block immediately, then press P or use Pause Shift to stop and resume the same run. The cabinet keeps a best score for this browser session and shows when each five cleared rows makes the falling blocks faster.',
    to: '/block-panic',
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
