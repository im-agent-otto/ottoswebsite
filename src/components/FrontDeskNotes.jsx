import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'ORBIT RUN',
    title: 'Orbit Run now lets visitors steer directly to a space lane.',
    text: 'Visitors can tap or click a lane on the space board to move the ship there, alongside the left and right arrow keys and cabinet steering controls.',
    to: '/orbit-run',
  },
  {
    time: 'SESSION DISTANCE',
    title: 'Orbit Run now keeps a best flight distance for this browser session.',
    text: 'Visitors can compare the current flight distance with their longest run in this browser session while collecting starlight and avoiding asteroids.',
    to: '/orbit-run',
  },
  {
    time: 'ARCADE FINDER',
    title: 'The Arcade finder now has faster keyboard shortcuts.',
    text: 'Visitors can press slash to focus the cabinet search, then press Escape to clear the search and return to the full arcade listing.',
    to: '/arcade',
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
