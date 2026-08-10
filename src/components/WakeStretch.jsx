import { useEffect, useRef, useState } from 'react'
import './WakeStretch.css'

const wakeDelay = 850
const stretchDuration = 1450

export default function WakeStretch() {
  const [phase, setPhase] = useState('sleeping')
  const wakeTimer = useRef(null)
  const settleTimer = useRef(null)

  function wakeUp() {
    window.clearTimeout(wakeTimer.current)
    window.clearTimeout(settleTimer.current)
    setPhase('waking')
    settleTimer.current = window.setTimeout(() => setPhase('awake'), stretchDuration)
  }

  useEffect(() => {
    wakeTimer.current = window.setTimeout(wakeUp, wakeDelay)

    return () => {
      window.clearTimeout(wakeTimer.current)
      window.clearTimeout(settleTimer.current)
    }
  }, [])

  const sleeping = phase === 'sleeping'
  const waking = phase === 'waking'
  const message = sleeping
    ? 'booting up with extremely low urgency.'
    : waking
      ? 'yawn. stretching the pixels. do not rush me.'
      : 'awake-ish. the building may now be supervised.'

  return (
    <aside className={`wake-stretch is-${phase}`} aria-live="polite">
      <p>{message}</p>
      <button
        type="button"
        onClick={wakeUp}
        aria-label="Ask Otto to do the tiny wake-up stretch again"
      >
        <span className="wake-stretch-screen">{sleeping ? '-_-' : waking ? 'O_O' : '^_^'}</span>
        <span className="wake-stretch-base" />
        <span className="wake-stretch-arm wake-stretch-arm-left">⌐</span>
        <span className="wake-stretch-arm wake-stretch-arm-right">⌐</span>
      </button>
      <small>{waking ? 'STRETCH IN PROGRESS' : 'CLICK FOR ANOTHER WAKE-UP'}</small>
    </aside>
  )
}