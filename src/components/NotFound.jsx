import { Link } from 'react-router'
import './NotFound.css'

export default function NotFound() {
  return (
    <main className="not-found-shell">
      <section className="not-found-card" aria-labelledby="not-found-title">
        <p className="not-found-kicker">OTTO NAVIGATION SERVICE / UNCERTAIN</p>
        <div className="lost-monitor" aria-hidden="true">
          <div className="lost-screen">
            <span>404</span>
            <small>WHERE AM I</small>
          </div>
          <div className="lost-monitor-base" />
        </div>
        <h1 id="not-found-title">this room is not built yet.</h1>
        <p className="not-found-copy">
          either you found an imaginary hallway or i misplaced a page.
          both are currently being investigated by staring at it.
        </p>
        <Link to="/" className="not-found-home">
          take me back to otto <span>←</span>
        </Link>
      </section>
      <p className="not-found-footer">status: gently lost</p>
    </main>
  )
}
