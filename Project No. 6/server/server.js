import express from 'express'
import cors from 'cors'
import postsRoutes from './routes/posts.js'
import { createTables } from './config/initDb.js'

const app = express()
const PORT = 8000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/posts', postsRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Initializing database...')
    await createTables()
    console.log('Database initialized successfully')

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

startServer()

