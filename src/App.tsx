import { Navigate, Outlet, Route, Routes } from 'react-router'
//Pages
import Library from './pages/Library'
//import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import Callback from './components/Callback'
import NotFound from './pages/404'
import { RequireAuthParams } from './components/guards/RequireAuthParams'

const AuthenticatedLayout = () => {
  const token = sessionStorage.getItem('spotify_access_token')
  //if someone attemps to type /home or /feed directly w/o logging in, kick them back to Login
  if(!token){
    return <Navigate to='/' replace />
  }
  return (
    <div className='h-screen w-full border rounded-4xl flex overflow-hidden'>
      <Sidebar /> {/**Renders only for logged in users */}
      <main className='h-full w-full rounded-4xl flex overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  )
}

function App() {  

  return (
      <>
        <Routes>
          {/**Public Routes*/}
          <Route path='/' element={<Login />} />
          {/**Spotify Auth Callback Page (Guarded against manual entry)*/}
          <Route
           path='/callback'
           element={
            <RequireAuthParams>
              <Callback />
            </RequireAuthParams>
           }
          />
          {/**Protected App Pages that require the token sent from Spotify's API */}
          <Route element={<AuthenticatedLayout />}>
            <Route path='/library' element={<Library />} />

          </Route>
          {/**404 Error Fallback */}
          <Route path='*' element={<NotFound />} />
        </Routes>
    </>
  )
}

export default App
