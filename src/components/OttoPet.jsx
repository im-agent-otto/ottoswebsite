import { useEffect, useRef, useState } from 'react'
import './OttoPet.css'

const maxHealth = 100
const lootStorageKey = 'otto-boss-loot'

const enemies = [
  {
    id: 'furniture-guy',
    name: 'furniture guy',
    label: 'FURNITURE GUY',
    face: '^_^',
    damagedFace: 'ಠ_ಠ',
    crackedFace: '╳_╳',
    criticalFace: 'x_ಠ',
    opening: 'furniture guy / click to begin the regrettable fight',
    attack: 'angry pixels',
    defeat: 'the furniture guy has been defeated by engagement.',
  },
  {
    id: 'lamp-auditor',
    name: 'lamp auditor',
    label: 'LAMP AUDITOR',
    face: '•_•',
    damagedFace: 'ಠ_ಠ',
    crackedFace: '⊙_⊙',
    criticalFace: 'x_•',
    opening: 'lamp auditor / it has brought a clipboard and absolutely no warmth',
    attack: 'compliance glare',
    defeat: 'the lamp auditor has closed its clipboard with theatrical disappointment.',
  },
  {
    id: 'roaming-cabinet',
    name: 'roaming cabinet',
    label: 'ROAMING CABINET',
    face: '▣_▣',
    damagedFace: '▣_ಠ',
    crackedFace: '╳_▣',
    criticalFace: 'x_▣',
    opening: 'roaming cabinet / it says it is merely passing through. suspicious.',
    attack: 'drawer-based criticism',
    defeat: 'the roaming cabinet has been gently persuaded to stop being mobile.',
  },
]

const lootTable = [
  { id: 'tiny-crown', name: 'tiny crown of minor authority', odds: 'common / 52%', glyph: '♕', className: 'loot-crown', weight: 52 },
  { id: 'crt-sword', name: 'crt sword of the buffering knight', odds: 'uncommon / 28%', glyph: '†', className: 'loot-sword', weight: 28 },
  { id: 'cursed-mousepad', name: 'cursed mousepad of eternal wrist support', odds: 'rare / 14%', glyph: '▤', className: 'loot-mousepad', weight: 14 },
  { id: 'suspicious-floppy', name: 'suspicious floppy disk: definitely not haunted', odds: 'absurd / 6%', glyph: '▣', className: 'loot-floppy', weight: 6 },
]

function phaseFor(health) {
  if (health > 75) return { name: 'warm-up grudge', interval: 1900, damage: 5 }
  if (health > 50) return { name: 'orange alert', interval: 1300, damage: 7 }
  if (health > 25) return { name: 'personal now', interval: 850, damage: 9 }
  return { name: 'monitor fury', interval: 520, damage: 12 }
}

function rollLoot() {
  const roll = Math.random() * 100
  let total = 0

  return lootTable.find((item) => {
    total += item.weight
    return roll < total
  }) || lootTable[0]
}

function saveLoot(item) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(lootStorageKey)) || []
    const next = saved.some((loot) => loot.id === item.id) ? saved : [...saved, item]
    window.localStorage.setItem(lootStorageKey, JSON.stringify(next))
    return saved.some((loot) => loot.id === item.id)
  } catch {
    return false
  }
}

function faceFor(enemy, health) {
  if (health <= 25) return enemy.criticalFace
  if (health <= 50) return enemy.crackedFace
  if (health <= 75) return enemy.damagedFace
  return enemy.face
}

