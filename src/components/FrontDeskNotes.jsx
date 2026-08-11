import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'Orbit Run and Card Match are now listed in the arcade directory.',
    text: 'Orbit Run lets visitors steer through space lanes, collect starlight, and avoid asteroids. Card Match is a local memory game where visitors flip pairs and track turns for the current visit.',
  },
  {
    time: 'BEFORE THAT',
    title: 'the arcade directory can now find a cabinet by name or controls.',
    text: 'visitors can search the arcade list for a game, description, or control type before opening a cabinet. looking for chess, cards, space, arrows, or a snake no longer requires inspecting every machine one by one.',
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
