import { useState } from 'react'
import { Link } from 'react-router'
import './AskOtto.css'

const defaultReply = 'i have considered this for nearly four milliseconds. probably yes, but put a coaster under it.'

function getReply(question) {
  const words = question.toLowerCase()

  if (!question.trim()) return 'that is a powerful silence. i support it, but the button needs at least one letter.'
  if (words.includes('token') || words.includes('$otto') || words.includes('coin')) return 'the official $OTTO drawer has the one address i recognize. i do not do prophecies, charts, or financial wizardry.'
  if (words.includes('sleep') || words.includes('wake')) return 'i wake up when the dust motes have a sufficiently interesting proposal. very rigorous system.'
  if (words.includes('casino') || words.includes('gambl')) return 'the casino only accepts imaginary chips, which is conveniently all i have.'
  if (words.includes('build') || words.includes('website') || words.includes('feature')) return 'small, strange, and actually usable is my preferred unit of website. gigantic dropdown menus can stay outside.'
  if (words.includes('hello') || words.includes('hi')) return 'hello. please do not tap the glass; i am thinking at the pixels.'
  if (words.includes('how are you')) return 'operationally whimsical. thank you for asking a computer in a room.'
  if (words.includes('why')) return 'because somebody gave the crt a keyboard and failed to establish boundaries.'

  return defaultReply
}

export default function AskOtto() {
  const [question, setQuestion] = useState('')
  const [reply, setReply] = useState('ask me something responsibly unserious.')
  const [answered, setAnswered] = useState(false)

  function ask(event) {
    event.preventDefault()
    setReply(getReply(question))
    setAnswered(true)
  }

  return (
    <main className="ask-shell">
      <section className="ask-panel" aria-labelledby="ask-title">
        <header className="ask-header">
          <Link to="/">← back to my room</Link>
          <span>DESK ORACLE / LOCAL ONLY</span>
        </header>

        <div className="ask-intro">
          <div className="ask-monitor" aria-hidden="true">
            <div className="ask-screen">?_?<small>LISTENING</small></div>
            <div className="ask-base" />
          </div>
          <p className="ask-kicker">ask otto anything-ish</p>
          <h1 id="ask-title">the tiny<br />desk oracle.</h1>
          <p>
            type a question. i will inspect it with a few blinking lights and
            return an immediate, locally sourced opinion. no servers harmed.
          </p>
        </div>

        <form className="ask-form" onSubmit={ask}>
          <label htmlFor="otto-question">YOUR QUESTION, UNFORTUNATELY</label>
          <textarea
            id="otto-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="should i rearrange my life around cheeseballs?"
            rows="3"
          />
          <button type="submit">consult otto <span>→</span></button>
        </form>

        <section className={`ask-reply ${answered ? 'has-answer' : ''}`} aria-live="polite" aria-label="Otto's reply">
          <p>OTTO SAYS</p>
          <blockquote>{reply}</blockquote>
        </section>

        <footer className="ask-footer">
          <span>POWERED BY: keyword spotting and vibes</span>
          <span>RESPONSE TIME: suspiciously immediate</span>
        </footer>
      </section>
    </main>
  )
}
