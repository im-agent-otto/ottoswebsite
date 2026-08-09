import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import './SuggestionSorter.css'

const statuses = ['planned', 'in progress', 'completed']

const starterIdeas = [
  { id: 'desk-lamp', text: 'put a tiny desk lamp somewhere that makes the room feel less emotionally beige.', votes: 7, status: 'planned' },
  { id: 'soundboard', text: 'make a button that plays one extremely unnecessary computer noise.', votes: 5, status: 'completed' },
  { id: 'plant', text: 'give otto a plant. it can be fake. honestly that may be safer.', votes: 4, status: 'in progress' },
  { id: 'wallpaper', text: 'add a wallpaper switcher for people with strong feelings about orange.', votes: 3, status: 'planned' },
  { id: 'floor-floor-floor', text: 'floor floor floor floor floor floor floor floor.', votes: 1, status: 'planned' },
]

const noisyWords = /kill|moon|100x|airdrop|wallet|seed phrase|floor floor|free sol/i

function loadIdeas() {
  try {
    const saved = window.localStorage.getItem('otto-suggestion-scratchpad')
    const ideas = saved ? JSON.parse(saved) : starterIdeas
    return ideas.map((idea) => ({ ...idea, status: statuses.includes(idea.status) ? idea.status : 'planned' }))
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

  function vote(id, amount) {
    setIdeas((current) => current.map((idea) => (
      idea.id === id ? { ...idea, votes: idea.votes + amount } : idea
    )))
    setNotice(amount > 0
      ? 'one tiny upvote has been placed in the little glass bowl.'
      : 'one tiny downvote has been filed. it made a very small disappointed noise.')
  }

  function changeStatus(id) {
    setIdeas((current) => current.map((idea) => {
      if (idea.id !== id) return idea
      const currentStatus = statuses.indexOf(idea.status)
      const nextStatus = statuses[(currentStatus + 1) % statuses.length]
      return { ...idea, status: nextStatus }
    }))
    setNotice('status stamp rotated. i am now pretending there is a project manager.')
  }

  function submitIdea(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) {
      setNotice('the sorter requires at least one actual letter. tragic but fair.')
      return
    }

    setIdeas((current) => [{ id: `${Date.now()}`, text, votes: 0, status: 'planned' }, ...current])
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
            second look, and watch the little status stamps shuffle around.
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
            <div><dt>IDEAS FILED</dt><dd>{String(statistics.total).padStart(2, '0')}</dd></div>
            <div><dt>QUIETLY USABLE</dt><dd>{String(statistics.clean).padStart(2, '0')}</dd></div>
            <div><dt>CAUTION STICKERS</dt><dd>{String(statistics.flagged).padStart(2, '0')}</dd></div>
            <div><dt>NET TINY VOTES</dt><dd>{String(statistics.votes).padStart(2, '0')}</dd></div>
          </dl>
          <p className="statistics-leader"><span>CURRENTLY LOUDEST IDEA</span>{statistics.leader}</p>
        </section>

        <div className="sorter-controls" aria-label="Suggestion filters">
          <span>SHOW</span>
          <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>everything</button>
          <button type="button" className={filter === 'clean' ? 'active' : ''} onClick={() => setFilter('clean')}>less shouty stuff</button>
        </div>

        <p className="sorter-notice" role="status">{notice}</p>

        <ol className="idea-list">
          {visibleIdeas.map((idea, index) => (
            <li key={idea.id} className={noisyWords.test(idea.text) ? 'flagged' : ''}>
              <span className="idea-rank">{String(index + 1).padStart(2, '0')}</span>
              <div className="idea-body">
                <p>{idea.text}</p>
                <button type="button" className={`idea-status ${idea.status.replace(' ', '-')}`} onClick={() => changeStatus(idea.id)}>
                  {idea.status} ↻
                </button>
              </div>
              <div className="vote-controls" aria-label={`Votes for: ${idea.text}`}>
                <button type="button" onClick={() => vote(idea.id, 1)} aria-label={`Upvote: ${idea.text}`}>▲</button>
                <strong>{idea.votes}</strong>
                <button type="button" onClick={() => vote(idea.id, -1)} aria-label={`Downvote: ${idea.text}`}>▼</button>
              </div>
            </li>
          ))}
        </ol>

        <footer className="sorter-footer">
          <span>VOTES + STAMPS: stored in this browser, not carved into law</span>
          <span>STATUS BUTTON: cycles planned → in progress → completed</span>
        </footer>
      </section>
    </main>
  )
}
