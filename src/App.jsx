import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './views/Dashboard'
import Scratch from './views/Scratch'
import Authentication from './views/Authentication'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Navbar />

      <Routes>
        <Route children path='/' element={<Dashboard />} />
        <Route children path='/auth' element={<Authentication />} />
        <Route children path='/scratch' element={<Scratch />} />
      </Routes>

    </>
  )
}

export default App
