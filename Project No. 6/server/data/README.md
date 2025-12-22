# Database Setup

This folder contains the database schema and setup files for the posts application.

## Files

- `schema.sql` - SQL script to create the database schema and insert sample data
- `postsStore.js` - Data access layer with functions for posts CRUD operations

## Database Schema

The application uses a PostgreSQL database with the following structure:

### Posts Table
- `id` - SERIAL PRIMARY KEY (auto-incrementing)
- `title` - VARCHAR(255) NOT NULL
- `content` - TEXT NOT NULL
- `author` - VARCHAR(255) NOT NULL
- `date` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `likes` - INTEGER DEFAULT 0

## Setup Instructions

### Option 1: Using the SQL File Directly
1. Connect to your PostgreSQL database
2. Run the `schema.sql` file:
   ```sql
   \i server/data/schema.sql
   ```

### Option 2: Using the Application
The application will automatically create the database tables when it starts (see `config/initDb.js`).

## Sample Data

The schema includes sample blog posts for testing purposes. These will be inserted automatically if the posts table is empty.
