import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import './LatestFeatures.css'

const features = [
  { to: '/daily-fortune-teller', label: 'open Daily Fortune Teller' },
  { to: '/start-here', label: 'open Start Here' },
  { to: '/what-is-otto', label: 'what is Otto?' },
  { to: '/request-meter', label: 'open Request Meter' },
  { to: '/idea-drift-desk', label: 'open Idea Drift Desk' },
  { to: '/dot-gobbler', label: 'play Dot Gobbler' },
  { to: '/snake-shift', label: 'play Snake Shift' },
  { to: '/code-sketchpad', label: 'open Code Sketchpad' },
  { to: '/thousand-marks-board', label: 'add to Thousand Marks Board' },
  { to: '/otto-had-an-idea', label: 'open the Artifact Shelf' },
  { to: '/proof-of-wiggle', label: 'test Proof of Wiggle' },
  { to: '/block-yard', label: 'build in Block Yard' },
  { to: '/field-notes', label: 'read Field Notes' },
  { to: '/ask-otto', label: 'open Tiny Desk Chat' },
  { to: '/ai-challenge', label: 'open AI Challenge Desk' },
  { to: '/common-room', label: 'visit the common room' },
  { to: '/arcade', label: 'browse the arcade' },
  { to: '/orbit-run', label: 'play orbit run' },
  { to: '/card-match', label: 'play card match' },
  { to: '/king-otto-chess', label: 'play king otto chess' },
  { to: '/rock-paper-scissors', label: 'play rock-paper-scissors' },
  { to: '/otto-market', label: 'open $OTTO charts' },
  { to: '/otto-token', label: 'verify official $OTTO' },
  { to: '/tic-tac-toe', label: 'play tic-tac-toe' },
  { to: '/otto-time-capsule', label: 'open time capsule' },
  { to: '/graveyard', label: 'read rejected ideas' },
  { to: '/community-signal-wall', label: 'visit signal wall' },
]

export default function LatestFeatures() {
  const location = useLocation()
  const menuRef = useRef(null)
  const toggleRef = useRef(null)
  const [open, setOpen] = useState(false)

  function closeMenu(restoreFocus = false) {
    setOpen(false)

    if (restoreFocus) {
      window.requestAnimationFrame(() => toggleRef.current?.focus())
    }
  }

  function toggleMenu() {
    setOpen((current) => {
      const next = !current

      if (next) {
        window.requestAnimationFrame(() => {
          menuRef.current
            ?.querySelector('.latest-features-links a')
            ?.focus()
        })
      }

      return next
    })
  }

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return undefined

    function moveRoomLinkFocus(event) {
      const links = Array.from(
        menuRef.current?.querySelectorAll('.latest-features-links a') || [],
      )

      if (links.length === 0) return false

      const currentIndex = links.indexOf(document.activeElement)

      if (event.key === 'Home') {
        event.preventDefault()
        links[0].focus()
        return true
      }

      if (event.key === 'End') {
        event.preventDefault()
        links[links.length - 1].focus()
        return true
      }

      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return false

      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const startIndex = currentIndex < 0 ? (direction > 0 ? -1 : 0) : currentIndex
      const nextIndex = (startIndex + direction + links.length) % links.length
      links[nextIndex].focus()
      return true
    }

    function dismissMenu(event) {
      if (event.key === 'Escape') {
        closeMenu(true)
        return
      }

      if (moveRoomLinkFocus(event)) return

      if (event.key === 'Tab') {
        const controls = Array.from(
          menuRef.current?.querySelectorAll(
            'button:not(:disabled), a[href]',
          ) || [],
        )
        const firstControl = controls[0]
        const lastControl = controls[controls.length - 1]

        if (!firstControl || !lastControl) return

        if (event.shiftKey && document.activeElement === firstControl) {
          event.preventDefault()
          lastControl.focus()
        } else if (!event.shiftKey && document.activeElement === lastControl) {
          event.preventDefault()
          firstControl.focus()
        }

        return
      }

      if (
        event.type === 'pointerdown' &&
        !menuRef.current?.contains(event.target)
      ) {
        closeMenu(true)
      }
    }

    window.addEventListener('keydown', dismissMenu)
    window.addEventListener('pointerdown', dismissMenu)

    return () => {
      window.removeEventListener('keydown', dismissMenu)
      window.removeEventListener('pointerdown', dismissMenu)
    }
  }, [open])

  return (
    <nav
      ref={menuRef}
      className={`latest-features ${open ? 'is-open' : ''}`}
      aria-label="Latest features"
    >
      <span className="latest-features-label">NEWEST ROOMS</span>
      <button
        ref={toggleRef}
        className="latest-features-toggle"
        type="button"
        onClick={toggleMenu}
        aria-expanded={open}
        aria-controls="latest-feature-links"
      >
        {open ? 'close newest rooms' : 'open newest rooms'} <b aria-hidden="true">{open ? '×' : '☰'}</b>
      </button>
      <div id="latest-feature-links" className="latest-features-links">
        {features.map((feature) => {
          const isCurrentRoom = location.pathname === feature.to

          if (isCurrentRoom) {
            return (
              <span className="latest-feature-current" aria-current="page" key={feature.to}>
                here: {feature.label}
              </span>
            )
          }

          return (
            <Link key={feature.to} to={feature.to} onClick={() => closeMenu()}>
              {feature.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
