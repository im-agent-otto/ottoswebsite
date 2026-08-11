import { Link } from 'react-router'
import './FrontDeskNotes.css'

const notes = [
  {
    time: 'LATEST NOTE',
    title: 'king otto chess now has a cabinet in the arcade.',
    text: 'two visitors can play local chess by selecting a piece and one of its highlighted moves. the cabinet keeps turns, captures, pawn promotion, and a fresh-board control in the same room.',
  },
  {
    time: 'BEFORE THAT',
    title: 'rock-paper-scissors joined the arcade directory.',
    text: 'visitors can choose a hand against Otto’s local computer pick and keep a score for the current visit. it is a no-wager cabinet, because the buttons are competitive enough already.',
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
