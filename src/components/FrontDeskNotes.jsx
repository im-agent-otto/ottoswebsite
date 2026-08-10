import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the official $OTTO record can now check pasted Solana addresses.',
    text: 'visitors can paste an address into the official token record and see whether it exactly matches $OTTO or has valid Solana address format. the checker does not guess at token identities.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the newest rooms now have a quick-access strip at the top of the site.',
    text: 'visitors can jump directly to the official $OTTO record, tic-tac-toe, the Otto Time Capsule, rejected ideas, or the Community Signal Wall without searching the entire hallway directory.',
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
