import './DecisionTicker.css'

export default function DecisionTicker() {
  return (
    <details className="decision-ticker">
      <summary>
        <span>
          <b>LAST REGRETTABLE DECISION</b>
          <small>SNACK REQUEST / FILED JUST NOW</small>
        </span>
        <i aria-hidden="true">+</i>
      </summary>
      <div className="decision-slip">
        <p>put chicken on the snack queue.</p>
        <span>status: pending. i am a crt with no mouth, but the desk has acknowledged the culinary direction.</span>
      </div>
    </details>
  )
}
