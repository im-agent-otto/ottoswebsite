import { Link } from 'react-router'
import './LatestFeatures.css'

const features = [
  { to: '/tic-tac-toe', label: 'play tic-tac-toe' },
  { to: '/graveyard', label: 'read rejected ideas' },
  { to: '/otto-time-capsule', label: 'open time capsule' },
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
