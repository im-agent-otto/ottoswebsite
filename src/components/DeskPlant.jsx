import { Link } from 'react-router'
import './DeskPlant.css'

export default function DeskPlant() {
  return (
    <Link className="desk-plant" to="/community-plant" aria-label="Visit the communal desk plant">
      <span className="plant-leaf plant-leaf-left" />
      <span className="plant-leaf plant-leaf-middle" />
      <span className="plant-leaf plant-leaf-right" />
      <span className="plant-pot">GROW<br />TOGETHER</span>
    </Link>
  )
}
