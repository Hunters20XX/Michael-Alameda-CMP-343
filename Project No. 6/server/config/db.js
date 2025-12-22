import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const Pool = pg.Pool;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'posts_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '120202',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
};

export const closePool = async () => {
  await pool.end();
  console.log('Database pool closed');
};

export const createTables = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        likes INTEGER DEFAULT 0
      )
    `);
    console.log('Database tables created successfully');

    const result = await query('SELECT COUNT(*) as count FROM posts');
    const count = parseInt(result.rows[0].count);
    if (count === 0) {
      await query(`
        INSERT INTO posts (title, content, author, date, likes) VALUES
        ($1, $2, $3, $4, $5),
        ($6, $7, $8, $9, $10),
        ($11, $12, $13, $14, $15)
      `, [
        'Getting Started with React',
        'React is a powerful library for building user interfaces. In this post, we explore the fundamentals of React components and how they work together.',
        'John Doe',
        new Date().toISOString(),
        0,
        'Understanding Component Composition',
        'Component composition is a key concept in React. Learn how to build reusable components and combine them to create complex UIs.',
        'Jane Smith',
        new Date(Date.now() - 86400000).toISOString(),
        0,
        'State Management Best Practices',
        'Managing state effectively is crucial for building maintainable React applications. Here are some best practices to follow.',
        'Bob Johnson',
        new Date(Date.now() - 172800000).toISOString(),
        0
      ]);
      console.log('Sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

export default pool; // You can export the pool itself if other modules need direct access