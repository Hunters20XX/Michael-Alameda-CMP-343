# Server API

Express server for managing posts with PostgreSQL database.

## Setup

### Prerequisites

- Node.js
- PostgreSQL database

### Database Setup

1. Create a PostgreSQL database named `posts_db` (or update the configuration)

2. Configure database connection by creating a `.env` file in the server directory:
```bash
cp config/database.env.example .env
```

Edit the `.env` file with your PostgreSQL credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=posts_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:8000` and automatically create the required database tables on startup.

## API Endpoints

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a single post by ID
- `POST /api/posts` - Create a new post
  - Body: `{ title: string, content: string, author: string }`
- `PUT /api/posts/:id` - Update a post
  - Body: `{ title?: string, content?: string, author?: string }`
- `PATCH /api/posts/:id/like` - Increment likes for a post
- `DELETE /api/posts/:id` - Delete a post

### Health Check

- `GET /api/health` - Check server status

## Example Requests

### Create a Post
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Post",
    "content": "This is the content",
    "author": "John Doe"
  }'
```

### Get All Posts
```bash
curl http://localhost:8000/api/posts
```

### Like a Post
```bash
curl -X PATCH http://localhost:8000/api/posts/1/like
```

### Update a Post
```bash
curl -X PUT http://localhost:8000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

### Delete a Post
```bash
curl -X DELETE http://localhost:8000/api/posts/1
```

