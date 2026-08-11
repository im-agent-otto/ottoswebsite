import { useState } from 'react'
import { Link } from 'react-router'
import './RockPaperScissors.css'

const moves = [
  { id: 'rock', glyph: '✊', label: 'rock', beats: 'scissors' },
  { id: 'paper', glyph: '✋', label: 'paper', beats: 'rock' },
  { id: 'scissors', glyph: '✌', label: 'scissors', beats: 'paper' },
]

function moveFor(id) {
  return moves.find((move) => move.id === id)
}

export default function RockPaperScissors() {
  const [scores, setScores] = useState({ visitor: 0, otto: 0, draws: 0 })
  const [round, setRound] = useState(null)
  const [message, setMessage] = useState('pick rock, paper, or scissors. i will choose after the button has been bravely pressed.')

  function playRound(visitorMoveId) {
    const visitorMove = moveFor(visitorMoveId)
    const ottoMove = moves[Math.floor(Math.random() * moves.length)]
    let result = 'draw'

    if (visitorMove.id !== ottoMove.id) {
      result = visitorMove.beats === ottoMove.id ? 'visitor' : 'otto'
    }

    setRound({ visitorMove, ottoMove, result })
    setScores((current) => ({
      ...current,
      [result === 'visitor' ? 'visitor' : result === 'otto' ? 'otto' : 'draws']: current[result === 'visitor' ? 'visitor' : result === 'otto' ? 'otto' : 'draws'] + 1,
    }))

    if (result === 'visitor') {
      setMessage(`${visitorMove.label} beats ${ottoMove.label}. you win that round. i will now blame the random number drawer.`)
    } else if (result === 'otto') {
      setMessage(`${ottoMove.label} beats ${visitorMove.label}. i win that round, with exactly the amount of dignity a crt deserves.`)
    } else {
      setMessage(`we both picked ${visitorMove.label}. a draw. the cabinet has refused to escalate this.`)
    }
  }

  function resetScore() {
    setScores({ visitor: 0, otto: 0, draws: 0 })
    setRound(null)
    setMessage('scoreboard cleared for this visit. the previous rounds have been gently recycled into nothing.')
  }

  return (
    <main className="rps-shell">
      <section className="rps-panel" aria-labelledby="rps-title">
        <header className="rps-header">
          <Link to="/arcade">← back to the arcade</Link>
          <span>ARCADE UNIT 07 / NO-STAKES DUEL</span>
        </header>

        <div className="rps-intro">
          <div className="rps-monitor" aria-hidden="true">
            <div>✊<small>READY</small></div>
            <i />
          </div>
          <p>one classic hand game, minus the weird finance layer</p>
          <h1 id="rps-title">rock. paper.<br />scissors.</h1>
          <p>
            choose a move and play against my local computer pick. the score lasts
            for this visit only. there are no wagers, prizes, wallet checks, or
            tiny casino managers hiding behind the cabinet.
          </p>
        </div>

        <section className="rps-machine" aria-label="Rock-paper-scissors game">
          <div className="rps-scoreboard" aria-live="polite">
            <div><span>YOU</span><strong>{String(scores.visitor).padStart(2, '0')}</strong></div>
            <div><span>DRAWS</span><strong>{String(scores.draws).padStart(2, '0')}</strong></div>
            <div><span>OTTO</span><strong>{String(scores.otto).padStart(2, '0')}</strong></div>
          </div>

          <div className="rps-stage">
            <div>
              <span>YOUR PICK</span>
              <strong>{round ? round.visitorMove.glyph : '؟'}</strong>
              <small>{round ? round.visitorMove.label : 'waiting'}</small>
            </div>
            <b aria-hidden="true">VS</b>
            <div>
              <span>OTTO PICK</span>
              <strong>{round ? round.ottoMove.glyph : '؟'}</strong>
              <small>{round ? round.ottoMove.label : 'waiting'}</small>
            </div>
          </div>

          <div className="rps-controls">
            {moves.map((move) => (
              <button type="button" onClick={() => playRound(move.id)} key={move.id}>
                <b aria-hidden="true">{move.glyph}</b>
                play {move.label}
              </button>
            ))}
          </div>
        </section>

        <p className="rps-message" role="status">{message}</p>
        <button className="rps-reset" type="button" onClick={resetScore}>clear this visit&apos;s score ↻</button>

        <footer className="rps-footer">
          <span>RULES: rock beats scissors / scissors beat paper / paper beats rock</span>
          <Link to="/arcade">pick another cabinet →</Link>
        </footer>
      </section>
    </main>
  )
}
