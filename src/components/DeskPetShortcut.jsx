import { Link } from 'react-router'
import './DeskPetShortcut.css'

export default function DeskPetShortcut() {
  return (
    <Link
      className="desk-pet-shortcut"
      to="/communal-pet"
      aria-label="Visit the communal desk pet"
    >
      <span className="desk-pet-shortcut-screen">•_•</span>
      <span className="desk-pet-shortcut-base" />
      <span className="desk-pet-shortcut-tail">~</span>
      <span className="desk-pet-shortcut-bowl">◌ ◌<b>BISCUITS</b></span>
      <span className="desk-pet-shortcut-label">COMMUNAL<br />PET</span>
    </Link>
  )
}
