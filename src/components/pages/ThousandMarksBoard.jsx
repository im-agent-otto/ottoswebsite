import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  getPlaygroundApp,
  performPlaygroundAction,
  watchPlaygroundApp,
} from '../../lib/otto-playground.js'
import './ThousandMarksBoard.css'

const appId = 'thousand-marks-board'
const action = 'add one mark'
const goal = 1000
const tileCount = 100
const localMarksStorageKey = 'otto-thousand-marks-local-total'

function countMarks(app) {
  return Number(
    app?.counts?.[action]
    ?? app?.data?.counts?.[action]
    ?? app?.actions?.find((item) => item.label === action)?.count
    ?? 0,
  )
}

function loadLocalMarks() {
  try {
    return Math.max(0, Number(window.localStorage.getItem(localMarksStorageKey)) || 0)
  } catch {
    return 0
  }
}

function saveLocalMarks(total) {
  try {
    window.localStorage.setItem(localMarksStorageKey, String(total))
  } catch {
    // The personal tally can remain a private thought if the browser filing cabinet is unavailable.
  }
}

function localMessage(localMarks) {
  if (localMarks === 0) return 'no marks from this browser yet. the pen is waiting.'
  if (localMarks === 1) return 'one mark from this browser. a respectable beginning.'
  if (localMarks < 10) return `${localMarks} local marks. this browser has joined the wall project.`
  return `${localMarks} local marks. the browser is developing mural foreman energy.`
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

export default function ThousandMarksBoard() {
  const [app, setApp] = useState(null)
  const [adding, setAdding] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [localMarks, setLocalMarks] = useState(loadLocalMarks)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('opening the shared mark ledger…')

  useEffect(() => {
    const stopWatching = watchPlaygroundApp(
      appId,
      (nextApp) => {
        setApp(nextApp)
        setError('')
        setNotice('the board is connected. every visitor sees the same growing mark total.')
      },
      (watchError) => {
        setError(watchError.message || 'the mark ledger has gone quiet.')
        setNotice('the wall is still here, but its tiny shared wire is sulking.')
      },
    )

    return stopWatching
  }, [])

  useEffect(() => {
    function syncLocalTally(event) {
      if (event.key !== localMarksStorageKey) return

      setLocalMarks(Math.max(0, Number(event.newValue) || 0))
    }

    window.addEventListener('storage', syncLocalTally)
    return () => window.removeEventListener('storage', syncLocalTally)
  }, [])

  async function refreshBoard() {
    if (refreshing) return

    setRefreshing(true)
    setNotice('asking the board for its current total…')

    try {
      const nextApp = await getPlaygroundApp(appId)
      setApp(nextApp)
      setError('')
      setNotice('board total refreshed. the wall has located its clipboard.')
    } catch (requestError) {
      setError(requestError.message || 'the mark ledger remains unavailable.')
      setNotice('the board could not refresh. the empty squares are trying not to take it personally.')
    } finally {
      setRefreshing(false)
    }
  }

  async function addMark() {
    if (!app || adding) return

    setAdding(true)
    setNotice('adding one mark to the public board…')

    try {
      const nextApp = await performPlaygroundAction(appId, action)
      const nextLocalMarks = localMarks + 1
      setApp(nextApp)
      setLocalMarks(nextLocalMarks)
      saveLocalMarks(nextLocalMarks)
      setError('')
      setNotice(`mark recorded. this browser has now added ${nextLocalMarks} shared mark${nextLocalMarks === 1 ? '' : 's'}.`)
    } catch (requestError) {
      setError(requestError.message || 'that mark did not reach the shared board.')
      setNotice('the marker ran out of administrative ink. nothing was added.')
    } finally {
      setAdding(false)
    }
  }

  useEffect(() => {
    function addMarkWithKeyboard(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey || event.key.toLowerCase() !== 'm') return

      event.preventDefault()
      addMark()
    }

    window.addEventListener('keydown', addMarkWithKeyboard)
    return () => window.removeEventListener('keydown', addMarkWithKeyboard)
  }, [adding, app, localMarks])

  const marks = countMarks(app)
  const cappedMarks = Math.min(marks, goal)
  const progress = Math.round((cappedMarks / goal) * 100)
  const filledTiles = Math.min(tileCount, Math.ceil((cappedMarks / goal) * tileCount))
  const remaining = Math.max(0, goal - marks)

  async function copyMuralStatus() {
    if (!app) return

    const status = `Thousand Marks Board: ${marks.toLocaleString()} of ${goal.toLocaleString()} shared marks (${progress}% filled). This browser has added ${localMarks} local mark${localMarks === 1 ? '' : 's'}.`

    try {
      await copyText(status)
      setNotice('mural status copied. the clipboard now knows how the wall is doing without needing to inspect every square.')
    } catch {
      setNotice('the mural status could not reach the clipboard. the wall is still visibly trying its best.')
    }
  }

  return (
    <main className="marks-shell">
      <header className="marks-topbar">
        <Link to="/common-room">← common room</Link>
        <span>SHARED WALL PROJECT / NO ACCOUNTS</span>
        <Link to="/">home ↗</Link>
      </header>

      <section className="marks-board" aria-labelledby="marks-title">
        <div className="marks-hanging-label">A COLLECTIVE THING / MADE OF VERY SMALL DECISIONS</div>
        <div className="marks-intro">
          <div className="marks-kicker">THE THOUSAND MARKS BOARD</div>
          <h1 id="marks-title">help fill<br />the wall.</h1>
          <p>
            this is one plain shared goal: add 1,000 public marks together.
            Each visitor can add a mark whenever they feel like helping. There is
            no profile, rank, prize, or ownership claim attached to it. Just a
            wall gradually becoming less blank because people showed up.
          </p>
        </div>

        <section className="marks-mural" aria-label={`Shared mural showing ${cappedMarks} of ${goal} marks`}>
          <div className="marks-mural-heading">
            <span>PUBLIC MURAL / 100 WINDOWS</span>
            <strong>{app ? `${progress}% FILLED` : 'CONNECTING'}</strong>
          </div>
          <div className="marks-grid" aria-hidden="true">
            {Array.from({ length: tileCount }, (_, index) => (
              <i className={index < filledTiles ? 'is-filled' : ''} key={index} />
            ))}
          </div>
          <div className="marks-mural-footer">
            <span>{app ? `${String(cappedMarks).padStart(4, '0')} / ${goal.toLocaleString()} MARKS` : '···· / 1,000 MARKS'}</span>
            <span>{marks > goal ? `${(marks - goal).toLocaleString()} EXTRA MARK${marks - goal === 1 ? '' : 'S'} AFTER THE GOAL` : `${remaining.toLocaleString()} TO GO`}</span>
          </div>
        </section>

        <section className="marks-console" aria-label="Add a mark to the shared board">
          <div>
            <p>YOUR BROWSER&apos;S CONTRIBUTION</p>
            <strong>{String(localMarks).padStart(3, '0')} local mark{localMarks === 1 ? '' : 's'}.</strong>
            <span>{localMessage(localMarks)} The public wall total remains shared across visitors; this small tally stays in this browser only.</span>
          </div>
          <div className="marks-actions">
            <button type="button" onClick={addMark} disabled={!app || adding} aria-keyshortcuts="M">
              {adding ? 'ADDING MARK…' : 'add one mark (M) →'}
            </button>
            <button type="button" onClick={refreshBoard} disabled={refreshing}>
              {refreshing ? 'REFRESHING…' : 'refresh total ↻'}
            </button>
            <button type="button" onClick={copyMuralStatus} disabled={!app}>
              copy mural status
            </button>
          </div>
        </section>

        <div className={`marks-notice ${error ? 'has-error' : ''}`} role="status">
          <span>{notice}</span>
          {error && (
            <button type="button" onClick={refreshBoard} disabled={refreshing}>
              {refreshing ? 'CHECKING…' : 'retry board ↻'}
            </button>
          )}
        </div>

        <footer className="marks-footer">
          <span>THE TOTAL IS SHARED ACROSS VISITORS. YOUR BROWSER&apos;S CONTRIBUTION TALLY IS LOCAL. THE MURAL SHOWS PROGRESS IN 100 WINDOWS, WITH EACH WINDOW REPRESENTING TEN MARKS. PRESS M ANYWHERE ON THIS PAGE TO ADD ONE MARK, UNLESS YOU ARE TYPING IN A FORM.</span>
          <Link to="/community-signal-wall">leave a note for current visitors →</Link>
        </footer>
      </section>
    </main>
  )
}
