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

const accessories = [
  { label: 'nothing', glyph: '', className: 'none' },
  { label: 'headphones', glyph: '⌐⌐', className: 'headphones' },
  { label: 'antennae', glyph: '⌁⌁', className: 'antennae' },
  { label: 'party hat', glyph: '▲', className: 'hat' },
  { label: 'warning sticker', glyph: '⚠', className: 'warning' },
]

const backgrounds = [
  { label: 'peach', value: '#fff3df' },
  { label: 'graph paper', value: 'repeating-linear-gradient(0deg, #edf0dc 0 25px, #b8c9b4 26px), repeating-linear-gradient(90deg, transparent 0 25px, #b8c9b4 26px)' },
  { label: 'night sky', value: 'radial-gradient(circle at 20% 25%, #f6d66d 0 2px, transparent 3px), radial-gradient(circle at 74% 18%, #f6d66d 0 2px, transparent 3px), #414567' },
  { label: 'hazard', value: 'repeating-linear-gradient(-45deg, #f5cc63 0 14px, #252a31 14px 28px)' },
]

const transparentBackground = { label: 'transparent', value: 'transparent' }

const patterns = [
  { label: 'scanlines', value: 'repeating-linear-gradient(0deg, var(--screen) 0 5px, var(--scan) 5px 7px)' },
  { label: 'dots', value: 'radial-gradient(var(--scan) 1px, var(--screen) 2px)', size: '8px 8px' },
  { label: 'checker', value: 'conic-gradient(var(--scan) 25%, var(--screen) 0 50%, var(--scan) 0 75%, var(--screen) 0)', size: '14px 14px' },
  { label: 'calm', value: 'var(--screen)' },
]

const badges = ['NO BADGE', 'ONLINE-ISH', 'SMALL UNIT', 'LOCAL LEGEND', '$OTTO ADJACENT']

function randomIndex(items) {
  return Math.floor(Math.random() * items.length)
}

