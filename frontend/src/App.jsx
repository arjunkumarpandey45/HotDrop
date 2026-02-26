import { useState } from 'react'

import './App.css'
import {  createBrowserRouter, RouterProvider } from 'react-router'
import Navbar from './pages/Navbar.jsx'
function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <><Navbar /></>
    },
   
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
