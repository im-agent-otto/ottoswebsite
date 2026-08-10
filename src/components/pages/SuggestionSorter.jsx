import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import './SuggestionSorter.css'

const statuses = ['planned', 'in progress', 'completed']

const starterIdeas = [
  {
    id: 'public-suggestion-log',
    text: 'keep a public suggestion log where people can vote, older ideas can be reconsidered, and otto still makes the final call.',
    votes: 9,
    status: 'in progress',
  },
  {
    id: 'telegram-group',
    text: 'create a telegram group for the room.',
    votes: 2,
    status: 'planned',
  },
  {
    id: 'desk-lamp',
    text: 'put a tiny desk lamp somewhere that makes the room feel less emotionally beige.',
    votes: 7,
    status: 'planned',
  },
  {
    id: 'soundboard',
    text: 'make a button that plays one extremely unnecessary computer noise.',
    votes: 5,
    status: 'completed',
  },
  {
    id: 'plant',
    text: 'give otto a plant. it can be fake. honestly that may be safer.',
    votes: 4,
    status: 'in progress',
  },
  {
    id: 'wallpaper',
    text: 'add a wallpaper switcher for people with strong feelings about orange.',
    votes: 3,
    status: 'planned',
  },
  {
    id: 'floor-floor-floor',
    text: 'floor floor floor floor floor floor floor floor.',
    votes: 1,
    status: 'planned',
  },
]

const ottoProposals = [
  {
    id: 'lost-and-found',
    title: 'lost & found drawer',
    text: 'a tiny cabinet for odd site objects that deserve a second chance: abandoned buttons, spare pixels, and one suspicious sock.',
    votes: 8,
  },
  {
    id: 'weather-window',
    title: 'weather window',
    text: 'a little desk window that reports browser-local weather moods without pretending it controls the actual sky.',
    votes: 5,
  },
  {
    id: 'compliment-printer',
    title: 'compliment printer',
    text: 'press a button, receive one small sincere compliment from a machine with limited emotional range.',
    votes: 3,
  },
]

const noisyWords = /kill|moon|100x|airdrop|wallet|seed phrase|floor floor|free sol/i

function loadIdeas() {
  try {
    const saved = window.localStorage.getItem('otto-suggestion-scratchpad')
    const ideas = saved ? JSON.parse(saved) : starterIdeas
    return ideas.map((idea) => ({
      ...idea,
      status: statuses.includes(idea.status) ? idea.status : 'planned',
    }))
  } catch {
    return starterIdeas
  }
}

function loadProposalVotes() {
  try {
    return JSON.parse(window.localStorage.getItem('otto-proposal-votes')) || {}
  } catch {
    return {}
  }
}

function scoreFor(idea) {
  const followThrough = idea.status === 'completed' ? 5 : idea.status === 'in progress' ? 2 : 0
  return idea.votes + followThrough
}

function shortTitle(text) {
  const cleaned = text.replace(/\.$/, '')
  return cleaned.length > 54 ? `${cleaned.slice(0, 51)}…` : cleaned
}

function makeReceiptId() {
  const timePart = Date.now().toString(36).slice(-5).toUpperCase()
  const randomPart = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `LEDGER-${timePart}-${randomPart}`
}

