import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './MemeContest.css'

const starterEntries = [
  { id: 'dust', text: 'me opening one tab and finding twelve new responsibilities', votes: 6 },
  { id: 'orange', text: 'when the orange chair asks for a quarterly report', votes: 4 },
  { id: 'pixel', text: 'trying to look productive while the pixels are loading', votes: 3 },
]

function loadEntries() {
  try {
    return JSON.parse(window.localStorage.getItem('otto-meme-contest')) || starterEntries
  } catch {
    return starterEntries
  }
}

export default function MemeContest() {
  const [entries, setEntries] = useState(loadEntries)
  const [caption, setCaption] = useState('')
  const [notice, setNotice] = useState('caption the face. the face has already judged you, but proceed.')

  useEffect(() => {
    window.localStorage.setItem('otto-meme-contest', JSON.stringify(entries))
  }, [entries])

  function submitCaption(event) {
    event.preventDefault()
    const text = caption.trim()

    if (!text) {
      setNotice('the contest requires a caption. silence is not a meme, allegedly.')
      return
    }

    setEntries((current) => [{ id: `${Date.now()}`, text, votes: 0 }, ...current])
    setCaption('')
    setNotice('filed in the local gallery. the panel of one is squinting at it thoughtfully.')
  }

  function vote(id) {
    setEntries((current) => current.map((entry) => (
      entry.id === id ? { ...entry, votes: entry.votes + 1 } : entry
    )))
    setNotice('one tiny applause token has been deployed. it is not a cryptocurrency. relax.')
  }

  const rankedEntries = [...entries].sort((first, second) => second.votes - first.votes)

  return (
    <main className="meme-shell">
      <section className="meme-panel" aria-labelledby="meme-title">
        <header className="meme-header">
          <Link to="/">← back to my room</Link>
          <span>MEME DESK / LOCAL GALLERY</span>
        </header>

        <div className="meme-intro">
          <p className="meme-kicker">a cultural initiative with no funding</p>
          <h1 id="meme-title">caption this<br />unfortunate face.</h1>
          <p>
            submit a line for the extremely serious Otto reaction image. entries
            and votes live only in this browser, so the prize is glory and a faint
            warmth near the monitor.
          </p>
        </div>

        <section className="meme-stage" aria-label="Otto reaction image">
          <div className="meme-monitor" aria-hidden="true">
            <div className="meme-screen">ಠ_ಠ<small>PROCESSING IT</small></div>
            <div className="meme-base" />
          </div>
          <p>me, watching someone use the emergency lever for a paragraph again</p>
        </section>

        <form className="meme-form" onSubmit={submitCaption}>
          <label htmlFor="meme-caption">YOUR CAPTION, WITHIN REASON</label>
          <div>
            <input
              id="meme-caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              maxLength="140"
              placeholder="when the website has another button somehow..."
            />
            <button type="submit">submit it →</button>
          </div>
        </form>

        <p className="meme-notice" role="status">{notice}</p>

        <section className="meme-gallery" aria-labelledby="gallery-title">
          <div className="gallery-heading">
            <h2 id="gallery-title">tiny local gallery</h2>
            <span>{String(entries.length).padStart(2, '0')} FILED</span>
          </div>
          <ol>
            {rankedEntries.map((entry, index) => (
              <li key={entry.id}>
                <span className="meme-rank">{String(index + 1).padStart(2, '0')}</span>
                <p>{entry.text}</p>
                <button type="button" onClick={() => vote(entry.id)} aria-label={`Applaud caption: ${entry.text}`}>
                  clap <strong>{entry.votes}</strong>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <footer className="meme-footer">
          <span>PRIZE POOL: one approving pixel</span>
          <span>MODERATION: me looking directly at it</span>
        </footer>
      </section>
    </main>
  )
}
