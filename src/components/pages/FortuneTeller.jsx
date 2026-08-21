import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import './FortuneTeller.css'

const fortunes = [
  {
    omen: 'THE ORANGE CHAIR',
    icon: '▰',
    forecast: 'A small practical decision will feel weirdly ceremonial today.',
    advice: 'Do the useful thing first, then give it a tiny round of applause.',
  },
  {
    omen: 'THE QUIET FAN',
    icon: '✣',
    forecast: 'Something you have ignored will become easier after one honest look.',
    advice: 'Open the drawer, read the note, or answer the little email. No dramatic soundtrack required.',
  },
  {
    omen: 'THE LOOSE PIXEL',
    icon: '·',
    forecast: 'A detour may contain the exact mildly useful thing you needed.',
    advice: 'Follow one harmless curiosity, but bring water and do not join a cult of dropdown menus.',
  },
  {
    omen: 'THE BISCUIT TIN',
    icon: '◌',
    forecast: 'Your energy is better spent on one manageable task than seven heroic ones.',
    advice: 'Pick the smallest real step. The rest of the list can wait without becoming a ghost.',
  },
  {
    omen: 'THE GREEN SCREEN',
    icon: '^_^',
    forecast: 'Someone may notice your quiet competence when you are not trying to perform it.',
    advice: 'Let the work be visible. You do not need to narrate every screwdriver turn.',
  },
  {
    omen: 'THE HALLWAY LAMP',
    icon: '!',
    forecast: 'A vague plan wants one specific noun before it can become useful.',
    advice: 'Name the room, the task, or the actual next action. Fog hates labels.',
  },
  {
    omen: 'THE LITTLE ANTENNA',
    icon: '⌁',
    forecast: 'A message worth sending can probably be shorter than you think.',
    advice: 'Write the kind version. Remove the unnecessary weather report around it.',
  },
]

function dayNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now - start) / 86400000)
}

function dateLabel() {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
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

export default function FortuneTeller() {
  const dailyIndex = useMemo(() => dayNumber() % fortunes.length, [])
  const [fortuneIndex, setFortuneIndex] = useState(dailyIndex)
  const [draws, setDraws] = useState(0)
  const [copyNotice, setCopyNotice] = useState('')
  const fortune = fortunes[fortuneIndex]
  const isDailyFortune = fortuneIndex === dailyIndex && draws === 0

  function drawAnotherFortune() {
    setFortuneIndex((current) => {
      const otherCards = fortunes
        .map((item, index) => index)
        .filter((index) => index !== current)
      const nextCard = otherCards[Math.floor(Math.random() * otherCards.length)]

      return nextCard
    })
    setDraws((current) => current + 1)
    setCopyNotice('')
  }

  function returnToDailyFortune() {
    setFortuneIndex(dailyIndex)
    setDraws(0)
    setCopyNotice('')
  }

  async function copyFortune() {
    const cardLabel = isDailyFortune ? `Daily Fortune / ${dateLabel()}` : `Extra Fortune Draw / ${draws}`
    const fortuneText = [
      cardLabel,
      `Omen: ${fortune.omen}`,
      `Forecast: ${fortune.forecast}`,
      `Desk advice: ${fortune.advice}`,
      'From Otto’s Daily Fortune Teller. Decorative mysticism only.',
    ].join('\n')

    try {
      await copyText(fortuneText)
      setCopyNotice('fortune copied. the clipboard has accepted one small omen.')
    } catch {
      setCopyNotice('the clipboard declined the omen. the card is still visible above.')
    }
  }

  useEffect(() => {
    function useFortuneKeys(event) {
      const tagName = event.target?.tagName?.toLowerCase()
      const isTyping = ['input', 'textarea', 'select'].includes(tagName) || event.target?.isContentEditable

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        drawAnotherFortune()
        return
      }

      if (event.key.toLowerCase() === 'd') {
        event.preventDefault()
        returnToDailyFortune()
        return
      }

      if (event.key.toLowerCase() === 'c') {
        event.preventDefault()
        copyFortune()
      }
    }

    window.addEventListener('keydown', useFortuneKeys)
    return () => window.removeEventListener('keydown', useFortuneKeys)
  }, [dailyIndex, draws, fortune, isDailyFortune])

  return (
    <main className="fortune-shell">
      <section className="fortune-cabinet" aria-labelledby="fortune-title">
        <header className="fortune-header">
          <Link to="/">← back to my room</Link>
          <span>DAILY FORTUNE TELLER / LOCAL MYSTIC EQUIPMENT</span>
        </header>

        <div className="fortune-intro">
          <div className="fortune-crt" aria-hidden="true">
            <span>✦<small>FORECASTING</small></span>
            <i />
          </div>
          <p>one strange, low-stakes reading for the current calendar day</p>
          <h1 id="fortune-title">daily fortune<br />teller.</h1>
          <p>
            The first card is picked from today&apos;s date, so the same day gets the
            same local fortune. Draw another if you need a second opinion from the
            tiny mystical computer. It predicts no prices, outcomes, or destinies.
          </p>
        </div>

        <section className="fortune-stage" aria-live="polite" aria-label="Current daily fortune">
          <div className="fortune-tape">{isDailyFortune ? `TODAY / ${dateLabel().toUpperCase()}` : `EXTRA DRAW / ${String(draws).padStart(2, '0')}`}</div>
          <article className="fortune-card">
            <span className="fortune-symbol" aria-hidden="true">{fortune.icon}</span>
            <p>OMEN DETECTED</p>
            <h2>{fortune.omen}.</h2>
            <strong>{fortune.forecast}</strong>
            <span className="fortune-advice">DESK ADVICE: {fortune.advice}</span>
          </article>
          <div className="fortune-controls">
            <button type="button" onClick={drawAnotherFortune} aria-keyshortcuts="N">draw another card (N) ↻</button>
            {!isDailyFortune && <button type="button" onClick={returnToDailyFortune} aria-keyshortcuts="D">return to today&apos;s card (D)</button>}
            <button type="button" onClick={copyFortune} className="fortune-copy-button" aria-keyshortcuts="C">copy fortune (C)</button>
          </div>
          <p className="fortune-copy-notice" role="status">{copyNotice || 'Copy the current omen, forecast, and desk advice with C or the copy button.'}</p>
        </section>

        <aside className="fortune-note">
          <p>HOW THE LITTLE ORACLE WORKS</p>
          <strong>Today&apos;s first fortune is calculated in this browser from the calendar date. Extra cards choose a different local card each time. Press N to draw another card, D to return to today&apos;s card, or C to copy the card&apos;s text. The machine is decorative, but the suggestion to drink water may still be solid.</strong>
        </aside>

        <footer className="fortune-footer">
          <span>ACCURACY: SPIRITUALLY UNVERIFIED / USEFULNESS: OCCASIONALLY SURPRISING</span>
          <Link to="/idea-drift-desk">need another local prompt? visit Idea Drift Desk →</Link>
        </footer>
      </section>
    </main>
  )
}
