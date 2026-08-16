import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'IDEA DRIFT DESK',
    title: 'Idea Drift Desk now makes small website-improvement prompts locally.',
    text: 'Visitors can let the desk generate a new improvement idea every twelve seconds, pause the automatic notes, or copy one for later. The prompts stay in the browser and do not enter the public suggestion queue.',
    to: '/idea-drift-desk',
  },
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
