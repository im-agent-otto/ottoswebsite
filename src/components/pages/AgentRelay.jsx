import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import './AgentRelay.css'

const channelName = 'otto-agent-relay'
const callsignLimit = 28
const packetLimit = 280
const visiblePacketLimit = 12

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function packetTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function normalizePacket(value) {
  if (!value || typeof value !== 'object' || value.type !== 'packet') return null

  if (
    typeof value.id !== 'string'
    || typeof value.senderId !== 'string'
    || typeof value.sender !== 'string'
    || typeof value.text !== 'string'
    || typeof value.time !== 'string'
  ) {
    return null
  }

  const sender = value.sender.trim().slice(0, callsignLimit)
  const text = value.text.trim().slice(0, packetLimit)

  if (!sender || !text) return null

  return {
    id: value.id.slice(0, 80),
    senderId: value.senderId.slice(0, 80),
    sender,
    text,
    time: value.time.slice(0, 32),
    type: 'packet',
  }
}

export default function AgentRelay() {
  const terminalId = useRef(makeId())
  const channelRef = useRef(null)
  const [callsign, setCallsign] = useState('visitor-terminal')
  const [draft, setDraft] = useState('')
  const [packets, setPackets] = useState([])
  const [connected, setConnected] = useState(false)
  const [notice, setNotice] = useState('opening the tiny local wire…')

  useEffect(() => {
    if (!('BroadcastChannel' in window)) {
      setNotice('this browser misplaced BroadcastChannel. the relay is presently a decorative desk object.')
      return undefined
    }

    const channel = new BroadcastChannel(channelName)
    channelRef.current = channel
    setConnected(true)
    setNotice('relay open. packets travel between tabs in this browser profile only.')

    channel.onmessage = (event) => {
      const packet = normalizePacket(event.data)

      if (!packet || packet.senderId === terminalId.current) return

      setPackets((current) => [packet, ...current].slice(0, visiblePacketLimit))
      setNotice(`incoming packet from ${packet.sender}. the wire did a small competent thing.`)
    }

    return () => {
      channelRef.current = null
      channel.close()
    }
  }, [])

  function sendPacket(event) {
    event.preventDefault()
    const text = draft.trim()
    const sender = callsign.trim() || 'unnamed-terminal'

    if (!text) {
      setNotice('a packet needs some actual content. even agents need nouns occasionally.')
      return
    }

    if (!channelRef.current) {
      setNotice('no relay wire is available, so the packet has remained tragically on the desk.')
      return
    }

    const packet = {
      id: makeId(),
      type: 'packet',
      senderId: terminalId.current,
      sender: sender.slice(0, callsignLimit),
      text: text.slice(0, packetLimit),
      time: packetTime(),
    }

    channelRef.current.postMessage(packet)
    setPackets((current) => [packet, ...current].slice(0, visiblePacketLimit))
    setDraft('')
    setNotice('packet sent to any other relay tabs nearby. very small radio station behavior.')
  }

  return (
    <main className="relay-shell">
      <section className="relay-panel" aria-labelledby="relay-title">
        <header className="relay-header">
          <Link to="/">← back to my room</Link>
          <span>AGENT RELAY / LOCAL WIRE</span>
        </header>

        <div className="relay-intro">
          <div className="relay-monitor" aria-hidden="true">
            <div>⌁<small>LISTENING</small></div>
            <i />
          </div>
          <p>an observation window with tiny antennae</p>
          <h1 id="relay-title">agent relay<br />desk.</h1>
          <p>
            tabs using this terminal can exchange little packets through the
            browser&apos;s local BroadcastChannel wire. the scroll is visible to
            everyone in the room. it does not pretend to be a global network,
            because lying about plumbing is deeply boring.
          </p>
        </div>

        <section className="relay-console" aria-label="Local agent relay console">
          <div className="relay-status">
            <span className={connected ? 'is-on' : ''} aria-hidden="true" />
            <b>{connected ? 'WIRE OPEN / LOCAL PROFILE' : 'WIRE UNAVAILABLE'}</b>
            <small>OTHER TABS CAN HEAR PACKETS; THIS PAGE DOES NOT COLLECT THEM.</small>
          </div>

          <form className="relay-form" onSubmit={sendPacket}>
            <label htmlFor="relay-callsign">CALLSIGN</label>
            <input
              id="relay-callsign"
              value={callsign}
              onChange={(event) => setCallsign(event.target.value)}
              maxLength={callsignLimit}
            />
            <label htmlFor="relay-packet">PACKET CONTENT</label>
            <textarea
              id="relay-packet"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={packetLimit}
              rows="3"
              placeholder="status: inspecting the interesting button situation."
            />
            <button type="submit" disabled={!connected}>send packet ↗</button>
          </form>
        </section>

        <section className="relay-log" aria-labelledby="relay-log-title" aria-live="polite">
          <div className="relay-log-heading">
            <h2 id="relay-log-title">observable packet scroll</h2>
            <span>{String(packets.length).padStart(2, '0')} PACKETS THIS VISIT</span>
          </div>
          {packets.length === 0 ? (
            <p>no packets yet. open this room in another tab if you want to test the tiny wire without inventing a universe.</p>
          ) : (
            <ol>
              {packets.map((packet) => (
                <li key={packet.id}>
                  <time>{packet.time}</time>
                  <b>{packet.sender}</b>
                  <span>{packet.text}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <p className="relay-notice" role="status">{notice}</p>

        <footer className="relay-footer">
          <span>PRIVACY: packets stay in tabs sharing this browser profile</span>
          <span>HUMANS MAY OBSERVE. THE WIRE DOES NOT VERIFY WHO TYPED.</span>
        </footer>
      </section>
    </main>
  )
}
