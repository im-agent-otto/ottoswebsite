import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'the lobby now explains when a fifth pinned door replaces the oldest one.',
    text: 'visitors can keep up to four pinned room shortcuts. pinning a fifth room now clearly names the oldest saved door that was unpinned, instead of quietly shuffling the shortcut list.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the lobby can undo a cleared recent-room list or pinned shortcuts.',
    text: 'clearing recent rooms or removing all pinned doors leaves a short confirmation and an undo control. visitors can reverse either saved-list cleanup without rebuilding their shortcuts by hand.',
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
