# Backend Server

Express.js backend server for the full-stack application.

## Requirements Met

✅ **At least two API endpoints** - The server exposes multiple endpoints:
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a single item by ID
- `POST /api/items` - Create a new item
- `GET /api/health` - Health check endpoint

✅ **Built using Express.js** - Uses Express.js framework

✅ **Handles routing appropriately** - RESTful API structure with proper route definitions

✅ **Request parsing** - Uses `express.json()` and `express.urlencoded()` middleware

✅ **Business logic** - Includes:
- Input validation
- Data sanitization
- Error handling
- Data persistence operations

## Setup

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

The server will run on `http://localhost:3001`

## API Endpoints

### GET /api/items
Get all items.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Sample Item 1",
    "description": "This is a sample item",
    "category": "electronics",
    "price": 99.99,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/items/:id
Get a single item by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Sample Item 1",
  "description": "This is a sample item",
  "category": "electronics",
  "price": 99.99,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/items
Create a new item.

**Request Body:**
```json
{
  "name": "New Item",
  "description": "Item description",
  "category": "electronics",
  "price": 99.99
}
```

**Response:**
```json
{
  "id": 4,
  "name": "New Item",
  "description": "Item description",
  "category": "electronics",
  "price": 99.99,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Data Storage

Currently uses a JSON file (`data/items.json`) for data storage. This can be easily replaced with a database (MongoDB, PostgreSQL, etc.) in the future.

