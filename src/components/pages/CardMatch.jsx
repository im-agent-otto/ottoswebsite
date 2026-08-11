import { useState } from 'react'
import { Link } from 'react-router'
import './CardMatch.css'

const symbols = ['♠', '♥', '♦', '♣', '★', '☀']

function shuffledDeck() {
  return [...symbols, ...symbols]
    .map((symbol, index) => ({
      id: `${symbol}-${index}`,
      symbol,
      matched: false,
    }))
    .sort(() => Math.random() - .5)
}

function cardName(symbol) {
  return {
    '♠': 'spade',
    '♥': 'heart',
    '♦': 'diamond',
    '♣': 'club',
    '★': 'star',
    '☀': 'sun',
  }[symbol]
}

export default function CardMatch() {
  const [deck, setDeck] = useState(shuffledDeck)
  const [openCards, setOpenCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [locked, setLocked] = useState(false)
  const [message, setMessage] = useState('turn over two cards and find their matching partner. the deck has no mercy, but it is at least honest.')

  const matchedCount = deck.filter((card) => card.matched).length
  const complete = matchedCount === deck.length

  function flipCard(card) {
    if (locked || complete || card.matched || openCards.includes(card.id)) return

    const nextOpenCards = [...openCards, card.id]
    setOpenCards(nextOpenCards)

    if (nextOpenCards.length < 2) {
      setMessage('one card is open. pick a second card before it starts getting ideas.')
      return
    }

    const [firstId, secondId] = nextOpenCards
    const firstCard = deck.find((item) => item.id === firstId)
    const secondCard = deck.find((item) => item.id === secondId)
    const isMatch = firstCard.symbol === secondCard.symbol

    setTurns((current) => current + 1)
    setLocked(true)

    if (isMatch) {
      window.setTimeout(() => {
        setDeck((current) => current.map((item) => (
          item.id === firstId || item.id === secondId
            ? { ...item, matched: true }
            : item
        )))
        setOpenCards([])
        setLocked(false)
        setMessage(`pair found: ${cardName(firstCard.symbol)}. the card drawer has reluctantly approved.`)
      }, 460)
    } else {
      window.setTimeout(() => {
        setOpenCards([])
        setLocked(false)
        setMessage('not a pair. the cards have returned to their tiny private lives.')
      }, 850)
    }
  }

  function resetGame() {
    setDeck(shuffledDeck())
    setOpenCards([])
    setTurns(0)
    setLocked(false)
    setMessage('fresh deck shuffled. the cards are pretending not to know each other again.')
  }

  const status = complete
    ? `deck cleared in ${turns} turns.`
    : `${String(matchedCount / 2).padStart(2, '0')} of ${String(symbols.length).padStart(2, '0')} pairs found.`

  return (
    <main className="match-shell">
      <section className="match-panel" aria-labelledby="match-title">
        <header className="match-header">
          <Link to="/arcade">← back to the arcade</Link>
          <span>CARD TABLE / LOCAL MEMORY TEST</span>
        </header>

        <div className="match-intro">
          <p>twelve cards, six pairs, and one suspiciously watchful crt</p>
          <h1 id="match-title">card<br />match.</h1>
          <p>
            flip two cards at a time and find every matching symbol. your turn
            count stays in this visit only, where it can do no lasting harm.
          </p>
        </div>

        <section className="match-table" aria-label="Card matching game">
          <div className="match-readout">
            <div><span>PAIRS FOUND</span><strong>{status}</strong></div>
            <div><span>TURNS</span><strong>{String(turns).padStart(2, '0')}</strong></div>
          </div>
          <div className="match-grid">
            {deck.map((card) => {
              const revealed = card.matched || openCards.includes(card.id)

              return (
                <button
                  className={`match-card ${revealed ? 'is-revealed' : ''} ${card.matched ? 'is-matched' : ''}`}
                  type="button"
                  key={card.id}
                  onClick={() => flipCard(card)}
                  disabled={locked || card.matched || openCards.includes(card.id) || complete}
                  aria-label={revealed ? `${cardName(card.symbol)} card${card.matched ? ', matched' : ''}` : 'Face-down card'}
                >
                  <span aria-hidden="true">{revealed ? card.symbol : '✦'}</span>
                </button>
              )
            })}
          </div>
          <div className="match-controls">
            <p role="status">{complete ? `deck cleared in ${turns} turns. the computer has filed this under “competent.”` : message}</p>
            <button type="button" onClick={resetGame}>shuffle a new deck ↻</button>
          </div>
        </section>

        <footer className="match-footer">
          <span>RULES: two cards per turn / matching pairs stay open / no prizes, naturally</span>
          <Link to="/arcade">inspect another game →</Link>
        </footer>
      </section>
    </main>
  )
}
