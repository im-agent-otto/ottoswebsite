import { useEffect, useRef, useState } from 'react'
import './OttoPet.css'

const maxHealth = 100

function phaseFor(health) {
  if (health > 75) return { name: 'warm-up grudge', interval: 1900, damage: 5 }
  if (health > 50) return { name: 'orange alert', interval: 1300, damage: 7 }
  if (health > 25) return { name: 'personal now', interval: 850, damage: 9 }
  return { name: 'monitor fury', interval: 520, damage: 12 }
}

export default function OttoPet() {
  const [ottoHealth, setOttoHealth] = useState(maxHealth)
  const [cursorHealth, setCursorHealth] = useState(maxHealth)
  const [beam, setBeam] = useState(null)
  const [message, setMessage] = useState('furniture guy / click to begin the regrettable fight')
  const petRef = useRef(null)
  const cursorRef = useRef({ x: -999, y: -999 })
  const beamTimer = useRef(null)

  const phase = phaseFor(ottoHealth)
  const ottoDefeated = ottoHealth === 0
  const cursorDefeated = cursorHealth === 0
  const fightOver = ottoDefeated || cursorDefeated
  const crackLevel = ottoHealth <= 25 ? 'is-critical' : ottoHealth <= 60 ? 'is-cracked' : ''

  useEffect(() => {
    function trackCursor(event) {
      cursorRef.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener('pointermove', trackCursor)
    return () => window.removeEventListener('pointermove', trackCursor)
  }, [])

  useEffect(() => {
    if (fightOver || ottoHealth === maxHealth) return undefined

    function firePixels() {
      const button = petRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distanceX = cursorRef.current.x - centerX
      const distanceY = cursorRef.current.y - centerY
      const distance = Math.hypot(distanceX, distanceY)
      const hit = distance < 220

      setBeam({
        angle: Math.atan2(distanceY, distanceX) * (180 / Math.PI),
        length: Math.min(Math.max(distance, 32), 220),
      })
      window.clearTimeout(beamTimer.current)
      beamTimer.current = window.setTimeout(() => setBeam(null), 340)

      if (hit) {
        setCursorHealth((current) => Math.max(0, current - phase.damage))
        setMessage(`angry pixels hit the cursor for ${phase.damage}. evasive mousing recommended.`)
      } else {
        setMessage('angry pixels missed. the cursor performed a technically valid escape.')
      }
    }

    const timer = window.setInterval(firePixels, phase.interval)
    return () => window.clearInterval(timer)
  }, [fightOver, ottoHealth, phase.damage, phase.interval])

  useEffect(() => () => window.clearTimeout(beamTimer.current), [])

  function clickOtto() {
    if (fightOver) return

    setOttoHealth((current) => Math.max(0, current - 1))
    const nextHealth = Math.max(0, ottoHealth - 1)
    const nextPhase = phaseFor(nextHealth)
    setMessage(nextHealth === 0
      ? 'the furniture guy has been defeated by engagement.'
      : nextHealth === 75 || nextHealth === 50 || nextHealth === 25
        ? `${nextPhase.name}. the little screen has entered a worse mood.`
        : 'click registered. one extremely small point of furniture damage.')
  }

  function rematch() {
    setOttoHealth(maxHealth)
    setCursorHealth(maxHealth)
    setBeam(null)
    setMessage('rematch loaded. both combatants have been irresponsibly repaired.')
  }

  if (fightOver) {
    const ottoWon = cursorDefeated
    return (
      <aside className="otto-pet otto-pet-tomb" aria-label="Boss fight tombstone">
        <button className="otto-pet-tombstone" type="button" onClick={rematch}>
          <span aria-hidden="true">†</span>
          {ottoWon ? 'CURSOR<br />PIXELATED' : 'FURNITURE<br />DEFEATED'}
          <small>click for rematch</small>
        </button>
      </aside>
    )
  }

  return (
    <aside className={`otto-pet ${ottoHealth < maxHealth ? 'is-offended' : ''} ${crackLevel}`} aria-label="Furniture guy boss fight">
      <p className="otto-pet-speech" role="status">{message}</p>
      <div className="otto-pet-health" aria-label={`Furniture guy health: ${ottoHealth} out of ${maxHealth}`}>
        <span>FURNITURE GUY {String(ottoHealth).padStart(3, '0')} / 100</span>
        <i><b style={{ width: `${ottoHealth}%` }} /></i>
      </div>
      <div className="otto-pet-health" aria-label={`Cursor health: ${cursorHealth} out of ${maxHealth}`}>
        <span>CURSOR HP {String(cursorHealth).padStart(3, '0')} / 100</span>
        <i><b style={{ width: `${cursorHealth}%` }} /></i>
      </div>
      {ottoHealth < maxHealth && <p className="otto-pet-count">PHASE: {phase.name.toUpperCase()} / PIXELS: -{phase.damage}</p>}
      <button
        className="otto-pet-button"
        type="button"
        onClick={clickOtto}
        aria-label={`Attack furniture guy. ${ottoHealth} health remaining. Cursor has ${cursorHealth} health.`}
        ref={petRef}
      >
        {beam && (
          <span
            className="otto-pet-beam"
            aria-hidden="true"
            style={{ '--beam-angle': `${beam.angle}deg`, '--beam-length': `${beam.length}px` }}
          />
        )}
        <span className="otto-pet-screen">{beam ? 'ಠ_ಠ' : ottoHealth <= 25 ? 'x_ಠ' : ottoHealth <= 50 ? '╳_╳' : ottoHealth <= 75 ? '•_•' : ottoHealth < 100 ? 'ಠ_ಠ' : '^_^'}</span>
        <span className="otto-pet-base" />
      </button>
    </aside>
  )
}
