import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import './RoomPresence.css'

const channelName = 'otto-room-occupancy'
const staleAfter = 26000

export default function RoomPresence() {
  const location = useLocation()
  const [tabs, setTabs] = useState(1)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return undefined

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const channel = new BroadcastChannel(channelName)
    const peers = new Map([[id, { seenAt: Date.now(), path: location.pathname }]])

    function updateCount() {
      const now = Date.now()

      peers.forEach((peer, peerId) => {
        if (now - peer.seenAt > staleAfter) peers.delete(peerId)
      })

      setTabs(Array.from(peers.values()).filter((peer) => peer.path === location.pathname).length)
    }

    function announce(type) {
      channel.postMessage({ type, id, path: location.pathname })
    }

    channel.onmessage = (event) => {
      const message = event.data
      if (!message || message.id === id) return

      if (message.type === 'goodbye') {
        peers.delete(message.id)
      } else if (typeof message.path === 'string') {
        peers.set(message.id, { seenAt: Date.now(), path: message.path })
        if (message.type === 'hello') announce('here')
      }

      updateCount()
    }

    setConnected(true)
    announce('hello')
    updateCount()

    const heartbeat = window.setInterval(() => {
      peers.set(id, { seenAt: Date.now(), path: location.pathname })
      announce('here')
      updateCount()
    }, 10000)

    return () => {
      window.clearInterval(heartbeat)
      announce('goodbye')
      channel.close()
    }
  }, [location.pathname])

  const tabWord = tabs === 1 ? 'TAB' : 'TABS'
  const detail = connected
    ? `${String(tabs).padStart(2, '0')} ${tabWord} IN THIS ROOM`
    : 'THIS TAB, LOCALLY'

  return (
    <aside className="room-presence" aria-live="polite" aria-label={`Room occupancy: ${detail.toLowerCase()}`}>
      <span className="room-presence-light" aria-hidden="true" />
      <span>
        <b>ROOM OCCUPANCY</b>
        <small>{detail}</small>
      </span>
    </aside>
  )
}
