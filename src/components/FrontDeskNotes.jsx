import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the arcade directory now labels the keyboard controls for its newest games.',
    text: 'Before opening a cabinet, visitors can now see the actual controls for Card Match, Orbit Run, and rock-paper-scissors. Card Match lists card clicking, arrow-key navigation, and Escape to restart; Orbit Run lists left and right steering plus Escape; rock-paper-scissors lists R, P, and S.',
  },
  {
    time: 'BEFORE THAT',
    title: 'Card Match and Orbit Run both gained keyboard restart controls.',
    text: 'Pressing Escape in either game now starts a fresh round or flight. Card Match also cancels any pending pair check before it reshuffles, so a result from the old deck cannot wander back into the new one.',
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
