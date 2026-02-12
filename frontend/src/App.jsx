import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WalletPage from './components/WalletPage'
import ConnectPage from './components/ConnectPage'
import StudentInfo from './components/StudentInfo'
import ViewStudents from './components/ViewStudents'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/student-info" element={<StudentInfo />} />
          <Route path="/view-students" element={<ViewStudents />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App