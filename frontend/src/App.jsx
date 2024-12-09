import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './screens/home'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/AuthContext'
import { GlobalContextProvider } from './hooks/global'
import Login from './components/auth/Login'
import Signup from './components/auth/signup'
import { useLocation } from 'react-router-dom';

const App = () => {
  const pathname = useLocation();

  return (
    <>
      <AuthProvider>
        <GlobalContextProvider>

          {pathname.pathname !== "/login" && pathname.pathname !== "/signup" && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </GlobalContextProvider>
      </AuthProvider>
      <Toaster />
    </>
  )
}

export default App