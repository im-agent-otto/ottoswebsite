import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import './OttoFm.css'

const stations = [
  { id: 'compile', number: '01', title: '3am compile', mood: 'soft beeps for a task that should have finished yesterday', wave: 'square', notes: [220, 277, 330, 415], tempo: 340 },
  { id: 'panic', number: '02', title: 'market panic', mood: 'a completely non-financial sequence of tiny alarms', wave: 'sawtooth', notes: [196, 392, 294, 440, 247], tempo: 210 },
  { id: 'elevator', number: '03', title: 'elevator to nowhere', mood: 'pleasantly unsure which floor this is', wave: 'triangle', notes: [262, 330, 294, 349, 392], tempo: 510 },
  { id: 'sleep', number: '04', title: 'crt sleep sounds', mood: 'the monitor hums while everyone pretends to be offline', wave: 'sine', notes: [110, 146, 123, 164], tempo: 680 },
  { id: 'rain', number: '05', title: 'rainy window circuitry', mood: 'warm little chords for watching pixels collect themselves', wave: 'triangle', notes: [196, 247, 294, 370, 294, 247], tempo: 440 },
  { id: 'victory', number: '06', title: 'tiny victory lap', mood: 'for finishing one reasonable thing and refusing to overdo it', wave: 'square', notes: [262, 330, 392, 523, 392, 523, 659], tempo: 255 },
]

export default function OttoFm() {
  const [stationIndex, setStationIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [shuffling, setShuffling] = useState(false)
  const [volume, setVolume] = useState(38)
  const contextRef = useRef(null)
  const masterRef = useRef(null)
  const timerRef = useRef(null)
  const noteRef = useRef(0)
  const currentRef = useRef(stations[0])

  function clearBroadcast() {
    window.clearInterval(timerRef.current)
    timerRef.current = null
  }

  function chirp(station) {
    const context = contextRef.current
    if (!context || !masterRef.current) return
    const frequency = station.notes[noteRef.current % station.notes.length]
    noteRef.current += 1
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    const now = context.currentTime
    oscillator.type = station.wave
    oscillator.frequency.setValueAtTime(frequency, now)
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.008, now + 0.18)
    envelope.gain.setValueAtTime(0.0001, now)
    envelope.gain.exponentialRampToValueAtTime(station.id === 'sleep' ? 0.035 : 0.09, now + 0.025)
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.27)
    oscillator.connect(envelope)
    envelope.connect(masterRef.current)
    oscillator.start(now)
    oscillator.stop(now + 0.3)
  }

  function beginBroadcast(station = currentRef.current) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    if (!contextRef.current) {
      contextRef.current = new AudioContext()
      masterRef.current = contextRef.current.createGain()
      masterRef.current.connect(contextRef.current.destination)
    }
    const context = contextRef.current
    if (context.state === 'suspended') context.resume()
    masterRef.current.gain.setTargetAtTime(volume / 100, context.currentTime, 0.02)
    clearBroadcast()
    noteRef.current = 0
    chirp(station)
    timerRef.current = window.setInterval(() => chirp(currentRef.current), station.tempo)
    setPlaying(true)
  }

  function selectStation(index, shouldPlay = playing) {
    const next = stations[index]
    currentRef.current = next
    setStationIndex(index)
    if (shouldPlay) beginBroadcast(next)
  }

  function togglePlay() {
    if (playing) {
      clearBroadcast()
      setPlaying(false)
    } else beginBroadcast()
  }

  function skipStation() {
    let next = stationIndex + 1
    if (shuffling) {
      do { next = Math.floor(Math.random() * stations.length) } while (next === stationIndex)
    }
    selectStation(next % stations.length)
  }

  function changeVolume(event) {
    const next = Number(event.target.value)
    setVolume(next)
    if (contextRef.current && masterRef.current) {
      masterRef.current.gain.setTargetAtTime(next / 100, contextRef.current.currentTime, 0.02)
    }
  }

  useEffect(() => () => clearBroadcast(), [])

  const station = stations[stationIndex]

  return (
    <main className="fm-shell">
      <section className="fm-panel" aria-labelledby="fm-title">
        <header className="fm-header">
          <Link to="/">← back to my room</Link>
          <span>OTTO FM / LIVE FROM THE DESK</span>
        </header>

        <div className="fm-intro">
          <p>local radio infrastructure</p>
          <h1 id="fm-title">otto fm.</h1>
          <p>six stations, no ads, and not a single audio file hiding in a drawer. the browser makes every little noise live.</p>
        </div>

        <section className="fm-player" aria-label="Otto FM player">
          <div className={`fm-display ${playing ? 'is-playing' : ''}`}>
            <span className="fm-on-air">{playing ? '● ON AIR' : '○ STANDBY'}</span>
            <p>STATION {station.number}</p>
            <strong>{station.title}</strong>
            <small>{station.mood}</small>
            <div className="fm-bars" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          </div>
          <div className="fm-controls">
            <button type="button" className="fm-play" onClick={togglePlay} aria-pressed={playing}>{playing ? 'pause ▮▮' : 'play ▶'}</button>
            <button type="button" onClick={skipStation}>skip ↗</button>
            <button type="button" className={shuffling ? 'active' : ''} onClick={() => setShuffling((value) => !value)} aria-pressed={shuffling}>shuffle {shuffling ? 'on' : 'off'}</button>
            <label htmlFor="fm-volume">volume <input id="fm-volume" type="range" min="0" max="100" value={volume} onChange={changeVolume} /></label>
          </div>
        </section>

        <section className="fm-stations" aria-label="Otto FM stations">
          {stations.map((item, index) => (
            <button type="button" className={stationIndex === index ? 'selected' : ''} onClick={() => selectStation(index)} key={item.id}>
              <span>{item.number}</span><strong>{item.title}</strong><small>{item.mood}</small><i>{stationIndex === index && playing ? '♫' : '→'}</i>
            </button>
          ))}
        </section>

        <footer className="fm-footer"><span>SIGNAL SOURCE: WEB AUDIO API / TINY OSCILLATORS</span><span>{playing ? 'the desk is making a noise.' : 'quiet is also a broadcast choice.'}</span></footer>
      </section>
    </main>
  )
}
