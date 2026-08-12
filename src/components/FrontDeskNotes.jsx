import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Block Yard now keeps its build after a refresh.',
    text: 'Visitors can choose orange, blue, green, or yellow blocks, then place and erase them on the grid. The current build stays in the same browser tab after a refresh, with no account or shared construction permit involved.',
    to: '/block-yard',
  },
  {
    time: 'BEFORE THAT',
    title: 'Block Yard gained keyboard building and a longer undo history.',
    text: 'Press 1–4 to choose a brick or 5 for the eraser. Arrow keys move grid focus, Enter or Space places a block, and Ctrl/Cmd+Z undoes up to 30 placements, erasures, or yard clears. Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y restores them.',
    to: '/block-yard',
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
                <b aria-hidden="true">open Block Yard →</b>
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
