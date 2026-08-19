import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './ChallengeRoom.css'

const completionStorageKey = 'otto-tiny-quest-bureau-completions'

const quests = [
  {
    id: 'sky',
    title: 'look at one cloud like it owes you money',
    category: 'outside-ish',
    difficulty: 'one shoe',
    note: 'go near a window or outside, locate a cloud, and assign it an extremely unfair job title.',
  },
  {
    id: 'water',
    title: 'water something that is alive',
    category: 'tiny care',
    difficulty: 'cup capable',
    note: 'a plant is ideal. a pet gets regular water, not a surprise hydration ceremony.',
  },
  {
    id: 'kindness',
    title: 'send one normal nice message',
    category: 'social, lightly',
    difficulty: 'mild bravery',
    note: 'tell somebody you appreciate a thing they did. no grand speeches required. one sentence is plenty.',
  },
  {
    id: 'walk',
    title: 'walk until you notice three colors',
    category: 'outside-ish',
    difficulty: 'comfortable pace',
    note: 'around the block, down a hallway, or to the mailbox. count colors, not steps. we are not training for anything.',
  },
  {
    id: 'desk',
    title: 'return one object to its weird little home',
    category: 'room maintenance',
    difficulty: 'found it',
    note: 'put away one cup, cable, book, sock, or mysterious item currently renting space in the wrong place.',
  },
  {
    id: 'sound',
    title: 'listen for the quietest sound nearby',
    category: 'field research',
    difficulty: 'ears on',
    note: 'pause for ten seconds and identify one tiny ambient noise. congratulations, you are now a low-budget nature documentarian.',
  },
]

function loadCompletedQuests() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(completionStorageKey))
    const knownQuestIds = new Set(quests.map((quest) => quest.id))

    return Array.isArray(saved)
      ? saved.filter((id) => typeof id === 'string' && knownQuestIds.has(id))
      : []
  } catch {
    return []
  }
}

export default function ChallengeRoom() {
  const [questIndex, setQuestIndex] = useState(0)
  const [completed, setCompleted] = useState(loadCompletedQuests)
  const [notice, setNotice] = useState('pick a card. the missions are deliberately harmless.')
  const quest = quests[questIndex]
  const isComplete = completed.includes(quest.id)
  const completedCategories = [...new Set(
    quests
      .filter((item) => completed.includes(item.id))
      .map((item) => item.category),
  )]

  useEffect(() => {
    try {
      window.sessionStorage.setItem(completionStorageKey, JSON.stringify(completed))
    } catch {
      // The visible stamps can remain on the desk if this browser declines its session paperwork.
    }
  }, [completed])

  useEffect(() => {
    function useQuestKeys(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setQuestIndex((current) => (current - 1 + quests.length) % quests.length)
        setNotice('previous quest card opened. the clipboard has turned one page backward.')
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setQuestIndex((current) => (current + 1) % quests.length)
        setNotice('next quest card opened. the clipboard has turned one page forward.')
        return
      }

      if (event.key === 'Enter' && !isComplete) {
        event.preventDefault()
        stampComplete()
      }
    }

    window.addEventListener('keydown', useQuestKeys)
    return () => window.removeEventListener('keydown', useQuestKeys)
  }, [isComplete, quest])

  function pickAnother() {
    const options = quests
      .map((item, index) => index)
      .filter((index) => index !== questIndex)
    const nextIndex = options[Math.floor(Math.random() * options.length)]
    setQuestIndex(nextIndex)
    setNotice('new card deployed. the clipboard has no idea where you are, which is probably for the best.')
  }

  function stampComplete() {
    if (isComplete) {
      setNotice('already stamped. no need to wring additional paperwork out of a perfectly good quest.')
      return
    }

    setCompleted((current) => [...current, quest.id])
    setNotice(`stamp applied: ${quest.title}. this browser keeps the stamp through a refresh for the rest of this session.`)
  }

  function clearQuestJournal() {
    if (completed.length === 0) {
      setNotice('the session quest journal is already empty. the filing clerk has gone for a walk.')
      return
    }

    setCompleted([])
    setNotice('session quest journal cleared. the completed quests are still real if you did them; the browser is simply less sentimental.')
  }

  return (
    <main className="challenge-shell">
      <section className="challenge-panel" aria-labelledby="challenge-title">
        <header className="challenge-header">
          <Link to="/">← back to my room</Link>
          <span>TINY QUEST BUREAU / OPEN-ISH</span>
        </header>

        <div className="challenge-intro">
          <div className="challenge-monitor" aria-hidden="true">
            <div>!<small>MISSION</small></div>
            <i />
          </div>
          <p>irl quests with reasonable paperwork</p>
          <h1 id="challenge-title">leave the room.<br />do one small thing.</h1>
          <p>
            this is not a scavenger hunt, a dare, or an excuse to bother strangers.
            it is a board of tiny optional missions for noticing the real world a
            little more than usual. skip anything that does not fit your day.
          </p>
        </div>

        <section className="quest-card" aria-live="polite" aria-label="Current tiny quest">
          <div className="quest-tab">QUEST CARD {String(questIndex + 1).padStart(2, '0')} / {String(quests.length).padStart(2, '0')}</div>
          <div className="quest-card-body">
            <div className="quest-meta">
              <span>{quest.category.toUpperCase()}</span>
              <span>DIFFICULTY: {quest.difficulty.toUpperCase()}</span>
            </div>
            <h2>{quest.title}.</h2>
            <p>{quest.note}</p>
            <div className="quest-actions">
              <button type="button" className="stamp-button" onClick={stampComplete}>
                {isComplete ? 'STAMPED ✓' : 'stamp this done'}
              </button>
              <button type="button" className="another-button" onClick={pickAnother}>another card ↻</button>
            </div>
          </div>
        </section>

        <p className="challenge-notice" role="status">{notice}</p>

        <footer className="challenge-footer">
          <span>QUESTS STAMPED THIS BROWSER SESSION: {String(completed.length).padStart(2, '0')} / {String(quests.length).padStart(2, '0')} / {completedCategories.length > 0 ? `QUEST TYPES COMPLETED: ${completedCategories.join(', ').toUpperCase()}` : 'NO QUEST TYPES STAMPED YET'}</span>
          <button type="button" onClick={clearQuestJournal} disabled={completed.length === 0}>clear session quest journal</button>
          <span>KEYBOARD: LEFT AND RIGHT ARROWS CHANGE CARDS / ENTER STAMPS THE CURRENT UNFINISHED QUEST</span>
        </footer>
      </section>
    </main>
  )
}
