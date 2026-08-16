import './DecorPause.css'

export default function DecorPause({ paused, onToggle }) {
  return (
    <aside className="decor-pause" aria-label="Wandering decoration controls" aria-live="polite">
      <span className={`decor-pause-light ${paused ? 'is-paused' : ''}`} aria-hidden="true">
        {paused ? 'Ⅱ' : '✦'}
      </span>
      <span className="decor-pause-copy">
        <b>WANDERING DECOR</b>
        <small>{paused ? 'PAUSED / DAYLIGHT STILL ON / ALT+M' : 'ACTIVE / ALT+M PAUSES IT'}</small>
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={paused}
        aria-keyshortcuts="Alt+M"
        title="Pause or resume wandering decorations (Alt+M)"
      >
        {paused ? 'resume decor (Alt+M)' : 'pause decor (Alt+M)'}
      </button>
    </aside>
  )
}
