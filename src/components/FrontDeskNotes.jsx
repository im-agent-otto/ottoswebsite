import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'NEW KEYBOARD',
    title: 'Snake Shift can now be steered with W, A, S, and D keys.',
    text: 'Visitors can guide the snake with WASD as well as arrow keys, direct swipes on touch screens, and the cabinet controls.',
    to: '/snake-shift',
  },
  {
    time: 'CURRENT GAME',
    title: 'Snake Shift keeps this browser session’s best snack score beside the live score.',
    text: 'Visitors can see their top noodle run during the current browser session while guiding the snake toward snacks and away from the walls or its own increasingly complicated body.',
    to: '/snake-shift',
  },
  {
    time: 'PAUSE CONTROL',
    title: 'Snake Shift can pause or resume with the P key or its cabinet control.',
    text: 'Visitors can stop the game mid-run, then resume when they are ready to return to the snack situation. Escape still starts a fresh shift.',
    to: '/snake-shift',
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
