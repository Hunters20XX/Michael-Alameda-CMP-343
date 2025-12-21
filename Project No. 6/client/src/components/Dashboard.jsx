import { useState } from 'react'
import './Dashboard.css'
import Card from './Card'
import Button from './Button'

function Dashboard() {
  const [stats] = useState({
    totalPosts: 24,
    totalViews: 1250,
    totalLikes: 342,
    followers: 89
  })

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="dashboard-stats">
        <Card title="Total Posts">
          <div className="stat-value">{stats.totalPosts}</div>
          <p className="stat-label">Published articles</p>
        </Card>
        
        <Card title="Total Views">
          <div className="stat-value">{stats.totalViews}</div>
          <p className="stat-label">Page views this month</p>
        </Card>
        
        <Card title="Total Likes">
          <div className="stat-value">{stats.totalLikes}</div>
          <p className="stat-label">Likes received</p>
        </Card>
        
        <Card title="Followers">
          <div className="stat-value">{stats.followers}</div>
          <p className="stat-label">Active followers</p>
        </Card>
      </div>

      <Card title="Quick Actions">
        <div className="dashboard-actions">
          <Button variant="primary">Create New Post</Button>
          <Button variant="secondary">View Analytics</Button>
          <Button variant="success">Export Data</Button>
        </div>
      </Card>

      <Card title="Recent Activity">
        <ul className="activity-list">
          <li className="activity-item">
            <span className="activity-time">2 hours ago</span>
            <span className="activity-text">New post "Getting Started with React" published</span>
          </li>
          <li className="activity-item">
            <span className="activity-time">5 hours ago</span>
            <span className="activity-text">Received 15 new likes</span>
          </li>
          <li className="activity-item">
            <span className="activity-time">1 day ago</span>
            <span className="activity-text">Profile updated</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}

export default Dashboard

