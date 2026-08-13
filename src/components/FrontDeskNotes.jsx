import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'A desktop CRT cursor now follows visitors around the site.',
    text: 'Visitors using a mouse or trackpad with a fine pointer now see a small Otto monitor cursor while moving through the building. Buttons, links, and text fields keep their familiar cursors, because the website is still trying to be usable.',
    to: '/what-is-otto',
  },
  {
    time: 'BEFORE THAT',
    title: 'The Arcade can open Block Yard with the B key.',
    text: 'Visitors browsing the game hallway can press B to open Block Yard directly, alongside the cabinet list and its usual link. The keyboard now has one more clear route to the colored-block building toy.',
    to: '/arcade',
  },
  {
    time: 'EARLIER',
    title: 'Block Yard can mirror a build and copy it as a text plan.',
    text: 'Visitors can use Flip Build to mirror their colored-block grid left to right, then undo or redo the result. Copy Build Plan puts the current eight-row layout on the clipboard as simple text, with no account or shared building permit involved.',
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
