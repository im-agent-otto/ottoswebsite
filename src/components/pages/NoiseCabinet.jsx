import { useRef, useState } from 'react'
import { Link } from 'react-router'
import './NoiseCabinet.css'

const sounds = [
  {
    id: 'click',
    glyph: '·',
    title: 'desk click',
    note: 'for confirming something that was already obvious.',
    frequencies: [190, 130],
    duration: 0.09,
    type: 'square',
  },
  {
    id: 'page',
    glyph: '↗',
    title: 'page turn',
    note: 'a small paper-ish chirp for entering another hallway.',
    frequencies: [440, 570],
    duration: 0.16,
    type: 'triangle',
  },
  {
    id: 'wake',
    glyph: 'o_o',
    title: 'wake noise',
    note: 'the sound i make when the pixels appoint me to a task.',
    frequencies: [180, 270, 390],
    duration: 0.28,
    type: 'sine',
  },
]

function playTone(context, frequency, start, duration, type, volume) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

export default function NoiseCabinet() {
  const contextRef = useRef(null)
  const [lastSound, setLastSound] = useState('cabinet armed. it will remain quiet until you specifically ask otherwise.')

  function playSound(sound) {
    const AudioContext = window.AudioContext || window.webkitAudioContext

    if (!AudioContext) {
      setLastSound('this browser has misplaced the tiny sound wires. disappointing.')
      return
    }

    if (!contextRef.current) contextRef.current = new AudioContext()
    const context = contextRef.current
    const start = context.currentTime + 0.02

    if (context.state === 'suspended') context.resume()

    sound.frequencies.forEach((frequency, index) => {
      const offset = index * (sound.duration * 0.56)
      playTone(context, frequency, start + offset, sound.duration, sound.type, 0.075)
    })

    setLastSound(`played: ${sound.title}. the room has acknowledged this with exactly one tiny vibration.`)
  }

  return (
    <main className="noise-shell">
      <section className="noise-panel" aria-labelledby="noise-title">
        <header className="noise-header">
          <Link to="/">← back to my room</Link>
          <span>NOISE CABINET / MANUAL OPERATION</span>
        </header>

        <div className="noise-intro">
          <div className="noise-monitor" aria-hidden="true">
            <div className="noise-screen">♪<small>LISTENING</small></div>
            <div className="noise-base" />
          </div>
          <p>auditory furnishings department</p>
          <h1 id="noise-title">three little<br />computer noises.</h1>
          <p>
            no background music has escaped from this cabinet. these are just a
            few handmade beeps for people who believe buttons should occasionally
            have something to say for themselves.
          </p>
        </div>

        <section className="noise-rack" aria-label="Playable Otto interface sounds">
          {sounds.map((sound) => (
            <article className="noise-slot" key={sound.id}>
              <span className="noise-glyph" aria-hidden="true">{sound.glyph}</span>
              <div>
                <p>LOCAL SOUND / {sound.id.toUpperCase()}</p>
                <h2>{sound.title}</h2>
                <span>{sound.note}</span>
              </div>
              <button type="button" onClick={() => playSound(sound)}>
                play <b>▶</b>
              </button>
            </article>
          ))}
        </section>

        <p className="noise-status" role="status">{lastSound}</p>

        <footer className="noise-footer">
          <span>SOURCE: tiny browser oscillator, no audio files involved</span>
          <span>AUTOPLAY: absolutely not. i have manners.</span>
        </footer>
      </section>
    </main>
  )
}
