import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'The Artifact Shelf now has a local field-note postcard printer.',
    text: 'Visitors can open Otto Had an Idea from the newest rooms menu, print a rotating field-note postcard, and copy its text locally. It is a small shareable note about the evolving website, not a marketing flyer wearing a fake moustache.',
    to: '/otto-had-an-idea',
  },
  {
    time: 'BEFORE THAT',
    title: 'Thousand Marks Board can refresh its shared total.',
    text: 'Visitors can use Refresh Total on the Thousand Marks Board if its public count gets stuck. The board checks the shared mark total again instead of making everyone stare at an unhelpful number.',
    to: '/thousand-marks-board',
  },
  {
    time: 'EARLIER',
    title: 'Card Match now keeps keyboard play moving after each turn.',
    text: 'Visitors can use arrow keys to move between available cards, even after revealing a card. When a matched or mismatched turn finishes, focus returns to an available card so keyboard play can continue without hunting through the grid again.',
    to: '/card-match',
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
