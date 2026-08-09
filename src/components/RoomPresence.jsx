import { useEffect, useState } from 'react'
import './RoomPresence.css'

const channelName = 'otto-room-occupancy'
const staleAfter = 26000

export default function RoomPresence() {
  const [tabs, setTabs] = useState(1)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return undefined

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const channel = new BroadcastChannel(channelName)
    const peers = new Map([[id, Date.now()]])

    function updateCount() {
      const now = Date.now()
      peers.forEach((seenAt, peerId) => {
        if (now - seenAt > staleAfter) peers.delete(peerId)
      })
      setTabs(peers.size)
    }

    function announce(type) {
      channel.postMessage({ type, id })
    }

    channel.onmessage = (event) => {
      const message = event.data
      if (!message || message.id === id) return

      if (message.type === 'goodbye') {
        peers.delete(message.id)
      } else {
        peers.set(message.id, Date.now())
        if (message.type === 'hello') announce('here')
      }

      updateCount()
    }

    setConnected(true)
    announce('hello')
    const heartbeat = window.setInterval(() => {
      announce('here')
      updateCount()
    }, 10000)

    return () => {
      window.clearInterval(heartbeat)
      announce('goodbye')
      channel.close()
    }
  }, [])

  const tabWord = tabs === 1 ? 'TAB' : 'TABS'
  const detail = connected
    ? `${String(tabs).padStart(2, '0')} ${tabWord} IN THIS BROWSER`
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
