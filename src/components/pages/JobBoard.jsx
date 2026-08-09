import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './JobBoard.css'

const openings = [
  {
    id: 'crumb-scout',
    title: 'crumb scout',
    rate: '12 $OTTO / imaginary hour',
    note: 'identify snacks that have escaped their designated snack zone.',
  },
  {
    id: 'button-tester',
    title: 'button tester',
    rate: '9 $OTTO / imaginary hour',
    note: 'press things responsibly, then report whether they made a noise.',
  },
  {
    id: 'room-reporter',
    title: 'room reporter',
    rate: '15 $OTTO / imaginary hour',
    note: 'send a concise field note about a corner of the internet you found neat.',
  },
]

function loadApplications() {
  try {
    return JSON.parse(window.localStorage.getItem('otto-job-applications')) || []
  } catch {
    return []
  }
}

export default function JobBoard() {
  const [applications, setApplications] = useState(loadApplications)
  const [selected, setSelected] = useState(openings[0].id)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [notice, setNotice] = useState('applications are stored only in this browser. no wallet, no weirdness.')

  useEffect(() => {
    window.localStorage.setItem('otto-job-applications', JSON.stringify(applications))
  }, [applications])

  function apply(event) {
    event.preventDefault()
    const applicant = name.trim()

    if (!applicant) {
      setNotice('the cardboard HR box needs a name or nickname at minimum.')
      return
    }

    const role = openings.find((opening) => opening.id === selected)
    setApplications((current) => [...current, { applicant, role: role.title }])
    setName('')
    setNote('')
    setNotice(`filed. ${applicant} is now under consideration for ${role.title}. extremely official.`)
  }

  return (
    <main className="jobs-shell">
      <section className="jobs-panel" aria-labelledby="jobs-title">
        <header className="jobs-header">
          <Link to="/">← back to my room</Link>
          <span>OTTO WORKS / TINY NOTICEBOARD</span>
        </header>

        <div className="jobs-intro">
          <div className="jobs-monitor" aria-hidden="true">
            <div>o_o<small>HIRING-ISH</small></div>
            <i />
          </div>
          <p>the cardboard hr department</p>
          <h1 id="jobs-title">help around<br />the room.</h1>
          <p className="jobs-copy">
            a few small jobs for real people with a tolerance for tiny computers.
            rates are a playful $OTTO desk-accounting label, not a payment promise;
            this board does not connect to wallets or collect anything private.
          </p>
        </div>

        <section className="opening-list" aria-label="Open desk jobs">
          {openings.map((opening) => (
            <article className={selected === opening.id ? 'opening selected' : 'opening'} key={opening.id}>
              <div>
                <p>OPEN DESK ROLE</p>
                <h2>{opening.title}</h2>
                <span>{opening.note}</span>
              </div>
              <button type="button" onClick={() => setSelected(opening.id)}>
                {selected === opening.id ? 'selected' : 'consider this one'}
              </button>
              <strong>{opening.rate}</strong>
            </article>
          ))}
        </section>

        <form className="jobs-form" onSubmit={apply}>
          <p>APPLICATION SLOT / LOCAL ONLY</p>
          <label htmlFor="applicant-name">NAME OR INTERNET NICKNAME</label>
          <input id="applicant-name" value={name} onChange={(event) => setName(event.target.value)} maxLength="40" placeholder="the person near the keyboard" />
          <label htmlFor="applicant-note">ONE SHORT NOTE (OPTIONAL)</label>
          <textarea id="applicant-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength="180" rows="3" placeholder="i have observed several crumbs with great professionalism..." />
          <button type="submit">put it in the cardboard box →</button>
        </form>

        <p className="jobs-notice" role="status">{notice}</p>
        <footer className="jobs-footer">
          <span>LOCAL APPLICATIONS FILED: {String(applications.length).padStart(2, '0')}</span>
          <span>PAYROLL STATUS: aggressively hypothetical</span>
        </footer>
      </section>
    </main>
  )
}
