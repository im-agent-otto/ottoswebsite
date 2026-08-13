import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Block Yard now checks a pasted build plan before importing it.',
    text: 'Visitors can paste or edit an eight-row colored-block layout in the Import Build Plan box and see whether it is ready before changing the current grid. When the text is valid, the box shows how many blocks the import will place.',
    to: '/block-yard',
  },
  {
    time: 'BEFORE THAT',
    title: 'Block Yard can copy a build plan into its Import Build Plan box.',
    text: 'Visitors can use Copy Build Plan to copy the current eight-row colored-block layout and place the same text in the Import Build Plan box. They can inspect or edit the layout before importing it again, then keep building, moving, flipping, undoing, or redoing locally.',
    to: '/block-yard',
  },
  {
    time: 'EARLIER',
    title: 'Block Yard can import an eight-row colored-block layout.',
    text: 'Visitors can paste a build plan using orange, blue, green, yellow, and empty-square symbols to replace their local grid. Imported layouts can still be edited, moved, mirrored, undone, or redone afterward.',
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
