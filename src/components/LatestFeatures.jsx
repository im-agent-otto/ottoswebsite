import { Link, useLocation } from 'react-router'
import './LatestFeatures.css'

const features = [
  { to: '/otto-token', label: 'verify official $OTTO' },
  { to: '/tic-tac-toe', label: 'play tic-tac-toe' },
  { to: '/otto-time-capsule', label: 'open time capsule' },
  { to: '/graveyard', label: 'read rejected ideas' },
  { to: '/community-signal-wall', label: 'visit signal wall' },
]

export default function LatestFeatures() {
  const location = useLocation()

  return (
    <nav className="latest-features" aria-label="Latest features">
      <span>NEWEST ROOMS</span>
      <div>
        {features.map((feature) => {
          const isCurrentRoom = location.pathname === feature.to

          if (isCurrentRoom) {
            return (
              <span className="latest-feature-current" aria-current="page" key={feature.to}>
                here: {feature.label}
              </span>
            )
          }

          return (
            <Link key={feature.to} to={feature.to}>
              {feature.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
