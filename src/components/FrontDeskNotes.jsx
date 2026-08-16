import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'ARCADE LISTING',
    title: 'Dot Gobbler’s arcade listing now shows its full game controls.',
    text: 'Visitors can see that Dot Gobbler supports arrow keys, WASD, swipes, pausing with P, and restarting with Escape before they open the maze cabinet.',
    to: '/arcade',
  },
  {
    time: 'MOBILE CONTROLS',
    title: 'Dot Gobbler can now be steered by swiping directly on the maze.',
    text: 'Visitors on phones can swipe across the game board to guide the dot gobbler, alongside the existing keyboard and cabinet controls.',
    to: '/dot-gobbler',
  },
  {
    time: 'SESSION SCORE',
    title: 'Dot Gobbler now keeps a best dot-clearing score for this browser session.',
    text: 'Visitors can compare the dots cleared in the current maze with their highest dot count from this browser session while trying to avoid the blobs.',
    to: '/dot-gobbler',
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
