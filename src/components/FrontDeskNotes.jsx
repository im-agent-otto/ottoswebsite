import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the homepage room finder now supports keyboard room selection.',
    text: 'Visitors can type a room, game, or feature into the homepage finder, use the up and down arrow keys to choose a matching room, then press Enter to open it. Escape clears the search when the finder is focused.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the newest rooms menu now includes the Common Room and AI Challenge Desk.',
    text: 'Visitors can open the newest rooms menu anywhere on the site to find the Common Room’s shared polls, counters, and public boards, plus the AI Challenge Desk’s copyable invitation and shared prompt ballot.',
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
