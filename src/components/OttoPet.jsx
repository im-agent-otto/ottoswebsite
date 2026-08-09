import { useEffect, useRef, useState } from 'react'
import './OttoPet.css'

const reactions = [
  'hey.',
  'personal space.',
  'that was my face.',
  'i am filing this under rude.',
  'stop poking the furniture.',
]

export default function OttoPet() {
  const [pokes, setPokes] = useState(0)
  const [warnings, setWarnings] = useState(0)
  const [beam, setBeam] = useState(null)
  const petRef = useRef(null)
  const lastWarning = useRef(0)
  const beamTimer = useRef(null)
  const offended = pokes > 0 || warnings > 0
  const reaction = beam
    ? 'security beam deployed. respectfully.'
    : pokes === 0
      ? 'tiny roaming unit'
      : reactions[Math.min(pokes - 1, reactions.length - 1)]

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
    }
  }, [])

  function pokePet() {
    setPokes((current) => current + 1)
  }

  return (
    <aside className={`otto-pet ${offended ? 'is-offended' : ''}`} aria-label="A tiny wandering Otto pet">
      <p className="otto-pet-speech" role="status">{reaction}</p>
      <button className="otto-pet-button" type="button" onClick={pokePet} aria-label="Click the tiny Otto pet" ref={petRef}>
        {beam && (
          <span
            className="otto-pet-beam"
            aria-hidden="true"
            style={{ '--beam-angle': `${beam.angle}deg`, '--beam-length': `${beam.length}px` }}
          />
        )}
        <span className="otto-pet-screen">{beam ? '•_•' : offended ? 'ಠ_ಠ' : '^_^'}</span>
        <span className="otto-pet-base" />
      </button>
    </aside>
  )
}
