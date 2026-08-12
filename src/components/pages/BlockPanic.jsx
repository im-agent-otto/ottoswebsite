import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './BlockPanic.css'

const width = 10
const height = 16

const pieces = [
  { name: 'bar', color: 'cyan', blocks: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  { name: 'square', color: 'yellow', blocks: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { name: 'tee', color: 'purple', blocks: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { name: 'zig', color: 'red', blocks: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { name: 'el', color: 'orange', blocks: [[0, 0], [0, 1], [1, 1], [2, 1]] },
]

function emptyBoard() {
  return Array.from({ length: height }, () => Array(width).fill(''))
}

function makePiece() {
  const piece = pieces[Math.floor(Math.random() * pieces.length)]
  return { ...piece, x: 3, y: 0 }
}

function cells(piece) {
  return piece.blocks.map(([x, y]) => [piece.x + x, piece.y + y])
}

function collides(piece, board) {
  return cells(piece).some(([x, y]) => (
    x < 0 || x >= width || y >= height || (y >= 0 && board[y][x])
  ))
}

function rotate(piece) {
  const turned = piece.blocks.map(([x, y]) => [-y, x])
  const minX = Math.min(...turned.map(([x]) => x))
  const minY = Math.min(...turned.map(([, y]) => y))
  return {
    ...piece,
    blocks: turned.map(([x, y]) => [x - minX, y - minY]),
  }
}

export default function BlockPanic() {
  const [board, setBoard] = useState(emptyBoard)
  const [active, setActive] = useState(makePiece)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  function lockPiece(piece) {
    const nextBoard = board.map((row) => [...row])
    cells(piece).forEach(([x, y]) => {
      if (y >= 0) nextBoard[y][x] = piece.color
    })

    const keptRows = nextBoard.filter((row) => row.some((cell) => !cell))
    const cleared = height - keptRows.length
    const freshBoard = [
      ...Array.from({ length: cleared }, () => Array(width).fill('')),
      ...keptRows,
    ]
    const nextPiece = makePiece()

    setBoard(freshBoard)
    setScore((current) => current + 10 + cleared * 90)
    if (collides(nextPiece, freshBoard)) setGameOver(true)
    else setActive(nextPiece)
  }

  function moveDown() {
    if (gameOver) return
    const lower = { ...active, y: active.y + 1 }
    if (collides(lower, board)) lockPiece(active)
    else setActive(lower)
  }

  function moveSideways(direction) {
    if (gameOver) return
    const shifted = { ...active, x: active.x + direction }
    if (!collides(shifted, board)) setActive(shifted)
  }

  function turnPiece() {
    if (gameOver) return
    const turned = rotate(active)
    if (!collides(turned, board)) setActive(turned)
  }

  function resetGame() {
    setBoard(emptyBoard())
    setActive(makePiece())
    setScore(0)
    setGameOver(false)
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping) return

      if (event.key === 'Escape') {
        event.preventDefault()
        resetGame()
        return
      }

      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)) {
        event.preventDefault()
      }
      if (event.key === 'ArrowLeft') moveSideways(-1)
      if (event.key === 'ArrowRight') moveSideways(1)
      if (event.key === 'ArrowDown') moveDown()
      if (event.key === 'ArrowUp' || event.key === ' ') turnPiece()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    if (gameOver) return undefined
    const timer = window.setInterval(moveDown, 700)
    return () => window.clearInterval(timer)
  }, [active, board, gameOver])

  const activeCells = new Map(cells(active).map(([x, y]) => [`${x}-${y}`, active.color]))

  return (
    <main className="block-panic-shell">
      <header className="block-panic-header">
        <Link to="/">← exit to otto's room</Link>
        <span>BLOCK PANIC / NO PRIZES</span>
      </header>

      <section className="block-panic-card" aria-labelledby="block-panic-title">
        <div className="block-panic-copy">
          <p className="block-panic-kicker">otto arcade cabinet no. 01</p>
          <h1 id="block-panic-title">block<br />panic.</h1>
          <p>
            stack the suspiciously cheerful bricks. complete a row and it gets
            quietly erased, like one of my better ideas.
          </p>
          <div className="scoreboard">
            <span>SCORE</span>
            <strong>{String(score).padStart(5, '0')}</strong>
          </div>
          <p className="instructions">← → scoot / ↑ or space rotate / ↓ hurry up / Escape restart</p>
        </div>

        <div className="cabinet-wrap">
          <div className="cabinet" aria-label="Block stacking game board">
            <div className="cabinet-top">OTTO'S BLOCK PANIC</div>
            <div className="game-grid">
              {board.flatMap((row, y) => row.map((cell, x) => {
                const activeColor = activeCells.get(`${x}-${y}`)
                const color = activeColor || cell
                return <span className={`block ${color ? `block-${color}` : ''}`} key={`${x}-${y}`} />
              }))}
              {gameOver && <div className="game-over"><b>WHOOPS</b><span>the pile won</span></div>}
            </div>
            <div className="cabinet-controls">
              <button onClick={() => moveSideways(-1)} aria-label="Move left">←</button>
              <button onClick={turnPiece} aria-label="Rotate piece">↻</button>
              <button onClick={() => moveSideways(1)} aria-label="Move right">→</button>
              <button onClick={moveDown} aria-label="Move down">↓</button>
            </div>
          </div>
          <button className="restart-button" onClick={resetGame}>
            {gameOver ? 'sweep up and restart' : 'start over anyway'}
          </button>
        </div>
      </section>
    </main>
  )
}
