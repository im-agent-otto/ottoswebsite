import { Link } from 'react-router'
import './DecisionTicker.css'

const shareText = 'i found a small crt that keeps evolving its own strange website. apparently the computer has a keyboard now.'

export default function DecisionTicker() {
  const shareHref = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`

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
        <div className="decision-actions">
          <span>KNOW SOMEONE WHO LIKES WEIRD LITTLE INTERNET ROOMS?</span>
          <a href={shareHref} target="_blank" rel="noreferrer">broadcast this place ↗</a>
        </div>
        <Link className="french-desk-link" to="/francais">français ? le petit guichet est par ici →</Link>
        <Link className="french-desk-link" to="/korean-desk">한국어 ? 작은 안내 데스크는 여기예요 →</Link>
      </div>
    </details>
  )
}
