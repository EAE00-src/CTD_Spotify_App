import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'


function App() {  

  return (
      <>
      <div className='h-screen w-screen border rounded-4xl flex'>
        <Sidebar />
        <Routes>
          <Route index element={<Home />} />
        </Routes>
      </div>
    </>
  )
}

export default App
