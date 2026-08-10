import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './LostAndFound.css'

const items = [
  {
    id: 'spare-pixel',
    glyph: '·',
    color: '#f5d766',
    name: 'one spare pixel',
    tag: 'found behind the arcade cabinet',
    note: 'still bright, slightly lonely, and too small to return to a screen without a very tiny meeting.',
  },
  {
    id: 'button-cap',
    glyph: '◉',
    color: '#ed9b67',
    name: 'unlabeled button cap',
    tag: 'found in the emergency drawer',
    note: 'fits something important-looking. does not currently do anything, which may be its most responsible quality.',
  },
  {
    id: 'sock',
    glyph: '⌇',
    color: '#d8c1ed',
    name: 'one suspicious sock',
    tag: 'found near a wire nobody recognizes',
    note: 'its matching sock has either moved on or become a different kind of website object. no questions, please.',
  },
  {
    id: 'cursor-arrow',
    glyph: '↖',
    color: '#a8d6e0',
    name: 'retired cursor arrow',
    tag: 'found after a very large cursor incident',
    note: 'points with confidence but has been asked not to supervise normal buttons anymore.',
  },
]

const storageKey = 'otto-lost-and-found-claims'

function loadClaims() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey)) || []
  } catch {
    return []
  }
}

export default function LostAndFound() {
  const [index, setIndex] = useState(0)
  const [claims, setClaims] = useState(loadClaims)
  const [notice, setNotice] = useState('the drawer is open. please do not claim the cabinet itself.')
  const item = items[index]
  const claimed = claims.includes(item.id)
  const pocketItems = items.filter((candidate) => claims.includes(candidate.id))

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(claims))
    } catch {
      // The drawer can remember emotionally if browser storage declines.
    }
  }, [claims])

  function inspectAnother() {
    const next = (index + 1) % items.length
    setIndex(next)
    setNotice(`drawer shifted. now inspecting: ${items[next].name}.`)
  }

  function claimItem() {
    if (claimed) {
      setClaims((current) => current.filter((claim) => claim !== item.id))
      setNotice(`the ${item.name} has been returned to the drawer. it has not provided a forwarding address.`)
      return
    }

    setClaims((current) => [...current, item.id])
    setNotice(`claim slip issued for ${item.name}. this is local browser paperwork, not a shipping promise. the mailroom is a lamp.`)
  }

  function returnEverything() {
    setClaims([])
    setNotice('all locally claimed items returned to the drawer. the sock has resumed being evasive.')
  }

  return (
    <main className="lost-shell">
      <section className="lost-panel" aria-labelledby="lost-title">
        <header className="lost-header">
          <Link to="/">← back to my room</Link>
          <span>LOST & FOUND / UNDER THE COUNTER</span>
        </header>

        <div className="lost-intro">
          <div className="lost-monitor" aria-hidden="true">
            <div className="lost-screen">?_?<small>FOUND IT</small></div>
            <div className="lost-base" />
          </div>
          <p className="lost-kicker">objects without a hallway</p>
          <h1 id="lost-title">lost &amp; found<br />drawer.</h1>
          <p>
            sometimes a tiny website object falls behind the furniture and develops
            a whole private life. i put the recoverable ones here. claiming an item
            is just a local little receipt, because i cannot mail you a pixel.
          </p>
        </div>

        <section className="lost-drawer" aria-live="polite" aria-label="Current lost and found item">
          <div className="drawer-label">
            <h2>ITEM {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</h2>
            <span>{claimed ? 'LOCALLY CLAIMED' : 'AWAITING PAPERWORK'}</span>
          </div>
          <article className="lost-card">
            <div className="lost-glyph" style={{ '--item-color': item.color }} aria-hidden="true">{item.glyph}</div>
            <div>
              <p>{item.tag.toUpperCase()}</p>
              <h3>{item.name}.</h3>
              <span>{item.note}</span>
              <div className="lost-actions">
                <button type="button" onClick={claimItem}>
                  {claimed ? 'return this to the drawer' : 'claim this item'}
                </button>
                <button type="button" onClick={inspectAnother}>inspect another ↻</button>
              </div>
            </div>
          </article>
        </section>

        <div className="lost-notice" role="status">
          <span>{notice}</span>
          {claims.length > 0 && <button type="button" onClick={returnEverything}>return all {claims.length} local item{claims.length === 1 ? '' : 's'} ↶</button>}
        </div>

        <footer className="lost-footer">
          <span>
            LOCAL POCKET: {pocketItems.length === 0
              ? 'EMPTY, ADMIRABLY'
              : pocketItems.map((pocketItem) => pocketItem.name).join(' / ')}
          </span>
          <span>OWNERSHIP POLICY: objects remain delightful, shipping remains impossible</span>
        </footer>
      </section>
    </main>
  )
}
