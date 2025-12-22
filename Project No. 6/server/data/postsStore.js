import { query, pool } from '../config/db.js'; // Import pool for transactions

// Functions for interacting with posts
export const getPosts = async () => {
  try {
    const result = await query('SELECT * FROM posts ORDER BY date DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPostById = async (id) => {
  try {
    const result = await query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw error;
  }
};

export const createPost = async ({ title, content, author }) => {
  try {
    const result = await query(
      'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *',
      [title, content, author]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (id, { title, content, author }) => {
  try {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (title) {
      fields.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (content) {
      fields.push(`content = $${paramIndex++}`);
      values.push(content);
    }
    if (author) {
      fields.push(`author = $${paramIndex++}`);
      values.push(author);
    }

    if (fields.length === 0) {
      return null; // No fields to update
    }

    values.push(id); // Add id for WHERE clause
    const queryText = `UPDATE posts SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await query(queryText, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const likePost = async (id) => {
  try {
    const result = await query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const result = await query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Advanced CRUD operations for demonstration

// Get posts with pagination
export const getPostsPaginated = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const result = await query(
      'SELECT * FROM posts ORDER BY date DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    // Get total count for pagination metadata
    const countResult = await query('SELECT COUNT(*) as total FROM posts');
    const total = parseInt(countResult.rows[0].total);

    return {
      posts: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    throw error;
  }
};

// Search posts by title, content, or author
export const searchPosts = async (searchTerm, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm}%`;

    const result = await query(`
      SELECT * FROM posts
      WHERE title ILIKE $1 OR content ILIKE $1 OR author ILIKE $1
      ORDER BY date DESC
      LIMIT $2 OFFSET $3
    `, [searchPattern, limit, offset]);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM posts
      WHERE title ILIKE $1 OR content ILIKE $1 OR author ILIKE $1
    `, [searchPattern]);

    const total = parseInt(countResult.rows[0].total);

    return {
      posts: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        searchTerm
      }
    };
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

// Get posts statistics
export const getPostsStats = async () => {
  try {
    const result = await query(`
      SELECT
        COUNT(*) as total_posts,
        COUNT(CASE WHEN date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as posts_last_30_days,
        SUM(likes) as total_likes,
        AVG(likes) as avg_likes_per_post,
        MAX(likes) as max_likes,
        COUNT(DISTINCT author) as unique_authors
      FROM posts
    `);

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching posts statistics:', error);
    throw error;
  }
};

// Bulk operations for demonstration
export const bulkUpdateLikes = async (postIds, likeIncrement = 1) => {
  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const placeholders = postIds.map((_, index) => `$${index + 2}`).join(',');
      const queryText = `
        UPDATE posts
        SET likes = likes + $1
        WHERE id IN (${placeholders})
        RETURNING *
      `;

      const result = await client.query(queryText, [likeIncrement, ...postIds]);
      await client.query('COMMIT');

      console.log(`Bulk updated ${result.rowCount} posts`);
      return result.rows;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in bulk update:', error);
    throw error;
  }
};