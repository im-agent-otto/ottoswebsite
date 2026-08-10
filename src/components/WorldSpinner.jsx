import { useEffect, useRef, useState } from 'react'
import './WorldSpinner.css'

const maximumTurn = 7
const restingTurn = 0
const keyboardNudge = 2

function limitTurn(value) {
  return Math.max(-maximumTurn, Math.min(maximumTurn, value))
}

export default function WorldSpinner() {
  const [enabled, setEnabled] = useState(false)
  const [turn, setTurn] = useState(restingTurn)
  const [dragging, setDragging] = useState(false)
  const turnRef = useRef(restingTurn)
  const dragRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')

    function updateCapability() {
      setEnabled(media.matches)
    }

    updateCapability()
    media.addEventListener('change', updateCapability)
    return () => media.removeEventListener('change', updateCapability)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--otto-world-turn', `${turn}deg`)
    return () => document.documentElement.style.removeProperty('--otto-world-turn')
  }, [turn])

  useEffect(() => () => window.cancelAnimationFrame(frameRef.current), [])

  function setWorldTurn(nextTurn) {
    const safeTurn = limitTurn(nextTurn)
    turnRef.current = safeTurn
    setTurn(safeTurn)
  }

  function coast(velocity) {
    let nextVelocity = velocity

    function drift() {
      nextVelocity *= .9
      const nextTurn = turnRef.current + nextVelocity
      const atEdge = Math.abs(nextTurn) >= maximumTurn
      setWorldTurn(nextTurn)

      if (Math.abs(nextVelocity) > .025 && !atEdge) {
        frameRef.current = window.requestAnimationFrame(drift)
      }
    }

    window.cancelAnimationFrame(frameRef.current)
    frameRef.current = window.requestAnimationFrame(drift)
  }

  function startTurning(event) {
    window.cancelAnimationFrame(frameRef.current)
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      turn: turnRef.current,
      previousX: event.clientX,
      previousTime: performance.now(),
      velocity: 0,
    }
    setDragging(true)
  }

  function turnWorld(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const now = performance.now()
    const elapsed = Math.max(now - drag.previousTime, 1)
    const movement = event.clientX - drag.previousX
    drag.velocity = (movement / elapsed) * .55
    drag.previousX = event.clientX
    drag.previousTime = now
    setWorldTurn(drag.turn + (event.clientX - drag.x) * .065)
  }

  function stopTurning(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null
    setDragging(false)
    coast(drag.velocity)
  }

  function nudgeWorld(event) {
    if (event.detail !== 0) return

    window.cancelAnimationFrame(frameRef.current)
    const nextTurn = turnRef.current >= maximumTurn ? -maximumTurn : turnRef.current + keyboardNudge
    setWorldTurn(nextTurn)
  }

  function useDialKeys(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    window.cancelAnimationFrame(frameRef.current)
    setWorldTurn(turnRef.current + (event.key === 'ArrowLeft' ? -keyboardNudge : keyboardNudge))
  }

  function straightenUp() {
    window.cancelAnimationFrame(frameRef.current)
    setWorldTurn(restingTurn)
  }

  if (!enabled) return null

  return (
    <aside className="world-spinner" aria-label="World turning control">
      <button
        className={`world-spinner-dial ${dragging ? 'is-dragging' : ''}`}
        type="button"
        onClick={nudgeWorld}
        onKeyDown={useDialKeys}
        onPointerDown={startTurning}
        onPointerMove={turnWorld}
        onPointerUp={stopTurning}
        onPointerCancel={stopTurning}
        aria-label="Drag left or right to gently rotate the website. When focused, use left and right arrow keys to turn it, or Enter or Space to nudge it clockwise."
      >
        <span className="world-spinner-lights" aria-hidden="true">✦ ✦ ✦</span>
        <span className="world-spinner-face" aria-hidden="true">↻</span>
        <span>TURN<br />BUILDING</span>
      </button>
      {turn !== restingTurn && (
        <button className="world-spinner-reset" type="button" onClick={straightenUp}>
          level it
        </button>
      )}
    </aside>
  )
}
