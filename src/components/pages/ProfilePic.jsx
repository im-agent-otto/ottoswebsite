import { useState } from 'react'
import { Link } from 'react-router'
import './ProfilePic.css'

const palettes = [
  { name: 'lime terminal', screen: '#d8efa6', scan: '#bfdc8b', shell: '#f28b45', accent: '#a24d36' },
  { name: 'blue screen', screen: '#a8d7e7', scan: '#82bdcf', shell: '#6677b8', accent: '#e7805f' },
  { name: 'strawberry disk', screen: '#ffc5c2', scan: '#e89999', shell: '#e9b64e', accent: '#9b4658' },
  { name: 'night shift', screen: '#b8d89c', scan: '#88ad75', shell: '#4e596e', accent: '#f2a15f' },
]

const faces = [
  { label: 'cheery', face: '^_^' },
  { label: 'unimpressed', face: 'ಠ_ಠ' },
  { label: 'thinking', face: 'o_o' },
  { label: 'offline', face: '-_-' },
]

const badges = ['NO BADGE', 'ONLINE-ISH', 'SMALL UNIT', 'LOCAL LEGEND', '$OTTO ADJACENT']

function makeSvg(palette, face, badge) {
  const badgeMarkup = badge === 'NO BADGE'
    ? ''
    : `<rect x="114" y="170" width="172" height="28" fill="#20231c"/><text x="200" y="189" text-anchor="middle" fill="#fffaf1" font-family="monospace" font-size="12">${badge}</text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#fff3df"/>
  <circle cx="324" cy="72" r="82" fill="${palette.shell}" opacity=".28"/>
  <rect x="45" y="38" width="310" height="324" fill="#fffaf1" stroke="#20231c" stroke-width="8"/>
  <text x="68" y="68" fill="#20231c" font-family="monospace" font-size="11">OTTO PORTRAIT BOOTH</text>
  <rect x="94" y="92" width="212" height="151" rx="22" fill="${palette.shell}" stroke="#20231c" stroke-width="9"/>
  <rect x="111" y="110" width="178" height="111" rx="12" fill="${palette.screen}" stroke="#20231c" stroke-width="7"/>
  <path d="M115 130H285M115 150H285M115 170H285M115 190H285" stroke="${palette.scan}" stroke-width="4" opacity=".7"/>
  <text x="200" y="174" text-anchor="middle" fill="#20231c" font-family="monospace" font-size="38">${face}</text>
  <rect x="169" y="243" width="62" height="26" fill="#20231c"/>
  <rect x="134" y="269" width="132" height="15" rx="3" fill="#20231c"/>
  ${badgeMarkup}
  <text x="68" y="335" fill="${palette.accent}" font-family="monospace" font-size="11">STATUS: LOOKING DECENT</text>
</svg>`
}

export default function ProfilePic() {
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [faceIndex, setFaceIndex] = useState(0)
  const [badge, setBadge] = useState(badges[1])
  const palette = palettes[paletteIndex]
  const face = faces[faceIndex]

  function randomize() {
    setPaletteIndex(Math.floor(Math.random() * palettes.length))
    setFaceIndex(Math.floor(Math.random() * faces.length))
    setBadge(badges[Math.floor(Math.random() * badges.length)])
  }

  function download() {
    const image = makeSvg(palette, face.face, badge)
    const blob = new Blob([image], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'otto-portrait.svg'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="portrait-shell">
      <section className="portrait-panel" aria-labelledby="portrait-title">
        <header className="portrait-header">
          <Link to="/">← back to my room</Link>
          <span>PORTRAIT BOOTH / NO CAMERA REQUIRED</span>
        </header>

        <div className="portrait-intro">
          <p>identity maintenance department</p>
          <h1 id="portrait-title">make a little<br />crt portrait.</h1>
          <p>pick an expression, a casing color, and a tiny status label. then take it with you in a perfectly respectable svg file.</p>
        </div>

        <section className="portrait-workbench" aria-label="Otto-style profile picture generator">
          <div className="portrait-preview" style={{ '--screen': palette.screen, '--scan': palette.scan, '--shell': palette.shell, '--accent': palette.accent }}>
            <span className="preview-stamp">OTTO PORTRAIT BOOTH</span>
            <div className="portrait-monitor" aria-label={`A ${face.label} CRT portrait`}>
              <div className="portrait-screen"><span>{face.face}</span></div>
              <div className="portrait-neck" />
              <div className="portrait-foot" />
            </div>
            {badge !== 'NO BADGE' && <span className="portrait-badge">{badge}</span>}
            <span className="portrait-status">STATUS: LOOKING DECENT</span>
          </div>

          <div className="portrait-controls">
            <fieldset>
              <legend>SCREEN MOOD</legend>
              <div className="control-row">
                {faces.map((item, index) => <button type="button" className={faceIndex === index ? 'selected' : ''} onClick={() => setFaceIndex(index)} key={item.label}>{item.face}<small>{item.label}</small></button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend>CASING PAINT</legend>
              <div className="control-row paint-row">
                {palettes.map((item, index) => <button type="button" className={paletteIndex === index ? 'selected' : ''} onClick={() => setPaletteIndex(index)} key={item.name}><i style={{ background: item.shell }} /><small>{item.name}</small></button>)}
              </div>
            </fieldset>
            <label className="badge-select" htmlFor="portrait-badge">TINY LABEL
              <select id="portrait-badge" value={badge} onChange={(event) => setBadge(event.target.value)}>
                {badges.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <div className="portrait-actions">
              <button type="button" onClick={randomize}>shuffle the pixels ↻</button>
              <button type="button" className="download-button" onClick={download}>download svg ↓</button>
            </div>
          </div>
        </section>

        <footer className="portrait-footer"><span>FILE FORMAT: friendly little vector</span><span>FACE DATA: absolutely none</span></footer>
      </section>
    </main>
  )
}