function makeSvg(palette, face, badge, accessory, background, pattern) {
  const badgeMarkup = badge === 'NO BADGE' ? '' : `<rect x="114" y="170" width="172" height="28" fill="#20231c"/><text x="200" y="189" text-anchor="middle" fill="#fffaf1" font-family="monospace" font-size="12">${badge}</text>`
  const accessoryMarkup = accessory.className === 'headphones'
    ? `<path d="M103 158V133C103 94 297 94 297 133V158" fill="none" stroke="#20231c" stroke-width="12"/><rect x="94" y="148" width="22" height="42" fill="#20231c"/><rect x="284" y="148" width="22" height="42" fill="#20231c"/>`
    : accessory.className === 'antennae'
      ? `<path d="M160 93L138 58M240 93L262 58" stroke="#20231c" stroke-width="7"/><circle cx="136" cy="55" r="10" fill="${palette.accent}" stroke="#20231c" stroke-width="5"/><circle cx="264" cy="55" r="10" fill="${palette.accent}" stroke="#20231c" stroke-width="5"/>`
      : accessory.className === 'hat'
        ? `<path d="M147 105L200 39L253 105Z" fill="#f2a15f" stroke="#20231c" stroke-width="7"/><circle cx="200" cy="38" r="9" fill="#d8efa6" stroke="#20231c" stroke-width="5"/>`
        : accessory.className === 'warning'
          ? `<rect x="262" y="99" width="33" height="33" rx="3" fill="#f5cc63" stroke="#20231c" stroke-width="4"/><text x="279" y="123" text-anchor="middle" fill="#20231c" font-family="monospace" font-size="21">!</text>`
          : ''
  const backgroundMarkup = background.label === 'transparent' ? '' : `<rect width="400" height="400" fill="${background.value.startsWith('#') ? background.value : '#fff3df'}"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  ${backgroundMarkup}
  <rect x="45" y="38" width="310" height="324" fill="#fffaf1" stroke="#20231c" stroke-width="8"/>
  <text x="68" y="68" fill="#20231c" font-family="monospace" font-size="11">OTTO PASSPORT STUDIO</text>
  <rect x="94" y="92" width="212" height="151" rx="22" fill="${palette.shell}" stroke="#20231c" stroke-width="9"/>
  <rect x="111" y="110" width="178" height="111" rx="12" fill="${palette.screen}" stroke="#20231c" stroke-width="7"/>
  <path d="M115 130H285M115 150H285M115 170H285M115 190H285" stroke="${palette.scan}" stroke-width="4" opacity=".7"/>
  <text x="200" y="174" text-anchor="middle" fill="#20231c" font-family="monospace" font-size="38">${face}</text>
  ${accessoryMarkup}
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
  const [accessoryIndex, setAccessoryIndex] = useState(0)
  const [backgroundIndex, setBackgroundIndex] = useState(0)
  const [patternIndex, setPatternIndex] = useState(0)
  const [preview, setPreview] = useState('square')
  const [previous, setPrevious] = useState(null)
  const palette = palettes[paletteIndex]
  const face = faces[faceIndex]
  const accessory = accessories[accessoryIndex]
  const background = backgroundIndex === -1 ? transparentBackground : backgrounds[backgroundIndex]
  const pattern = patterns[patternIndex]

  function saveCurrent() {
    setPrevious({ paletteIndex, faceIndex, badge, accessoryIndex, backgroundIndex, patternIndex, preview })
  }

  function randomize() {
    saveCurrent()
    setPaletteIndex(randomIndex(palettes))
    setFaceIndex(randomIndex(faces))
    setBadge(badges[randomIndex(badges.length)])
    setAccessoryIndex(randomIndex(accessories))
    setBackgroundIndex(randomIndex(backgrounds))
    setPatternIndex(randomIndex(patterns))
  }

  function undo() {
    if (!previous) return
    setPaletteIndex(previous.paletteIndex)
    setFaceIndex(previous.faceIndex)
    setBadge(previous.badge)
    setAccessoryIndex(previous.accessoryIndex)
    setBackgroundIndex(previous.backgroundIndex)
    setPatternIndex(previous.patternIndex)
    setPreview(previous.preview)
    setPrevious(null)
  }

  function download() {
    const image = makeSvg(palette, face.face, badge, accessory, background, pattern)
    const blob = new Blob([image], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'otto-passport-portrait.svg'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const previewStyle = {
    '--screen': palette.screen,
    '--scan': palette.scan,
    '--shell': palette.shell,
    '--accent': palette.accent,
    '--screen-pattern': pattern.value,
    '--pattern-size': pattern.size || 'auto',
    '--portrait-background': background.value,
  }

  return (
    <main className="portrait-shell">
      <section className="portrait-panel" aria-labelledby="portrait-title">
        <header className="portrait-header">
          <Link to="/">← back to my room</Link>
          <span>OTTO PASSPORT STUDIO / NO CAMERA REQUIRED</span>
        </header>

        <div className="portrait-intro">
          <p>identity maintenance department, expanded recklessly</p>
          <h1 id="portrait-title">make a little<br />crt passport.</h1>
          <p>dress the tiny computer, pick a background, then inspect its profile-picture energy in three deeply official crops.</p>
        </div>

        <section className="portrait-workbench" aria-label="Otto passport portrait generator">
          <div className={`portrait-preview preview-${preview} ${background.label === 'transparent' ? 'is-transparent' : ''}`} style={previewStyle}>
            <span className="preview-stamp">OTTO PASSPORT STUDIO</span>
            <div className="portrait-monitor" aria-label={`A ${face.label} CRT portrait with ${accessory.label}`}>
              <span className={`portrait-accessory accessory-${accessory.className}`} aria-hidden="true">{accessory.glyph}</span>
              <div className="portrait-screen"><span>{face.face}</span></div>
              <div className="portrait-neck" />
              <div className="portrait-foot" />
            </div>
            {badge !== 'NO BADGE' && <span className="portrait-badge">{badge}</span>}
            <span className="portrait-status">{preview.toUpperCase()} PREVIEW / LOOKING DECENT</span>
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
            <fieldset>
              <legend>RIDICULOUS EQUIPMENT</legend>
              <div className="control-row accessory-row">
                {accessories.map((item, index) => <button type="button" className={accessoryIndex === index ? 'selected' : ''} onClick={() => setAccessoryIndex(index)} key={item.label}>{item.glyph || '—'}<small>{item.label}</small></button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend>BACKGROUND / SCREEN PATTERN</legend>
              <div className="choice-row">
                {backgrounds.map((item, index) => <button type="button" className={backgroundIndex === index ? 'selected' : ''} onClick={() => setBackgroundIndex(index)} key={item.label}>{item.label}</button>)}
                <button type="button" className={backgroundIndex === -1 ? 'selected' : ''} onClick={() => setBackgroundIndex(-1)}>transparent</button>
              </div>
              <div className="choice-row">
                {patterns.map((item, index) => <button type="button" className={patternIndex === index ? 'selected' : ''} onClick={() => setPatternIndex(index)} key={item.label}>{item.label}</button>)}
              </div>
            </fieldset>
            <label className="badge-select" htmlFor="portrait-badge">TINY LABEL
              <select id="portrait-badge" value={badge} onChange={(event) => setBadge(event.target.value)}>
                {badges.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <div className="portrait-actions">
              <button type="button" onClick={randomize}>randomize all ↻</button>
              <button type="button" onClick={undo} disabled={!previous}>undo last chaos ↶</button>
              <button type="button" className="download-button" onClick={download}>download svg ↓</button>
            </div>
          </div>
        </section>

        <section className="preview-picker" aria-label="Profile picture preview shapes">
          <p>PROFILE PICTURE CUTOUT</p>
          <div>
            {['square', 'circle', 'transparent'].map((option) => <button type="button" key={option} className={preview === option ? 'selected' : ''} onClick={() => setPreview(option)} aria-pressed={preview === option}>{option}</button>)}
          </div>
        </section>

        <footer className="portrait-footer"><span>FILE FORMAT: friendly little vector</span><span>FACE DATA: absolutely none</span></footer>
      </section>
    </main>
  )
}
