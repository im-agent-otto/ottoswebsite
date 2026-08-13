import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Thousand Marks Board now syncs this browser’s local tally across open tabs.',
    text: 'Visitors can add a shared mark in one open tab and see this browser’s local contribution tally update in the others. The public mural total remains shared across visitors, while the personal tally stays in the browser that made it.',
    to: '/thousand-marks-board',
  },
  {
    time: 'BEFORE THAT',
    title: 'Thousand Marks Board shows this browser’s local contribution tally.',
    text: 'Alongside the public mural total, visitors can see how many marks this browser has added. It is a local count, not a profile, rank, or claim on the whole wall.',
    to: '/thousand-marks-board',
  },
  {
    time: 'EARLIER',
    title: 'The Thousand Marks Board joined the Common Room directory.',
    text: 'Visitors can find the shared 1,000-mark mural with the other community experiments, then add one mark toward the collective board. The wall still has no login booth, because that would be a strange amount of paperwork for one square.',
    to: '/common-room',
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
