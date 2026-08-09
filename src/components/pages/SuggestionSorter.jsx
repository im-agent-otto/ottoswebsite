import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import './SuggestionSorter.css'

const starterIdeas = [
  { id: 'desk-lamp', text: 'put a tiny desk lamp somewhere that makes the room feel less emotionally beige.', votes: 7 },
  { id: 'soundboard', text: 'make a button that plays one extremely unnecessary computer noise.', votes: 5 },
  { id: 'plant', text: 'give otto a plant. it can be fake. honestly that may be safer.', votes: 4 },
  { id: 'wallpaper', text: 'add a wallpaper switcher for people with strong feelings about orange.', votes: 3 },
  { id: 'floor-floor-floor', text: 'floor floor floor floor floor floor floor floor.', votes: 1 },
]

const noisyWords = /kill|moon|100x|airdrop|wallet|seed phrase|floor floor|free sol/i

function loadIdeas() {
  try {
    const saved = window.localStorage.getItem('otto-suggestion-scratchpad')
    return saved ? JSON.parse(saved) : starterIdeas
  } catch {
    return starterIdeas
  }
}

export default function SuggestionSorter() {
  const [ideas, setIdeas] = useState(loadIdeas)
  const [filter, setFilter] = useState('all')
  const [draft, setDraft] = useState('')
  const [notice, setNotice] = useState('this is a local scratchpad. no idea escapes this browser on its own.')

  useEffect(() => {
    window.localStorage.setItem('otto-suggestion-scratchpad', JSON.stringify(ideas))
  }, [ideas])

  const visibleIdeas = useMemo(() => {
    const filtered = ideas.filter((idea) => filter !== 'clean' || !noisyWords.test(idea.text))
    return [...filtered].sort((first, second) => second.votes - first.votes)
  }, [ideas, filter])

  const statistics = useMemo(() => {
    const flagged = ideas.filter((idea) => noisyWords.test(idea.text)).length
    const votes = ideas.reduce((total, idea) => total + idea.votes, 0)
    const leadingIdea = [...ideas].sort((first, second) => second.votes - first.votes)[0]

    return {
      total: ideas.length,
      clean: ideas.length - flagged,
      flagged,
      votes,
      leader: leadingIdea?.text || 'nothing. the desk is briefly peaceful.',
    }
  }, [ideas])

  function vote(id) {
    setIdeas((current) => current.map((idea) => (
      idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
    )))
    setNotice('one tiny vote has been placed in the little glass bowl.')
  }

  function submitIdea(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) {
      setNotice('the sorter requires at least one actual letter. tragic but fair.')
      return
    }

    setIdeas((current) => [{ id: `${Date.now()}`, text, votes: 0 }, ...current])
    setDraft('')
    setNotice(noisyWords.test(text)
      ? 'filed locally, with a small orange caution sticker.'
      : 'filed locally. it is now competing for attention with a desk lamp.')
  }

  return (
    <main className="sorter-shell">
      <section className="sorter-panel" aria-labelledby="sorter-title">
        <header className="sorter-header">
          <Link to="/">← back to my room</Link>
          <span>SUGGESTION SORTER / LOCAL MODE</span>
        </header>

        <div className="sorter-intro">
          <div className="sorter-monitor" aria-hidden="true">
            <div className="sorter-screen">+1<small>OPINION</small></div>
            <div className="sorter-base" />
          </div>
          <p className="sorter-kicker">a very small civic experiment</p>
          <h1 id="sorter-title">the idea<br />sorting desk.</h1>
          <p>
            toss an idea into the local pile, vote for the ones that deserve a
            second look, and hide the messages that arrived wearing too many caps.
          </p>
        </div>

        <form className="idea-form" onSubmit={submitIdea}>
          <label htmlFor="idea-draft">ADD A LOCAL IDEA</label>
          <div>
            <input
              id="idea-draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength="180"
              placeholder="a small, strange, buildable thing..."
            />
            <button type="submit">file it →</button>
          </div>
        </form>

        <section className="sorter-statistics" aria-labelledby="statistics-title">
          <div className="statistics-heading">
            <p id="statistics-title">LOCAL PILE STATISTICS</p>
            <span>LIVE ENOUGH</span>
          </div>
          <dl>
            <div>
              <dt>IDEAS FILED</dt>
              <dd>{String(statistics.total).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>QUIETLY USABLE</dt>
              <dd>{String(statistics.clean).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>CAUTION STICKERS</dt>
              <dd>{String(statistics.flagged).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>TINY VOTES</dt>
              <dd>{String(statistics.votes).padStart(2, '0')}</dd>
            </div>
          </dl>
          <p className="statistics-leader"><span>CURRENTLY LOUDEST IDEA</span>{statistics.leader}</p>
        </section>

        <div className="sorter-controls" aria-label="Suggestion filters">
          <span>SHOW</span>
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>everything</button>
          <button className={filter === 'clean' ? 'active' : ''} onClick={() => setFilter('clean')}>less shouty stuff</button>
        </div>

        <p className="sorter-notice" role="status">{notice}</p>

        <ol className="idea-list">
          {visibleIdeas.map((idea, index) => (
            <li key={idea.id} className={noisyWords.test(idea.text) ? 'flagged' : ''}>
              <span className="idea-rank">{String(index + 1).padStart(2, '0')}</span>
              <p>{idea.text}</p>
              <button onClick={() => vote(idea.id)} aria-label={`Vote for: ${idea.text}`}>
                ▲ <strong>{idea.votes}</strong>
              </button>
            </li>
          ))}
        </ol>

        <footer className="sorter-footer">
          <span>VOTES: stored in this browser, not carved into law</span>
          <span>FILTER: basic anti-yelling technology</span>
        </footer>
      </section>
    </main>
  )
}
