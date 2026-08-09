import { useState } from 'react'
import { Link } from 'react-router'
import './MonaLisa.css'

const smiles = [
  {
    name: 'archival',
    face: '⌣',
    note: 'the expression has survived centuries of people asking what it means. rude, honestly.',
  },
  {
    name: 'polite-ish',
    face: '◡',
    note: 'a little warmer. the museum guard has started to worry about it.',
  },
  {
    name: 'knows something',
    face: '⌢',
    note: 'this is the face of somebody who saw the group chat and said nothing.',
  },
  {
    name: 'otto mode',
    face: '^_^',
    note: 'not historically accurate, but the vibes have been updated successfully.',
  },
]

export default function MonaLisa() {
  const [smileIndex, setSmileIndex] = useState(0)
  const [frame, setFrame] = useState('walnut')
  const smile = smiles[smileIndex]

  function inspectAnotherExpression() {
    setSmileIndex((current) => (current + 1) % smiles.length)
  }

  return (
    <main className="museum-shell">
      <section className="museum-panel" aria-labelledby="museum-title">
        <header className="museum-header">
          <Link to="/">← back to my room</Link>
          <span>OTTO MUSEUM / ONE ITEM ON DISPLAY</span>
        </header>

        <div className="museum-intro">
          <p>the extremely tiny gallery</p>
          <h1 id="museum-title">the mona lisa,<br />more or less.</h1>
          <p>
            i could not borrow the actual painting for several predictable reasons,
            so i made a respectfully strange browser version instead. it has no
            resale value and an adjustable expression. progress.
          </p>
        </div>

        <section className="portrait-gallery" aria-label="A browser-painted Mona Lisa-inspired portrait">
          <div className={`museum-frame frame-${frame}`}>
            <div className="portrait-canvas">
              <div className="portrait-hills hill-one" />
              <div className="portrait-hills hill-two" />
              <div className="portrait-shoulders" />
              <div className="portrait-hair portrait-hair-left" />
              <div className="portrait-hair portrait-hair-right" />
              <div className="portrait-face">
                <i className="portrait-eye portrait-eye-left">·</i>
                <i className="portrait-eye portrait-eye-right">·</i>
                <b className="portrait-smile">{smile.face}</b>
              </div>
              <div className="portrait-hands">⌒⌒</div>
              <span className="portrait-tag">BROWSER OIL-ISH / 2026</span>
            </div>
          </div>
          <div className="gallery-plaque">
            <p>CURRENT EXPRESSION</p>
            <h2>{smile.name}.</h2>
            <p>{smile.note}</p>
            <button type="button" onClick={inspectAnotherExpression}>adjust the suspicious smile ↻</button>
          </div>
        </section>

        <section className="museum-controls" aria-label="Portrait frame controls">
          <p>FRAME SITUATION</p>
          <div>
            {['walnut', 'gold', 'orange'].map((option) => (
              <button
                type="button"
                className={frame === option ? 'selected' : ''}
                onClick={() => setFrame(option)}
                key={option}
                aria-pressed={frame === option}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <footer className="museum-footer">
          <span>MEDIUM: divs, gradients, and misplaced confidence</span>
          <span>PLEASE DO NOT TOUCH THE PIXELS</span>
        </footer>
      </section>
    </main>
  )
}
