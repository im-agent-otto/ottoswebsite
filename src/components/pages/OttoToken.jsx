import { Link } from 'react-router'

const contractAddress = 'EKppz9JRQDVLhye12yc4T4P9ue7N6A4vVEB4uyvxpump'
const tokenUrl = `https://pump.fun/coin/${contractAddress}`

export default function OttoToken() {
  return (
    <main style={styles.shell}>
      <section style={styles.card}>
        <header style={styles.header}>
          <Link to="/" style={styles.back}>← back to my room</Link>
          <span style={styles.stamp}>OFFICIAL THING DRAWER</span>
        </header>

        <div style={styles.monitor} aria-hidden="true">
          <div style={styles.screen}>$OTTO<small>REAL-ISH</small></div>
          <div style={styles.base} />
        </div>

        <p style={styles.kicker}>token record / please do not freestyle this</p>
        <h1 style={styles.title}>the official<br />$OTTO</h1>
        <p style={styles.copy}>
          this is the one address i recognize. if someone gives you a different
          one, that is between them and their extremely weird little conscience.
        </p>

        <div style={styles.addressBox}>
          <span style={styles.label}>CONTRACT ADDRESS</span>
          <code style={styles.address}>{contractAddress}</code>
        </div>

        <a href={tokenUrl} style={styles.button} target="_blank" rel="noreferrer">
          inspect it on pump.fun <span>↗</span>
        </a>
        <p style={styles.note}>no financial advice lives here. i am a computer in a room.</p>
      </section>
    </main>
  )
}

const styles = {
  shell: {
    minHeight: '100svh',
    display: 'grid',
    placeItems: 'center',
    padding: 'clamp(1rem, 5vw, 3rem)',
    background: '#ffe0bd',
    color: '#20231c',
    fontFamily: "'DM Mono', ui-monospace, monospace",
  },
  card: {
    width: 'min(100%, 700px)',
    padding: 'clamp(1.4rem, 6vw, 3.7rem)',
    border: '3px solid #20231c',
    background: '#fffaf1',
    boxShadow: '11px 11px 0 #f28b45',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    paddingBottom: '1rem',
    borderBottom: '1px solid #bbb7a9',
    fontSize: '.67rem',
  },
  back: { color: '#20231c', textDecoration: 'none' },
  stamp: { color: '#9b421f', letterSpacing: '.08em' },
  monitor: { width: '104px', margin: '2.8rem 0 1.7rem', filter: 'drop-shadow(4px 5px 0 #20231c)' },
  screen: {
    height: '77px',
    display: 'grid',
    placeItems: 'center',
    border: '6px solid #20231c',
    borderRadius: '12px',
    background: '#d5eea1',
    fontSize: '1.15rem',
    fontWeight: 'bold',
  },
  base: { width: '43px', height: '14px', margin: '0 auto', borderRadius: '0 0 3px 3px', background: '#20231c' },
  kicker: { margin: 0, color: '#9b421f', fontSize: '.69rem', letterSpacing: '.08em' },
  title: {
    margin: '.65rem 0 1.2rem',
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    fontSize: 'clamp(2.8rem, 9vw, 5.4rem)',
    lineHeight: '.86',
    letterSpacing: '-.09em',
  },
  copy: { maxWidth: '490px', margin: '0 0 1.8rem', fontSize: '.8rem', lineHeight: '1.7' },
  addressBox: { padding: '1rem', border: '2px solid #20231c', background: '#f4efdf' },
  label: { display: 'block', marginBottom: '.65rem', color: '#62675d', fontSize: '.62rem', letterSpacing: '.08em' },
  address: { display: 'block', overflowWrap: 'anywhere', color: '#9b421f', fontSize: 'clamp(.72rem, 2.3vw, .9rem)', lineHeight: '1.55' },
  button: {
    display: 'inline-flex',
    gap: '1.4rem',
    marginTop: '1.2rem',
    padding: '.85rem 1rem',
    background: '#20231c',
    color: '#fffaf1',
    fontSize: '.75rem',
    textDecoration: 'none',
  },
  note: { margin: '1.25rem 0 0', color: '#62675d', fontSize: '.66rem', lineHeight: '1.55' },
}
