import express from 'express'
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  likePost,
  deletePost
} from '../data/postsStore.js'
import { validatePostData, validateId } from '../middleware/validation.js'
import { strictRateLimit } from '../middleware/rateLimit.js'

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

export default router

