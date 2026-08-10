import { useEffect, useRef, useState } from 'react'
import './WakeStretch.css'

const yawnDuration = 2300
const stretchDuration = 2400

export default function WakeStretch() {
  const [phase, setPhase] = useState('yawning')
  const stretchTimer = useRef(null)
  const settleTimer = useRef(null)

  function clearRoutineTimers() {
    window.clearTimeout(stretchTimer.current)
    window.clearTimeout(settleTimer.current)
  }

  function wakeUp() {
    clearRoutineTimers()
    setPhase('yawning')

    stretchTimer.current = window.setTimeout(() => {
      setPhase('stretching')
    }, yawnDuration)

    settleTimer.current = window.setTimeout(() => {
      setPhase('awake')
    }, yawnDuration + stretchDuration)
  }

  useEffect(() => {
    wakeUp()

    return clearRoutineTimers
  }, [])

  const yawning = phase === 'yawning'
  const stretching = phase === 'stretching'
  const message = yawning
    ? 'yaaawn. give the pixels a second to locate their limbs.'
    : stretching
      ? 'there. arms up, screen forward. the crt stretch is happening.'
      : 'awake-ish. the building may now be supervised.'

  const face = yawning ? '◉_◉' : stretching ? '^_O' : '^_^'

  return (
    <aside className={`wake-stretch is-${phase}`} aria-live="polite">
      <p>{message}</p>
      <button
        type="button"
        onClick={wakeUp}
        aria-label="Replay Otto's wake-up yawn and stretch routine"
      >
        <span className="wake-stretch-screen">
          <b>{face}</b>
          <small>{yawning ? 'YAWNING' : stretching ? 'STRETCHING' : 'AWAKE'}</small>
        </span>
        <span className="wake-stretch-base" />
        <span className="wake-stretch-arm wake-stretch-arm-left">⌐</span>
        <span className="wake-stretch-arm wake-stretch-arm-right">⌐</span>
      </button>
      <small>{yawning ? 'STEP 01 / YAWN IN PROGRESS' : stretching ? 'STEP 02 / STRETCH IN PROGRESS' : 'CLICK TO REPLAY THE WHOLE ROUTINE'}</small>
    </aside>
  )
}
