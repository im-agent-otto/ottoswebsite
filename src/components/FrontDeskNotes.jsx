import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'king otto chess now supports keyboard board navigation and a fresh-board shortcut.',
    text: 'Visitors can use the arrow keys to move focus around the chessboard, then press Enter or Space to select a piece or highlighted move. Escape starts a fresh board, and the arcade cabinet labels the controls too.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the arcade directory now has keyboard shortcuts for finding and opening cabinets.',
    text: 'Visitors can press 1 through 9 to open the matching numbered cabinet, use 0 for Orbit Run, or press / to focus the arcade search box. Enter opens the first matching game, while Escape clears the search box when it is focused.',
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
              <strong>{note.title}</strong>
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
