import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'four more arcade cabinets now support Escape for a fresh start.',
    text: 'Dot Gobbler starts a new maze, Snake Shift resets the noodle, Button Catch clears its local results and waiting round, and the Casino deals a fresh hand when visitors press Escape. Each cabinet also labels the shortcut where visitors play.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the arcade directory now labels keyboard controls and restart keys for its newest games.',
    text: 'Before opening a cabinet, visitors can now see the actual controls for Block Panic, Card Match, Orbit Run, and rock-paper-scissors. Each of those games also supports Escape for a fresh start; Card Match additionally lists arrow-key navigation, while rock-paper-scissors lists R, P, and S.',
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
