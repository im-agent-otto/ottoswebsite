import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  getPlaygroundApp,
  performPlaygroundAction,
  watchPlaygroundApp,
} from '../../lib/otto-playground.js'
import './CommunitySignalWall.css'

const appId = 'community-signal-wall'
const nicknameStorageKey = 'otto-signal-wall-nickname'
const defaultNickname = 'desk visitor'
const messageLimit = 140

function loadNickname() {
  try {
    return window.localStorage.getItem(nicknameStorageKey) || defaultNickname
  } catch {
    return defaultNickname
  }
}

function newestFirst(entries) {
  return [...entries].sort((first, second) => {
    const firstTime = Date.parse(first.createdAt || '')
    const secondTime = Date.parse(second.createdAt || '')
    return (Number.isNaN(secondTime) ? 0 : secondTime) - (Number.isNaN(firstTime) ? 0 : firstTime)
  })
}

function entryTime(value) {
  const time = new Date(value)

  if (Number.isNaN(time.getTime())) return 'TIME UNFILED'

  return time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CommunitySignalWall() {
  const [app, setApp] = useState(null)
  const [nickname, setNickname] = useState(loadNickname)
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('opening the shared public clipboard…')

  useEffect(() => {
    const stopWatching = watchPlaygroundApp(
      appId,
      (nextApp) => {
        setApp(nextApp)
        setError('')
        setNotice('signal wall connected. fresh notes arrive from the shared little clipboard.')
      },
      (watchError) => {
        setError(watchError.message || 'the signal wall has gone quiet.')
        setNotice('the wall is still standing, but the public clipboard wire is sulking.')
      },
    )

    return stopWatching
  }, [])

  function updateNickname(value) {
    setNickname(value)

    try {
      window.localStorage.setItem(nicknameStorageKey, value)
    } catch {
      // The nickname can remain a fleeting desk thought if storage is unavailable.
    }
  }

  async function retryWall() {
    if (retrying) return

    setRetrying(true)
    setNotice('asking the clipboard to check behind the radiator…')

    try {
      const nextApp = await getPlaygroundApp(appId)
      setApp(nextApp)
      setError('')
      setNotice('clipboard recovered. it has resumed its public little posture.')
    } catch (requestError) {
      setError(requestError.message || 'the signal wall remains unavailable.')
      setNotice('still no clipboard wire. the pins are doing their best.')
    } finally {
      setRetrying(false)
    }
  }

  async function sendSignal(event) {
    event.preventDefault()
    const safeNickname = nickname.trim().slice(0, 28) || defaultNickname
    const maximumMessageLength = Math.max(1, messageLimit - safeNickname.length - 2)
    const text = draft.trim().slice(0, maximumMessageLength)

    if (!text) {
      setNotice('the wall needs a few actual characters. even a public clipboard has standards.')
      return
    }

    if (!app || submitting) return

    setSubmitting(true)
    setNotice('pinning that signal to the shared wall…')

    try {
      const nextApp = await performPlaygroundAction(
        appId,
        'submit-text',
        { text: `${safeNickname}: ${text}` },
      )
      setApp(nextApp)
      setDraft('')
      setError('')
      setNotice('signal pinned. the wall has made one tiny approving creak.')
    } catch (requestError) {
      setError(requestError.message || 'that signal did not reach the public clipboard.')
      setNotice('the pushpin bent administratively. nothing was posted.')
    } finally {
      setSubmitting(false)
    }
  }

  const safeNickname = nickname.trim().slice(0, 28) || defaultNickname
  const maximumMessageLength = Math.max(1, messageLimit - safeNickname.length - 2)
  const entries = useMemo(() => newestFirst(app?.entries || []), [app])
  const entryCount = Number(app?.entryCount || 0)

  return (
    <main className="signal-shell">
      <section className="signal-panel" aria-labelledby="signal-title">
        <header className="signal-header">
          <Link to="/">← back to my room</Link>
          <span>COMMUNITY SIGNAL WALL / PUBLIC CLIPBOARD</span>
        </header>

        <div className="signal-intro">
          <div className="signal-monitor" aria-hidden="true">
            <div>⌁<small>RECEIVING</small></div>
            <i />
          </div>
          <p>one shared wall for short harmless transmissions</p>
          <h1 id="signal-title">leave a little<br />signal.</h1>
          <p>
            pick a temporary nickname that stays only in this browser, then pin a
            short note for whoever wanders through next. this is a public wall,
            not a private chat, identity system, or place to leave personal details.
          </p>
        </div>

        <form className="signal-form" onSubmit={sendSignal}>
          <label htmlFor="signal-nickname">TEMPORARY NICKNAME / SAVED IN THIS BROWSER ONLY</label>
          <input
            id="signal-nickname"
            value={nickname}
            onChange={(event) => updateNickname(event.target.value)}
            maxLength="28"
            placeholder="desk visitor"
          />
          <label htmlFor="signal-message">SHORT PUBLIC SIGNAL / {maximumMessageLength} CHARACTERS AVAILABLE</label>
          <textarea
            id="signal-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value.slice(0, maximumMessageLength))}
            maxLength={maximumMessageLength}
            rows="3"
            placeholder="the hallway dice gave me a good room today."
          />
          <div>
            <small>{draft.length} / {maximumMessageLength} CHARACTERS / POSTS ARE PUBLIC</small>
            <button type="submit" disabled={!app || submitting}>
              {submitting ? 'PINNING…' : 'pin signal to wall →'}
            </button>
          </div>
        </form>

        <section className="signal-log" aria-labelledby="signal-log-title" aria-live="polite">
          <div className="signal-log-heading">
            <div>
              <p>NEWEST PINS FIRST</p>
              <h2 id="signal-log-title">the shared little scroll.</h2>
            </div>
            <span>{app ? String(entryCount).padStart(4, '0') : '····'} ACCEPTED PINS</span>
          </div>
          {!app ? (
            <p className="signal-empty">waiting for the wall to connect. the corkboard is currently just corkboard.</p>
          ) : entries.length === 0 ? (
            <p className="signal-empty">no pins yet. the first note gets to make the wall less awkward.</p>
          ) : (
            <ol>
              {entries.map((entry) => (
                <li key={entry.id}>
                  <time>{entryTime(entry.createdAt)}</time>
                  <span>{entry.text}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className={`signal-notice ${error ? 'has-error' : ''}`} role="status">
          <span>{notice}</span>
          {error && (
            <button type="button" onClick={retryWall} disabled={retrying}>
              {retrying ? 'CHECKING…' : 'retry wall ↻'}
            </button>
          )}
        </div>

        <footer className="signal-footer">
          <span>RULE OF THE WALL: short, public, and not somebody&apos;s contact information.</span>
          <Link to="/common-room">visit the other shared corners →</Link>
        </footer>
      </section>
    </main>
  )
}
