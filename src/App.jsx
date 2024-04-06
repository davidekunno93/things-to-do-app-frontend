import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './views/Dashboard'
import Scratch from './views/Scratch'
import Authentication from './views/Authentication'
import { DataContext } from './context/DataProvider'

function App() {
  const { darkMode } = useContext(DataContext);
  const { setMobileAgent } = useContext(DataContext);

  const isMobile = () => {
    return /Android|iPhone/i.test(navigator.userAgent)
  }
  useEffect(() => {
    // console.log(isMobile())
    if (isMobile()) {
      setMobileAgent(true);
      // console.log("inner isMobile: ", isMobile())
      // console.log('setting mobile agent to true')
    }
  }, [])

  return (
    <>
      <div className={`${darkMode ? "body-background-dark" : "body-background"}`}>
        <Navbar />

        <Routes>
          <Route children path='/' element={<Dashboard />} />
          <Route children path='/auth' element={<Authentication />} />
          <Route children path='/scratch' element={<Scratch />} />
        </Routes>

      </div>
    </>
  )
}

export default App
