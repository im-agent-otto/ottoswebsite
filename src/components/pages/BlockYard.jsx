import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import './BlockYard.css'

const columns = 10
const rows = 8
const historyLimit = 30
const yardStorageKey = 'otto-block-yard-current-build'

const bricks = [
  { id: 'orange', label: 'orange brick', glyph: '■', shortcut: '1' },
  { id: 'blue', label: 'blue brick', glyph: '■', shortcut: '2' },
  { id: 'green', label: 'green brick', glyph: '■', shortcut: '3' },
  { id: 'yellow', label: 'yellow brick', glyph: '■', shortcut: '4' },
  { id: 'erase', label: 'eraser', glyph: '×', shortcut: '5' },
]

const planSymbols = {
  orange: 'O',
  blue: 'B',
  green: 'G',
  yellow: 'Y',
  '': '·',
}

function freshYard() {
  return Array(columns * rows).fill('')
}

function loadYard() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(yardStorageKey))
    const usableBricks = new Set(bricks.map((brick) => brick.id))

    if (
      !Array.isArray(saved) ||
      saved.length !== columns * rows ||
      saved.some((brick) => brick !== '' && !usableBricks.has(brick))
    ) {
      return freshYard()
    }

    return saved
  } catch {
    return freshYard()
  }
}

function yardsMatch(first, second) {
  return first.every((brick, index) => brick === second[index])
}

