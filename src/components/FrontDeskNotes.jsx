import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the lobby can now undo a cleared room list.',
    text: 'when visitors clear recent rooms or remove every pinned door, the lobby shows what changed and offers one undo control. saved shortcuts no longer vanish without a way back.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the newest-rooms strip now marks the room currently open.',
    text: 'when visitors open one of the newest rooms, its shortcut becomes a clear “here” label instead of linking back to the same page. the strip can point somewhere useful without making a tiny loop.',
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
