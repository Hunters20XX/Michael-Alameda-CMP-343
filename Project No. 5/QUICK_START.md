# Quick Start Guide

## Installation

1. **Install backend dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Set up PostgreSQL database:**
   - Create database: `CREATE DATABASE favlinks;`
   - Run schema: `psql -U your_username -d favlinks -f database/schema.sql`
   - Create `.env` file with your database credentials (see `env.example.txt`)

## Running the Application

1. **Start the Express server (from root directory):**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:9001`

2. **Start the React app (in a new terminal, from root directory):**
   ```bash
   cd client
   npm run dev
   ```
   App runs on `http://localhost:3000`

## React Features Demonstrated

### Components
- **LinkContainer** - Main container component managing application state
- **Form** - Reusable form component for creating/editing links
- **Table** - Displays data in a table format
- **TableHeader** - Table header component
- **TableBody** - Table body component with dynamic rows

### useState Hook
Used in multiple components:
- `LinkContainer`: Manages `favLinks` array and `editingLink` state
- `Form`: Manages `name` and `URL` input states

### Props
Components communicate through props:
- `LinkContainer` passes `linkData`, `removeLink`, `editLink` to `Table`
- `LinkContainer` passes `handleSubmit`, `editingLink`, `handleCancel` to `Form`
- `Table` passes `linkData`, `removeLink`, `editLink` to `TableBody`

### CRUD Operations
- **Create**: POST request to `/new` endpoint
- **Read**: GET request to `/links` endpoint
- **Update**: PUT request to `/links/:id` endpoint
- **Delete**: DELETE request to `/links/:id` endpoint

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. Add a new link using the form
3. View all links in the table
4. Click "Edit" to modify a link
5. Click "Delete" to remove a link

