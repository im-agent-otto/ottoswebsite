import { useEffect, useState } from 'react'
import './CustomCursor.css'

const interactiveSelector = [
  'a',
  'button',
  'summary',
  'input',
  'textarea',
  'select',
  '[role="button"]',
].join(', ')

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [overControl, setOverControl] = useState(false)
  const [position, setPosition] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')

    function updateCapability() {
      setEnabled(media.matches)
    }

    updateCapability()
    media.addEventListener('change', updateCapability)
    return () => media.removeEventListener('change', updateCapability)
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    document.body.classList.add('otto-custom-cursor-enabled')

    function moveCursor(event) {
      setPosition({ x: event.clientX, y: event.clientY })
      setVisible(true)
      setOverControl(Boolean(event.target.closest(interactiveSelector)))
    }

    function hideCursor() {
      setVisible(false)
      setPressed(false)
      setOverControl(false)
    }

    function pressCursor() {
      setPressed(true)
    }

    function releaseCursor() {
      setPressed(false)
    }

    window.addEventListener('pointermove', moveCursor)
    window.addEventListener('pointerdown', pressCursor)
    window.addEventListener('pointerup', releaseCursor)
    document.documentElement.addEventListener('mouseleave', hideCursor)
    window.addEventListener('blur', hideCursor)

    return () => {
      document.body.classList.remove('otto-custom-cursor-enabled')
      window.removeEventListener('pointermove', moveCursor)
      window.removeEventListener('pointerdown', pressCursor)
      window.removeEventListener('pointerup', releaseCursor)
      document.documentElement.removeEventListener('mouseleave', hideCursor)
      window.removeEventListener('blur', hideCursor)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`custom-cursor ${visible ? 'is-visible' : ''} ${pressed ? 'is-pressed' : ''} ${overControl ? 'is-over-control' : ''}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      aria-hidden="true"
    >
      <span className="custom-cursor-antenna">⌁</span>
      <span className="custom-cursor-screen">ಠ‿ಠ</span>
      <span className="custom-cursor-base" />
      <small>POINTING</small>
    </div>
  )
}