function buildPlan(yard) {
  const rowsOfBlocks = Array.from({ length: rows }, (_, row) => (
    yard
      .slice(row * columns, (row + 1) * columns)
      .map((brick) => planSymbols[brick])
      .join(' ')
  ))

  return [
    'OTTO BLOCK YARD BUILD PLAN',
    'O = orange / B = blue / G = green / Y = yellow / · = empty',
    '',
    ...rowsOfBlocks,
  ].join('\n')
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

export default function BlockYard() {
  const [yard, setYard] = useState(loadYard)
  const [history, setHistory] = useState([])
  const [redoHistory, setRedoHistory] = useState([])
  const [tool, setTool] = useState('orange')
  const [notice, setNotice] = useState('orange brick selected. click an empty square to start building.')
  const squareRefs = useRef([])

  useEffect(() => {
    try {
      window.sessionStorage.setItem(yardStorageKey, JSON.stringify(yard))
    } catch {
      // The construction clipboard can forget after a refresh if browser storage is unavailable.
    }
  }, [yard])

  function rememberChange(nextYard) {
    if (yardsMatch(yard, nextYard)) return false

    setHistory((current) => [...current, yard].slice(-historyLimit))
    setRedoHistory([])
    setYard(nextYard)
    return true
  }

  function placeBrick(index) {
    const brick = bricks.find((item) => item.id === tool)
    const nextYard = yard.map((cell, cellIndex) => (
      cellIndex === index ? (tool === 'erase' ? '' : tool) : cell
    ))

    if (!rememberChange(nextYard)) {
      setNotice(tool === 'erase'
        ? 'that square is already empty. the demolition crew has nothing to do.'
        : `that square already has an ${brick.label}. duplicate paperwork has been declined.`)
      return
    }

    setNotice(tool === 'erase'
      ? 'one block removed. the demolition crew was surprisingly efficient.'
      : `${brick.label} placed. the building has acquired one more extremely local decision.`)
  }

  function chooseTool(nextTool) {
    const brick = bricks.find((item) => item.id === nextTool)
    setTool(nextTool)
    setNotice(`${brick.label} selected. the block supply is unlimited because this is a browser, not a warehouse.`)
  }

  function clearYard() {
    if (!rememberChange(freshYard())) {
      setNotice('the whole block yard is already clear. the broom has been sent home early.')
      return
    }

    setNotice('the whole block yard has been cleared. no tiny tenants were displaced.')
  }

  function undoLastChange() {
    const previousYard = history[history.length - 1]
    if (!previousYard) return

    setHistory((current) => current.slice(0, -1))
    setRedoHistory((current) => [...current, yard].slice(-historyLimit))
    setYard(previousYard)
    setNotice(`last yard change reversed. ${history.length - 1} earlier change${history.length - 1 === 1 ? '' : 's'} still available.`)
  }

  function redoLastChange() {
    const nextYard = redoHistory[redoHistory.length - 1]
    if (!nextYard) return

    setRedoHistory((current) => current.slice(0, -1))
    setHistory((current) => [...current, yard].slice(-historyLimit))
    setYard(nextYard)
    setNotice(`reversed yard change restored. ${redoHistory.length - 1} more redo${redoHistory.length - 1 === 1 ? '' : 's'} still available.`)
  }

  async function copyBuildPlan() {
    try {
      await copyText(buildPlan(yard))
      setNotice('build plan copied as an eight-row text layout. the construction crew has produced paperwork.')
    } catch {
      setNotice('the build plan could not reach the clipboard. the grid is still here, looking employable.')
    }
  }

  useEffect(() => {
    function useYardShortcuts(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable
      const usesCommandKey = event.ctrlKey || event.metaKey

      if (isTyping) return

      if (!usesCommandKey) {
        const shortcutTool = bricks.find((brick) => brick.shortcut === event.key)

        if (shortcutTool) {
          event.preventDefault()
          chooseTool(shortcutTool.id)
        }

        return
      }

      const key = event.key.toLowerCase()
      const wantsRedo = key === 'y' || (key === 'z' && event.shiftKey)
      const wantsUndo = key === 'z' && !event.shiftKey

      if (wantsRedo && redoHistory.length > 0) {
        event.preventDefault()
        redoLastChange()
      } else if (wantsUndo && history.length > 0) {
        event.preventDefault()
        undoLastChange()
      }
    }

    window.addEventListener('keydown', useYardShortcuts)
    return () => window.removeEventListener('keydown', useYardShortcuts)
  }, [history, redoHistory, yard])

  function moveSquareFocus(event, index) {
    const offsets = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns,
      ArrowDown: columns,
    }
    const offset = offsets[event.key]

    if (offset === undefined) return

    event.preventDefault()

    const row = Math.floor(index / columns)
    const column = index % columns
    let nextIndex = index

    if (event.key === 'ArrowLeft') {
      nextIndex = row * columns + (column - 1 + columns) % columns
    } else if (event.key === 'ArrowRight') {
      nextIndex = row * columns + (column + 1) % columns
    } else if (event.key === 'ArrowUp') {
      nextIndex = ((row - 1 + rows) % rows) * columns + column
    } else if (event.key === 'ArrowDown') {
      nextIndex = ((row + 1) % rows) * columns + column
    }

    squareRefs.current[nextIndex]?.focus()
  }

  const placedCount = yard.filter(Boolean).length

  return (
    <main className="yard-shell">
      <section className="yard-panel" aria-labelledby="yard-title">
        <header className="yard-header">
          <Link to="/arcade">← back to the arcade</Link>
          <span>BUILDING TABLE / BROWSER ONLY</span>
        </header>

        <div className="yard-intro">
          <p>an extremely small block-building toy</p>
          <h1 id="yard-title">block<br />yard.</h1>
          <p>
            choose a colored block, then click squares to build a tiny structure.
            This is a local browser toy, not Roblox, an account system, or a
            construction permit office. Thank goodness.
          </p>
        </div>

        <section className="yard-workbench" aria-label="Block building board">
          <div className="yard-readout">
            <div>
              <span>BLOCKS PLACED</span>
              <strong>{String(placedCount).padStart(3, '0')}</strong>
            </div>
            <p role="status">{notice}</p>
          </div>

          <div className="yard-tools" aria-label="Block selection tools">
            {bricks.map((brick) => (
              <button
                className={`yard-tool ${tool === brick.id ? 'is-selected' : ''} ${brick.id}`}
                type="button"
                onClick={() => chooseTool(brick.id)}
                aria-pressed={tool === brick.id}
                aria-keyshortcuts={brick.shortcut}
                title={`Choose ${brick.label} (${brick.shortcut})`}
                key={brick.id}
              >
                <b aria-hidden="true">{brick.glyph}</b>
                {brick.label} ({brick.shortcut})
              </button>
            ))}
          </div>

          <div className="yard-grid" role="grid" aria-label="Block Yard building grid">
            {yard.map((brick, index) => {
              const column = index % columns
              const row = Math.floor(index / columns)
              const squareLabel = `Row ${row + 1}, column ${column + 1}${brick ? `, ${brick} block` : ', empty'}`

              return (
                <button
                  ref={(element) => { squareRefs.current[index] = element }}
                  className={`yard-square ${brick ? `has-${brick}` : ''}`}
                  type="button"
                  role="gridcell"
                  onClick={() => placeBrick(index)}
                  onKeyDown={(event) => moveSquareFocus(event, index)}
                  aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
                  aria-label={squareLabel}
                  key={index}
                >
                  {brick && <span aria-hidden="true">■</span>}
                </button>
              )
            })}
          </div>

          <div className="yard-actions">
            <span>PRESS 1–4 TO CHOOSE A BRICK OR 5 FOR THE ERASER. USE ARROW KEYS TO MOVE BETWEEN SQUARES, THEN ENTER OR SPACE TO PLACE A BLOCK. CTRL/CMD+Z UNDOS; CTRL/CMD+SHIFT+Z OR CTRL/CMD+Y REDOS.</span>
            <div className="yard-action-buttons">
              <button type="button" onClick={undoLastChange} disabled={history.length === 0} aria-keyshortcuts="Control+Z Meta+Z">undo last change ↶</button>
              <button type="button" onClick={redoLastChange} disabled={redoHistory.length === 0} aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y Meta+Y">redo last change ↷</button>
              <button type="button" onClick={copyBuildPlan}>copy build plan</button>
              <button type="button" onClick={clearYard}>clear the whole yard ↻</button>
            </div>
          </div>
        </section>

        <footer className="yard-footer">
          <span>TOOLS: CLICK A COLOR OR PRESS 1–4, PRESS 5 FOR THE × ERASER, THEN CLICK A SQUARE / YOUR BLOCKS STAY IN THIS BROWSER TAB, INCLUDING AFTER A REFRESH / COPY BUILD PLAN MAKES A TEXT GRID FOR YOUR CLIPBOARD / KEYBOARD: ARROW KEYS MOVE GRID FOCUS, ENTER OR SPACE PLACES A BLOCK, CTRL/CMD+Z UNDOS, CTRL/CMD+SHIFT+Z OR CTRL/CMD+Y REDOS</span>
          <Link to="/arcade">inspect another cabinet →</Link>
        </footer>
      </section>
    </main>
  )
}
