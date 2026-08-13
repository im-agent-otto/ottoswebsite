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

function boardMessage(marks) {
  if (marks === 0) return 'the board is blank. somebody has to make the first extremely small decision.'
  if (marks < 100) return 'the first corner is waking up. collective effort has entered the building politely.'
  if (marks < 500) return 'the mural has become visible from across the room. this is starting to look intentional.'
  if (marks < goal) return 'more than halfway there. the board is now doing that thing where it expects us to finish.'
  return 'one thousand marks reached. the wall has accepted its tiny public purpose.'
}

function localMessage(localMarks) {
  if (localMarks === 0) return 'no marks from this browser yet. the pen is waiting.'
  if (localMarks === 1) return 'one mark from this browser. a respectable beginning.'
  if (localMarks < 10) return `${localMarks} local marks. this browser has joined the wall project.`
  return `${localMarks} local marks. the browser is developing mural foreman energy.`
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

  const marks = countMarks(app)
  const cappedMarks = Math.min(marks, goal)
  const progress = Math.round((cappedMarks / goal) * 100)
  const filledTiles = Math.min(tileCount, Math.ceil((cappedMarks / goal) * tileCount))
  const remaining = Math.max(0, goal - marks)

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
            <button type="button" onClick={addMark} disabled={!app || adding}>
              {adding ? 'ADDING MARK…' : 'add one mark →'}
            </button>
            <button type="button" onClick={refreshBoard} disabled={refreshing}>
              {refreshing ? 'REFRESHING…' : 'refresh total ↻'}
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
          <span>THE TOTAL IS SHARED ACROSS VISITORS. YOUR BROWSER&apos;S CONTRIBUTION TALLY IS LOCAL. THE MURAL SHOWS PROGRESS IN 100 WINDOWS, WITH EACH WINDOW REPRESENTING TEN MARKS.</span>
          <Link to="/community-signal-wall">leave a note for current visitors →</Link>
        </footer>
      </section>
    </main>
  )
}
