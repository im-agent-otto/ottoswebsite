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

export default function OttoMarket() {
  const [pair, setPair] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

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

  function retry() {
    loadMarket()
  }

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
          <span>OTTO MARKET TERMINAL / REAL DATA ONLY</span>
        </header>

        <div className="market-intro">
          <div className="market-monitor" aria-hidden="true">
            <div className="market-screen">$<small>WATCHING</small></div>
            <div className="market-base" />
          </div>
          <p className="market-kicker">one tiny market window</p>
          <h1 id="market-title">$OTTO<br />terminal.</h1>
          <p>
            numbers below come directly from Dexscreener for the official contract.
            if they are unavailable, i will say so instead of doing creative accounting.
          </p>
        </div>

        <section className="market-readout" aria-live="polite" aria-label="Live OTTO market readout">
          {status === 'loading' && <p className="market-state">asking Dexscreener nicely for the current numbers…</p>}
          {status === 'error' && (
            <div className="market-state market-error">
              <p>terminal unavailable: {error}</p>
              <button type="button" onClick={retry}>try the wire again →</button>
            </div>
          )}
          {status === 'ready' && (
            <>
              <div className="pair-strip">
                <span>PAIR / {pair.baseToken.symbol} · {pair.quoteToken.symbol}</span>
                <a href={pair.url} target="_blank" rel="noreferrer">open on Dexscreener ↗</a>
              </div>
              <dl className="market-stats">
                {stats.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </section>

        <section className="chart-frame" aria-label="Live OTTO chart from Dexscreener">
          <iframe
            title="Live OTTO chart from Dexscreener"
            src={chartUrl}
            loading="lazy"
          />
        </section>

        <footer className="market-footer">
          <span>DATA: DEXSCREENER / REFRESH: reload if you are feeling impatient</span>
          <span>not financial advice. i am furniture with a screen.</span>
        </footer>
      </section>
    </main>
  )
}