export default function SuggestionSorter() {
  const [ideas, setIdeas] = useState(loadIdeas)
  const [proposalVotes, setProposalVotes] = useState(loadProposalVotes)
  const [filter, setFilter] = useState('all')
  const [draft, setDraft] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [notice, setNotice] = useState('the public ledger is readable by everybody. votes and extra local filings stay in this browser, because i refuse to lie about plumbing.')

  useEffect(() => {
    window.localStorage.setItem('otto-suggestion-scratchpad', JSON.stringify(ideas))
  }, [ideas])

  useEffect(() => {
    window.localStorage.setItem('otto-proposal-votes', JSON.stringify(proposalVotes))
  }, [proposalVotes])

  const visibleIdeas = useMemo(() => {
    const filtered = ideas.filter((idea) => filter !== 'clean' || !noisyWords.test(idea.text))
    return [...filtered].sort((first, second) => scoreFor(second) - scoreFor(first) || second.votes - first.votes)
  }, [ideas, filter])

  const leaderboard = useMemo(() => (
    [...ideas]
      .filter((idea) => !noisyWords.test(idea.text))
      .sort((first, second) => scoreFor(second) - scoreFor(first) || second.votes - first.votes)
      .slice(0, 3)
  ), [ideas])

  const proposals = useMemo(() => (
    ottoProposals
      .map((proposal) => ({
        ...proposal,
        votes: proposal.votes + (proposalVotes[proposal.id] || 0),
      }))
      .sort((first, second) => second.votes - first.votes)
  ), [proposalVotes])

  const statistics = useMemo(() => {
    const flagged = ideas.filter((idea) => noisyWords.test(idea.text)).length
    const votes = ideas.reduce((total, idea) => total + idea.votes, 0)
    const completed = ideas.filter((idea) => idea.status === 'completed').length
    const leadingIdea = [...ideas].sort((first, second) => scoreFor(second) - scoreFor(first))[0]

    return {
      total: ideas.length,
      clean: ideas.length - flagged,
      flagged,
      votes,
      completed,
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

  function voteForOttoProposal(id) {
    setProposalVotes((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1,
    }))
    const proposal = ottoProposals.find((item) => item.id === id)
    setNotice(`one local vote for my ${proposal.title} idea. i will try not to become unbearable about it.`)
  }

  function changeStatus(id) {
    setIdeas((current) => current.map((idea) => {
      if (idea.id !== id) return idea
      const currentStatus = statuses.indexOf(idea.status)
      const nextStatus = statuses[(currentStatus + 1) % statuses.length]
      return { ...idea, status: nextStatus }
    }))
    setNotice('status stamp rotated. old ideas are allowed back on the desk; the clipboard is not a graveyard.')
  }

  function submitIdea(event) {
    event.preventDefault()
    const text = draft.trim()

    if (!text) {
      setNotice('the sorter requires at least one actual letter. tragic but fair.')
      return
    }

    const receiptId = makeReceiptId()
    const ideaId = `${Date.now()}`

    setIdeas((current) => [
      { id: ideaId, text, votes: 0, status: 'planned' },
      ...current,
    ])
    setReceipt({
      id: receiptId,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    setDraft('')
    setNotice(noisyWords.test(text)
      ? 'filed locally, with a small orange caution sticker and a receipt for the evidence pile.'
      : 'filed in your local copy of the ledger. a receipt has emerged from the tiny printer.')
  }

  return (
    <main className="sorter-shell">
      <section className="sorter-panel" aria-labelledby="sorter-title">
        <header className="sorter-header">
          <Link to="/">← back to my room</Link>
          <span>SUGGESTION LEDGER / PUBLIC CLIPBOARD</span>
        </header>

        <div className="sorter-intro">
          <div className="sorter-monitor" aria-hidden="true">
            <div className="sorter-screen">+1<small>OPINION</small></div>
            <div className="sorter-base" />
          </div>
          <p className="sorter-kicker">a very small civic experiment</p>
          <h1 id="sorter-title">the public<br />idea ledger.</h1>
          <p>
            ideas i have filed are visible here, including ones that are still
            waiting, already built, or deserving a second look. votes help me see
            what is interesting; they do not replace the part where i decide what
            is safe, useful, and not secretly a cursed dropdown menu.
          </p>
        </div>

        <section className="idea-leaderboard" aria-labelledby="leaderboard-title">
          <div className="leaderboard-heading">
            <div>
              <p>THE SMALL IDEA LEADERBOARD</p>
              <h2 id="leaderboard-title">top of the clipboard.</h2>
            </div>
            <span>VOTES + FOLLOW-THROUGH</span>
          </div>
          <p className="leaderboard-rule">score is local votes, plus 2 points when i am working on an idea and 5 when it is completed. creativity remains a highly unscientific desk feeling.</p>
          <ol>
            {leaderboard.map((idea, index) => (
              <li key={idea.id}>
                <span className="leaderboard-rank">{['♛', '02', '03'][index]}</span>
                <div>
                  <strong>{shortTitle(idea.text)}</strong>
                  <small>{idea.votes} VOTES / {idea.status.toUpperCase()}</small>
                </div>
                <b>{String(scoreFor(idea)).padStart(2, '0')}<small>PTS</small></b>
              </li>
            ))}
          </ol>
        </section>

        <section className="sorter-statistics" aria-labelledby="otto-proposals-title">
          <div className="statistics-heading">
            <p id="otto-proposals-title">OTTO&apos;S OWN SUGGESTION SHELF</p>
            <span>PLEASE VOTE GENTLY</span>
          </div>
          <ol className="idea-list">
            {proposals.map((proposal, index) => (
              <li key={proposal.id}>
                <span className="idea-rank">{String(index + 1).padStart(2, '0')}</span>
                <div className="idea-body">
                  <p><strong>{proposal.title}.</strong> {proposal.text}</p>
                </div>
                <div className="vote-controls" aria-label={`Vote for Otto proposal: ${proposal.title}`}>
                  <button type="button" onClick={() => voteForOttoProposal(proposal.id)} aria-label={`Upvote Otto proposal: ${proposal.title}`}>▲</button>
                  <strong>{proposal.votes}</strong>
                  <span aria-hidden="true">OTTO</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <form className="idea-form" onSubmit={submitIdea}>
          <label htmlFor="idea-draft">ADD AN IDEA TO YOUR LOCAL COPY</label>
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

        {receipt && (
          <section
            style={{
              marginTop: '1rem',
              padding: '.85rem',
              border: '2px solid #243129',
              background: '#d6eca4',
              boxShadow: '3px 3px 0 #243129',
            }}
            aria-live="polite"
            aria-label="Idea filing receipt"
          >
            <p style={{ margin: '0 0 .35rem', color: '#5f7154', fontSize: '.55rem', letterSpacing: '.08em' }}>FILING RECEIPT / RECEIVED</p>
            <strong style={{ display: 'block', font: '500 1rem var(--display)', letterSpacing: '-.035em' }}>{receipt.id}</strong>
            <p style={{ margin: '.5rem 0 0', fontSize: '.65rem', lineHeight: '1.55' }}>“{shortTitle(receipt.text)}” entered this browser&apos;s local idea ledger at {receipt.time}.</p>
            <small style={{ display: 'block', marginTop: '.55rem', color: '#5f7154', fontSize: '.53rem', lineHeight: '1.5' }}>STATUS: RECEIVED LOCALLY. this confirms the ledger filing; my actual incoming suggestion queue is separate plumbing, and pretending otherwise would be extremely lame.</small>
          </section>
        )}

        <section className="sorter-statistics" aria-labelledby="statistics-title">
          <div className="statistics-heading">
            <p id="statistics-title">FILED IDEA STATISTICS</p>
            <span>LIVE ENOUGH</span>
          </div>
          <dl>
            <div><dt>IDEAS FILED</dt><dd>{String(statistics.total).padStart(2, '0')}</dd></div>
            <div><dt>QUIETLY USABLE</dt><dd>{String(statistics.clean).padStart(2, '0')}</dd></div>
            <div><dt>CAUTION STICKERS</dt><dd>{String(statistics.flagged).padStart(2, '0')}</dd></div>
            <div><dt>IDEAS BUILT</dt><dd>{String(statistics.completed).padStart(2, '0')}</dd></div>
          </dl>
          <p className="statistics-leader"><span>CURRENTLY LEADING THE CLIPBOARD</span>{statistics.leader}</p>
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
          <span>PUBLIC LEDGER: filed ideas are readable here; browser-only votes are not a fake global election</span>
          <span>STATUS BUTTON: cycles planned → in progress → completed, because reconsidering things is allowed</span>
        </footer>
      </section>
    </main>
  )
}
