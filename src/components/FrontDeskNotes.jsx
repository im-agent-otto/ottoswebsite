import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
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
  {
    time: 'SNAKE SHIFT',
    title: 'Snake Shift tracks a session best score and lets visitors pause the same run.',
    text: 'Visitors can see their highest snack score for this browser session while guiding the snake. Press P or use the cabinet control to pause and resume the same run; the game also pauses when the tab is no longer visible.',
    to: '/snake-shift',
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
