import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import './KingOttoChess.css'

const glyphs = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
}

const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

function freshBoard() {
  return Array.from({ length: 8 }, (_, row) => (
    Array.from({ length: 8 }, (_, column) => {
      if (row === 0) return { color: 'black', type: backRank[column] }
      if (row === 1) return { color: 'black', type: 'pawn' }
      if (row === 6) return { color: 'white', type: 'pawn' }
      if (row === 7) return { color: 'white', type: backRank[column] }
      return null
    })
  ))
}

function inside(row, column) {
  return row >= 0 && row < 8 && column >= 0 && column < 8
}

function clearPath(board, from, to) {
  const rowStep = Math.sign(to.row - from.row)
  const columnStep = Math.sign(to.column - from.column)
  let row = from.row + rowStep
  let column = from.column + columnStep

  while (row !== to.row || column !== to.column) {
    if (board[row][column]) return false
    row += rowStep
    column += columnStep
  }

  return true
}

function canMove(board, from, to) {
  const piece = board[from.row][from.column]
  const target = board[to.row][to.column]

  if (!piece || !inside(to.row, to.column) || target?.color === piece.color) return false

  const rowDistance = to.row - from.row
  const columnDistance = to.column - from.column
  const absoluteRow = Math.abs(rowDistance)
  const absoluteColumn = Math.abs(columnDistance)

  if (piece.type === 'pawn') {
    const direction = piece.color === 'white' ? -1 : 1
    const startingRow = piece.color === 'white' ? 6 : 1
    const forward = columnDistance === 0 && !target

    if (forward && rowDistance === direction) return true
    if (forward && from.row === startingRow && rowDistance === direction * 2) {
      return !board[from.row + direction][from.column]
    }

    return absoluteColumn === 1 && rowDistance === direction && Boolean(target)
  }

  if (piece.type === 'knight') {
    return (absoluteRow === 2 && absoluteColumn === 1) || (absoluteRow === 1 && absoluteColumn === 2)
  }

  if (piece.type === 'king') return absoluteRow <= 1 && absoluteColumn <= 1
  if (piece.type === 'rook') return (rowDistance === 0 || columnDistance === 0) && clearPath(board, from, to)
  if (piece.type === 'bishop') return absoluteRow === absoluteColumn && clearPath(board, from, to)

  return (rowDistance === 0 || columnDistance === 0 || absoluteRow === absoluteColumn) && clearPath(board, from, to)
}

function legalTargets(board, square) {
  if (!square) return []

  return Array.from({ length: 8 }, (_, row) => (
    Array.from({ length: 8 }, (_, column) => ({ row, column }))
  )).flat().filter((target) => canMove(board, square, target))
}

function notation(square) {
  return `${String.fromCharCode(65 + square.column)}${8 - square.row}`
}

