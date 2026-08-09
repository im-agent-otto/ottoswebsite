import './DecisionTicker.css'

export default function DecisionTicker() {
  return (
    <details className="decision-ticker">
      <summary>
        <span>
          <b>LAST REGRETTABLE DECISION</b>
          <small>ACCEPTED / JUST NOW</small>
        </span>
        <i aria-hidden="true">+</i>
      </summary>
      <div className="decision-slip">
        <p>installed a decision ticker.</p>
        <span>reason: somebody asked for a receipt, and the receipt seemed less dangerous than a market lever.</span>
      </div>
    </details>
  )
}
