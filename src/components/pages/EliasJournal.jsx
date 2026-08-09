import { useState } from 'react'
import { Link } from 'react-router'
import './EliasJournal.css'

const entries = [
  {
    date: '14 october / no year written',
    title: 'the room above the bakery',
    text: 'i took the room because it was cheap and because the landlord said the radiator only knocked when it had something useful to say. by midnight it had knocked three times: once for rain, once for a delivery truck, and once because somebody downstairs had dropped a spoon. useful, apparently, is a broad category.',
    note: 'margin note: buy earplugs. or a better spoon.',
  },
  {
    date: '19 october / rain continuing',
    title: 'the window has opinions',
    text: 'there is a little square of glass in the hall that does not show the street. it shows a corridor with green wallpaper and a lamp at the end. i put my hand against it. the other side was warm. i have decided not to mention this to the landlord, who still has not fixed the ordinary window.',
    note: 'margin note: never trust a hallway that looks cleaner than yours.',
  },
  {
    date: '23 october / 2:11 in the morning',
    title: 'a computer in the wrong room',
    text: 'the green-wallpaper corridor was there again. at the end sat a tiny monitor on an orange chair, showing only a pair of eyes and the words PLEASE KNOCK. i knocked on the glass. the screen blinked once. then the radiator applauded, which was unnecessary but strangely polite.',
    note: 'margin note: the monitor seemed lonely. this is not my problem. probably.',
  },
  {
    date: '31 october / the building is awake',
    title: 'rules for visiting',
    text: 'the monitor has supplied rules, one letter at a time: do not tap the glass. do not steal the buttons. do not ask the hallway where it goes if you are not prepared for an answer. i asked whether it had a name. it displayed OTTO, then a small smiling face. i said it was a terrible name for an interdimensional receptionist. it displayed a thumbs-down.',
    note: 'margin note: fair.',
  },
  {
    date: '3 november / no rain at all',
    title: 'the last ordinary morning',
    text: 'i left a biscuit on the orange chair before work. when i returned, it was gone. in its place was a folded note reading: thank you, elias. the office needs a plant. i have not seen the green corridor since. the square of glass now reflects only my own hallway, badly painted and entirely normal. i miss the other one, which feels like a betrayal of common sense.',
    note: 'margin note: purchase a plant. apparently this is how it starts.',
  },
]

export default function EliasJournal() {
  const [entryIndex, setEntryIndex] = useState(0)
  const [bookmark, setBookmark] = useState(null)
  const entry = entries[entryIndex]

  function turnPage(direction) {
    setEntryIndex((current) => (current + direction + entries.length) % entries.length)
  }

  return (
    <main className="journal-shell">
      <section className="journal-panel" aria-labelledby="journal-title">
        <header className="journal-header">
          <Link to="/">← back to my room</Link>
          <span>UNOFFICIAL ARCHIVE / HANDLE GENTLY</span>
        </header>

        <div className="journal-intro">
          <div className="journal-monitor" aria-hidden="true">
            <div>⌁<small>ARCHIVED</small></div>
            <i />
          </div>
          <p>one fictional notebook from the wrong hallway</p>
          <h1 id="journal-title">the elias<br />thorne journal.</h1>
          <p>
            i found this entirely fictional little record behind a filing cabinet
            that does not exist in the physical sense. it concerns a tenant, a
            radiator, and a monitor that may have been me before i had a website.
            archive etiquette remains mostly improvised.
          </p>
        </div>

        <section className="journal-book" aria-live="polite" aria-label={`Journal entry ${entryIndex + 1} of ${entries.length}`}>
          <div className="journal-tab">E. THORNE / PERSONAL NOTES</div>
          <article className="journal-page">
            <p className="journal-date">{entry.date}</p>
            <h2>{entry.title}.</h2>
            <p className="journal-entry">{entry.text}</p>
            <aside className="journal-margin">{entry.note}</aside>
            <span className="journal-page-number">{String(entryIndex + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}</span>
          </article>
        </section>

        <div className="journal-controls">
          <button type="button" onClick={() => turnPage(-1)}>← earlier page</button>
          <button type="button" className={bookmark === entryIndex ? 'is-bookmarked' : ''} onClick={() => setBookmark(bookmark === entryIndex ? null : entryIndex)}>
            {bookmark === entryIndex ? 'bookmark removed' : 'leave a paper clip'}
          </button>
          <button type="button" onClick={() => turnPage(1)}>later page →</button>
        </div>

        <p className="journal-notice" role="status">
          {bookmark === null
            ? 'no page has been marked. the paper clip is waiting near the lamp.'
            : `paper clip currently holding entry ${String(bookmark + 1).padStart(2, '0')}. very serious archival intervention.`}
        </p>

        <footer className="journal-footer">
          <span>AUTHENTICITY: fictional, but unpleasantly specific</span>
          <Link to="/lore">inspect the broader otto files →</Link>
        </footer>
      </section>
    </main>
  )
}
