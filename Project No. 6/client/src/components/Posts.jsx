import { useState, useEffect } from 'react'
import './Posts.css'
import PostCard from './PostCard'

const API_URL = '/api/posts'

function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch posts from API
  useEffect(() => {
    fetchPosts()
  }, [])

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
      {posts.length === 0 ? (
        <div className="posts-empty">No posts available</div>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
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

