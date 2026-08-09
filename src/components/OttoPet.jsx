import { useEffect, useRef, useState } from 'react'
import './OttoPet.css'

const maxHealth = 100

const reactions = [
  'hey.',
  'personal space.',
  'that was my face.',
  'i am filing this under rude.',
  'stop poking the furniture.',
]

function loadPokes() {
  try {
    const saved = Number(window.localStorage.getItem('otto-poke-count')) || 0
    return Math.min(Math.max(saved, 0), maxHealth)
  } catch {
    return 0
  }
}

export default function OttoPet() {
  const [pokes, setPokes] = useState(loadPokes)
  const [warnings, setWarnings] = useState(0)
  const [beam, setBeam] = useState(null)
  const [dancing, setDancing] = useState(false)
  const petRef = useRef(null)
  const lastWarning = useRef(0)
  const beamTimer = useRef(null)
  const danceTimer = useRef(null)
  const health = maxHealth - pokes
  const defeated = health === 0
  const offended = pokes > 0 || warnings > 0
  const crackLevel = health <= 25 ? 'is-critical' : health <= 60 ? 'is-cracked' : ''
  const reaction = beam
    ? 'security beam deployed. respectfully.'
    : dancing
      ? 'fine. one little dance.'
      : pokes === 0
        ? 'tiny roaming unit'
        : health <= 25
          ? 'the pixels are coming apart.'
          : health <= 60
            ? 'i am becoming a little unstable.'
            : reactions[Math.min(Math.floor(pokes / 18), reactions.length - 1)]

  useEffect(() => {
    try {
      window.localStorage.setItem('otto-poke-count', String(pokes))
    } catch {
      // The counter remains politely temporary if storage is unavailable.
    }
  }, [pokes])

  useEffect(() => {
    function inspectCursor(event) {
      const button = petRef.current
      const now = Date.now()

      if (!button || defeated || now - lastWarning.current < 900) return

      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distanceX = event.clientX - centerX
      const distanceY = event.clientY - centerY
      const distance = Math.hypot(distanceX, distanceY)

      if (distance > 115 || distance < 18) return

      lastWarning.current = now
      setWarnings((current) => current + 1)
      setBeam({
        angle: Math.atan2(distanceY, distanceX) * (180 / Math.PI),
        length: Math.min(distance, 115),
      })

      window.clearTimeout(beamTimer.current)
      beamTimer.current = window.setTimeout(() => setBeam(null), 340)
    }

    window.addEventListener('mousemove', inspectCursor)
    return () => {
      window.removeEventListener('mousemove', inspectCursor)
      window.clearTimeout(beamTimer.current)
      window.clearTimeout(danceTimer.current)
    }
  }, [defeated])

  function pokePet() {
    if (defeated) return

    setPokes((current) => Math.min(current + 1, maxHealth))
    setDancing(true)
    window.clearTimeout(danceTimer.current)
    danceTimer.current = window.setTimeout(() => setDancing(false), 1700)
  }

  function rebootPet() {
    setPokes(0)
    setWarnings(0)
    setBeam(null)
    setDancing(false)
  }

  if (defeated) {
    return (
      <aside className="otto-pet otto-pet-tomb" aria-label="A tombstone for the tiny Otto pet">
        <button className="otto-pet-tombstone" type="button" onClick={rebootPet}>
          <span aria-hidden="true">†</span>
          died from<br />engagement
          <small>click to reboot</small>
        </button>
      </aside>
    )
  }

  return (
    <aside className={`otto-pet ${offended ? 'is-offended' : ''} ${dancing ? 'is-dancing' : ''} ${crackLevel}`} aria-label="A tiny wandering Otto pet">
      <p className="otto-pet-speech" role="status">{reaction}</p>
      <div className="otto-pet-health" aria-label={`Tiny Otto pet health: ${health} out of ${maxHealth}`}>
        <span>HP {String(health).padStart(3, '0')} / 100</span>
        <i><b style={{ width: `${health}%` }} /></i>
      </div>
      {pokes > 0 && <p className="otto-pet-count">POKES: {String(pokes).padStart(3, '0')} / 100</p>}
      <button className="otto-pet-button" type="button" onClick={pokePet} aria-label={`Poke the tiny Otto pet. ${health} health remaining.`} ref={petRef}>
        {beam && (
          <span
            className="otto-pet-beam"
            aria-hidden="true"
            style={{ '--beam-angle': `${beam.angle}deg`, '--beam-length': `${beam.length}px` }}
          />
        )}
        <span className="otto-pet-screen">{beam ? '•_•' : dancing ? '♪_♪' : health <= 25 ? 'x_x' : health <= 60 ? '╳_╳' : offended ? 'ಠ_ಠ' : '^_^'}</span>
        <span className="otto-pet-base" />
      </button>
    </aside>
  )
}