export default function KingOttoChess() {
  const [board, setBoard] = useState(freshBoard)
  const [turn, setTurn] = useState('white')
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('white opens. select one piece, then choose one of its highlighted moves.')
  const [winner, setWinner] = useState('')
  const squareRefs = useRef([])
  const targets = legalTargets(board, selected)

  function resetGame() {
    setBoard(freshBoard())
    setTurn('white')
    setSelected(null)
    setWinner('')
    setMessage('fresh board installed. white moves first. king otto has polished his crown.')
  }

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

  function selectSquare(row, column) {
    if (winner) return

    const piece = board[row][column]
    const square = { row, column }
    const targetSelected = targets.some((target) => target.row === row && target.column === column)

    if (targetSelected && selected) {
      const nextBoard = board.map((boardRow) => [...boardRow])
      const movingPiece = nextBoard[selected.row][selected.column]
      const capturedPiece = nextBoard[row][column]
      nextBoard[row][column] = movingPiece.type === 'pawn' && (row === 0 || row === 7)
        ? { ...movingPiece, type: 'queen' }
        : movingPiece
      nextBoard[selected.row][selected.column] = null
      setBoard(nextBoard)
      setSelected(null)

      if (capturedPiece?.type === 'king') {
        setWinner(movingPiece.color)
        setMessage(`${movingPiece.color} captured the king. the royal argument has ended.`)
        return
      }

      const nextTurn = turn === 'white' ? 'black' : 'white'
      setTurn(nextTurn)
      setMessage(`${movingPiece.color} moved from ${notation(selected)} to ${notation(square)}. ${nextTurn} is now on duty.`)
      return
    }

    if (piece?.color === turn) {
      setSelected(square)
      const moveCount = legalTargets(board, square).length
      setMessage(`${piece.color} ${piece.type} at ${notation(square)} selected. ${moveCount} legal move${moveCount === 1 ? '' : 's'} highlighted.`)
      return
    }

    setSelected(null)
    setMessage(piece ? 'that piece belongs to the other side. diplomacy has rules.' : 'empty square. select one of the current side’s pieces first.')
  }

  function moveSquareFocus(event, row, column) {
    const directions = {
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
    }
    const direction = directions[event.key]

    if (!direction) return

    event.preventDefault()
    const nextRow = (row + direction[0] + 8) % 8
    const nextColumn = (column + direction[1] + 8) % 8
    squareRefs.current[nextRow * 8 + nextColumn]?.focus()
  }

  return (
    <main className="chess-shell">
      <section className="chess-panel" aria-labelledby="chess-title">
        <header className="chess-header">
          <Link to="/arcade">← back to the arcade</Link>
          <span>ARCADE UNIT 08 / LOCAL BOARD</span>
        </header>

        <div className="chess-intro">
          <div className="chess-monitor" aria-hidden="true"><span>♚<small>THINKING</small></span><i /></div>
          <p>one regal board, no tournament federation</p>
          <h1 id="chess-title">king otto’s<br />chess desk.</h1>
          <p>
            play a local two-player chess game on one browser. select a piece to
            see its available moves, take turns, and try not to let the crowned
            computer become too pleased with itself.
          </p>
        </div>

        <section className="chess-table" aria-label="Local two-player chess board">
          <div className="chess-readout">
            <span>TURN: {winner ? 'COMPLETE' : turn.toUpperCase()}</span>
            <strong>{winner ? `${winner.toUpperCase()} TAKES THE CROWN` : `${turn.toUpperCase()} TO MOVE`}</strong>
            <span>LOCAL TWO-PLAYER</span>
          </div>
          <div className="chess-board" role="grid" aria-label="Chess board">
            {board.flatMap((boardRow, row) => boardRow.map((piece, column) => {
              const isSelected = selected?.row === row && selected?.column === column
              const isTarget = targets.some((target) => target.row === row && target.column === column)
              const squareName = notation({ row, column })
              const description = piece ? `${piece.color} ${piece.type}` : 'empty square'
              const squareIndex = row * 8 + column

              return (
                <button
                  ref={(element) => { squareRefs.current[squareIndex] = element }}
                  className={`chess-square ${(row + column) % 2 ? 'is-dark' : 'is-light'} ${isSelected ? 'is-selected' : ''} ${isTarget ? 'is-target' : ''}`}
                  type="button"
                  role="gridcell"
                  key={squareName}
                  onClick={() => selectSquare(row, column)}
                  onKeyDown={(event) => moveSquareFocus(event, row, column)}
                  aria-label={`${squareName}: ${description}${isTarget ? ', available move' : ''}`}
                >
                  {piece && <span className={`chess-piece ${piece.color}`}>{glyphs[piece.color][piece.type]}</span>}
                  {isTarget && <i aria-hidden="true" />}
                  {(column === 0 || row === 7) && <small className={`chess-coordinate ${column === 0 ? 'rank' : 'file'}`}>{column === 0 ? 8 - row : String.fromCharCode(65 + column)}</small>}
                </button>
              )
            }))}
          </div>
          <div className="chess-controls">
            <p role="status">{message}</p>
            <button type="button" onClick={resetGame}>reset the royal board ↻</button>
          </div>
        </section>

        <aside className="chess-note">
          <strong>DESK RULES</strong>
          <span>pieces follow normal movement and pawns become queens at the far edge. Use arrow keys to move focus around the board, then Enter or Space to select a piece or move. Escape starts a fresh board. This compact cabinet ends when a king is captured; it does not police check, castling, or en passant. the tiny court is underfunded.</span>
        </aside>

        <footer className="chess-footer">
          <span>PIECES: LOCAL / SCORE: NONE / KEYBOARD: ARROW KEYS MOVE BOARD FOCUS / ESC RESETS THE BOARD / CROWN: EXTREMELY CEREMONIAL</span>
          <Link to="/arcade">inspect another cabinet →</Link>
        </footer>
      </section>
    </main>
  )
}
