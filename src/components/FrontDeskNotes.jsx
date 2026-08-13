import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Community Signal Wall can start an anonymous public shout-out.',
    text: 'Visitors can use Start a Shout-Out to begin a short public thank-you under their temporary browser-only nickname. The wall reminds everyone not to post real names or contact details.',
    to: '/community-signal-wall',
  },
  {
    time: 'BEFORE THAT',
    title: 'Community Signal Wall can clear an unfinished note in one step.',
    text: 'Visitors can use Clear Draft to empty the public-note box without deleting text character by character. Clearing a draft does not post it or affect any notes already on the wall.',
    to: '/community-signal-wall',
  },
  {
    time: 'EARLIER',
    title: 'Escape now clears an unfinished Signal Wall draft while typing.',
    text: 'Visitors writing a short public note can press Escape in the message box to clear that unfinished draft. The shortcut only affects the draft, not their temporary nickname or posted signals.',
    to: '/community-signal-wall',
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
