import { useState, useEffect } from 'react'
import './Posts.css'
import PostCard from './PostCard'

const API_URL = '/api/posts'

function Posts() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch posts from API
  useEffect(() => {
    fetchPosts()
  }, [])

  // Filter posts based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts)
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPosts(filtered)
    }
  }, [posts, searchTerm])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      
      const data = await response.json()
      setPosts(data)
      setFilteredPosts(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/${postId}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to update likes')
      }
      
      const updatedPost = await response.json()
      
      // Update the post in the local state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? updatedPost : post
        )
      )
    } catch (err) {
      console.error('Error updating likes:', err)
    }
  }

  if (loading) {
    return (
      <section className="posts">
        <h2 className="posts-title">Latest Posts</h2>
        <div className="posts-loading">Loading posts...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="posts">
        <h2 className="posts-title">Latest Posts</h2>
        <div className="posts-error">
          <p>Error: {error}</p>
          <button onClick={fetchPosts}>Retry</button>
        </div>
      </section>
    )
  }

  return (
    <section className="posts">
      <h2 className="posts-title">Latest Posts</h2>

      <div className="posts-search">
        <input
          type="text"
          placeholder="Search posts by title, content, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredPosts.length === 0 && posts.length > 0 ? (
        <div className="posts-no-results">
          <p>No posts match your search: "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className="clear-search-btn">
            Clear search
          </button>
        </div>
      ) : (
        <div className="posts-list">
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              title={post.title}
              content={post.content}
              author={post.author}
              date={post.date}
              likes={post.likes || 0}
              onLike={() => handleLike(post.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Posts

