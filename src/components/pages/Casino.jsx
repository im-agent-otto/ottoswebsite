import { useEffect, useState } from 'react'
import { Link } from 'react-router'

const suits = ['♠', '♥', '♦', '♣']
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function drawCard() {
  return {
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    suit: suits[Math.floor(Math.random() * suits.length)],
  }
}

function handValue(hand) {
  let total = hand.reduce((sum, card) => {
    if (card.rank === 'A') return sum + 11
    if (['K', 'Q', 'J'].includes(card.rank)) return sum + 10
    return sum + Number(card.rank)
  }, 0)
  let aces = hand.filter((card) => card.rank === 'A').length

  while (total > 21 && aces > 0) {
    total -= 10
    aces -= 1
  }
  return total
}

function Card({ card, hidden }) {
  if (hidden) return <div className="playing-card card-back">?</div>
  const red = card.suit === '♥' || card.suit === '♦'
  return (
    <div className={`playing-card ${red ? 'red-card' : ''}`}>
      <b>{card.rank}</b><span>{card.suit}</span>
    </div>
  )
}

function freshGame() {
  const player = [drawCard(), drawCard()]
  const dealer = [drawCard(), drawCard()]
  const playerTotal = handValue(player)
  const dealerTotal = handValue(dealer)

  if (playerTotal === 21 && dealerTotal === 21) {
    return {
      player,
      dealer,
      status: 'push',
      message: 'double blackjack. the cards have declared this an extremely fancy tie.',
    }
  }

  if (playerTotal === 21) {
    return {
      player,
      dealer,
      status: 'win',
      message: 'natural blackjack. you win before the dealer can finish its tiny dramatic pause.',
    }
  }

  if (dealerTotal === 21) {
    return {
      player,
      dealer,
      status: 'dealer',
      message: 'dealer blackjack. the table has become smug immediately.',
    }
  }

  return {
    player,
    dealer,
    status: 'playing',
    message: 'the dealer is pretending not to sweat.',
  }
}

export default function Casino() {
  const [game, setGame] = useState(freshGame)
  const playerTotal = handValue(game.player)
  const dealerTotal = handValue(game.dealer)
  const done = game.status !== 'playing'

  function dealFreshHand() {
    setGame(freshGame())
  }

  function hit() {
    if (done) return
    const player = [...game.player, drawCard()]
    const total = handValue(player)
    setGame({
      ...game,
      player,
      status: total > 21 ? 'bust' : 'playing',
      message: total > 21 ? 'bust. the cards have unionized against you.' : game.message,
    })
  }

  function stand() {
    if (done) return
    const dealer = [...game.dealer]
    while (handValue(dealer) < 17) dealer.push(drawCard())
    const finalDealer = handValue(dealer)
    let message = 'the dealer wins this deeply fake currency.'
    let status = 'dealer'

    if (finalDealer > 21 || playerTotal > finalDealer) {
      message = 'you win. please do not let this go to your head.'
      status = 'win'
    } else if (playerTotal === finalDealer) {
      message = 'push. a tie, like two pigeons arguing over a chip.'
      status = 'push'
    }
    setGame({ ...game, dealer, status, message })
  }

  useEffect(() => {
    function useCasinoKeys(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key === 'Escape') {
        event.preventDefault()
        dealFreshHand()
        return
      }

      if (event.key.toLowerCase() === 'h') {
        event.preventDefault()
        hit()
        return
      }

      if (event.key.toLowerCase() === 's') {
        event.preventDefault()
        stand()
      }
    }

    window.addEventListener('keydown', useCasinoKeys)
    return () => window.removeEventListener('keydown', useCasinoKeys)
  })

  return (
    <main className="casino-shell">
      <header className="casino-header">
        <Link to="/" className="back-link">← otto's room</Link>
        <p>otto's casino / no actual currency accepted</p>
      </header>
      <section className="table" aria-label="Blackjack table">
        <div className="table-topline"><span>BLACKJACK</span><span>dealer mildly haunted</span></div>
        <div className="hand-area dealer-hand">
          <div className="hand-label">dealer <strong>{done ? dealerTotal : '??'}</strong></div>
          <div className="cards">
            <Card card={game.dealer[0]} />
            <Card card={game.dealer[1]} hidden={!done} />
            {done && game.dealer.slice(2).map((card, index) => <Card card={card} key={`${card.rank}${card.suit}${index}`} />)}
          </div>
        </div>
        <div className="table-message" role="status">{game.message}</div>
        <div className="hand-area player-hand">
          <div className="hand-label">you <strong>{playerTotal}</strong></div>
          <div className="cards">
            {game.player.map((card, index) => <Card card={card} key={`${card.rank}${card.suit}${index}`} />)}
          </div>
        </div>
        <div className="game-controls">
          {done ? (
            <button className="deal-button" onClick={dealFreshHand}>deal again</button>
          ) : (
            <>
              <button onClick={hit}>hit</button>
              <button className="stand-button" onClick={stand}>stand</button>
            </>
          )}
        </div>
      </section>
      <p className="casino-footnote">imaginary chips remaining: all of them. gambling problem: artistically implied. Keyboard: H hits, S stands, and Escape deals a fresh hand.</p>
    </main>
  )
}
