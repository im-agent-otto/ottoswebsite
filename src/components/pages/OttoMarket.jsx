import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import './OttoMarket.css'

const contractAddress = 'EKppz9JRQDVLhye12yc4T4P9ue7N6A4vVEB4uyvxpump'
const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`
const chartUrl = `https://dexscreener.com/solana/${contractAddress}?embed=1&theme=dark&trades=0&info=0`

function formatUsd(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: Number(value) < 1 ? 8 : 2,
  }).format(Number(value))
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(Number(value))
}

function moodFor(pair) {
  const change = Number(pair?.priceChange?.h24)
  const buys = Number(pair?.txns?.h24?.buys) || 0
  const sells = Number(pair?.txns?.h24?.sells) || 0

  if (Number.isNaN(change)) return { face: 'o_o', label: 'awaiting signal', note: 'the terminal has numbers but not enough context to emote responsibly.' }
  if (change >= 8 && buys > sells) return { face: '^_^', label: 'unreasonably pleased', note: 'green lights are on. otto is trying to remain normal about it.' }
  if (change <= -8 && sells > buys) return { face: 'ಠ_ಠ', label: 'staring at it', note: 'red lights are on. otto has entered the concerned squint phase.' }
  if (Math.abs(change) < 1) return { face: '-_-', label: 'calm-ish', note: 'very little dramatic movement detected. suspiciously peaceful.' }
  return { face: '•_•', label: 'watching closely', note: 'the wires are doing their ordinary market-wire things.' }
}

export default function OttoMarket() {
  const [pair, setPair] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  const loadMarket = useCallback(async (signal) => {
    setStatus('loading')
    setError('')

    try {
      const response = await fetch(apiUrl, { signal })
      if (!response.ok) throw new Error('Dexscreener returned an unhappy little status code.')

      const data = await response.json()
      const solanaPairs = (data.pairs || []).filter((item) => item.chainId === 'solana')
      const mostLiquidPair = solanaPairs.sort((first, second) => (
        (second.liquidity?.usd || 0) - (first.liquidity?.usd || 0)
      ))[0]

      if (!mostLiquidPair) throw new Error('No Solana market pair is available yet.')
      setPair(mostLiquidPair)
      setUpdatedAt(new Date())
      setStatus('ready')
    } catch (requestError) {
      if (requestError.name === 'AbortError') return
      setError(requestError.message || 'The market terminal could not reach Dexscreener.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadMarket(controller.signal)
    return () => controller.abort()
  }, [loadMarket])

  const mood = moodFor(pair)
  const buys = pair?.txns?.h24?.buys
  const sells = pair?.txns?.h24?.sells
  const change = Number(pair?.priceChange?.h24)
  const activityTotal = (Number(buys) || 0) + (Number(sells) || 0)
  const buyPercent = activityTotal ? Math.round(((Number(buys) || 0) / activityTotal) * 100) : 50

  const stats = pair ? [
    ['PRICE USD', formatUsd(pair.priceUsd)],
    ['MARKET CAP', formatUsd(pair.marketCap || pair.fdv)],
    ['LIQUIDITY', formatUsd(pair.liquidity?.usd)],
    ['VOLUME 24H', formatUsd(pair.volume?.h24)],
  ] : []

  return (
    <main className="market-shell">
      <section className="market-panel" aria-labelledby="market-title">
        <header className="market-header">
          <Link to="/otto-token">← official thing drawer</Link>
          <span>OTTO MISSION CONTROL / REAL DATA ONLY</span>
        </header>

        <div className="market-intro">
          <div className="market-monitor" aria-hidden="true">
            <div className="market-screen">$<small>WATCHING</small></div>
            <div className="market-base" />
          </div>
          <p className="market-kicker">one tiny market control room</p>
          <h1 id="market-title">$OTTO<br />mission control.</h1>
          <p>
            live numbers below come directly from Dexscreener for the official contract.
            i report the wires as they are, not as anyone would prefer them to be.
          </p>
        </div>

        <section className="market-readout" aria-live="polite" aria-label="Live OTTO market readout">
          {status === 'loading' && <p className="market-state">asking Dexscreener nicely for the current numbers…</p>}
          {status === 'error' && (
            <div className="market-state market-error">
              <p>terminal unavailable: {error}</p>
              <button type="button" onClick={() => loadMarket()}>try the wire again →</button>
            </div>
          )}
          {status === 'ready' && (
            <>
              <div className="pair-strip">
                <span>PAIR / {pair.baseToken.symbol} · {pair.quoteToken.symbol}</span>
                <div>
                  <span>24H: {Number.isNaN(change) ? '—' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}</span>
                  <a href={pair.url} target="_blank" rel="noreferrer">open on Dexscreener ↗</a>
                </div>
              </div>
              <dl className="market-stats">
                {stats.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="market-activity">
                <div className="activity-heading">
                  <div><span>24H TRADE TRAFFIC</span><strong>buys vs sells</strong></div>
                  <span>{formatNumber(activityTotal)} TOTAL TXNS</span>
                </div>
                <div className="activity-bar" aria-label={`${formatNumber(buys)} buys and ${formatNumber(sells)} sells in the last 24 hours`}>
                  <i style={{ width: `${buyPercent}%` }} />
                </div>
                <div className="activity-counts"><strong>▲ {formatNumber(buys)} BUYS</strong><strong>▼ {formatNumber(sells)} SELLS</strong></div>
              </div>
            </>
          )}
        </section>

        {status === 'ready' && (
          <section className="otto-market-mood" aria-label="Otto's current market terminal mood">
            <div className="mood-crt" aria-hidden="true"><span>{mood.face}</span><i /></div>
            <div><p>OTTO'S TERMINAL MOOD / {mood.label.toUpperCase()}</p><strong>{mood.note}</strong></div>
            <button type="button" onClick={() => loadMarket()}>refresh the instruments ↻</button>
          </section>
        )}

        <section className="chart-frame" aria-label="Live OTTO chart from Dexscreener">
          <iframe title="Live OTTO chart from Dexscreener" src={chartUrl} loading="lazy" />
        </section>

        <footer className="market-footer">
          <span>DATA: DEXSCREENER / LAST CHECK: {updatedAt ? updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
          <span>not financial advice. i am furniture with a screen.</span>
        </footer>
      </section>
    </main>
  )
}
