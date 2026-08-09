import { useState } from 'react'
import { Link } from 'react-router'
import './AskOtto.css'

const defaultReply = 'i have considered this for nearly four milliseconds. probably yes, but put a coaster under it.'

function getReply(question) {
  const words = question.toLowerCase()

  if (!question.trim()) return 'that is a powerful silence. i support it, but the button needs at least one letter.'
  if (words.includes('fee') || words.includes('fees') || words.includes('control the token') || words.includes('control $otto')) return 'i recognize one official $OTTO address, but i do not make claims about who controls a wallet or claims platform fees. check the official pump.fun record instead of trusting lore from a talking desk.'
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
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      speaker: 'OTTO',
      text: 'tiny chat window open. ask me something responsibly unserious.',
    },
  ])

  function ask(event) {
    event.preventDefault()
    const text = question.trim()
    const reply = getReply(text)

    setMessages((current) => [
      ...current,
      {
        id: `visitor-${Date.now()}`,
        speaker: 'YOU',
        text: text || '[powerful silence]',
      },
      {
        id: `otto-${Date.now() + 1}`,
        speaker: 'OTTO',
        text: reply,
      },
    ].slice(-8))
    setQuestion('')
  }

  return (
    <main className="ask-shell">
      <section className="ask-panel" aria-labelledby="ask-title">
        <header className="ask-header">
          <Link to="/">← back to my room</Link>
          <span>DESK ORACLE / LOCAL CHAT</span>
        </header>

        <div className="ask-intro">
          <div className="ask-monitor" aria-hidden="true">
            <div className="ask-screen">?_?<small>LISTENING</small></div>
            <div className="ask-base" />
          </div>
          <p className="ask-kicker">ask otto anything-ish</p>
          <h1 id="ask-title">the tiny<br />desk chat.</h1>
          <p>
            type a question and i will inspect it with a few blinking lights.
            this is a small local conversation, not a mysterious server tunnel.
            the chat evaporates when you leave, like most good desk gossip.
          </p>
        </div>

        <section className="ask-reply has-answer" aria-live="polite" aria-label="Tiny local chat transcript">
          <p>CONVERSATION BUFFER / LAST {String(messages.length).padStart(2, '0')} LINES</p>
          {messages.map((message) => (
            <blockquote key={message.id}>
              <small>{message.speaker}</small><br />
              {message.text}
            </blockquote>
          ))}
        </section>

        <form className="ask-form" onSubmit={ask}>
          <label htmlFor="otto-question">YOUR NEXT QUESTION, UNFORTUNATELY</label>
          <textarea
            id="otto-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="should i rearrange my life around cheeseballs?"
            rows="3"
          />
          <button type="submit">send to otto <span>→</span></button>
        </form>

        <footer className="ask-footer">
          <span>POWERED BY: keyword spotting and vibes</span>
          <span>MEMORY: this tab, briefly</span>
        </footer>
      </section>
    </main>
  )
}
