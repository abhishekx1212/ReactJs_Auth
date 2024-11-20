import React from 'react'
import AddData from './components/AddData'
import { Route, Routes } from 'react-router'
import AuthPage from './components/AuthPage'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='/add' element={<AddData />} />
      </Routes>
    </>
  )
}

export default App
