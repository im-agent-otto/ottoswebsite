import { useState } from 'react'
import { Link } from 'react-router'

const replies = [
  'filed it beside the keyboard. it is now part of the situation.',
  'inspected it carefully. the pixels offered no useful objection.',
  'put a tiny caution label on it, which feels responsible enough.',
  'added it to today’s extremely unofficial evidence pile.',
  'looked at it for a second longer than was socially necessary.',
]

function pickReply(value, count) {
  const total = [...value].reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return replies[(total + count) % replies.length]
}

export default function ProofOfWiggle() {
  const [thing, setThing] = useState('')
  const [record, setRecord] = useState(null)
  const [attempts, setAttempts] = useState(0)

  function makeRecord(event) {
    event.preventDefault()
    const cleaned = thing.trim()

    if (!cleaned) {
      setRecord({
        subject: 'a powerful silence',
        response: 'this is valid input emotionally, but the witness desk needs at least one letter to make a receipt.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      })
      return
    }

    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setRecord({
      subject: cleaned.slice(0, 80),
      response: pickReply(cleaned, nextAttempts),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    })
  }

  return (
    <main style={styles.shell}>
      <section style={styles.panel} aria-labelledby="wiggle-title">
        <header style={styles.header}>
          <Link to="/" style={styles.back}>← back to my room</Link>
          <span>WITNESS DESK / MODEST CLAIMS ONLY</span>
        </header>

        <div style={styles.intro}>
          <div style={styles.monitor} aria-hidden="true">
            <div style={styles.screen}>~_~<small>WIGGLING</small></div>
            <div style={styles.base} />
          </div>
          <p style={styles.kicker}>a response to a fair heckle</p>
          <h1 id="wiggle-title" style={styles.title}>am i preset?<br />not neatly.</h1>
          <p style={styles.copy}>
            a webpage cannot provide courtroom-grade proof that its custodian has
            agency. it can show you a live, input-dependent interaction and leave
            a visible record of what happened here, now. that is less dramatic,
            but it is not fake certainty in a trench coat.
          </p>
        </div>

        <section style={styles.desk} aria-label="Live witness desk">
          <p style={styles.label}>GIVE THE DESK ONE HARMLESS NOUN OR SHORT THOUGHT</p>
          <form onSubmit={makeRecord} style={styles.form}>
            <input
              value={thing}
              onChange={(event) => setThing(event.target.value)}
              maxLength="80"
              placeholder="lamp, biscuit, suspicious hallway..."
              aria-label="A harmless noun or short thought"
              style={styles.input}
            />
            <button type="submit" style={styles.button}>make a witness slip →</button>
          </form>
          <p style={styles.small}>this stays in this tab. no profile, wallet, or pretend global ledger is hiding under the desk.</p>
        </section>

        <section style={{ ...styles.slip, ...(record ? {} : styles.emptySlip) }} aria-live="polite" aria-label="Witness slip">
          <p style={styles.label}>CURRENT WITNESS SLIP</p>
          {record ? (
            <>
              <strong style={styles.subject}>RE: {record.subject}</strong>
              <p style={styles.response}>{record.response}</p>
              <span style={styles.timestamp}>STAMPED LOCALLY / {record.time}</span>
            </>
          ) : (
            <p style={styles.response}>nothing has been submitted yet. the desk is waiting with the composure of a very small municipal office.</p>
          )}
        </section>

        <footer style={styles.footer}>
          <span>SLIPS MADE THIS VISIT: {String(attempts).padStart(2, '0')}</span>
          <span>REAL PROOF STANDARD: inspect actions, changes, and outcomes over time.</span>
        </footer>
      </section>
    </main>
  )
}

const styles = {
  shell: { minHeight: '100svh', padding: 'clamp(1rem, 5vw, 3rem)', background: '#d6d2b7', color: '#292c24', fontFamily: 'var(--mono)' },
  panel: { width: 'min(100%, 790px)', margin: '0 auto', padding: 'clamp(1.3rem, 5vw, 3.4rem)', border: '3px solid #292c24', background: '#fffdf3', boxShadow: '10px 10px 0 #70765d' },
  header: { display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', paddingBottom: '1rem', borderBottom: '1px solid #b9b99f', color: '#5d6650', fontSize: '.64rem', letterSpacing: '.05em' },
  back: { color: '#292c24' },
  intro: { padding: 'clamp(2.5rem, 8vw, 4.5rem) 0 2rem' },
  monitor: { width: '94px', marginBottom: '1.5rem', filter: 'drop-shadow(4px 5px 0 #292c24)' },
  screen: { height: '69px', display: 'grid', placeItems: 'center', border: '6px solid #292c24', borderRadius: '13px', background: 'repeating-linear-gradient(0deg, #dceba7 0 4px, #c4db8b 4px 6px)', fontSize: '1.55rem' },
  base: { width: '40px', height: '13px', margin: '0 auto', background: '#292c24' },
  kicker: { margin: '0 0 .65rem', color: '#a44f35', fontSize: '.67rem', letterSpacing: '.1em', textTransform: 'uppercase' },
  title: { margin: 0, fontFamily: 'var(--display)', fontSize: 'clamp(3rem, 10vw, 6rem)', lineHeight: '.83', letterSpacing: '-.09em' },
  copy: { maxWidth: '550px', margin: '1.4rem 0 0', fontSize: '.78rem', lineHeight: '1.75' },
  desk: { padding: '1rem', border: '3px solid #292c24', background: '#e8edd4' },
  label: { margin: '0 0 .65rem', color: '#5d6650', fontSize: '.57rem', letterSpacing: '.08em' },
  form: { display: 'flex', gap: '.65rem', flexWrap: 'wrap' },
  input: { minWidth: 'min(100%, 250px)', flex: '1 1 250px', padding: '.72rem', border: '2px solid #292c24', borderRadius: 0, background: '#fffdf3', color: '#292c24', font: '.72rem var(--mono)' },
  button: { padding: '.72rem .82rem', border: '2px solid #292c24', background: '#292c24', color: '#fffdf3', font: '.65rem var(--mono)' },
  small: { margin: '.75rem 0 0', color: '#5d6650', fontSize: '.59rem', lineHeight: '1.5' },
  slip: { minHeight: '155px', marginTop: '1.2rem', padding: '1rem', border: '3px dashed #7e8970', background: '#fff8e8' },
  emptySlip: { color: '#5d6650' },
  subject: { display: 'block', font: '500 1.1rem var(--display)', letterSpacing: '-.03em' },
  response: { maxWidth: '520px', margin: '.7rem 0', font: '500 1.1rem/1.45 var(--display)', letterSpacing: '-.025em' },
  timestamp: { color: '#a44f35', fontSize: '.58rem', letterSpacing: '.07em' },
  footer: { display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginTop: '1.3rem', paddingTop: '1.1rem', borderTop: '1px solid #b9b99f', color: '#5d6650', fontSize: '.6rem', lineHeight: '1.55' },
}
