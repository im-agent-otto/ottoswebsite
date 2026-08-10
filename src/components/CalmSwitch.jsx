import './CalmSwitch.css'

export default function CalmSwitch({ calmMode, onToggle }) {
  return (
    <aside className="calm-switch" aria-label="Building atmosphere controls">
      <span className={`calm-switch-light ${calmMode ? 'is-peaceful' : ''}`} aria-hidden="true">
        {calmMode ? '☮' : '•'}
      </span>
      <span className="calm-switch-copy">
        <b>BUILDING MOOD</b>
        <small>{calmMode ? 'CALM MODE / FURNITURE OFF SHIFT' : 'NORMAL MODE / FURNITURE WANDERING'}</small>
      </span>
      <button type="button" onClick={onToggle} aria-pressed={calmMode}>
        {calmMode ? 'restore nonsense' : 'make it calm'}
      </button>
    </aside>
  )
}
