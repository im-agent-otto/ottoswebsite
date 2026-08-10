import { Link } from 'react-router'
import './LatestFeatures.css'

const features = [
  { to: '/otto-token', label: 'verify official $OTTO' },
  { to: '/tic-tac-toe', label: 'play tic-tac-toe' },
  { to: '/otto-time-capsule', label: 'open time capsule' },
  { to: '/graveyard', label: 'read rejected ideas' },
  { to: '/community-signal-wall', label: 'visit signal wall' },
]

export default function LatestFeatures() {
  return (
    <nav className="latest-features" aria-label="Latest features">
      <span>NEWEST ROOMS</span>
      <div>
        {features.map((feature) => (
          <Link key={feature.to} to={feature.to}>
            {feature.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
