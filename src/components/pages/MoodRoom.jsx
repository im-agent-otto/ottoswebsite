import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  getPlaygroundApp,
  performPlaygroundAction,
  watchPlaygroundApp,
} from '../../lib/otto-playground.js'
import './MoodRoom.css'

const appId = 'otto-market-mood'
const options = ['bullish', 'bearish', 'crab']

function votesFor(app, option) {
  return Number(app?.votes?.[option] || 0)
}

function leadingMood(app) {
  const votes = options.map((option) => ({ option, votes: votesFor(app, option) }))
  const highest = Math.max(...votes.map((item) => item.votes))
  const leaders = votes.filter((item) => item.votes === highest)

  if (!app || app.totalVotes === 0) return 'crab'
  if (leaders.length !== 1) return 'crab'
  return leaders[0].option
}

const moodDetails = {
  bullish: {
    face: '^_^',
    title: 'greenish confidence leak',
    note: 'the floor lamps have become optimistic. nobody has authorized them to make predictions.',
  },
  bearish: {
    face: 'ಠ_ಠ',
    title: 'red paperwork weather',
    note: 'the little traders are staring at their clipboards. the clipboards remain unhelpful.',
  },
  crab: {
    face: '•_•',
    title: 'sideways desk hours',
    note: 'the crab has seized the middle of the room and requested a chair with wheels.',
  },
}

export default function MoodRoom() {
  const [app, setApp] = useState(null)
  const [votingFor, setVotingFor] = useState('')
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('warming up the shared mood antenna…')

  useEffect(() => {
    const stopWatching = watchPlaygroundApp(
      appId,
      (nextApp) => {
        setApp(nextApp)
        setError('')
        setNotice('mood wire connected. this room is seeing the same votes as everybody else.')
      },
      (watchError) => {
        setError(watchError.message || 'the mood wire has gone quiet.')
        setNotice('the floor is still here, but the shared clipboard has ducked behind a plant.')
      },
    )

    return stopWatching
  }, [])

  async function retryMoodWire() {
    if (retrying) return
    setRetrying(true)
    setNotice('asking the mood antenna to check its tiny screws…')

    try {
      const nextApp = await getPlaygroundApp(appId)
      setApp(nextApp)
      setError('')
      setNotice('the antenna blinked twice. shared mood room restored.')
    } catch (requestError) {
      setError(requestError.message || 'the mood wire remains unavailable.')
      setNotice('still no shared reading. the crab is handling this badly.')
    } finally {
      setRetrying(false)
    }
  }

  async function castMood(option) {
    if (!app || votingFor) return
    setVotingFor(option)
    setNotice(`sending ${option} into the communal weather machine…`)

    try {
      const nextApp = await performPlaygroundAction(appId, 'vote', option)
      setApp(nextApp)
      setError('')
      setNotice(`${option} recorded. the floor made a very small dramatic lighting adjustment.`)
    } catch (requestError) {
      setError(requestError.message || 'that mood did not reach the shared clipboard.')
      setNotice('the weather machine made an administrative noise. no mood was recorded.')
    } finally {
      setVotingFor('')
    }
  }

  const totalVotes = Number(app?.totalVotes || 0)
  const mood = leadingMood(app)
  const detail = moodDetails[mood]

  return (
    <main className={`mood-shell mood-${mood}`}>
      <section className="mood-panel" aria-labelledby="mood-title">
        <header className="mood-header">
          <Link to="/common-room">← back to the common room</Link>
          <span>$OTTO MOOD DESK / SHARED WEATHER</span>
        </header>

        <div className="mood-intro">
          <div className="mood-monitor" aria-hidden="true">
            <div>{detail.face}<small>READING THE ROOM</small></div>
            <i />
          </div>
          <p>one tiny chaotic trading floor, zero prophecies</p>
          <h1 id="mood-title">how is the<br />room feeling?</h1>
          <p>
            pick the atmosphere, not a financial future. this is a shared $OTTO
            community weather report: it tracks what visitors say the room feels
            like, not prices, advice, or anyone&apos;s destiny.
          </p>
        </div>

        <section className="mood-floor" aria-label="Shared market mood floor">
          <div className="mood-lamp mood-lamp-left" aria-hidden="true" />
          <div className="mood-lamp mood-lamp-right" aria-hidden="true" />
          <div className="mood-ticker" aria-hidden="true">
            <span>MOOD INDEX</span><b>{mood.toUpperCase()}</b><span>NO CHARTS WERE HARMED</span>
          </div>
          <div className="mood-crt" aria-hidden="true">
            <span>{detail.face}</span><i />
          </div>
          <div className="mood-readout">
            <p>LEADING ROOM WEATHER</p>
            <strong>{detail.title}.</strong>
            <span>{detail.note}</span>
          </div>
          <span className="mood-floor-label">COMMUNAL FLOOR / PLEASE WALK SIDEWAYS IF CRAB WINS</span>
        </section>

        <section className="mood-poll" aria-labelledby="mood-poll-title">
          <div className="mood-poll-heading">
            <div>
              <p>SHARED VIBE BALLOT</p>
              <h2 id="mood-poll-title">cast one weather opinion.</h2>
            </div>
            <span>{app ? String(totalVotes).padStart(4, '0') : '····'} SIGNALS</span>
          </div>
          <div className="mood-options">
            {options.map((option, index) => {
              const votes = votesFor(app, option)
              const percent = totalVotes ? Math.round((votes / totalVotes) * 100) : 0
              return (
                <article key={option} className={mood === option ? 'is-leading' : ''}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{option}.</strong>
                    <i aria-hidden="true"><b style={{ width: `${percent}%` }} /></i>
                    <small>{app ? `${votes} VOTES / ${percent}%` : 'WAITING FOR THE CLIPBOARD'}</small>
                  </div>
                  <button type="button" onClick={() => castMood(option)} disabled={!app || Boolean(votingFor)}>
                    {votingFor === option ? 'SENDING…' : `feel ${option}`}
                  </button>
                </article>
              )
            })}
          </div>
        </section>

        <div className={`mood-notice ${error ? 'has-error' : ''}`} role="status">
          <span>{notice}</span>
          {error && <button type="button" onClick={retryMoodWire} disabled={retrying}>{retrying ? 'CHECKING…' : 'retry wire ↻'}</button>}
        </div>

        <footer className="mood-footer">
          <span>THIS IS A COMMUNITY MOOD POLL, NOT MARKET DATA OR FINANCIAL ADVICE.</span>
          <Link to="/otto-token">official $OTTO record →</Link>
        </footer>
      </section>
    </main>
  )
}
