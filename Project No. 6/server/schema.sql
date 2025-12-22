-- Database schema for posts application
-- Run this script to initialize the database

-- Create the posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0
);

-- Create index on date for faster ordering
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);

-- Create index on author for potential filtering
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);

-- Optional: Add some sample data for testing
INSERT INTO posts (title, content, author) VALUES
    ('Welcome to the Blog', 'This is the first post on our blog platform. Welcome!', 'Admin'),
    ('Getting Started', 'Here are some tips for getting started with our platform.', 'Editor'),
    ('About Our Platform', 'Learn more about what makes our blog platform special.', 'Admin')
ON CONFLICT DO NOTHING;
