import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './TicTacToe.css'

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function winnerFor(board) {
  const winningLine = lines.find(([first, second, third]) => (
    board[first] && board[first] === board[second] && board[first] === board[third]
  ))

  return winningLine ? board[winningLine[0]] : ''
}

function computerMove(board) {
  const emptySquares = board
    .map((square, index) => (square ? null : index))
    .filter((square) => square !== null)

  for (const square of emptySquares) {
    const testBoard = [...board]
    testBoard[square] = 'O'
    if (winnerFor(testBoard) === 'O') return square
  }

  for (const square of emptySquares) {
    const testBoard = [...board]
    testBoard[square] = 'X'
    if (winnerFor(testBoard) === 'X') return square
  }

  if (!board[4]) return 4
  return emptySquares[Math.floor(Math.random() * emptySquares.length)]
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(''))
  const [turn, setTurn] = useState('X')
  const [message, setMessage] = useState('your turn: place an X. i will be O, which is objectively the rounder letter.')

  const winner = winnerFor(board)
  const fullBoard = board.every(Boolean)
  const gameOver = Boolean(winner) || fullBoard

  function resetGame() {
    setBoard(Array(9).fill(''))
    setTurn('X')
    setMessage('fresh board. you are X again. do not let the center become a whole thing.')
  }

  useEffect(() => {
    if (turn !== 'O' || gameOver) return undefined

    const timer = window.setTimeout(() => {
      setBoard((current) => {
        const square = computerMove(current)
        const nextBoard = [...current]
        nextBoard[square] = 'O'
        const nextWinner = winnerFor(nextBoard)

        if (nextWinner === 'O') setMessage('i made three Os in a row. the cabinet has awarded itself a small private trophy.')
        else if (nextBoard.every(Boolean)) setMessage('a draw. the grid has achieved a bureaucratically perfect stalemate.')
        else setMessage('my O is down. your turn, X person.')

        return nextBoard
      })
      setTurn('X')
    }, 420)

    return () => window.clearTimeout(timer)
  }, [turn, gameOver])

  useEffect(() => {
    function useEscapeReset(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (event.key !== 'Escape' || isTyping) return

      event.preventDefault()
      resetGame()
    }

    window.addEventListener('keydown', useEscapeReset)
    return () => window.removeEventListener('keydown', useEscapeReset)
  }, [])

  function playSquare(index) {
    if (board[index] || turn !== 'X' || gameOver) return

    const nextBoard = [...board]
    nextBoard[index] = 'X'
    const nextWinner = winnerFor(nextBoard)
    setBoard(nextBoard)

    if (nextWinner === 'X') {
      setMessage('you won. i will now inspect the diagonals with professional disappointment.')
      return
    }

    if (nextBoard.every(Boolean)) {
      setMessage('a draw. nobody gets a trophy, which feels fiscally responsible.')
      return
    }

    setTurn('O')
    setMessage('my turn. the tiny O player is examining the grid.')
  }

  const result = winner === 'X' ? 'YOU WIN' : winner === 'O' ? 'OTTO WINS' : fullBoard ? 'DRAW' : turn === 'O' ? 'OTTO THINKING' : 'YOUR TURN'

  return (
    <main className="ttt-shell">
      <header className="ttt-header">
        <Link to="/arcade">← back to the arcade</Link>
        <span>ARCADE UNIT 06 / GRID ARGUMENT</span>
      </header>

      <section className="ttt-machine" aria-labelledby="ttt-title">
        <div className="ttt-side">
          <p>OTTO ARCADE CABINET 06</p>
          <h1 id="ttt-title">tic-tac<br />toe.</h1>
          <p className="ttt-intro">make three Xs in a row before my local O player does. no accounts, rankings, or disputed tournament officials have been installed.</p>
          <dl className="ttt-key">
            <div><dt>YOU</dt><dd>X</dd></div>
            <div><dt>OTTO</dt><dd>O</dd></div>
          </dl>
        </div>

        <section className="ttt-cabinet" aria-label="Tic-tac-toe game">
          <div className="ttt-marquee">OTTO&apos;S GRID ARGUMENT</div>
          <div className="ttt-status" aria-live="polite">
            <span>STATUS LIGHT</span>
            <strong>{result}</strong>
          </div>
          <div className="ttt-board" role="grid" aria-label="Tic-tac-toe board">
            {board.map((square, index) => (
              <button
                type="button"
                role="gridcell"
                key={index}
                onClick={() => playSquare(index)}
                disabled={Boolean(square) || turn !== 'X' || gameOver}
                aria-label={square ? `Square ${index + 1}: ${square}` : `Place X in square ${index + 1}`}
              >
                {square}
              </button>
            ))}
          </div>
          <button className="ttt-reset" type="button" onClick={resetGame}>start a new game ↻</button>
        </section>

        <aside className="ttt-message" role="status">
          <span>DESK COMMENTARY</span>
          <strong>{message}</strong>
        </aside>
      </section>
    </main>
  )
}
