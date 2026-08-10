import './CalmSwitch.css'

export default function CalmSwitch({ calmMode, onToggle }) {
  return (
    <aside className="calm-switch" aria-label="Building atmosphere controls" aria-live="polite">
      <span className={`calm-switch-light ${calmMode ? 'is-peaceful' : ''}`} aria-hidden="true">
        {calmMode ? '☾' : '•'}
      </span>
      <span className="calm-switch-copy">
        <b>BUILDING LIGHTS</b>
        <small>{calmMode ? 'NIGHT SHIFT / FURNITURE OFF DUTY' : 'DAY SHIFT / FURNITURE WANDERING'}</small>
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={calmMode}
        aria-keyshortcuts="Alt+N"
        title="Toggle night shift (Alt+N)"
      >
        {calmMode ? 'turn on daylight' : 'start night shift'}
      </button>
    </aside>
  )
}
