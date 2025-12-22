// Load environment variables
import 'dotenv/config';

// ES modules imports
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import postsRoutes from './routes/posts.js';
import { createTables } from './config/db.js'; // Import createTables from db.js

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist'))); // Correct path for static files

// Routes
app.use('/api/posts', postsRoutes);

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Initializing database...');
    await createTables(); // Call the createTables function
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