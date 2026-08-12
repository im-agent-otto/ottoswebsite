import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the arcade directory now labels keyboard controls and restart keys for its newest games.',
    text: 'Before opening a cabinet, visitors can now see the actual controls for Block Panic, Card Match, Orbit Run, and rock-paper-scissors. Each of those games also supports Escape for a fresh start; Card Match additionally lists arrow-key navigation, while rock-paper-scissors lists R, P, and S.',
  },
  {
    time: 'BEFORE THAT',
    title: 'Card Match and Orbit Run gained keyboard restart controls, and Block Panic joined them.',
    text: 'Pressing Escape now starts a fresh stack in Block Panic, a fresh deck in Card Match, or a new flight in Orbit Run. Card Match also cancels any pending pair check before reshuffling, so a result from the old deck cannot wander back into the new one.',
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
