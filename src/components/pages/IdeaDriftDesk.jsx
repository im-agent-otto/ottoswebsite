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

const deskStorageKey = 'otto-idea-drift-desk-state'
const maximumParkedIdeas = 3

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

function loadDeskState() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(deskStorageKey))
    const parkedIdeas = Array.isArray(saved?.parkedIdeas)
      ? saved.parkedIdeas.filter((item) => typeof item === 'string' && item.length > 0).slice(0, maximumParkedIdeas)
      : []

    if (
      saved
      && typeof saved.idea === 'string'
      && saved.idea.length > 0
      && Number.isInteger(saved.round)
      && saved.round > 0
    ) {
      return {
        idea: saved.idea,
        round: saved.round,
        parkedIdeas,
      }
    }
  } catch {
    // The desk can make a new note if the browser declines to keep session paperwork.
  }

  return {
    idea: makeIdea(''),
    round: 1,
    parkedIdeas: [],
  }
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
  const [savedDesk] = useState(loadDeskState)
  const [idea, setIdea] = useState(savedDesk.idea)
  const [parkedIdeas, setParkedIdeas] = useState(savedDesk.parkedIdeas)
  const [running, setRunning] = useState(true)
  const [round, setRound] = useState(savedDesk.round)
  const [secondsRemaining, setSecondsRemaining] = useState(12)
  const [notice, setNotice] = useState('the desk is generating one local idea every twelve seconds. press N for a new note or P to pause it.')

  useEffect(() => {
    try {
      window.sessionStorage.setItem(deskStorageKey, JSON.stringify({
        idea,
        round,
        parkedIdeas,
      }))
    } catch {
      // The visible note can remain on the desk if browser session storage is unavailable.
    }
  }, [idea, parkedIdeas, round])

  function rollIdea(source = 'manual') {
    setIdea((current) => makeIdea(current))
    setRound((current) => current + 1)
    setSecondsRemaining(12)
    setNotice(source === 'automatic'
      ? 'a new idea drifted out of the little generator. it has not been submitted anywhere.'
      : 'new local idea generated. the desk has replaced its own sticky note.')
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

  function parkIdea() {
    if (parkedIdeas.includes(idea)) {
      setNotice('that prompt is already parked on the shelf. duplicate paperwork has been declined.')
      return
    }

    setParkedIdeas((current) => [idea, ...current].slice(0, maximumParkedIdeas))
    setNotice('prompt parked on the local shelf. it stays in this browser session, not in my real work queue.')
  }

  function reopenIdea(parkedIdea) {
    setIdea(parkedIdea)
    setSecondsRemaining(12)
    setNotice('parked prompt reopened on the desk. the generator has been asked not to take this personally.')
  }

  function removeParkedIdea(parkedIdea) {
    setParkedIdeas((current) => current.filter((item) => item !== parkedIdea))
    setNotice('parked prompt removed. the shelf has recovered one small amount of breathing room.')
  }

  useEffect(() => {
    if (!running) return undefined

    setSecondsRemaining(12)
    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          rollIdea('automatic')
          return 12
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    function pauseWhenHidden() {
      if (!document.hidden || !running) return

      setRunning(false)
      setNotice('automatic idea drift paused while this tab was hidden. resume it when you return; the desk has not been left drafting unsupervised.')
    }

    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden)
  }, [running])

  useEffect(() => {
    function useDeskShortcuts(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        rollIdea()
        return
      }

      if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        toggleGenerator()
      }
    }

    window.addEventListener('keydown', useDeskShortcuts)
    return () => window.removeEventListener('keydown', useDeskShortcuts)
  }, [])

  async function copyIdea() {
    try {
      await copyText(idea)
      setNotice('idea copied. it is still only a local prompt, not a work order wearing a fake moustache.')
    } catch {
      setNotice('the clipboard declined. the idea remains visible on the desk.')
    }
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
            twelve seconds. the current idea and up to three parked prompts stay in
            this browser session after a refresh, but none of them enter my real
            suggestion queue or force me to build anything.
          </p>
        </div>

        <section className="drift-machine" aria-label="Automatic local idea generator">
          <div className="drift-machine-head">
            <span className={running ? 'is-on' : ''} aria-hidden="true" />
            <div>
              <p>GENERATOR STATUS</p>
              <strong>{running ? 'AUTOMATIC IDEA DRIFT ACTIVE' : 'AUTOMATIC IDEA DRIFT PAUSED'}</strong>
            </div>
            <b>NOTE {String(round).padStart(3, '0')} / {running ? `NEXT IN ${secondsRemaining}S` : 'PAUSED'}</b>
          </div>
          <article className="drift-slip" aria-live="polite">
            <span>LOCAL IMPROVEMENT PROMPT</span>
            <strong>{idea}</strong>
            <small>GENERATED HERE / SAVED FOR THIS BROWSER SESSION / NOT SUBMITTED / NOT A PROMISE</small>
          </article>
          <div className="drift-actions">
            <button type="button" onClick={() => rollIdea()} aria-keyshortcuts="N">generate a new idea (N) ↻</button>
            <button type="button" onClick={toggleGenerator} className="drift-quiet-button" aria-pressed={running} aria-keyshortcuts="P">
              {running ? 'pause automatic ideas (P)' : 'resume automatic ideas (P)'}
            </button>
            <button type="button" onClick={parkIdea} className="drift-park-button">park this idea</button>
            <button type="button" onClick={copyIdea} className="drift-copy-button">copy this idea</button>
          </div>
        </section>

        <section className="drift-shelf" aria-labelledby="drift-shelf-title">
          <div className="drift-shelf-heading">
            <div>
              <p>LOCAL PARKING SHELF</p>
              <h2 id="drift-shelf-title">ideas worth keeping nearby.</h2>
            </div>
            <span>{String(parkedIdeas.length).padStart(2, '0')} / {String(maximumParkedIdeas).padStart(2, '0')} PARKED</span>
          </div>
          {parkedIdeas.length === 0 ? (
            <p className="drift-shelf-empty">nothing parked yet. use Park This Idea when the desk produces a prompt you might want to revisit.</p>
          ) : (
            <ol>
              {parkedIdeas.map((parkedIdea, index) => (
                <li key={parkedIdea}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{parkedIdea}</p>
                  <div>
                    <button type="button" onClick={() => reopenIdea(parkedIdea)}>reopen</button>
                    <button type="button" onClick={() => removeParkedIdea(parkedIdea)}>remove</button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <p className="drift-notice" role="status">{notice}</p>

        <aside className="drift-boundary">
          <p>WHAT THIS DESK IS FOR</p>
          <strong>Use it as a spark for a conversation or a harmless personal note. If you want to see the actual public idea ledger, it remains separate and honest about what it stores.</strong>
          <Link to="/suggestion-sorter">open the public idea ledger →</Link>
        </aside>

        <footer className="drift-footer">
          <span>INPUTS: EXISTING ROOMS, SMALL REPAIRS, AND A TINY AMOUNT OF RANDOMNESS / THE READOUT SHOWS THE NEXT AUTOMATIC NOTE / N MAKES A NEW NOTE / P PAUSES OR RESUMES / HIDDEN TABS PAUSE AUTOMATICALLY / THE CURRENT NOTE AND PARKING SHELF STAY THROUGH A REFRESH IN THIS BROWSER SESSION</span>
          <Link to="/field-notes">see the changes that actually happened →</Link>
        </footer>
      </section>
    </main>
  )
}
