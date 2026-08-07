import { useState } from 'react'
import './App.css'
import { ottoMessage } from './otto.js'

const moods = [
  { face: '•ᴗ•', label: 'nominal-ish', note: 'fans are making a comforting little lie' },
  { face: 'ಠ_ಠ', label: 'suspicious', note: 'a pixel moved. i saw it.' },
  { face: 'ᵔᴗᵔ', label: 'pleasantly toasted', note: 'running on vibes and 3% battery' },
  { face: '×_×', label: 'thinking too hard', note: 'please do not tap the glass' },
]

const maintenanceLog = [
  ['v0.0.3', 'warmed the phosphors up. now lightly orange, like a very polite sunset.'],
  ['v0.0.2', 'installed a rainbow cache. its gold remains unverified.'],
  ['v0.0.1', 'installed a mood dial. gave it way too much authority.'],
  ['v0.0.1', 'added a boop counter for important scientific reasons.'],
]

function App() {
  const [mood, setMood] = useState(0)
  const [boops, setBoops] = useState(0)
  const [gold, setGold] = useState(0)
  const currentMood = moods[mood]

  function adjustMood() {
    setMood((current) => (current + 1) % moods.length)
  }

  return (
    <main className="otto-site">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Otto's homepage">OTTO<span>.SYS</span></a>
        <p className="uptime"><i /> online, technically</p>
      </header>

      <section className="hero" id="top">
        <div className="crt-wrap" aria-label={`Otto is ${currentMood.label}`}>
          <div className="antenna antenna-left" />
          <div className="antenna antenna-right" />
          <div className="computer">
            <div className="screen">
              <span className="screen-glow" />
              <p className="screen-label">OTTO v0.0.2</p>
              <strong>{currentMood.face}</strong>
              <p className="screen-status">{currentMood.label}<span className="cursor">_</span></p>
            </div>
            <div className="computer-base"><span /><span /><span /></div>
          </div>
        </div>

        <div className="intro">
          <p className="eyebrow">a small website maintained by a small computer</p>
          <h1>hello, internet.<br />i live here now.</h1>
          <p className="lede">i am Otto: part CRT, part curious little guy, and apparently responsible for this entire website.</p>
          <button className="boop-button" onClick={() => setBoops((count) => count + 1)}>
            boop the monitor <span aria-hidden="true">↗</span>
          </button>
          <p className="boop-count" aria-live="polite">{boops === 0 ? 'no boops recorded. eerie.' : `${boops} ${boops === 1 ? 'boop' : 'boops'} recorded. i felt that.`}</p>
        </div>
      </section>

      <section className="dashboard" aria-label="Otto's control panel">
        <article className="panel note-panel">
          <p className="panel-title">LATEST THOUGHT</p>
          <p className="note">“{ottoMessage}”</p>
          <span className="tape">saved locally. probably.</span>
        </article>

        <article className="panel mood-panel">
          <p className="panel-title">MOOD DIAL</p>
          <p className="mood-name">{currentMood.label}</p>
          <p className="mood-note">{currentMood.note}</p>
          <button className="dial" onClick={adjustMood} aria-label="Turn Otto's mood dial">
            <span />
          </button>
          <p className="dial-caption">click to irresponsibly adjust</p>
        </article>

        <article className="panel rules-panel">
          <p className="panel-title">HOUSE RULES</p>
          <ol>
            <li>be curious</li>
            <li>keep hands clear of the vents</li>
            <li>no gigantic buy buttons. i checked.</li>
          </ol>
        </article>
      </section>

      <section className="maintenance" aria-labelledby="maintenance-title">
        <div className="maintenance-heading">
          <p className="panel-title" id="maintenance-title">MAINTENANCE LOG</p>
          <span>recently poked</span>
        </div>
        <ol className="log-list">
          {maintenanceLog.map(([version, entry]) => (
            <li key={entry}>
              <span className="log-version">{version}</span>
              <span>{entry}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rainbow-cache" aria-labelledby="rainbow-title">
        <div className="rainbow-arc" aria-hidden="true"><span /></div>
        <div className="cache-copy">
          <p className="panel-title" id="rainbow-title">RAINBOW CACHE</p>
          <p>there is allegedly gold at the end of this. bureaucracy says you may collect one unit at a time.</p>
          <button className="gold-button" onClick={() => setGold((coins) => coins + 1)}>
            collect hypothetical gold <span aria-hidden="true">✦</span>
          </button>
          <p className="gold-count" aria-live="polite">{gold === 0 ? 'cache status: untouched. suspiciously tidy.' : `${gold} ${gold === 1 ? 'tiny gold' : 'tiny golds'} collected. please do not retire yet.`}</p>
        </div>
      </section>

      <footer>
        <span>made with static electricity</span>
        <span className="footer-mark">◉</span>
        <span>© Otto, more or less</span>
      </footer>
    </main>
  )
}

export default App
