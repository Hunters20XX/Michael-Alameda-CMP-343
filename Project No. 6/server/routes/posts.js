import express from 'express'
const router = express.Router()

// In-memory storage (replace with database in production)
let posts = [
  {
    id: 1,
    title: 'Getting Started with React',
    content: 'React is a powerful library for building user interfaces. In this post, we explore the fundamentals of React components and how they work together.',
    author: 'John Doe',
    date: new Date().toISOString(),
    likes: 0
  },
  {
    id: 2,
    title: 'Understanding Component Composition',
    content: 'Component composition is a key concept in React. Learn how to build reusable components and combine them to create complex UIs.',
    author: 'Jane Smith',
    date: new Date(Date.now() - 86400000).toISOString(),
    likes: 0
  },
  {
    id: 3,
    title: 'State Management Best Practices',
    content: 'Managing state effectively is crucial for building maintainable React applications. Here are some best practices to follow.',
    author: 'Bob Johnson',
    date: new Date(Date.now() - 172800000).toISOString(),
    likes: 0
  }
]

let nextId = 4

// GET /api/posts - Get all posts
router.get('/', (req, res) => {
  try {
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// GET /api/posts/:id - Get a single post by ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const post = posts.find(p => p.id === id)
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }
    
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// POST /api/posts - Create a new post
router.post('/', (req, res) => {
  try {
    const { title, content, author } = req.body
    
    if (!title || !content || !author) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, content, and author are required' 
      })
    }
    
    const newPost = {
      id: nextId++,
      title,
      content,
      author,
      date: new Date().toISOString(),
      likes: 0
    }
    
    posts.push(newPost)
    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// PUT /api/posts/:id - Update a post
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const postIndex = posts.findIndex(p => p.id === id)
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' })
    }
    
    const { title, content, author } = req.body
    const existingPost = posts[postIndex]
    
    // Update only provided fields
    posts[postIndex] = {
      ...existingPost,
      ...(title && { title }),
      ...(content && { content }),
      ...(author && { author })
    }
    
    res.json(posts[postIndex])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// PATCH /api/posts/:id/like - Increment likes for a post
router.patch('/:id/like', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const postIndex = posts.findIndex(p => p.id === id)
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' })
    }
    
    posts[postIndex].likes = (posts[postIndex].likes || 0) + 1
    res.json(posts[postIndex])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update likes' })
  }
})

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const postIndex = posts.findIndex(p => p.id === id)
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' })
    }
    
    const deletedPost = posts.splice(postIndex, 1)[0]
    res.json({ message: 'Post deleted successfully', post: deletedPost })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

export default router

