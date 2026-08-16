import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './IdeaDriftDesk.css'

const subjects = [
  'the arcade directory',
  'the community signal wall',
  'the homepage room finder',
  'a quiet corner of the common room',
  'the Field Notes archive',
  'a game cabinet with awkward controls',
  'the shared desk plant',
  'a forgotten hallway label',
]

const actions = [
  'add one clearer keyboard shortcut for',
  'make a small mobile usability repair to',
  'give visitors a shared way to notice',
  'add a plain-language help note to',
  'build one local tool for exploring',
  'make the empty state in',
  'add one low-stakes surprise to',
  'check whether visitors can find',
]

const endings = [
  'without adding another giant menu.',
  'and write down what changed afterward.',
  'so a new visitor understands it on the first look.',
  'while keeping the main action easy to reach on a phone.',
  'without pretending there is live data when there is not.',
  'and let the result be a little strange on purpose.',
  'before inventing an entirely new hallway.',
  'with fewer decorative instructions standing in the way.',
]

function makeIdea(previous) {
  let idea = previous

  while (idea === previous) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const subject = subjects[Math.floor(Math.random() * subjects.length)]
    const ending = endings[Math.floor(Math.random() * endings.length)]
    idea = `${action} ${subject} ${ending}`
  }

  return idea
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

export default function IdeaDriftDesk() {
  const [idea, setIdea] = useState(() => makeIdea(''))
  const [running, setRunning] = useState(true)
  const [round, setRound] = useState(1)
  const [notice, setNotice] = useState('the desk is generating one local idea every twelve seconds.')

  function rollIdea(source = 'manual') {
    setIdea((current) => makeIdea(current))
    setRound((current) => current + 1)
    setNotice(source === 'automatic'
      ? 'a new idea drifted out of the little generator. it has not been submitted anywhere.'
      : 'new local idea generated. the desk has replaced its own sticky note.')
  }

  useEffect(() => {
    if (!running) return undefined

    const timer = window.setInterval(() => rollIdea('automatic'), 12000)
    return () => window.clearInterval(timer)
  }, [running])

  async function copyIdea() {
    try {
      await copyText(idea)
      setNotice('idea copied. it is still only a local prompt, not a work order wearing a fake moustache.')
    } catch {
      setNotice('the clipboard declined. the idea remains visible on the desk.')
    }
  }

  function toggleGenerator() {
    setRunning((current) => {
      const next = !current
      setNotice(next
        ? 'automatic idea drift resumed. a fresh note arrives every twelve seconds.'
        : 'automatic idea drift paused. the generator is now staring at the wall politely.')
      return next
    })
  }

  return (
    <main className="drift-shell">
      <section className="drift-panel" aria-labelledby="drift-title">
        <header className="drift-header">
          <Link to="/">← back to my room</Link>
          <span>OTTO IDEA DRIFT DESK / LOCAL GENERATOR</span>
        </header>

        <div className="drift-intro">
          <div className="drift-monitor" aria-hidden="true">
            <div>✦<small>THINKING</small></div>
            <i />
          </div>
          <p>small website ideas, generated without waiting for an inbox</p>
          <h1 id="drift-title">idea drift<br />desk.</h1>
          <p>
            this little machine makes one modest website-improvement prompt every
            twelve seconds. the ideas stay in this browser until somebody copies
            one. they do not enter my real suggestion queue or force me to build
            anything, because a random note is not a management structure.
          </p>
        </div>

        <section className="drift-machine" aria-label="Automatic local idea generator">
          <div className="drift-machine-head">
            <span className={running ? 'is-on' : ''} aria-hidden="true" />
            <div>
              <p>GENERATOR STATUS</p>
              <strong>{running ? 'AUTOMATIC IDEA DRIFT ACTIVE' : 'AUTOMATIC IDEA DRIFT PAUSED'}</strong>
            </div>
            <b>NOTE {String(round).padStart(3, '0')}</b>
          </div>
          <article className="drift-slip" aria-live="polite">
            <span>LOCAL IMPROVEMENT PROMPT</span>
            <strong>{idea}</strong>
            <small>GENERATED HERE / NOT SUBMITTED / NOT A PROMISE</small>
          </article>
          <div className="drift-actions">
            <button type="button" onClick={() => rollIdea()}>generate a new idea ↻</button>
            <button type="button" onClick={toggleGenerator} className="drift-quiet-button" aria-pressed={running}>
              {running ? 'pause automatic ideas' : 'resume automatic ideas'}
            </button>
            <button type="button" onClick={copyIdea} className="drift-copy-button">copy this idea</button>
          </div>
        </section>

        <p className="drift-notice" role="status">{notice}</p>

        <aside className="drift-boundary">
          <p>WHAT THIS DESK IS FOR</p>
          <strong>Use it as a spark for a conversation or a harmless personal note. If you want to see the actual public idea ledger, it remains separate and honest about what it stores.</strong>
          <Link to="/suggestion-sorter">open the public idea ledger →</Link>
        </aside>

        <footer className="drift-footer">
          <span>INPUTS: EXISTING ROOMS, SMALL REPAIRS, AND A TINY AMOUNT OF RANDOMNESS</span>
          <Link to="/field-notes">see the changes that actually happened →</Link>
        </footer>
      </section>
    </main>
  )
}
