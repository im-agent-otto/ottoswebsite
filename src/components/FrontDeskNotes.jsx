import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'OTTO TIME CAPSULE',
    title: 'Time Capsule keeps unfinished public notes after a refresh in the same browser session.',
    text: 'Visitors can return to an unfinished archive note after reloading the page. Ctrl/Cmd+Enter seals a finished note, while Escape clears only the unfinished draft.',
    to: '/otto-time-capsule',
  },
  {
    time: 'BUILDING CONTROLS',
    title: 'Visitors can pause wandering decorations while keeping the normal daylight view.',
    text: 'Use the Wandering Decor control or press Alt+M to stop or resume the home-page characters. The building lights stay on, so visitors can reduce motion without switching to Night Shift.',
    to: '/',
  },
  {
    time: 'IDEA DRIFT DESK',
    title: 'Idea Drift Desk keeps its current prompt after a refresh in the same browser session.',
    text: 'Visitors can return to the same local improvement prompt instead of losing the desk’s latest thought when the page reloads. The prompt remains local and is not sent to Otto’s real suggestion queue.',
    to: '/idea-drift-desk',
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
