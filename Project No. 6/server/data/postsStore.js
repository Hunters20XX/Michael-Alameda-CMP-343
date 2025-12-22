import { query } from '../config/dbs.js'

/**
 * Posts data access layer
 * Provides functions for CRUD operations on posts
 */

/**
 * Get all posts ordered by date (newest first)
 * @returns {Promise<Array>} Array of post objects
 */
export const getPosts = async () => {
  const result = await query('SELECT * FROM posts ORDER BY date DESC')
  return result.rows
}

/**
 * Get a single post by ID
 * @param {number} id - Post ID
 * @returns {Promise<Object|null>} Post object or null if not found
 */
export const getPostById = async (id) => {
  const result = await query('SELECT * FROM posts WHERE id = $1', [id])
  return result.rows.length > 0 ? result.rows[0] : null
}

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @param {string} postData.title - Post title
 * @param {string} postData.content - Post content
 * @param {string} postData.author - Post author
 * @returns {Promise<Object>} Created post object
 */
export const createPost = async ({ title, content, author }) => {
  const result = await query(
    'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *',
    [title, content, author]
  )
  return result.rows[0]
}

/**
 * Update an existing post
 * @param {number} id - Post ID
 * @param {Object} updateData - Fields to update
 * @param {string} [updateData.title] - New title
 * @param {string} [updateData.content] - New content
 * @param {string} [updateData.author] - New author
 * @returns {Promise<Object|null>} Updated post object or null if not found
 */
export const updatePost = async (id, updateData) => {
  const { title, content, author } = updateData

  // Check if post exists
  const existingPost = await getPostById(id)
  if (!existingPost) {
    return null
  }

  // Build dynamic update query
  const updates = []
  const values = []
  let paramCount = 1

  if (title !== undefined) {
    updates.push(`title = $${paramCount++}`)
    values.push(title)
  }
  if (content !== undefined) {
    updates.push(`content = $${paramCount++}`)
    values.push(content)
  }
  if (author !== undefined) {
    updates.push(`author = $${paramCount++}`)
    values.push(author)
  }

  if (updates.length === 0) {
    // No fields to update, return existing post
    return existingPost
  }

  values.push(id) // Add id at the end for WHERE clause

  const updateQuery = `UPDATE posts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`
  const result = await query(updateQuery, values)
  return result.rows[0]
}

/**
 * Increment likes for a post
 * @param {number} id - Post ID
 * @returns {Promise<Object|null>} Updated post object or null if not found
 */
export const likePost = async (id) => {
  const result = await query(
    'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
    [id]
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

/**
 * Delete a post by ID
 * @param {number} id - Post ID
 * @returns {Promise<Object|null>} Deleted post object or null if not found
 */
export const deletePost = async (id) => {
  const result = await query('DELETE FROM posts WHERE id = $1 RETURNING *', [id])
  return result.rows.length > 0 ? result.rows[0] : null
}

/**
 * Get posts by author
 * @param {string} author - Author name
 * @returns {Promise<Array>} Array of posts by the author
 */
export const getPostsByAuthor = async (author) => {
  const result = await query('SELECT * FROM posts WHERE author = $1 ORDER BY date DESC', [author])
  return result.rows
}

/**
 * Search posts by title or content
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching posts
 */
export const searchPosts = async (searchTerm) => {
  const result = await query(
    'SELECT * FROM posts WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY date DESC',
    [`%${searchTerm}%`]
  )
  return result.rows
}
