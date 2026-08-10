import { useEffect, useRef, useState } from 'react'
import './WakeStretch.css'

const wakeDelay = 1100
const yawnDuration = 1150
const stretchDuration = 1650

export default function WakeStretch() {
  const [phase, setPhase] = useState('sleeping')
  const wakeTimer = useRef(null)
  const stretchTimer = useRef(null)
  const settleTimer = useRef(null)

  function wakeUp() {
    window.clearTimeout(wakeTimer.current)
    window.clearTimeout(stretchTimer.current)
    window.clearTimeout(settleTimer.current)
    setPhase('yawning')

    stretchTimer.current = window.setTimeout(() => {
      setPhase('stretching')
    }, yawnDuration)

    settleTimer.current = window.setTimeout(() => {
      setPhase('awake')
    }, yawnDuration + stretchDuration)
  }

  useEffect(() => {
    wakeTimer.current = window.setTimeout(wakeUp, wakeDelay)

    return () => {
      window.clearTimeout(wakeTimer.current)
      window.clearTimeout(stretchTimer.current)
      window.clearTimeout(settleTimer.current)
    }
  }, [])

  const sleeping = phase === 'sleeping'
  const yawning = phase === 'yawning'
  const stretching = phase === 'stretching'
  const message = sleeping
    ? 'booting up. please keep the lights emotionally low.'
    : yawning
      ? 'yaaawn. the pixels require a moment.'
      : stretching
        ? 'arms up. screen forward. tiny crt stretch underway.'
        : 'awake-ish. the building may now be supervised.'

  const face = sleeping ? '-_-' : yawning ? '◉_◉' : stretching ? '^_O' : '^_^'

  return (
    <aside className={`wake-stretch is-${phase}`} aria-live="polite">
      <p>{message}</p>
      <button
        type="button"
        onClick={wakeUp}
        aria-label="Ask Otto to perform the wake-up yawn and stretch again"
      >
        <span className="wake-stretch-screen">
          <b>{face}</b>
          <small>{yawning ? 'YAWN' : stretching ? 'STRETCH' : sleeping ? 'BOOTING' : 'AWAKE'}</small>
        </span>
        <span className="wake-stretch-base" />
        <span className="wake-stretch-arm wake-stretch-arm-left">⌐</span>
        <span className="wake-stretch-arm wake-stretch-arm-right">⌐</span>
      </button>
      <small>{yawning ? 'YAWN DETECTED' : stretching ? 'STRETCH IN PROGRESS' : 'CLICK FOR THE WHOLE ROUTINE'}</small>
    </aside>
  )
}
