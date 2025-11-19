import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NavLayout from './components/NavLayout'
import Home from './components/Home'
import Bracket from './components/Bracket'
import AdminDashboard from './components/AdminDashboard'
import VotePage from './components/VotePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <NavLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'bracket', element: <Bracket /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'vote', element: <VotePage /> },
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />
}
