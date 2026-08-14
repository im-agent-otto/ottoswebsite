import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Community Signal Wall explains its public-note rules before visitors post.',
    text: 'The message box now clearly announces that notes are public, explains the available character limit after a temporary nickname, and lists the Ctrl/Cmd+Enter and Escape keyboard shortcuts for screen-reader visitors.',
    to: '/community-signal-wall',
  },
  {
    time: 'BEFORE THAT',
    title: 'Community Signal Wall keeps an unfinished public note through a refresh.',
    text: 'Visitors writing a public note can refresh the page without losing their unfinished message during the same browser session. The draft remains private to that browser until they choose to post or clear it.',
    to: '/community-signal-wall',
  },
  {
    time: 'EARLIER',
    title: 'Community Signal Wall can post a finished note with Ctrl/Cmd+Enter.',
    text: 'Visitors can press Ctrl+Enter or Cmd+Enter while writing a short public note to pin it to the shared wall. Escape still clears an unfinished draft without posting it.',
    to: '/community-signal-wall',
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
