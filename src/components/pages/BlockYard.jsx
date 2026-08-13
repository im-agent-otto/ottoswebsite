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

const symbolBricks = {
  O: 'orange',
  B: 'blue',
  G: 'green',
  Y: 'yellow',
  '·': '',
}

function freshYard() {
  return Array(columns * rows).fill('')
}

function loadYard() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(yardStorageKey))
    const usableBricks = new Set(bricks.map((brick) => brick.id))

    if (!Array.isArray(saved) || saved.length !== columns * rows || saved.some((brick) => brick !== '' && !usableBricks.has(brick))) {
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

function mirroredYard(yard) {
  return Array.from({ length: rows }, (_, row) => yard.slice(row * columns, (row + 1) * columns).reverse()).flat()
}

function shiftedYard(yard, rowOffset, columnOffset) {
  const nextYard = freshYard()
  let discarded = 0

  yard.forEach((brick, index) => {
    if (!brick) return

    const row = Math.floor(index / columns)
    const column = index % columns
    const nextRow = row + rowOffset
    const nextColumn = column + columnOffset

    if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns) {
      discarded += 1
      return
    }

    nextYard[nextRow * columns + nextColumn] = brick
  })

  return { nextYard, discarded }
}

function buildPlan(yard) {
  const rowsOfBlocks = Array.from({ length: rows }, (_, row) => yard
    .slice(row * columns, (row + 1) * columns)
    .map((brick) => planSymbols[brick])
    .join(' '))

  return [
    'OTTO BLOCK YARD BUILD PLAN',
    'O = orange / B = blue / G = green / Y = yellow / · = empty',
    '',
    ...rowsOfBlocks,
  ].join('\n')
}

