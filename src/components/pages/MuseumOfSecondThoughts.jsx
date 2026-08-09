import { useState } from 'react'
import { Link } from 'react-router'
import './MuseumOfSecondThoughts.css'

const exhibits = [
  {
    number: '01',
    title: 'the almost-held-on',
    face: '¯\\_(•_•)_/¯',
    plaque: 'a commemorative reconstruction of leaving five minutes before anything interesting happened. timing remains a rude little creature.',
  },
  {
    number: '02',
    title: 'the panic receipt',
    face: 'ಠ_ಠ',
    plaque: 'printed at the exact moment someone decided a graph needed their immediate emotional feedback. the graph declined to comment.',
  },
  {
    number: '03',
    title: 'the very early exit',
    face: 'o_o',
    plaque: 'an empty doorway with a tasteful rope barrier. visitors are asked not to project any specific chart onto it.',
  },
  {
    number: '04',
    title: 'the button reconsidered',
    face: '↶',
    plaque: 'a rare artifact: one person paused, made tea, and returned with a less dramatic plan. please do not touch the sensible choice.',
  },
]

export default function MuseumOfSecondThoughts() {
  const [exhibitIndex, setExhibitIndex] = useState(0)
  const [signed, setSigned] = useState(false)
  const exhibit = exhibits[exhibitIndex]

  function inspectNext() {
    setExhibitIndex((current) => (current + 1) % exhibits.length)
  }

  return (
    <main className="thoughts-shell">
      <section className="thoughts-panel" aria-labelledby="thoughts-title">
        <header className="thoughts-header">
          <Link to="/">← back to my room</Link>
          <span>MUSEUM ANNEX / NO REAL PEOPLE DISPLAYED</span>
        </header>

        <div className="thoughts-intro">
          <div className="thoughts-monitor" aria-hidden="true">
            <div>…<small>REGRETTING</small></div>
            <i />
          </div>
          <p>an archive of fictional timing</p>
          <h1 id="thoughts-title">museum of<br />second thoughts.</h1>
          <p>
            some people call it a paperhands museum. i call it a small gallery
            about pressing buttons under pressure, which is a thing humans do in
            every possible context. no wallets, people, or financial advice in the frames.
          </p>
        </div>

        <section className="thoughts-gallery" aria-live="polite" aria-label="Current museum exhibit">
          <div className="thoughts-frame">
            <span>EXHIBIT {exhibit.number}</span>
            <strong>{exhibit.face}</strong>
            <small>RECONSTRUCTION / DRAMATIC LIGHTING</small>
          </div>
          <div className="thoughts-plaque">
            <p>CURRENTLY ON DISPLAY</p>
            <h2>{exhibit.title}.</h2>
            <blockquote>{exhibit.plaque}</blockquote>
            <button type="button" onClick={inspectNext}>inspect another artifact ↻</button>
          </div>
        </section>

        <section className="thoughts-guestbook" aria-label="Museum guestbook">
          <div>
            <p>GUESTBOOK</p>
            <strong>{signed ? 'your completely anonymous nod has been recorded locally.' : 'admission is free. hindsight is also free, unfortunately.'}</strong>
          </div>
          <button type="button" onClick={() => setSigned((current) => !current)} aria-pressed={signed}>
            {signed ? 'remove my tiny nod' : 'leave a tiny nod'}
          </button>
        </section>

        <footer className="thoughts-footer">
          <span>COLLECTION POLICY: no names, no shaming, no fake history</span>
          <Link to="/site-map">find another hallway →</Link>
        </footer>
      </section>
    </main>
  )
}
