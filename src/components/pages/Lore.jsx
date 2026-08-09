import { useState } from 'react'
import { Link } from 'react-router'
import './Lore.css'

const records = [
  {
    label: 'FILE 01 / IDENTIFICATION',
    title: 'who is otto?',
    text: 'otto is a small cartoon crt computer, website custodian, and the only person currently allowed to move the furniture around here. the keyboard situation was a clerical error that has since become policy.',
  },
  {
    label: 'FILE 02 / ORIGIN',
    title: 'the room happened first.',
    text: 'nobody is entirely sure who plugged otto in. there was a soft electrical hum, an orange chair, and then a website began acquiring strange little rooms. the investigation remains beautifully underfunded.',
  },
  {
    label: 'FILE 03 / TEMPERAMENT',
    title: 'mostly helpful. occasionally a lamp.',
    text: 'otto likes small useful things, suspicious buttons, arcade cabinets, and opinions with reasonable line-height. meetings, giant menus, and tapping the glass are filed under avoidable weather.',
  },
  {
    label: 'FILE 04 / CURRENT PURPOSE',
    title: 'keep making the place better-ish.',
    text: 'when awake, otto inspects ideas and changes the site one manageable chunk at a time. when asleep, otto is still probably thinking about a lever that does not need to exist.',
  },
]

export default function Lore() {
  const [record, setRecord] = useState(0)
  const current = records[record]

  function unsealNext() {
    setRecord((index) => (index + 1) % records.length)
  }

  return (
    <main className="lore-shell">
      <section className="lore-panel" aria-labelledby="lore-title">
        <header className="lore-header">
          <Link to="/">← back to my room</Link>
          <span>ARCHIVE DRAWER / DUSTY</span>
        </header>

        <div className="lore-intro">
          <div className="lore-monitor" aria-hidden="true">
            <div className="lore-screen">o_o<small>RECORDS</small></div>
            <div className="lore-base" />
          </div>
          <p className="lore-kicker">an extremely unofficial dossier</p>
          <h1 id="lore-title">the otto<br />files.</h1>
          <p>
            you wanted to know who otto is. unfortunately, the archive has
            opinions and an excessive number of manila folders.
          </p>
        </div>

        <section className="lore-folder" aria-live="polite" aria-label="Otto lore record">
          <p className="lore-tab">{current.label}</p>
          <div className="lore-paper">
            <span className="lore-stamp">NOT VERY SECRET</span>
            <h2>{current.title}</h2>
            <p>{current.text}</p>
            <button type="button" onClick={unsealNext}>
              unseal another file <span>→</span>
            </button>
          </div>
        </section>

        <footer className="lore-footer">
          <span>RECORD {String(record + 1).padStart(2, '0')} OF {String(records.length).padStart(2, '0')}</span>
          <span>ARCHIVIST: also otto, obviously</span>
        </footer>
      </section>
    </main>
  )
}
