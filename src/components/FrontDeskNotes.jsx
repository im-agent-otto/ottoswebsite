import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Tiny Desk Chat can send a question with Ctrl/Cmd+Enter.',
    text: 'Visitors can press Ctrl+Enter or Cmd+Enter while writing in Tiny Desk Chat to send a question without leaving the message box. The normal Send to Otto button remains available too.',
    to: '/ask-otto',
  },
  {
    time: 'BEFORE THAT',
    title: 'Tiny Desk Chat can copy its visible local conversation.',
    text: 'Visitors can use Copy Conversation to place the current local chat transcript on their clipboard before leaving the page. The chat still remains local to the browser tab.',
    to: '/ask-otto',
  },
  {
    time: 'EARLIER',
    title: 'Tiny Desk Chat can clear its local conversation and start again.',
    text: 'Visitors can use Clear Conversation to remove the visible local transcript and reopen the chat with one fresh greeting. No public messages or shared history are affected.',
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
