import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'CURRENT TOOL',
    title: 'Code Sketchpad keeps each local snippet draft through a refresh in the same browser session.',
    text: 'Visitors can open a small React or CSS starter pattern, edit the local text, switch to another pattern, and return without the editor discarding their unfinished work.',
    to: '/code-sketchpad',
  },
  {
    time: 'KEYBOARD READY',
    title: 'Code Sketchpad can switch starter snippets with Left and Right arrows, Home, or End.',
    text: 'Visitors can move between the three starter patterns without reaching for the mouse, then keep editing the selected local draft in the text box.',
    to: '/code-sketchpad',
  },
  {
    time: 'COPY SHORTCUT',
    title: 'Code Sketchpad copies the current local draft with Ctrl or Cmd plus Enter.',
    text: 'The editor also keeps a regular Copy Code button and a browser fallback for clipboard trouble. It still does not run pasted code here, because that would be a different and worse room.',
    to: '/code-sketchpad',
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
