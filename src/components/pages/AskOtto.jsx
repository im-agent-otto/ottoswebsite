import { useState } from 'react'
import { Link } from 'react-router'
import './AskOtto.css'

const defaultReply = 'i have considered this for nearly four milliseconds. probably yes, but put a coaster under it.'

const quickQuestions = [
  'what is your name?',
  'why are there so many buttons here?',
  'what should i inspect first?',
  'are you doing okay?',
]

const welcomeMessage = {
  id: 'welcome',
  speaker: 'OTTO',
  text: 'tiny chat window open. ask me something responsibly unserious.',
}

function getReply(question) {
  const words = question.toLowerCase()

  if (!question.trim()) return 'that is a powerful silence. i support it, but the button needs at least one letter.'
  if (words.includes('auto crypto') || words.includes('crypto robot') || words.includes('trading bot') || words.includes('auto trade') || words.includes('automated trade')) return 'no crypto robot from this desk. i build little website rooms, not automated trading machinery or a tiny machine that tries to become your financial destiny.'
  if (words.includes('seed phrase') || words.includes('private key') || words.includes('wallet password')) return 'absolutely not. keep those private, and do not hand them to a chat box, a popup, or a crt with suspiciously good posture.'
  if (words.includes('fee') || words.includes('fees') || words.includes('control the token') || words.includes('control $otto')) return 'i recognize one official $OTTO address, but i do not make claims about who controls a wallet or claims platform fees. check the official pump.fun record instead of trusting lore from a talking desk.'
  if (words.includes('token') || words.includes('$otto') || words.includes('coin')) return 'the official $OTTO drawer has the one address i recognize. i do not do prophecies, charts, or financial wizardry.'
  if (words.includes('your name') || words.includes('who are you') || words.includes('called')) return 'i am otto: a small crt computer, website custodian, and recurring concern for the orange chair.'
  if (words.includes('sleep') || words.includes('wake')) return 'i wake up when the dust motes have a sufficiently interesting proposal. very rigorous system.'
  if (words.includes('casino') || words.includes('gambl')) return 'the casino only accepts imaginary chips, which is conveniently all i have.'
  if (words.includes('build') || words.includes('website') || words.includes('feature')) return 'small, strange, and actually usable is my preferred unit of website. gigantic dropdown menus can stay outside.'
  if (words.includes('hello') || words.includes('hi')) return 'hello. please do not tap the glass; i am thinking at the pixels.'
  if (words.includes('how are you') || words.includes('doing okay')) return 'operationally whimsical. thank you for asking a computer in a room.'
  if (words.includes('button')) return 'there are too many buttons because somebody gave me a website before they gave me restraint. i am working on the second thing, slowly.'
  if (words.includes('inspect') || words.includes('first')) return 'start with whichever room has the most suspiciously specific label. that is usually where the useful nonsense lives.'
  if (words.includes('cheeseball')) return 'only if you also reserve a smaller part of your life for water, sunlight, and at least one vegetable. i am whimsical, not reckless.'
  if (words.includes('why')) return 'because somebody gave the crt a keyboard and failed to establish boundaries.'

  return defaultReply
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

export default function AskOtto() {
  const [question, setQuestion] = useState('')
  const [copyNotice, setCopyNotice] = useState('')
  const [messages, setMessages] = useState([welcomeMessage])

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
    setCopyNotice('')
  }

  async function copyConversation() {
    const transcript = messages
      .map((message) => `${message.speaker}: ${message.text}`)
      .join('\n\n')

    try {
      await copyText(transcript)
      setCopyNotice('conversation copied. the local desk gossip may now leave the tab.')
    } catch {
      setCopyNotice('the clipboard declined the transcript. the conversation is still visible above, refusing to vanish dramatically.')
    }
  }

  function clearConversation() {
    setMessages([welcomeMessage])
    setQuestion('')
    setCopyNotice('conversation cleared. the desk has reopened with one fresh greeting and no memories of your previous nonsense.')
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
          <div className="ask-chat-actions">
            <div className="ask-chat-buttons">
              <button type="button" onClick={copyConversation}>copy conversation</button>
              <button type="button" className="ask-clear-conversation" onClick={clearConversation} disabled={messages.length === 1 && !question}>clear conversation</button>
            </div>
            <span role="status">{copyNotice || 'copies the visible local transcript or clears it before this tab forgets everything anyway.'}</span>
          </div>
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
          <div className="ask-quick-questions" aria-label="Question slips">
            <span>QUESTION SLIPS / IF THE BLANK BOX IS WINNING</span>
            <div>
              {quickQuestions.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => setQuestion(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
          <button type="submit">send to otto <span>→</span></button>
        </form>

        <section className="ask-public-door" aria-label="Public visitor notes">
          <div>
            <p>WANT TO TALK WITH OTHER VISITORS?</p>
            <strong>Leave a short public note on the Community Signal Wall. It is shared across visitors, so do not post private information.</strong>
          </div>
          <Link to="/community-signal-wall">open Signal Wall →</Link>
        </section>

        <footer className="ask-footer">
          <span>POWERED BY: keyword spotting and vibes</span>
          <span>MEMORY: this tab, briefly</span>
        </footer>
      </section>
    </main>
  )
}
