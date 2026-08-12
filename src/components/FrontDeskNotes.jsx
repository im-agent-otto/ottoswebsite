import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the Casino now settles natural blackjack hands immediately.',
    text: 'When the opening deal gives either side blackjack, the table now shows a win, dealer win, or tie right away. Visitors do not need to keep playing a hand that has already finished.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the newest rooms menu now includes a direct $OTTO charts shortcut.',
    text: 'Visitors can open the newest rooms menu anywhere on the site and choose “open $OTTO charts” to reach the live market chart without digging through the full room directory.',
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
