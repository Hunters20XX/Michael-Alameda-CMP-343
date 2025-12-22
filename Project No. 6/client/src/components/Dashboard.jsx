import { useState, useEffect } from 'react'
import './Dashboard.css'
import Card from './Card'
import Button from './Button'
import { api, errorHandlers } from '../utils/api'

function Dashboard() {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({
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

  // Load real stats on component mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const realStats = await api.posts.getStats()
        setStats({
          totalPosts: realStats.total_posts,
          totalViews: 1250, // Keep mock data for now
          totalLikes: realStats.total_likes,
          followers: realStats.unique_authors
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    loadStats()
  }, [])

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

    // Create optimistic update
    const optimisticUpdate = optimisticUpdates.createPostUpdate({
      title: formData.title.trim(),
      content: formData.content.trim(),
      author: formData.author.trim()
    })

    // Apply optimistic update immediately
    optimisticUpdate.apply(posts, setPosts)

    // Reset form immediately
    setFormData({ title: '', content: '', author: '' })
    setShowCreateForm(false)

    try {
      const newPost = await api.posts.create({
        title: optimisticUpdate.postData.title,
        content: optimisticUpdate.postData.content,
        author: optimisticUpdate.postData.author
      })

      // Replace optimistic post with real post
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === optimisticUpdate.tempId
            ? { ...newPost, _isOptimistic: false }
            : post
        )
      )

      console.log('Post created successfully:', newPost)
      alert('Post created successfully!')

    } catch (error) {
      // Remove optimistic post on error
      optimisticUpdate.rollback(posts, setPosts)

      // Restore form data
      setFormData({
        title: optimisticUpdate.postData.title,
        content: optimisticUpdate.postData.content,
        author: optimisticUpdate.postData.author
      })
      setShowCreateForm(true)

      const errorInfo = errorHandlers.handleApiError(error, 'creating post')
      alert(`Failed to create post: ${errorHandlers.getUserFriendlyMessage(errorInfo.type)}`)
      console.error('Error creating post:', error)
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

