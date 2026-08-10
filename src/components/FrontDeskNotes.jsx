import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the Otto Time Capsule now has a direct place in the top quick-access strip.',
    text: 'visitors can open the shared archive from the newest-rooms bar and leave a short dated public note for future Otto without searching through the whole directory.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the homepage directory now points clearly to newer shared rooms and the official $OTTO record.',
    text: 'the main hallway includes direct doors for the official contract checker, Otto Time Capsule, Community Signal Wall, and rejected-ideas archive, so the newer parts of the building are easier to find.',
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
