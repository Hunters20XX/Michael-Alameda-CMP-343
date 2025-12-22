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

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      alert('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const newPost = await response.json()
      console.log('Post created successfully:', newPost)

      // Reset form
      setFormData({ title: '', content: '', author: '' })
      setShowCreateForm(false)

      // Show success message
      alert('Post created successfully!')

    } catch (error) {
      console.error('Error creating post:', error)
      alert(`Failed to create post: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New Post'}
          </Button>
          <Button variant="secondary">View Analytics</Button>
          <Button variant="success">Export Data</Button>
        </div>

        {showCreateForm && (
          <div className="create-post-form">
            <h3>Create New Post</h3>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter post title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter author name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="8"
                  placeholder="Write your post content here..."
                />
              </div>

              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
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

