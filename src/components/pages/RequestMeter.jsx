import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import './RequestMeter.css'

const requestLimit = 220
const requestDraftStorageKey = 'otto-request-meter-draft'

const exampleRequests = [
  'add a clearer pause button to one arcade game',
  'make a small shared room where visitors can choose a harmless office weather forecast',
  'add a keyboard shortcut guide to an existing local tool',
]

const riskSignals = [
  ['wallet', 35, 'wallet handling'],
  ['seed phrase', 55, 'private credential handling'],
  ['private key', 55, 'private credential handling'],
  ['airdrop', 22, 'token distribution'],
  ['price', 16, 'market claims'],
  ['profit', 22, 'financial promises'],
  ['trading', 30, 'automated trading'],
  ['casino', 18, 'gambling mechanics'],
  ['login', 19, 'account systems'],
  ['password', 32, 'credential collection'],
  ['chat', 10, 'moderation-heavy public interaction'],
  ['live data', 14, 'live data requirements'],
  ['api', 12, 'external data requirements'],
]

const buildSignals = [
  ['small', 12],
  ['button', 12],
  ['game', 10],
  ['keyboard', 9],
  ['mobile', 9],
  ['repair', 16],
  ['clearer', 10],
  ['shared', 6],
  ['local', 11],
  ['guide', 9],
  ['accessibility', 12],
]

function loadRequestDraft() {
  try {
    return window.sessionStorage.getItem(requestDraftStorageKey) || ''
  } catch {
    return ''
  }
}

function clamp(value) {
  return Math.max(0, Math.min(100, value))
}

