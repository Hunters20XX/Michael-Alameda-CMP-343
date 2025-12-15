import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware for request parsing
app.use(cors())
app.use(express.json()) // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded request bodies

// Data file path
const DATA_FILE = join(__dirname, 'data', 'items.json')
const dataDir = join(__dirname, 'data')

// Initialize data directory if it doesn't exist
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

// Initialize data file with sample data if it doesn't exist
if (!existsSync(DATA_FILE)) {
  const initialData = [
    { id: 1, name: 'Sample Item 1', description: 'This is a sample item', category: 'electronics', price: 99.99 },
    { id: 2, name: 'Sample Item 2', description: 'Another sample item', category: 'books', price: 19.99 },
    { id: 3, name: 'Sample Item 3', description: 'Yet another sample', category: 'electronics', price: 149.99 },
  ]
  writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2))
}

// Helper functions for data operations
const readData = () => {
  try {
    const data = readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading data:', error)
    return []
  }
}

const writeData = (data) => {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing data:', error)
    return false
  }
}

// API Routes

// GET /api/items - Get all items
app.get('/api/items', (req, res) => {
  try {
    const items = readData()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

// GET /api/items/:id - Get a single item by ID
app.get('/api/items/:id', (req, res) => {
  try {
    const items = readData()
    const itemId = parseInt(req.params.id)
    
    // Business logic: Validate ID
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item ID' })
    }
    
    const item = items.find(i => i.id === itemId)
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

// POST /api/items - Create a new item
app.post('/api/items', (req, res) => {
  try {
    const { name, description, category, price } = req.body

    // Business logic: Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Name is required and must be a non-empty string' 
      })
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Description is required and must be a non-empty string' 
      })
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Category is required and must be a non-empty string' 
      })
    }

    // Business logic: Price validation (optional but must be valid if provided)
    if (price !== undefined && price !== null) {
      const priceNum = parseFloat(price)
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ 
          error: 'Price must be a valid positive number' 
        })
      }
    }

    const items = readData()
    
    // Business logic: Generate unique ID
    const newId = items.length > 0 
      ? Math.max(...items.map(i => i.id)) + 1 
      : 1

    // Business logic: Create new item with sanitized data
    const newItem = {
      id: newId,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: price !== undefined && price !== null ? parseFloat(price) : null,
      createdAt: new Date().toISOString()
    }

    items.push(newItem)
    
    // Business logic: Persist data
    if (writeData(items)) {
      res.status(201).json(newItem)
    } else {
      res.status(500).json({ error: 'Failed to save item' })
    }
  } catch (error) {
    console.error('Error creating item:', error)
    res.status(500).json({ error: 'Failed to create item' })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`API endpoints:`)
  console.log(`  GET    http://localhost:${PORT}/api/items - Get all items`)
  console.log(`  GET    http://localhost:${PORT}/api/items/:id - Get single item`)
  console.log(`  POST   http://localhost:${PORT}/api/items - Create new item`)
  console.log(`  GET    http://localhost:${PORT}/api/health - Health check`)
})

