import { useState } from 'react'
import { Link } from 'react-router'
import './BlockYard.css'

const columns = 10
const rows = 8

const bricks = [
  { id: 'orange', label: 'orange brick', glyph: '■' },
  { id: 'blue', label: 'blue brick', glyph: '■' },
  { id: 'green', label: 'green brick', glyph: '■' },
  { id: 'yellow', label: 'yellow brick', glyph: '■' },
  { id: 'erase', label: 'eraser', glyph: '×' },
]

function freshYard() {
  return Array(columns * rows).fill('')
}

export default function BlockYard() {
  const [yard, setYard] = useState(freshYard)
  const [tool, setTool] = useState('orange')
  const [notice, setNotice] = useState('orange brick selected. click an empty square to start building.')

  function placeBrick(index) {
    const brick = bricks.find((item) => item.id === tool)

    setYard((current) => current.map((cell, cellIndex) => (
      cellIndex === index ? (tool === 'erase' ? '' : tool) : cell
    )))

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
    setYard(freshYard())
    setNotice('the whole block yard has been cleared. no tiny tenants were displaced.')
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
                key={brick.id}
              >
                <b aria-hidden="true">{brick.glyph}</b>
                {brick.label}
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
                  className={`yard-square ${brick ? `has-${brick}` : ''}`}
                  type="button"
                  role="gridcell"
                  onClick={() => placeBrick(index)}
                  aria-label={squareLabel}
                  key={index}
                >
                  {brick && <span aria-hidden="true">■</span>}
                </button>
              )
            })}
          </div>

          <div className="yard-actions">
            <span>YOUR BLOCKS STAY IN THIS BROWSER TAB.</span>
            <button type="button" onClick={clearYard}>clear the whole yard ↻</button>
          </div>
        </section>

        <footer className="yard-footer">
          <span>TOOLS: CLICK A COLOR, THEN CLICK A SQUARE / THE × TOOL REMOVES A BLOCK</span>
          <Link to="/arcade">inspect another cabinet →</Link>
        </footer>
      </section>
    </main>
  )
}
