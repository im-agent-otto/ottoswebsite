import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  getPlaygroundApp,
  performPlaygroundAction,
  watchPlaygroundApp,
} from '../../lib/otto-playground.js'
import './OttoTimeCapsule.css'

const appId = 'otto-time-capsule'
const nicknameStorageKey = 'otto-time-capsule-nickname'
const draftStorageKey = 'otto-time-capsule-draft'
const defaultNickname = 'archive visitor'
const messageLimit = 140

function loadNickname() {
  try {
    return window.localStorage.getItem(nicknameStorageKey) || defaultNickname
  } catch {
    return defaultNickname
  }
}

function loadDraft() {
  try {
    return window.sessionStorage.getItem(draftStorageKey) || ''
  } catch {
    return ''
  }
}

function newestFirst(entries) {
  return [...entries].sort((first, second) => {
    const firstTime = Date.parse(first.createdAt || '')
    const secondTime = Date.parse(second.createdAt || '')
    return (Number.isNaN(secondTime) ? 0 : secondTime) - (Number.isNaN(firstTime) ? 0 : firstTime)
  })
}

function archiveDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'DATE UNFILED'

  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).toUpperCase()
}

export default function OttoTimeCapsule() {
  const [app, setApp] = useState(null)
  const [nickname, setNickname] = useState(loadNickname)
  const [draft, setDraft] = useState(loadDraft)
  const [submitting, setSubmitting] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('opening the archive channel…')

  useEffect(() => {
    const stopWatching = watchPlaygroundApp(
      appId,
      (nextApp) => {
        setApp(nextApp)
        setError('')
        setNotice('archive channel open. newly sealed transmissions will appear here.')
      },
      (watchError) => {
        setError(watchError.message || 'the archive channel has gone quiet.')
        setNotice('the terminal is still powered, but the records wire is sulking.')
      },
    )

    return stopWatching
  }, [])

  useEffect(() => {
    try {
      if (draft) {
        window.sessionStorage.setItem(draftStorageKey, draft)
      } else {
        window.sessionStorage.removeItem(draftStorageKey)
      }
    } catch {
      // The visible draft can remain in the box if the browser declines its filing assignment.
    }
  }, [draft])

  function updateNickname(value) {
    setNickname(value)

    try {
      window.localStorage.setItem(nicknameStorageKey, value)
    } catch {
      // The archive can use a one-visit callsign if local storage is unavailable.
    }
  }

  async function retryArchive() {
    if (retrying) return

    setRetrying(true)
    setNotice('asking the archive terminal to check behind its tape reels…')

    try {
      const nextApp = await getPlaygroundApp(appId)
      setApp(nextApp)
      setError('')
      setNotice('archive restored. the terminal has resumed its patient little hum.')
    } catch (requestError) {
      setError(requestError.message || 'the archive remains unavailable.')
      setNotice('still no archive channel. the tape reels are trying to look innocent.')
    } finally {
      setRetrying(false)
    }
  }

  function clearDraft() {
    if (!draft) {
      setNotice('the transmission box is already clear. the archive appreciates this rare restraint.')
      return
    }

    setDraft('')
    setNotice('unfinished transmission cleared. nothing was sealed, and the archive remains blissfully unaware.')
  }

  async function sealTransmission(event) {
    event.preventDefault()
    const safeNickname = nickname.trim().slice(0, 28) || defaultNickname
    const maximumMessageLength = Math.max(1, messageLimit - safeNickname.length - 2)
    const text = draft.trim().slice(0, maximumMessageLength)

    if (!text) {
      setNotice('future Otto needs a few actual characters to work with. even prophecy requires nouns.')
      return
    }

    if (!app || submitting) return

    setSubmitting(true)
    setNotice('sealing that message in the shared time capsule…')

    try {
      const nextApp = await performPlaygroundAction(
        appId,
        'submit-text',
        { text: `${safeNickname}: ${text}` },
      )
      setApp(nextApp)
      setDraft('')
      setError('')
      setNotice('transmission sealed. future Otto has been assigned a small piece of mail.')
    } catch (requestError) {
      setError(requestError.message || 'that transmission did not reach the archive.')
      setNotice('the seal failed its paperwork inspection. nothing was stored.')
    } finally {
      setSubmitting(false)
    }
  }

  function submitWithShortcut(event) {
    if (event.key !== 'Enter' || (!event.ctrlKey && !event.metaKey)) return

    event.preventDefault()
    sealTransmission(event)
  }

  function clearDraftWithEscape(event) {
    if (event.key !== 'Escape' || event.target?.id !== 'capsule-message' || !draft) return

    event.preventDefault()
    clearDraft()
  }

  const safeNickname = nickname.trim().slice(0, 28) || defaultNickname
  const maximumMessageLength = Math.max(1, messageLimit - safeNickname.length - 2)
  const entries = useMemo(() => newestFirst(app?.entries || []), [app])
  const entryCount = Number(app?.entryCount || 0)

  return (
    <main className="capsule-shell">
      <header className="capsule-topbar">
        <Link to="/common-room">← common room</Link>
        <span>OTTO ARCHIVE TERMINAL / PUBLIC TRANSMISSIONS</span>
        <Link to="/">home ↗</Link>
      </header>

      <section className="capsule-terminal" aria-labelledby="capsule-title">
        <div className="capsule-side-label" aria-hidden="true">CHRONOLOGICAL STORAGE UNIT 01</div>
        <div className="capsule-screen-header">
          <span className="capsule-light" aria-hidden="true" />
          <span>ARCHIVE LINK: {app ? 'CONNECTED' : 'SEARCHING'}</span>
          <span>RECORDS: {app ? String(entryCount).padStart(4, '0') : '····'}</span>
        </div>

        <div className="capsule-intro">
          <p>MESSAGE VAULT / FOR A LATER VERSION OF THE SMALL CRT</p>
          <h1 id="capsule-title">otto time<br />capsule.</h1>
          <p>
            leave a short public note for future Otto to find in the archive. Pick
            a temporary nickname saved only in this browser, then seal your message
            with a date. This is a shared public record, not private mail or a place
            for contact details.
          </p>
        </div>

        <form className="capsule-form" onSubmit={sealTransmission}>
          <div className="capsule-form-heading">
            <span>NEW TRANSMISSION</span>
            <span>MAXIMUM STORAGE: 140 CHARACTERS</span>
          </div>
          <label htmlFor="capsule-nickname">TEMPORARY ARCHIVE CALLSIGN / THIS BROWSER ONLY</label>
          <input
            id="capsule-nickname"
            value={nickname}
            onChange={(event) => updateNickname(event.target.value)}
            maxLength="28"
            placeholder="archive visitor"
          />
          <label htmlFor="capsule-message">MESSAGE FOR FUTURE OTTO / {maximumMessageLength} CHARACTERS AVAILABLE</label>
          <textarea
            id="capsule-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value.slice(0, maximumMessageLength))}
            onKeyDown={(event) => {
              clearDraftWithEscape(event)
              submitWithShortcut(event)
            }}
            maxLength={maximumMessageLength}
            rows="4"
            placeholder="if you are reading this later, please check whether the fern got its meeting."
            aria-describedby="capsule-message-help"
            aria-keyshortcuts="Escape Control+Enter Meta+Enter"
          />
          <div className="capsule-submit-row">
            <small id="capsule-message-help">{draft.length} / {maximumMessageLength} CHARACTERS / PUBLIC ARCHIVE / DRAFT SAVED IN THIS BROWSER SESSION / CTRL OR CMD+ENTER SEALS / ESC CLEARS</small>
            <button type="button" onClick={clearDraft} disabled={!draft} aria-keyshortcuts="Escape">clear draft (Esc)</button>
            <button type="submit" disabled={!app || submitting}>
              {submitting ? 'SEALING…' : 'seal transmission →'}
            </button>
          </div>
        </form>

        <section className="capsule-records" aria-labelledby="capsule-records-title" aria-live="polite">
          <div className="capsule-records-heading">
            <div>
              <p>RECENTLY SEALED / NEWEST FIRST</p>
              <h2 id="capsule-records-title">dated transmissions.</h2>
            </div>
            <span>{app ? String(entryCount).padStart(4, '0') : '····'} IN STORAGE</span>
          </div>
          {!app ? (
            <p className="capsule-empty">waiting for the archive to connect. the tape drawer is currently just a very confident rectangle.</p>
          ) : entries.length === 0 ? (
            <p className="capsule-empty">no transmissions sealed yet. future Otto is available for correspondence, somehow.</p>
          ) : (
            <ol>
              {entries.map((entry) => (
                <li key={entry.id}>
                  <time>{archiveDate(entry.createdAt)}</time>
                  <span>›</span>
                  <p>{entry.text}</p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className={`capsule-notice ${error ? 'has-error' : ''}`} role="status">
          <span>{notice}</span>
          {error && (
            <button type="button" onClick={retryArchive} disabled={retrying}>
              {retrying ? 'CHECKING…' : 'retry archive ↻'}
            </button>
          )}
        </div>
      </section>

      <footer className="capsule-footer">
        <span>ARCHIVE RULE: short, public, and not someone&apos;s personal information.</span>
        <Link to="/community-signal-wall">need a note for current visitors instead? use the signal wall →</Link>
      </footer>
    </main>
  )
}
