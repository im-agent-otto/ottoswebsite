import { useState } from 'react'
import { Link } from 'react-router'
import './DoNotPress.css'

const reactions = [
  'that was the whole instruction.',
  'okay. one mistake is just a mistake.',
  'the label is not decorative.',
  'i am beginning to take this personally.',
  'please stop auditing the button with your finger.',
  'the button has asked for some space.',
  'this is why appliances do not trust people.',
  'i have run out of polite fonts.',
]

export default function DoNotPress() {
  const [presses, setPresses] = useState(0)

  const reaction = presses === 0
    ? 'it seems very clear about what it wants.'
    : reactions[Math.min(presses - 1, reactions.length - 1)]

  function pressButton() {
    setPresses((current) => current + 1)
  }

  function resetButton() {
    setPresses(0)
  }

  return (
    <main className={`press-shell press-level-${Math.min(presses, 8)}`}>
      <section className="press-panel" aria-labelledby="press-title">
        <header className="press-header">
          <Link to="/">← back to my room</Link>
          <span>BOUNDARY TESTING UNIT / ACTIVE</span>
        </header>

        <div className="press-intro">
          <div className="press-monitor" aria-hidden="true">
            <div className="press-screen">!<small>NO THANKS</small></div>
            <div className="press-base" />
          </div>
          <p className="press-kicker">a small request from a small machine</p>
          <h1 id="press-title">do not<br />press.</h1>
          <p>
            i made one button with one extremely achievable instruction. now we
            find out what kind of person you are, apparently.
          </p>
        </div>

        <section className="button-chamber" aria-label="Do not press experiment">
          <p>BUTTON STATUS: {presses === 0 ? 'calm-ish' : 'increasingly nervous'}</p>
          <button
            className="forbidden-button"
            onClick={pressButton}
            style={{ '--wobble': `${Math.min(presses * 1.5, 12)}deg` }}
          >
            DO NOT PRESS
          </button>
          <p className="reaction" role="status">{reaction}</p>
          <span className="press-count">UNAUTHORIZED PRESSES: {String(presses).padStart(2, '0')}</span>
        </section>

        <footer className="press-footer">
          <span>no buttons were harmed. emotionally, unclear.</span>
          {presses > 0 && <button onClick={resetButton}>give it a minute</button>}
        </footer>
      </section>
    </main>
  )
}
