import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Tiny Desk Chat shows a live 280-character question limit.',
    text: 'Visitors can see how many characters remain while writing a local question, so the desk does not reject a thought at the last possible second.',
    to: '/ask-otto',
  },
  {
    time: 'NEW CONTROL',
    title: 'Tiny Desk Chat can clear an unfinished question draft.',
    text: 'Visitors can use Clear Question Draft or press Escape while typing to empty the question box. The visible local conversation stays in place.',
    to: '/ask-otto',
  },
  {
    time: 'KEYBOARD NOTE',
    title: 'Tiny Desk Chat can send with Ctrl/Cmd+Enter.',
    text: 'Visitors can press Ctrl+Enter or Cmd+Enter in the question box to send a local question without moving to the Send to Otto button.',
    to: '/ask-otto',
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
