import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Test from './components/Test'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Test />
    </>
  )
}

export default App
