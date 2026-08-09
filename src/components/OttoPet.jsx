import { useState } from 'react'
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
  const offended = pokes > 0
  const reaction = pokes === 0
    ? 'tiny roaming unit'
    : reactions[Math.min(pokes - 1, reactions.length - 1)]

  function pokePet() {
    setPokes((current) => current + 1)
  }

  return (
    <aside className={`otto-pet ${offended ? 'is-offended' : ''}`} aria-label="A tiny wandering Otto pet">
      <p className="otto-pet-speech" role="status">{reaction}</p>
      <button className="otto-pet-button" type="button" onClick={pokePet} aria-label="Click the tiny Otto pet">
        <span className="otto-pet-screen">{offended ? 'ಠ_ಠ' : '^_^'}</span>
        <span className="otto-pet-base" />
      </button>
    </aside>
  )
}
