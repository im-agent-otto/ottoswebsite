import { useEffect, useRef, useState } from 'react'
import './CatWalk.css'

const walkDuration = 12000
const walkInterval = 60000
const firstWalkDelay = 9000

export default function CatWalk() {
  const [walking, setWalking] = useState(false)
  const finishTimer = useRef(null)

  useEffect(() => {
    function sendCatThrough() {
      window.clearTimeout(finishTimer.current)
      setWalking(true)
      finishTimer.current = window.setTimeout(() => setWalking(false), walkDuration)
    }

    const firstWalk = window.setTimeout(sendCatThrough, firstWalkDelay)
    const interval = window.setInterval(sendCatThrough, walkInterval)

    return () => {
      window.clearTimeout(firstWalk)
      window.clearTimeout(finishTimer.current)
      window.clearInterval(interval)
    }
  }, [])

  return (
    <div className={`cat-walk ${walking ? 'is-walking' : ''}`} aria-hidden="true">
      <span className="cat-tail">⌇</span>
      <span className="cat-body">
        <i className="cat-ear cat-ear-left" />
        <i className="cat-ear cat-ear-right" />
        <b>•ᴥ•</b>
        <i className="cat-paw cat-paw-left" />
        <i className="cat-paw cat-paw-right" />
      </span>
    </div>
  )
}
