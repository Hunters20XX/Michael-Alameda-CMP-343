import { useState, useEffect } from 'react'
import './Posts.css'
import PostCard from './PostCard'
import { api, optimisticUpdates, errorHandlers } from '../utils/api'

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
      const data = await api.posts.getAll()
      setPosts(data)
      setFilteredPosts(data)
    } catch (err) {
      const errorInfo = errorHandlers.handleApiError(err, 'fetching posts')
      setError(errorHandlers.getUserFriendlyMessage(errorInfo.type))
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    // Find the current post to get its current likes count
    const currentPost = posts.find(post => post.id === postId)
    if (!currentPost) return

    // Create optimistic update
    const optimisticUpdate = optimisticUpdates.createLikeUpdate(postId, currentPost.likes)

    // Apply optimistic update immediately
    optimisticUpdate.apply(posts, setPosts)

    try {
      const updatedPost = await api.posts.like(postId)

      // Update with real data from server
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? updatedPost : post
        )
      )
    } catch (err) {
      // Revert optimistic update on error
      optimisticUpdate.rollback(posts, setPosts)

      const errorInfo = errorHandlers.handleApiError(err, 'liking post')
      alert(`Failed to like post: ${errorHandlers.getUserFriendlyMessage(errorInfo.type)}`)
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

