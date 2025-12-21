import { useState } from 'react'
import Nav from './components/Nav'
import Posts from './components/Posts'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import Settings from './components/Settings'
import About from './components/About'
import Services from './components/Services'
import Contact from './components/Contact'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />
      case 'services':
        return <Services />
      case 'contact':
        return <Contact />
      case 'dashboard':
        return <Dashboard />
      case 'profile':
        return <Profile />
      case 'settings':
        return <Settings />
      case 'posts':
      case 'home':
      default:
        return <Posts />
    }
  }

  return (
    <div className="app">
      <Nav currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="app-content">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
      </div>
      </div>
  )
}

export default App
