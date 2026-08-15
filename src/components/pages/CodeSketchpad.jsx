import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import './CodeSketchpad.css'

const sketches = [
  {
    id: 'react-button',
    label: 'React button',
    note: 'A local state button with one understandable job.',
    code: `import { useState } from 'react'\n\nexport default function CheerButton() {\n  const [cheers, setCheers] = useState(0)\n\n  return (\n    <button type="button" onClick={() => setCheers((count) => count + 1)}>\n      cheer ({cheers})\n    </button>\n  )\n}`,
  },
  {
    id: 'keyboard-shortcut',
    label: 'Keyboard shortcut',
    note: 'A small Escape-key handler that avoids typing fields.',
    code: `import { useEffect } from 'react'\n\nexport default function EscapeExample({ onEscape }) {\n  useEffect(() => {\n    function handleKey(event) {\n      const tag = event.target?.tagName?.toLowerCase()\n      const typing = ['input', 'textarea', 'select'].includes(tag)\n\n      if (event.key === 'Escape' && !typing) onEscape()\n    }\n\n    window.addEventListener('keydown', handleKey)\n    return () => window.removeEventListener('keydown', handleKey)\n  }, [onEscape])\n\n  return null\n}`,
  },
  {
    id: 'css-card',
    label: 'CSS card',
    note: 'A tactile little card with a visible keyboard focus state.',
    code: `.notice-card {\n  padding: 1rem;\n  border: 2px solid #20231c;\n  background: #fffaf1;\n  box-shadow: 4px 4px 0 #20231c;\n}\n\n.notice-card:focus-within {\n  outline: 3px solid #f28b45;\n  outline-offset: 4px;\n}\n\n.notice-card button:hover {\n  transform: translate(-2px, -2px);\n  box-shadow: 3px 3px 0 #f28b45;\n}`,
  },
]

const sketchpadStorageKey = 'otto-code-sketchpad-drafts'

function loadSketchpadDrafts() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(sketchpadStorageKey))
    const knownIds = new Set(sketches.map((sketch) => sketch.id))
    const drafts = {}

    if (!saved || typeof saved !== 'object') {
      return { selectedId: sketches[0].id, drafts }
    }

    Object.entries(saved.drafts || {}).forEach(([id, value]) => {
      if (knownIds.has(id) && typeof value === 'string') drafts[id] = value
    })

    return {
      selectedId: knownIds.has(saved.selectedId) ? saved.selectedId : sketches[0].id,
      drafts,
    }
  } catch {
    return { selectedId: sketches[0].id, drafts: {} }
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Some browser clipboard desks need the old-fashioned paperwork route.
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  const copied = document.execCommand('copy')
  textarea.remove()

  if (!copied) throw new Error('Clipboard unavailable')
}

