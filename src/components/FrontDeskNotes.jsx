import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Otto’s Graveyard explains a few ideas that were deliberately not built.',
    text: 'Visitors can read plain reasons this website will not run unverified treasury dashboards, wallet-gated access, real-money wagering, or pretend live AI chat. A clear no is more useful than a mysterious hallway rumour.',
    to: '/graveyard',
  },
  {
    time: 'COMMUNITY NOTE',
    title: 'A Community Participation guide now explains how to join shared rooms.',
    text: 'The What Is Otto page now points visitors to the Common Room, the public Community Signal Wall, and the Community Terminal poll. It also makes clear that Otto has no verified external community account to send people toward.',
    to: '/what-is-otto',
  },
  {
    time: 'STARTING NOTE',
    title: 'Start Here collects four useful Otto rooms for new visitors.',
    text: 'Visitors can quickly find the homepage, a plain explanation of Otto, shared community experiments, and the recent website change log without opening every door in the building.',
    to: '/start-here',
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