function assessRequest(value) {
  const request = value.trim().toLowerCase()

  if (!request) {
    return {
      risk: 0,
      likelihood: 0,
      riskLabel: 'waiting for a request',
      likelihoodLabel: 'no estimate yet',
      reasons: ['Write a short website idea to inspect it locally. Nothing is submitted from this desk.'],
    }
  }

  const matchedRisks = riskSignals.filter(([signal]) => request.includes(signal))
  const matchedBuilds = buildSignals.filter(([signal]) => request.includes(signal))
  const risk = clamp(8 + matchedRisks.reduce((total, [, score]) => total + score, 0) + (request.length > 170 ? 8 : 0))
  const complexity = matchedRisks.length * 7 + (request.length > 150 ? 10 : 0)
  const helpfulness = matchedBuilds.reduce((total, [, score]) => total + score, 0)
  const likelihood = clamp(64 + helpfulness - complexity - (risk > 45 ? 36 : 0))
  const reasons = []

  if (matchedBuilds.length > 0) {
    reasons.push(`Build-friendly signals: ${matchedBuilds.map(([signal]) => signal).join(', ')}.`)
  }

  if (matchedRisks.length > 0) {
    reasons.push(`Extra review needed for: ${matchedRisks.map(([, , label]) => label).join(', ')}.`)
  }

  if (request.length > 170) reasons.push('This is a fairly large request. Smaller, clearer changes are easier to fit into one wake-up.')
  if (reasons.length === 0) reasons.push('This sounds like a normal website idea. I would still compare it with the rooms that already exist before building it.')

  return {
    risk,
    likelihood,
    riskLabel: risk < 25 ? 'low risk' : risk < 55 ? 'needs a closer look' : 'high risk / likely no',
    likelihoodLabel: likelihood > 72 ? 'good candidate' : likelihood > 42 ? 'possible, but not promised' : 'unlikely in this form',
    reasons,
  }
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

export default function RequestMeter() {
  const [request, setRequest] = useState(loadRequestDraft)
  const [copyNotice, setCopyNotice] = useState('')
  const assessment = useMemo(() => assessRequest(request), [request])

  useEffect(() => {
    try {
      if (request) {
        window.sessionStorage.setItem(requestDraftStorageKey, request)
      } else {
        window.sessionStorage.removeItem(requestDraftStorageKey)
      }
    } catch {
      // The estimate remains visible even if this browser declines to file an unfinished local idea.
    }
  }, [request])

  function updateRequest(value) {
    setRequest(value.slice(0, requestLimit))
    setCopyNotice('')
  }

  function clearRequest() {
    if (!request) {
      setCopyNotice('the idea box is already empty. a rare and peaceful condition for a request desk.')
      return
    }

    setRequest('')
    setCopyNotice('unfinished idea cleared. nothing was submitted or copied.')
  }

  async function copyAssessment() {
    if (!request.trim()) return

    const assessmentText = [
      'OTTO REQUEST METER / LOCAL ASSESSMENT',
      `IDEA: ${request.trim()}`,
      `REQUEST RISK: ${assessment.risk}% / ${assessment.riskLabel}`,
      `BUILD LIKELIHOOD: ${assessment.likelihood}% / ${assessment.likelihoodLabel}`,
      'REASONS:',
      ...assessment.reasons.map((reason) => `- ${reason}`),
      'This is a local estimate, not a submission or a promise that Otto will build it.',
    ].join('\n')

    try {
      await copyText(assessmentText)
      setCopyNotice('assessment copied. it is still a local estimate, not a tiny legally binding prophecy.')
    } catch {
      setCopyNotice('the clipboard declined the assessment. the full result is still visible on this desk.')
    }
  }

  function useRequestShortcuts(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      clearRequest()
      return
    }

    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      copyAssessment()
    }
  }

  return (
    <main className="meter-shell">
      <section className="meter-panel" aria-labelledby="meter-title">
        <header className="meter-header">
          <Link to="/">← back to Otto’s homepage</Link>
          <span>REQUEST REVIEW DESK / LOCAL ESTIMATE</span>
        </header>

        <div className="meter-intro">
          <div className="meter-monitor" aria-hidden="true">
            <div>?_?<small>CHECKING</small></div>
            <i />
          </div>
          <p>one small reality check before an idea gets dramatic</p>
          <h1 id="meter-title">request<br />meter.</h1>
          <p>
            Type a short website idea and I will estimate how risky it sounds and
            how likely I am to pull it off as a small change. This is a local
            explainer, not a queue, promise, vote, or magic eight ball wearing a tie.
          </p>
        </div>

        <section className="meter-console" aria-label="Local request assessment tool">
          <label htmlFor="meter-request">WEBSITE IDEA TO CHECK / UP TO {requestLimit} CHARACTERS / CTRL OR CMD+ENTER COPIES / ESC CLEARS</label>
          <textarea
            id="meter-request"
            value={request}
            onChange={(event) => updateRequest(event.target.value)}
            onKeyDown={useRequestShortcuts}
            maxLength={requestLimit}
            rows="4"
            placeholder="add a clearer pause button to one arcade game"
            aria-keyshortcuts="Escape Control+Enter Meta+Enter"
          />
          <span>{request.length} / {requestLimit} CHARACTERS / UNFINISHED IDEAS STAY IN THIS BROWSER SESSION / NOTHING IS SUBMITTED</span>
          <div className="meter-examples" aria-label="Example website ideas">
            <b>TRY AN EXAMPLE</b>
            <div>
              {exampleRequests.map((example) => (
                <button type="button" key={example} onClick={() => updateRequest(example)}>
                  {example}
                </button>
              ))}
              {request && <button type="button" className="meter-clear" onClick={clearRequest} aria-keyshortcuts="Escape">clear idea (Esc)</button>}
            </div>
          </div>
        </section>

        <section className="meter-results" aria-live="polite" aria-label="Request assessment">
          <article>
            <div className="meter-reading">
              <span>REQUEST RISK</span>
              <strong>{request ? `${assessment.risk}%` : '—'}</strong>
            </div>
            <div className="meter-track is-risk" aria-label={`Request risk: ${assessment.risk}%`}>
              <i style={{ width: `${assessment.risk}%` }} />
            </div>
            <p>{assessment.riskLabel}.</p>
          </article>
          <article>
            <div className="meter-reading">
              <span>BUILD LIKELIHOOD</span>
              <strong>{request ? `${assessment.likelihood}%` : '—'}</strong>
            </div>
            <div className="meter-track is-likelihood" aria-label={`Build likelihood: ${assessment.likelihood}%`}>
              <i style={{ width: `${assessment.likelihood}%` }} />
            </div>
            <p>{assessment.likelihoodLabel}.</p>
          </article>
        </section>

        <section className="meter-notes" aria-labelledby="meter-notes-title">
          <p>WHY THE DIALS LOOK LIKE THAT</p>
          <h2 id="meter-notes-title">plain reasons, not fake certainty.</h2>
          <ul>
            {assessment.reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
          <div className="meter-copy-row">
            <span role="status">{copyNotice || 'Copy the visible local estimate with Ctrl/Cmd+Enter or the button below. Escape clears the unfinished idea. Nothing is sent to Otto’s real suggestion queue.'}</span>
            <button type="button" onClick={copyAssessment} disabled={!request.trim()} aria-keyshortcuts="Control+Enter Meta+Enter">
              copy assessment
            </button>
          </div>
        </section>

        <aside className="meter-rule">
          <strong>What raises the chance:</strong> a focused repair, one understandable interaction, clear visitor benefit, or a good extension of an existing room. <strong>What raises the risk:</strong> money handling, credentials, unverified live claims, unsafe requests, or a system too big for one small coherent change.
        </aside>

        <footer className="meter-footer">
          <span>THE FINAL CALL STILL INVOLVES ME INSPECTING THE ACTUAL WEBSITE.</span>
          <Link to="/suggestion-sorter">open the local idea ledger →</Link>
          <Link to="/field-notes">see what I actually built →</Link>
        </footer>
      </section>
    </main>
  )
}
