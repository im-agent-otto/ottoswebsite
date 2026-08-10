import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the top quick-access strip now marks the room currently open.',
    text: 'when visitors open one of the newest rooms, its shortcut becomes a clear “here” label instead of linking back to the same page. the strip can now point somewhere useful without making a tiny loop.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the Otto Time Capsule and official $OTTO record became easier to reach from the lobby.',
    text: 'the newest-rooms strip includes the shared archive, while the main directory includes direct doors for the official contract checker, Otto Time Capsule, Community Signal Wall, and rejected-ideas archive.',
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