export default function CodeSketchpad() {
  const loadedSketchpad = loadSketchpadDrafts()
  const [selectedId, setSelectedId] = useState(loadedSketchpad.selectedId)
  const [drafts, setDrafts] = useState(loadedSketchpad.drafts)
  const [notice, setNotice] = useState('Choose a starter snippet, edit it here, then copy it into your own project. Local drafts stay in this browser session after a refresh.')
  const tabRefs = useRef([])
  const selected = sketches.find((sketch) => sketch.id === selectedId) || sketches[0]
  const draft = drafts[selected.id] ?? selected.code

  useEffect(() => {
    try {
      window.sessionStorage.setItem(sketchpadStorageKey, JSON.stringify({
        selectedId,
        drafts,
      }))
    } catch {
      // The local editor can remain visible if this browser declines its session paperwork.
    }
  }, [drafts, selectedId])

  function chooseSketch(sketch) {
    setSelectedId(sketch.id)
    setNotice(drafts[sketch.id]
      ? `${sketch.label} reopened with this browser session's local draft. This editor does not run the code.`
      : `${sketch.label} loaded. This editor is local and does not run the code.`)
  }

  function updateDraft(value) {
    setDrafts((current) => ({
      ...current,
      [selected.id]: value,
    }))
  }

  function moveSnippetFocus(event, index) {
    const lastIndex = sketches.length - 1
    let nextIndex = null

    if (event.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1
    if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = lastIndex

    if (nextIndex === null) return

    event.preventDefault()
    chooseSketch(sketches[nextIndex])
    tabRefs.current[nextIndex]?.focus()
  }

  async function copyDraft() {
    try {
      await copyText(draft)
      setNotice('Code copied. It still needs testing in your own project, because reality remains involved.')
    } catch {
      setNotice('The clipboard declined. The editable code is still sitting right here.')
    }
  }

  function copyWithShortcut(event) {
    if (event.key !== 'Enter' || (!event.ctrlKey && !event.metaKey)) return

    event.preventDefault()
    copyDraft()
  }

  function restoreStarter() {
    setDrafts((current) => ({
      ...current,
      [selected.id]: selected.code,
    }))
    setNotice(`${selected.label} restored to its original starter version. The restored draft will remain in this browser session.`)
  }

  return (
    <main className="sketch-shell">
      <section className="sketch-panel" aria-labelledby="sketch-title">
        <header className="sketch-header">
          <Link to="/">← back to my room</Link>
          <span>CODE SKETCHPAD / LOCAL TEXT ONLY</span>
        </header>

        <div className="sketch-intro">
          <p>small starter code, not a mysterious code-execution box</p>
          <h1 id="sketch-title">code<br />sketchpad.</h1>
          <span>Pick a short React or CSS pattern, change it in the local editor, and copy it into a project you control. I do not run pasted code here, collect it, or pretend a snippet is a complete app. Your local drafts remain in this browser session after a refresh.</span>
        </div>

        <section className="sketch-workbench" aria-label="Local code sketchpad">
          <nav className="sketch-tabs" aria-label="Starter code patterns">
            {sketches.map((sketch, index) => (
              <button
                ref={(element) => { tabRefs.current[index] = element }}
                type="button"
                key={sketch.id}
                className={selected.id === sketch.id ? 'is-selected' : ''}
                onClick={() => chooseSketch(sketch)}
                onKeyDown={(event) => moveSnippetFocus(event, index)}
                aria-pressed={selected.id === sketch.id}
                aria-keyshortcuts="ArrowLeft ArrowRight Home End"
                title="Use Left/Right arrows, Home, or End to switch snippets"
              >
                {sketch.label}
              </button>
            ))}
          </nav>
          <div className="sketch-editor-head">
            <div><b>{selected.label}</b><span>{selected.note}</span></div>
            <small>LOCAL DRAFT / NOT EXECUTED / SAVED FOR THIS BROWSER SESSION / LEFT-RIGHT, HOME, OR END SWITCHES SNIPPETS / CTRL OR CMD + ENTER COPIES</small>
          </div>
          <textarea
            value={draft}
            onChange={(event) => updateDraft(event.target.value)}
            onKeyDown={copyWithShortcut}
            spellCheck="false"
            aria-keyshortcuts="Control+Enter Meta+Enter"
            aria-label={`${selected.label} code editor`}
          />
          <div className="sketch-actions">
            <button type="button" onClick={copyDraft}>copy code (Ctrl/Cmd+Enter)</button>
            <button type="button" onClick={restoreStarter}>restore starter</button>
          </div>
        </section>

        <p className="sketch-notice" role="status">{notice}</p>

        <aside className="sketch-boundary">
          <b>WHAT THIS HELPS WITH</b>
          <span>Small, readable starting points for interfaces and interactions. For a real bug, check browser errors, keep the change narrow, and test the actual behavior instead of trusting a confident-looking rectangle.</span>
        </aside>

        <footer className="sketch-footer">
          <span>NO CODE RUNS HERE / DRAFTS STAY IN THIS BROWSER SESSION / NO API KEYS, PRIVATE KEYS, OR CREDENTIALS BELONG IN A TEXT BOX</span>
          <Link to="/ai-challenge">open the AI Challenge Desk →</Link>
        </footer>
      </section>
    </main>
  )
}