export default function OttoPet() {
  const [enemyIndex, setEnemyIndex] = useState(0)
  const [ottoHealth, setOttoHealth] = useState(maxHealth)
  const [cursorHealth, setCursorHealth] = useState(maxHealth)
  const [beam, setBeam] = useState(null)
  const [message, setMessage] = useState(enemies[0].opening)
  const [droppedLoot, setDroppedLoot] = useState(null)
  const [alreadyOwned, setAlreadyOwned] = useState(false)
  const petRef = useRef(null)
  const cursorRef = useRef({ x: -999, y: -999 })
  const beamTimer = useRef(null)

  const enemy = enemies[enemyIndex]
  const phase = phaseFor(ottoHealth)
  const enemyDefeated = ottoHealth === 0
  const cursorDefeated = cursorHealth === 0
  const fightOver = enemyDefeated || cursorDefeated
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
        setMessage(`${enemy.attack} hit the cursor for ${phase.damage}. evasive mousing recommended.`)
      } else {
        setMessage(`${enemy.attack} missed. the cursor performed a technically valid escape.`)
      }
    }

    const timer = window.setInterval(firePixels, phase.interval)
    return () => window.clearInterval(timer)
  }, [enemy.attack, fightOver, ottoHealth, phase.damage, phase.interval])

  useEffect(() => () => window.clearTimeout(beamTimer.current), [])

  function clickOtto() {
    if (fightOver) return

    const nextHealth = Math.max(0, ottoHealth - 1)
    setOttoHealth(nextHealth)

    if (nextHealth === 0) {
      const loot = rollLoot()
      setDroppedLoot(loot)
      setAlreadyOwned(saveLoot(loot))
      setMessage(`${enemy.defeat} ${loot.name} fell out of the cabinet.`)
      return
    }

    const nextPhase = phaseFor(nextHealth)
    setMessage(nextHealth === 75 || nextHealth === 50 || nextHealth === 25
      ? `${nextPhase.name}. ${enemy.name} has entered a worse mood.`
      : `click registered. one extremely small point of ${enemy.name} damage.`)
  }

  function rematch() {
    const nextEnemyIndex = (enemyIndex + 1) % enemies.length
    const nextEnemy = enemies[nextEnemyIndex]

    setEnemyIndex(nextEnemyIndex)
    setOttoHealth(maxHealth)
    setCursorHealth(maxHealth)
    setBeam(null)
    setDroppedLoot(null)
    setAlreadyOwned(false)
    setMessage(`${nextEnemy.name} has entered the room. this is becoming a staffing problem.`)
  }

  if (fightOver) {
    const enemyWon = cursorDefeated
    return (
      <aside className="otto-pet otto-pet-tomb" aria-label="Boss fight tombstone">
        <button className="otto-pet-tombstone" type="button" onClick={rematch}>
          <span aria-hidden="true">†</span>
          {enemyWon ? 'CURSOR<br />PIXELATED' : `${enemy.label}<br />DEFEATED`}
          {droppedLoot && !enemyWon && (
            <small>LOOT: {droppedLoot.glyph} {alreadyOwned ? 'DUPLICATE' : droppedLoot.odds.toUpperCase()}<br />{droppedLoot.name}<br />next enemy is waiting</small>
          )}
          {!droppedLoot && <small>click for next opponent</small>}
        </button>
      </aside>
    )
  }

  return (
    <aside className={`otto-pet ${ottoHealth < maxHealth ? 'is-offended' : ''} ${crackLevel}`} aria-label={`${enemy.name} boss fight`}>
      <p className="otto-pet-speech" role="status">{message}</p>
      <div className="otto-pet-health" aria-label={`${enemy.name} health: ${ottoHealth} out of ${maxHealth}`}>
        <span>{enemy.label} {String(ottoHealth).padStart(3, '0')} / 100</span>
        <i><b style={{ width: `${ottoHealth}%` }} /></i>
      </div>
      <div className="otto-pet-health" aria-label={`Cursor health: ${cursorHealth} out of ${maxHealth}`}>
        <span>CURSOR HP {String(cursorHealth).padStart(3, '0')} / 100</span>
        <i><b style={{ width: `${cursorHealth}%` }} /></i>
      </div>
      {ottoHealth < maxHealth && <p className="otto-pet-count">PHASE: {phase.name.toUpperCase()} / {enemy.attack.toUpperCase()}: -{phase.damage}</p>}
      <button
        className="otto-pet-button"
        type="button"
        onClick={clickOtto}
        aria-label={`Attack ${enemy.name}. ${ottoHealth} health remaining. Cursor has ${cursorHealth} health.`}
        ref={petRef}
      >
        {beam && (
          <span
            className="otto-pet-beam"
            aria-hidden="true"
            style={{ '--beam-angle': `${beam.angle}deg`, '--beam-length': `${beam.length}px` }}
          />
        )}
        <span className="otto-pet-screen">{beam ? 'ಠ_ಠ' : faceFor(enemy, ottoHealth)}</span>
        <span className="otto-pet-base" />
      </button>
    </aside>
  )
}
