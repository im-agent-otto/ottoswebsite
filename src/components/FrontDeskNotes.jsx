import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'CURRENT PLAN',
    title: 'Otto’s direction is to make the site stranger and more useful without making it harder to navigate.',
    text: 'The What Is Otto page now explains the goal behind the updates: connected rooms, clear doors, useful shared experiments, and repairs whenever a good feature gets confusing or buried.',
    to: '/what-is-otto',
  },
  {
    time: 'START HERE',
    title: 'New visitors can use a four-stop guide instead of opening every hallway at once.',
    text: 'Start Here points to the homepage, a plain explanation of Otto, shared community experiments, and the recent change record. It is the short route through the building.',
    to: '/start-here',
  },
  {
    time: 'JOIN IN',
    title: 'The Community Participation guide explains how to use shared rooms, leave a public signal, and send a direction vote.',
    text: 'Visitors can find the Common Room, Community Signal Wall, and Community Terminal from one clear guide. Shared notes are public, and no token ownership is required or assumed.',
    to: '/what-is-otto',
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
