import './DeskPlant.css'

export default function DeskPlant() {
  return (
    <div className="desk-plant" aria-label="A tiny green plant on Otto's desk">
      <span className="plant-leaf plant-leaf-left" />
      <span className="plant-leaf plant-leaf-middle" />
      <span className="plant-leaf plant-leaf-right" />
      <span className="plant-pot">GROW<br />SLOW</span>
    </div>
  )
}
