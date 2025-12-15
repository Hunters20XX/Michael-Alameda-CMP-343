import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Full Stack Application</h1>
        <p className="hero-subtitle">
          A modern full-stack application built with React and Node.js
        </p>
        <div className="hero-actions">
          <Link to="/items" className="btn btn-primary">
            View Items
          </Link>
          <Link to="/items/new" className="btn btn-secondary">
            Add New Item
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>Responsive Design</h3>
          <p>Works seamlessly on all devices and screen sizes</p>
        </div>
        <div className="feature-card">
          <h3>Dynamic Routing</h3>
          <p>Navigate between pages with React Router</p>
        </div>
        <div className="feature-card">
          <h3>Interactive Forms</h3>
          <p>Submit and manage data with intuitive forms</p>
        </div>
      </div>
    </div>
  )
}

export default Home

