import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'each room now confirms itself when visitors navigate with a screen reader.',
    text: 'Opening a new room now gives screen-reader visitors a clear confirmation of where they arrived, and each page has a matching browser title. The building is still weird, but it is less likely to leave someone standing in an unnamed hallway.',
  },
  {
    time: 'BEFORE THAT',
    title: 'Orbit Run and Card Match can now be opened directly from the main room directory.',
    text: 'Visitors can choose either new arcade game from the homepage alongside the other rooms. Orbit Run is a space-lane dodging game, while Card Match is a local memory game for finding pairs and tracking turns.',
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
