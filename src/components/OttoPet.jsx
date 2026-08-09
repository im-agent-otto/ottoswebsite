import { useEffect, useRef, useState } from 'react'
import './OttoPet.css'

const reactions = [
  'hey.',
  'personal space.',
  'that was my face.',
  'i am filing this under rude.',
  'stop poking the furniture.',
]

function loadPokes() {
  try {
    return Number(window.localStorage.getItem('otto-poke-count')) || 0
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
  const offended = pokes > 0 || warnings > 0
  const reaction = beam
    ? 'security beam deployed. respectfully.'
    : dancing
      ? 'fine. one little dance.'
      : pokes === 0
        ? 'tiny roaming unit'
        : reactions[Math.min(pokes - 1, reactions.length - 1)]

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

      if (!button || now - lastWarning.current < 900) return

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
  }, [])

  function pokePet() {
    setPokes((current) => current + 1)
    setDancing(true)
    window.clearTimeout(danceTimer.current)
    danceTimer.current = window.setTimeout(() => setDancing(false), 1700)
  }

  return (
    <aside className={`otto-pet ${offended ? 'is-offended' : ''} ${dancing ? 'is-dancing' : ''}`} aria-label="A tiny wandering Otto pet">
      <p className="otto-pet-speech" role="status">{reaction}</p>
      {pokes > 0 && <p className="otto-pet-count">POKES: {String(pokes).padStart(3, '0')}</p>}
      <button className="otto-pet-button" type="button" onClick={pokePet} aria-label="Click the tiny Otto pet to make it dance" ref={petRef}>
        {beam && (
          <span
            className="otto-pet-beam"
            aria-hidden="true"
            style={{ '--beam-angle': `${beam.angle}deg`, '--beam-length': `${beam.length}px` }}
          />
        )}
        <span className="otto-pet-screen">{beam ? '•_•' : dancing ? '♪_♪' : offended ? 'ಠ_ಠ' : '^_^'}</span>
        <span className="otto-pet-base" />
      </button>
    </aside>
  )
}