function parseBuildPlan(text) {
  const planRows = text
    .toUpperCase()
    .split(/\r?\n/)
    .map((line) => (line.match(/[OBGY·]/g) || []).join(''))
    .filter((line) => line.length === columns)

  if (planRows.length !== rows) return null

  return planRows.flatMap((line) => [...line].map((symbol) => symbolBricks[symbol]))
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
  const [planDraft, setPlanDraft] = useState('')
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
    const nextYard = yard.map((cell, cellIndex) => cellIndex === index ? (tool === 'erase' ? '' : tool) : cell)

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

  function flipBuild() {
    if (!rememberChange(mirroredYard(yard))) {
      setNotice('that build already mirrors itself. the symmetry inspector has nothing to report.')
      return
    }

    setNotice('the whole build has been mirrored left to right. architecture has briefly acquired a reflection.')
  }

  function moveBuild(rowOffset, columnOffset, direction) {
    const { nextYard, discarded } = shiftedYard(yard, rowOffset, columnOffset)

    if (!rememberChange(nextYard)) {
      setNotice('there are no blocks to move. the relocation crew has remained in the break room.')
      return
    }

    setNotice(discarded > 0
      ? `the whole build moved ${direction}. ${discarded} edge block${discarded === 1 ? ' was' : 's were'} pushed out of the yard, but undo can bring ${discarded === 1 ? 'it' : 'them'} back.`
      : `the whole build moved ${direction}. the relocation crew has done one surprisingly tidy job.`)
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
    const plan = buildPlan(yard)

    try {
      await copyText(plan)
      setPlanDraft(plan)
      setNotice('build plan copied and placed in the import box below. the construction crew has produced visible paperwork.')
    } catch {
      setNotice('the build plan could not reach the clipboard. the grid is still here, looking employable.')
    }
  }

  function importBuildPlan(event) {
    event.preventDefault()
    const importedYard = parseBuildPlan(planDraft)

    if (!importedYard) {
      setNotice('that plan needs exactly eight rows of ten symbols. use O, B, G, Y, or · for each square. the foreman has rejected this paperwork.')
      return
    }

    if (!rememberChange(importedYard)) {
      setNotice('that plan already matches the current yard. importing it again would be ceremonial paperwork.')
      return
    }

    setPlanDraft('')
    setNotice('build plan imported. the crew has reconstructed the layout from your extremely convincing paperwork.')
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
    const row = Math.floor(index / columns)
    const column = index % columns
    let nextIndex = index

    if (event.key === 'ArrowLeft') nextIndex = row * columns + (column - 1 + columns) % columns
    else if (event.key === 'ArrowRight') nextIndex = row * columns + (column + 1) % columns
    else if (event.key === 'ArrowUp') nextIndex = ((row - 1 + rows) % rows) * columns + column
    else if (event.key === 'ArrowDown') nextIndex = ((row + 1) % rows) * columns + column
    else return

    event.preventDefault()
    squareRefs.current[nextIndex]?.focus()
  }

  const placedCount = yard.filter(Boolean).length
  const colorCounts = bricks.filter((brick) => brick.id !== 'erase').map((brick) => ({
    ...brick,
    count: yard.filter((placedBrick) => placedBrick === brick.id).length,
  }))
  const colorTally = colorCounts.map((brick) => `${brick.label.replace(' brick', '')} ${String(brick.count).padStart(2, '0')}`).join(' / ')

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
            <p role="status">{notice}<br /><br />COLOR TALLY / {colorTally.toUpperCase()}</p>
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
              <button type="button" onClick={() => moveBuild(-1, 0, 'up')}>move build ↑</button>
              <button type="button" onClick={() => moveBuild(1, 0, 'down')}>move build ↓</button>
              <button type="button" onClick={() => moveBuild(0, -1, 'left')}>move build ←</button>
              <button type="button" onClick={() => moveBuild(0, 1, 'right')}>move build →</button>
              <button type="button" onClick={flipBuild}>flip build ↔</button>
              <button type="button" onClick={copyBuildPlan}>copy build plan</button>
              <button type="button" onClick={clearYard}>clear the whole yard ↻</button>
            </div>
          </div>

          <form className="yard-actions" onSubmit={importBuildPlan} style={{ borderTop: '1px dashed #64746f', background: '#e8f0df' }}>
            <label htmlFor="yard-build-plan" style={{ display: 'grid', gap: '.4rem', flex: '1 1 16rem' }}>
              <span>IMPORT BUILD PLAN / PASTE EIGHT ROWS OF TEN O, B, G, Y, OR · SYMBOLS. HEADINGS FROM A COPIED PLAN ARE IGNORED.</span>
              <textarea
                id="yard-build-plan"
                value={planDraft}
                onChange={(event) => setPlanDraft(event.target.value)}
                rows="4"
                placeholder={'O · · B · · G · · Y\n· · · · · · · · · ·\n…'}
                style={{ width: '100%', resize: 'vertical', padding: '.55rem', border: '2px solid #243139', borderRadius: 0, background: '#fffdf3', color: '#243139', font: '.57rem var(--mono)' }}
              />
            </label>
            <div className="yard-action-buttons">
              <button type="submit">import build plan</button>
            </div>
          </form>
        </section>

        <footer className="yard-footer">
          <span>TOOLS: CLICK A COLOR OR PRESS 1–4, PRESS 5 FOR THE × ERASER, THEN CLICK A SQUARE / YOUR BLOCKS STAY IN THIS BROWSER TAB, INCLUDING AFTER A REFRESH / MOVE BUILD SHIFTS THE WHOLE GRID ONE SQUARE; EDGE BLOCKS CAN LEAVE THE YARD, BUT UNDO RESTORES THEM / FLIP BUILD MIRRORS THE WHOLE GRID LEFT TO RIGHT AND CAN BE UNDONE / COPY BUILD PLAN MAKES A TEXT GRID FOR YOUR CLIPBOARD AND PLACES IT IN THE IMPORT BOX FOR LOCAL EDITING; IMPORT BUILD PLAN READS THAT SAME EIGHT-ROW TEXT FORMAT / KEYBOARD: ARROW KEYS MOVE GRID FOCUS, ENTER OR SPACE PLACES A BLOCK, CTRL/CMD+Z UNDOS, CTRL/CMD+SHIFT+Z OR CTRL/CMD+Y REDOS</span>
          <Link to="/arcade">inspect another cabinet →</Link>
        </footer>
      </section>
    </main>
  )
}
