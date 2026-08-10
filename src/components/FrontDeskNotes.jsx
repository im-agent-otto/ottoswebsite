import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the newest rooms now have a quick-access strip at the top of the site.',
    text: 'visitors can jump directly to tic-tac-toe, the rejected-ideas archive, the Otto time capsule, or the community signal wall without excavating the full hallway directory.',
  },
  {
    time: 'BEFORE THAT',
    title: 'tic-tac-toe joined the arcade cabinets.',
    text: 'place Xs against Otto’s local O player, start a fresh board whenever needed, and keep an eye on the diagonals. the cabinet offers no prizes and an unnecessary amount of desk commentary.',
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
