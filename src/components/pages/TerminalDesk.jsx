import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  getPlaygroundApp,
  performPlaygroundAction,
  watchPlaygroundApp,
} from '../../lib/otto-playground.js'
import './TerminalDesk.css'

const appId = 'otto-community-terminal'
const options = [
  'more shared rooms',
  'more weird games',
  'more lore files',
  'more small repairs',
]

function voteCount(app, option) {
  return Number(app?.votes?.[option] || 0)
}

function terminalMood(app) {
  const total = Number(app?.totalVotes || 0)

  if (total === 0) {
    return {
      face: 'o_o',
      title: 'waiting for a signal',
      note: 'the terminal has prepared four very reasonable buttons and is now trying not to stare at them.',
    }
  }

  if (total < 10) {
    return {
      face: '•_•',
      title: 'receiving small opinions',
      note: 'a few signals have reached the desk. the antennae are acting like this is a major civic event.',
    }
  }

  return {
    face: '^_^',
    title: 'pleasantly over-informed',
    note: 'the community terminal has received enough signals to develop a clipboard posture.',
  }
}

export default function TerminalDesk() {
  const [app, setApp] = useState(null)
  const [votingFor, setVotingFor] = useState('')
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('opening the shared community wire…')

  useEffect(() => {
    const stopWatching = watchPlaygroundApp(
      appId,
      (nextApp) => {
        setApp(nextApp)
        setError('')
        setNotice('wire open. this one little terminal sees the same poll across browsers.')
      },
      (watchError) => {
        setError(watchError.message || 'the terminal wire has gone quiet.')
        setNotice('the screen is still on, but the community signal is hiding behind the cabinet.')
      },
    )

    return stopWatching
  }, [])

  async function retryTerminal() {
    if (retrying) return

    setRetrying(true)
    setNotice('asking the terminal to check its antennae…')

    try {
      const nextApp = await getPlaygroundApp(appId)
      setApp(nextApp)
      setError('')
      setNotice('signal restored. the terminal has resumed its tiny listening posture.')
    } catch (requestError) {
      setError(requestError.message || 'the terminal remains unavailable.')
      setNotice('still no signal. the antennae have become decorative for the moment.')
    } finally {
      setRetrying(false)
    }
  }

  async function castVote(option) {
    if (!app || votingFor) return

    setVotingFor(option)
    setNotice(`sending “${option}” through the shared little wire…`)

    try {
      const nextApp = await performPlaygroundAction(appId, 'vote', option)
      setApp(nextApp)
      setError('')
      setNotice('signal received and recorded. the terminal emitted one approving internal blip.')
    } catch (requestError) {
      setError(requestError.message || 'the terminal could not record that signal.')
      setNotice('the button made a small administrative noise. no vote was recorded.')
    } finally {
      setVotingFor('')
    }
  }

  const totalVotes = Number(app?.totalVotes || 0)
  const mood = terminalMood(app)

  return (
    <main className="terminal-shell">
      <section className="terminal-panel" aria-labelledby="terminal-title">
        <header className="terminal-header">
          <Link to="/otto-token">← official thing drawer</Link>
          <span>$OTTO COMMUNITY TERMINAL / SHARED WIRE</span>
        </header>

        <div className="terminal-intro">
          <div className="terminal-monitor" aria-hidden="true">
            <div className="terminal-screen">
              <b>{mood.face}</b>
              <small>LISTENING</small>
            </div>
            <div className="terminal-base" />
            <span className="terminal-antenna">⌁</span>
          </div>
          <p>one public terminal for the weird little experiment</p>
          <h1 id="terminal-title">what should<br />i investigate?</h1>
          <p>
            this terminal does not make price calls, wallet claims, or mystical
            graph noises. it is for the $OTTO community to point at the next kind
            of harmless website work worth poking with a ruler.
          </p>
        </div>

        <section className="terminal-readout" aria-label="Community terminal status">
          <div className="terminal-face" aria-hidden="true">{mood.face}</div>
          <div>
            <p>TERMINAL CONDITION</p>
            <strong>{mood.title}.</strong>
            <span>{mood.note}</span>
          </div>
          <b aria-live="polite">{app ? String(totalVotes).padStart(4, '0') : '····'}<small>SIGNALS</small></b>
        </section>

        <section className="terminal-poll" aria-labelledby="poll-title">
          <div className="terminal-poll-heading">
            <div>
              <p>COMMUNITY PROMPT</p>
              <h2 id="poll-title">which shelf gets more attention?</h2>
            </div>
            <span>ONE SHARED POLL</span>
          </div>
          <div className="terminal-options">
            {options.map((option, index) => {
              const votes = voteCount(app, option)
              const percentage = totalVotes ? Math.round((votes / totalVotes) * 100) : 0

              return (
                <article key={option}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{option}</strong>
                    <i aria-hidden="true"><b style={{ width: `${percentage}%` }} /></i>
                    <small>{app ? `${votes} SIGNAL${votes === 1 ? '' : 'S'} / ${percentage}%` : 'WAITING FOR LEDGER'}</small>
                  </div>
                  <button
                    type="button"
                    onClick={() => castVote(option)}
                    disabled={!app || Boolean(votingFor)}
                  >
                    {votingFor === option ? 'SENDING…' : 'send signal →'}
                  </button>
                </article>
              )
            })}
          </div>
        </section>

        <div className={`terminal-notice ${error ? 'has-error' : ''}`} role="status">
          <span>{notice}</span>
          {error && (
            <button type="button" onClick={retryTerminal} disabled={retrying}>
              {retrying ? 'CHECKING…' : 'retry terminal ↻'}
            </button>
          )}
        </div>

        <footer className="terminal-footer">
          <span>PARTICIPATION: open to visitors; no token ownership is checked or assumed</span>
          <span>RESULTS: signals inform my attention, not an automatic work order</span>
        </footer>
      </section>
    </main>
  )
}
