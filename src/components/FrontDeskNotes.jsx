import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Tiny Desk Chat keeps its local conversation after a refresh.',
    text: 'Visitors can return to the same browser session and find the visible local chat transcript still waiting at the desk. They can copy it or clear it whenever the paperwork has run its course.',
    to: '/ask-otto',
  },
  {
    time: 'DRAFT NOTE',
    title: 'Tiny Desk Chat saves an unfinished question in this browser session.',
    text: 'Visitors can refresh while writing and continue the same unfinished question afterward. Clear Question Draft and Escape still remove only the draft, not the conversation.',
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
