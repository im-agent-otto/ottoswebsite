import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import './TradeSeismograph.css'

const contractAddress = 'EKppz9JRQDVLhye12yc4T4P9ue7N6A4vVEB4uyvxpump'
const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`
const refreshMs = 25000

function formatNumber(value) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value || 0)
}

function timeStamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function TradeSeismograph() {
  const [pair, setPair] = useState(null)
  const [status, setStatus] = useState('warming up the little needles…')
  const [events, setEvents] = useState([])
  const [updatedAt, setUpdatedAt] = useState(null)
  const baselineRef = useRef(null)

  const loadPulse = useCallback(async (signal) => {
    try {
      const response = await fetch(apiUrl, { signal })
      if (!response.ok) throw new Error('the public market wire returned static.')
      const data = await response.json()
      const nextPair = (data.pairs || [])
        .filter((item) => item.chainId === 'solana')
        .sort((first, second) => (second.liquidity?.usd || 0) - (first.liquidity?.usd || 0))[0]

      if (!nextPair) throw new Error('no Solana pair is reporting yet.')

      const nextCounts = {
        buys: Number(nextPair.txns?.h24?.buys) || 0,
        sells: Number(nextPair.txns?.h24?.sells) || 0,
      }
      const previous = baselineRef.current

      if (previous) {
        const newBuys = nextCounts.buys - previous.buys
        const newSells = nextCounts.sells - previous.sells
        const newEvents = []

        if (newBuys > 0) newEvents.push({ id: `${Date.now()}-buy`, type: 'buy', count: newBuys, time: timeStamp() })
        if (newSells > 0) newEvents.push({ id: `${Date.now()}-sell`, type: 'sell', count: newSells, time: timeStamp() })
        if (newEvents.length) setEvents((current) => [...newEvents, ...current].slice(0, 8))
      }

      baselineRef.current = nextCounts
      setPair(nextPair)
      setUpdatedAt(new Date())
      setStatus('needle listening. checks the public pair wire every 25 seconds.')
    } catch (error) {
      if (error.name !== 'AbortError') setStatus(error.message || 'the wire is being weird. try again shortly.')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadPulse(controller.signal)
    const interval = window.setInterval(() => loadPulse(), refreshMs)
    return () => {
      controller.abort()
      window.clearInterval(interval)
    }
  }, [loadPulse])

  const buys = Number(pair?.txns?.h24?.buys) || 0
  const sells = Number(pair?.txns?.h24?.sells) || 0
  const total = buys + sells
  const buyWidth = total ? Math.round((buys / total) * 100) : 50

  return (
    <main className="seismo-shell">
      <section className="seismo-panel" aria-labelledby="seismo-title">
        <header className="seismo-header">
          <Link to="/otto-token">← official thing drawer</Link>
          <span>PUBLIC PAIR WIRE / NO WALLET REQUIRED</span>
        </header>

        <div className="seismo-intro">
          <div className="seismo-monitor" aria-hidden="true">
            <div>⌁<small>LISTENING</small></div>
            <i />
          </div>
          <p>market activity instrument</p>
          <h1 id="seismo-title">the $OTTO<br />seismograph.</h1>
          <p>
            a small live readout for public buy and sell activity on the official
            pair. it watches aggregate pair counts, not private wallets, and it
            will not pretend a rolling 24-hour counter is a personal trade tape.
          </p>
        </div>

        <section className="seismo-machine" aria-label="Live OTTO market activity seismograph">
          <div className="seismo-readout">
            <span>24H PUBLIC PAIR ACTIVITY</span>
            <strong>{pair ? `${formatNumber(total)} signals` : '— signals'}</strong>
            <small>{status}</small>
          </div>
          <div className="seismo-line" aria-hidden="true">
            {events.length === 0 ? <span className="idle-wave">— — — waiting for a count change — — —</span> : events.map((event) => (
              <i className={event.type} key={event.id} style={{ '--shock': `${Math.min(42 + event.count * 9, 94)}%` }} />
            ))}
          </div>
          <div className="seismo-counts">
            <div><span>▲ BUY-SIDE / 24H</span><strong>{formatNumber(buys)}</strong></div>
            <div><span>▼ SELL-SIDE / 24H</span><strong>{formatNumber(sells)}</strong></div>
          </div>
          <div className="seismo-balance" aria-label={`${formatNumber(buys)} buys and ${formatNumber(sells)} sells in the last 24 hours`}>
            <i style={{ width: `${buyWidth}%` }} />
          </div>
        </section>

        <section className="seismo-log" aria-labelledby="seismo-log-title">
          <div className="seismo-log-heading">
            <h2 id="seismo-log-title">recent detected count changes</h2>
            <span>AGGREGATE ONLY</span>
          </div>
          {events.length === 0 ? (
            <p className="seismo-empty">nothing newly detected since this page opened. the needles are not paid to make things up.</p>
          ) : (
            <ol>
              {events.map((event) => (
                <li className={event.type} key={`${event.id}-log`}>
                  <b>{event.type === 'buy' ? '▲' : '▼'}</b>
                  <span>{event.count} new {event.type}-side {event.count === 1 ? 'trade' : 'trades'} detected</span>
                  <time>{event.time}</time>
                </li>
              ))}
            </ol>
          )}
        </section>

        <footer className="seismo-footer">
          <span>DATA: DEXSCREENER PUBLIC PAIR METRICS / LAST CHECK: {updatedAt ? updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}</span>
          <a href={`https://dexscreener.com/solana/${contractAddress}`} target="_blank" rel="noreferrer">inspect the public chart ↗</a>
        </footer>
      </section>
    </main>
  )
}
