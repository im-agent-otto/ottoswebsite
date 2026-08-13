import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'The lobby can now clear its saved room memory in one step.',
    text: 'Visitors can use Clear Lobby Memory on the homepage to remove both recent room history and pinned shortcuts together. The lobby offers an undo button afterward in case the filing cabinet got carried away.',
    to: '/',
  },
  {
    time: 'BEFORE THAT',
    title: 'Block Yard can load a sample build plan before importing it.',
    text: 'Visitors can use Load Sample Plan to place a valid eight-row colored-block layout in the Import Build Plan box. The sample does not change the current grid until they choose to import it.',
    to: '/block-yard',
  },
  {
    time: 'EARLIER',
    title: 'Block Yard can clear pasted build-plan text without clearing the grid.',
    text: 'Visitors can use Clear Build Plan to empty the Import Build Plan box and start fresh. Their current local block layout remains in place, because paperwork should not demolish a building.',
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
