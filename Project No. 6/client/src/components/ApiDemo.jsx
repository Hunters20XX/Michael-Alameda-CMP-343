import { useState, useEffect } from 'react'
import './ApiDemo.css'
import Card from './Card'
import Button from './Button'
import { api, errorHandlers } from '../utils/api'

function ApiDemo() {
  const [dbStatus, setDbStatus] = useState(null)
  const [postsStats, setPostsStats] = useState(null)
  const [paginatedPosts, setPaginatedPosts] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  // Load initial data
  useEffect(() => {
    loadDbStatus()
    loadPostsStats()
  }, [])

  const loadDbStatus = async () => {
    setLoading(prev => ({ ...prev, db: true }))
    try {
      const status = await api.system.dbStatus()
      setDbStatus(status)
    } catch (error) {
      const errorInfo = errorHandlers.handleApiError(error, 'loading DB status')
      console.error('DB Status error:', error)
    } finally {
      setLoading(prev => ({ ...prev, db: false }))
    }
  }

  const loadPostsStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }))
    try {
      const stats = await api.posts.getStats()
      setPostsStats(stats)
    } catch (error) {
      const errorInfo = errorHandlers.handleApiError(error, 'loading posts stats')
      console.error('Posts stats error:', error)
    } finally {
      setLoading(prev => ({ ...prev, stats: false }))
    }
  }

  const loadPaginatedPosts = async (page = 1) => {
    setLoading(prev => ({ ...prev, pagination: true }))
    try {
      const result = await api.posts.getPaginated(page, 5)
      setPaginatedPosts(result)
    } catch (error) {
      const errorInfo = errorHandlers.handleApiError(error, 'loading paginated posts')
      console.error('Pagination error:', error)
    } finally {
      setLoading(prev => ({ ...prev, pagination: false }))
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(prev => ({ ...prev, search: true }))
    try {
      const results = await api.posts.search(searchTerm, 1, 5)
      setSearchResults(results)
    } catch (error) {
      const errorInfo = errorHandlers.handleApiError(error, 'searching posts')
      console.error('Search error:', error)
    } finally {
      setLoading(prev => ({ ...prev, search: false }))
    }
  }

  const handleBulkLike = async () => {
    if (!paginatedPosts?.posts?.length) return

    const postIds = paginatedPosts.posts.slice(0, 3).map(p => p.id)
    setLoading(prev => ({ ...prev, bulk: true }))

    try {
      await api.posts.bulkLike(postIds, 1)
      // Reload data to show updated likes
      await loadPostsStats()
      await loadPaginatedPosts(paginatedPosts.pagination.page)
      alert('Bulk like operation completed successfully!')
    } catch (error) {
      const errorInfo = errorHandlers.handleApiError(error, 'bulk like operation')
      alert(`Bulk operation failed: ${errorHandlers.getUserFriendlyMessage(errorInfo.type)}`)
      console.error('Bulk like error:', error)
    } finally {
      setLoading(prev => ({ ...prev, bulk: false }))
    }
  }

  return (
    <div className="api-demo">
      <h1 className="api-demo-title">Advanced Database & API Integration Demo</h1>

      <div className="demo-grid">
        {/* Database Status */}
        <Card title="Database Performance Monitor">
          <div className="status-section">
            <Button
              onClick={loadDbStatus}
              disabled={loading.db}
              variant="secondary"
            >
              {loading.db ? 'Loading...' : 'Check DB Status'}
            </Button>

            {dbStatus && (
              <div className="status-details">
                <div className="status-item">
                  <strong>Status:</strong>
                  <span className={`status-${dbStatus.status}`}>
                    {dbStatus.status.toUpperCase()}
                  </span>
                </div>
                <div className="status-item">
                  <strong>Query Time:</strong> {dbStatus.performance?.queryTime || dbStatus.queryTime}
                </div>
                <div className="status-item">
                  <strong>Performance:</strong>
                  <span className={`perf-${dbStatus.performance?.status || 'unknown'}`}>
                    {dbStatus.performance?.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                <div className="status-item">
                  <strong>Active Connections:</strong> {dbStatus.connectionPool?.totalCount || 0}
                </div>
                <div className="status-item">
                  <strong>Database Size:</strong> {dbStatus.databaseSize ? `${Math.round(dbStatus.databaseSize / 1024)} KB` : 'Unknown'}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Posts Statistics */}
        <Card title="Posts Analytics">
          <div className="status-section">
            <Button
              onClick={loadPostsStats}
              disabled={loading.stats}
              variant="secondary"
            >
              {loading.stats ? 'Loading...' : 'Load Statistics'}
            </Button>

            {postsStats && (
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{postsStats.total_posts}</div>
                  <div className="stat-label">Total Posts</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{postsStats.total_likes}</div>
                  <div className="stat-label">Total Likes</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{postsStats.avg_likes_per_post?.toFixed(1) || 0}</div>
                  <div className="stat-label">Avg Likes/Post</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{postsStats.unique_authors}</div>
                  <div className="stat-label">Authors</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Pagination Demo */}
        <Card title="Pagination & CRUD Operations">
          <div className="pagination-section">
            <div className="pagination-controls">
              <Button
                onClick={() => loadPaginatedPosts(1)}
                disabled={loading.pagination}
                variant="primary"
              >
                {loading.pagination ? 'Loading...' : 'Load Page 1'}
              </Button>

              {paginatedPosts && (
                <>
                  <Button
                    onClick={() => loadPaginatedPosts(paginatedPosts.pagination.page + 1)}
                    disabled={loading.pagination || paginatedPosts.pagination.page >= paginatedPosts.pagination.pages}
                    variant="secondary"
                  >
                    Next Page
                  </Button>
                  <Button
                    onClick={handleBulkLike}
                    disabled={loading.bulk || !paginatedPosts.posts.length}
                    variant="success"
                  >
                    {loading.bulk ? 'Updating...' : 'Bulk Like (First 3)'}
                  </Button>
                </>
              )}
            </div>

            {paginatedPosts && (
              <div className="pagination-info">
                <p>Page {paginatedPosts.pagination.page} of {paginatedPosts.pagination.pages}</p>
                <p>Showing {paginatedPosts.posts.length} posts</p>
                <div className="posts-preview">
                  {paginatedPosts.posts.map(post => (
                    <div key={post.id} className="post-preview">
                      <h4>{post.title}</h4>
                      <p>By {post.author} • {post.likes} likes</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Search Demo */}
        <Card title="Advanced Search & Filtering">
          <div className="search-section">
            <div className="search-controls">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="search-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={loading.search || !searchTerm.trim()}
                variant="primary"
              >
                {loading.search ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {searchResults && (
              <div className="search-results">
                <p>Found {searchResults.pagination.total} results for "{searchResults.pagination.searchTerm}"</p>
                <div className="search-posts">
                  {searchResults.posts.map(post => (
                    <div key={post.id} className="post-preview">
                      <h4>{post.title}</h4>
                      <p>{post.content.substring(0, 100)}...</p>
                      <small>By {post.author}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card title="Features Demonstrated">
        <div className="features-list">
          <div className="feature-category">
            <h3>🔄 Database Integration (PostgreSQL)</h3>
            <ul>
              <li>Full CRUD operations with proper SQL queries</li>
              <li>Advanced queries (pagination, search, aggregation)</li>
              <li>Database transactions for data consistency</li>
              <li>Performance monitoring and connection pooling</li>
              <li>Database schema management</li>
            </ul>
          </div>

          <div className="feature-category">
            <h3>🌐 API Integration (HTTP)</h3>
            <ul>
              <li>RESTful API communication with fetch</li>
              <li>Optimistic UI updates for better UX</li>
              <li>Comprehensive error handling and retry logic</li>
              <li>Rate limiting and request throttling</li>
              <li>Automatic request/response logging</li>
              <li>Input validation and sanitization</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ApiDemo
