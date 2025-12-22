-- SQL schema for posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  likes INTEGER NOT NULL DEFAULT 0
);

-- Example: create extension for UUIDs if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
