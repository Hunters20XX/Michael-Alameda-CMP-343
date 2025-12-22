// Load environment variables
import 'dotenv/config';

// ES modules imports
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import postsRoutes from './routes/posts.js'
import contactRoutes from './routes/contact.js';
import { createTables } from './config/db.js'; // Import createTables from db.js
import { createContactTable } from './data/contactStore.js'; // Import createContactTable
import { generalRateLimit } from './middleware/rateLimit.js'
import { requestLogger, errorLogger } from './middleware/logging.js'

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging
app.use(requestLogger);

// Rate limiting
app.use('/api', generalRateLimit);

// Routes
app.use('/api/posts', postsRoutes);
app.use('/api/contact', contactRoutes);

// Static files (skip API routes)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  next();
});
app.use(express.static(path.join(__dirname, '../client/dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database monitoring endpoint
app.get('/api/db/status', async (req, res) => {
  try {
    const start = Date.now()

    // Test database connection
    const result = await query('SELECT NOW(), pg_database_size(current_database()) as db_size')
    const queryTime = Date.now() - start

    // Get connection stats
    const poolStats = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    }

    // Get table statistics
    const tableStats = await query(`
      SELECT
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes
      FROM pg_stat_user_tables
      WHERE schemaname = 'public'
    `)

    res.json({
      status: 'healthy',
      timestamp: result.rows[0].now,
      databaseSize: result.rows[0].db_size,
      queryTime: `${queryTime}ms`,
      connectionPool: poolStats,
      tableStats: tableStats.rows,
      performance: {
        queryTime,
        status: queryTime < 100 ? 'excellent' : queryTime < 500 ? 'good' : 'needs_attention'
      }
    })
  } catch (error) {
    console.error('Database status check failed:', error)
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    })
  }
})

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Blog API',
    version: '1.0.0',
    description: 'REST API for a full-stack blog application',
    endpoints: {
      posts: {
        'GET /api/posts': {
          description: 'Get all posts',
          response: 'Array of post objects'
        },
        'GET /api/posts/:id': {
          description: 'Get a specific post by ID',
          parameters: { id: 'Post ID (number)' },
          response: 'Post object'
        },
        'POST /api/posts': {
          description: 'Create a new post',
          body: {
            title: 'string (required, 1-255 chars)',
            content: 'string (required, 1-10000 chars)',
            author: 'string (required, 1-100 chars)'
          },
          response: 'Created post object'
        },
        'PUT /api/posts/:id': {
          description: 'Update an existing post',
          parameters: { id: 'Post ID (number)' },
          body: {
            title: 'string (optional, 1-255 chars)',
            content: 'string (optional, 1-10000 chars)',
            author: 'string (optional, 1-100 chars)'
          },
          response: 'Updated post object'
        },
        'PATCH /api/posts/:id/like': {
          description: 'Increment likes for a post',
          parameters: { id: 'Post ID (number)' },
          response: 'Updated post object'
        },
        'DELETE /api/posts/:id': {
          description: 'Delete a post',
          parameters: { id: 'Post ID (number)' },
          response: 'Success message with deleted post'
        }
      },
      contact: {
        'POST /api/contact': {
          description: 'Send a contact message',
          body: {
            name: 'string (required, 1-255 chars)',
            email: 'string (required, valid email)',
            subject: 'string (required, 1-255 chars)',
            message: 'string (required, 1-5000 chars)'
          },
          response: 'Success message with created message data'
        }
      },
      system: {
        'GET /api/health': {
          description: 'Health check endpoint',
          response: 'Server status'
        },
        'GET /api/docs': {
          description: 'API documentation',
          response: 'This documentation'
        }
      }
    },
    features: [
      'Input validation',
      'Rate limiting (100 req/15min general, 10 req/5min for writes)',
      'Request logging',
      'CORS enabled',
      'PostgreSQL database',
      'Error handling with appropriate HTTP status codes'
    ]
  });
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The API endpoint ${req.originalUrl} does not exist`
  });
});

// Catch-all handler for non-API routes (serve React app)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Error logging middleware (must be last)
app.use(errorLogger);

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Initializing database...');
    await createTables(); // Call the createTables function
    await createContactTable(); // Call the createContactTable function
    console.log('Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

startServer();