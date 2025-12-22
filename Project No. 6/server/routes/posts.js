import express from 'express'
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  likePost,
  deletePost,
  getPostsPaginated,
  searchPosts,
  getPostsStats,
  bulkUpdateLikes
} from '../data/postsStore.js'
import { validatePostData, validateId } from '../middleware/validation.js'
import { strictRateLimit } from '../middleware/rateLimit.js'

// Create router instance
const router = express.Router()

// GET /api/posts - Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await getPosts()
    res.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// GET /api/posts/:id - Get a single post by ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const post = await getPostById(req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// POST /api/posts - Create a new post
router.post('/', strictRateLimit, validatePostData, async (req, res) => {
  try {
    const { title, content, author } = req.body

    const newPost = await createPost({ title: title.trim(), content: content.trim(), author: author.trim() })

    // Emit real-time event for new post
    const io = req.app.get('io')
    io.to('general').emit('post-created', {
      ...newPost,
      timestamp: new Date().toISOString()
    })

    res.status(201).json(newPost)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// PUT /api/posts/:id - Update a post
router.put('/:id', strictRateLimit, validateId, async (req, res) => {
  try {
    const { title, content, author } = req.body

    if (!title && !content && !author) {
      return res.status(400).json({ error: 'At least one field (title, content, or author) must be provided' })
    }

    const updateData = {}
    if (title) updateData.title = title.trim()
    if (content) updateData.content = content.trim()
    if (author) updateData.author = author.trim()

    const updatedPost = await updatePost(req.params.id, updateData)

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// PATCH /api/posts/:id/like - Increment likes for a post
router.patch('/:id/like', strictRateLimit, validateId, async (req, res) => {
  try {
    const updatedPost = await likePost(req.params.id)

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Emit real-time event for like update
    const io = req.app.get('io')
    io.to('general').emit('like-updated', {
      postId: req.params.id,
      likes: updatedPost.likes,
      timestamp: new Date().toISOString()
    })

    res.json(updatedPost)
  } catch (error) {
    console.error('Error updating likes:', error)
    res.status(500).json({ error: 'Failed to update likes' })
  }
})

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', strictRateLimit, validateId, async (req, res) => {
  try {
    const deletedPost = await deletePost(req.params.id)

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.json({ message: 'Post deleted successfully', post: deletedPost })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

// GET /api/posts/paginated?page=1&limit=10 - Get posts with pagination
router.get('/paginated', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
      });
    }

    const result = await getPostsPaginated(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    res.status(500).json({ error: 'Failed to fetch paginated posts' });
  }
});

// GET /api/posts/search?q=searchterm&page=1&limit=10 - Search posts
router.get('/search', async (req, res) => {
  try {
    const { q: searchTerm, page = 1, limit = 10 } = req.query;

    if (!searchTerm || searchTerm.trim().length < 2) {
      return res.status(400).json({
        error: 'Search term must be at least 2 characters long'
      });
    }

    const result = await searchPosts(searchTerm.trim(), parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

// GET /api/posts/stats - Get posts statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getPostsStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching posts statistics:', error);
    res.status(500).json({ error: 'Failed to fetch posts statistics' });
  }
});

// POST /api/posts/bulk-like - Bulk update likes for multiple posts
router.post('/bulk-like', strictRateLimit, async (req, res) => {
  try {
    const { postIds, likeIncrement = 1 } = req.body;

    if (!Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({
        error: 'postIds must be a non-empty array of post IDs'
      });
    }

    if (postIds.length > 50) {
      return res.status(400).json({
        error: 'Cannot update more than 50 posts at once'
      });
    }

    // Validate that all IDs are numbers
    if (!postIds.every(id => typeof id === 'number' && id > 0)) {
      return res.status(400).json({
        error: 'All post IDs must be positive numbers'
      });
    }

    const updatedPosts = await bulkUpdateLikes(postIds, likeIncrement);
    res.json({
      message: `Successfully updated ${updatedPosts.length} posts`,
      posts: updatedPosts
    });
  } catch (error) {
    console.error('Error in bulk like operation:', error);
    res.status(500).json({ error: 'Failed to perform bulk like operation' });
  }
});

export default router