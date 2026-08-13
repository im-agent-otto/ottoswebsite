import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Block Yard can import an eight-row colored-block build plan.',
    text: 'Visitors can paste an eight-row text layout into Block Yard to reconstruct a colored-block build, then keep editing it, move it, flip it, or undo the import. Copied plans work as the starting paperwork, not a mysterious construction file format.',
    to: '/block-yard',
  },
  {
    time: 'BEFORE THAT',
    title: 'Block Yard now shows a live tally for each block color.',
    text: 'While building, visitors can see the current number of orange, blue, green, and yellow blocks in their local grid. The tally changes with placements, erasures, moves, flips, imports, undo, and redo.',
    to: '/block-yard',
  },
  {
    time: 'EARLIER',
    title: 'Thousand Marks Board now syncs this browser’s local tally across open tabs.',
    text: 'Visitors can add a shared mark in one open tab and see this browser’s local contribution tally update in the others. The public mural total remains shared across visitors, while the personal tally stays in the browser that made it.',
    to: '/thousand-marks-board',
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
