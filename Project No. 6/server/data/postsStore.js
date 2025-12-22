import { query } from '../config/db.js'; // Import only 'query'

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