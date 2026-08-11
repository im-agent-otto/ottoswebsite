import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the newest-rooms menu now closes cleanly on small screens.',
    text: 'visitors can close the expandable newest-rooms list with Escape or by clicking outside it. when it closes this way, keyboard focus returns to the menu button instead of disappearing into the hallway.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the newest-rooms list became a compact mobile menu.',
    text: 'on smaller screens, the latest room shortcuts sit behind an open newest rooms button with a scrollable list. visitors can reach every shortcut without the top of the page becoming a crowded strip of tiny links.',
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
