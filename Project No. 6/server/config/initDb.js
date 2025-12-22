const pool = require('./db.js')

export const createTables = async () => {
  try {
    // Create posts table
    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        likes INTEGER DEFAULT 0
      )
    `)

    console.log('Database tables created successfully')

    // Insert sample data if table is empty
    const result = await query('SELECT COUNT(*) as count FROM posts')
    const count = parseInt(result.rows[0].count)

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
      ])
      console.log('Sample data inserted successfully')
    }

  } catch (error) {
    console.error('Error creating tables:', error)
    throw error
  }
}
