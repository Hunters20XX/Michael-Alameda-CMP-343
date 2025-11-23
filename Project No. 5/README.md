# React + Express + PostgreSQL CRUD Application

A full-stack web application that demonstrates CRUD (Create, Read, Update, Delete) operations connecting a React frontend to a PostgreSQL database through an Express API.

## Features

- **React Frontend**: Modern React application with components, hooks (useState), and props
- **Express API**: RESTful API with CRUD endpoints
- **PostgreSQL Database**: Persistent data storage
- **Full CRUD Operations**: Create, Read, Update, and Delete links

## Project Structure

```
.
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Form.jsx   # Form component for creating/editing links
│   │   │   ├── Table.jsx  # Table component for displaying links
│   │   │   └── LinkContainer.jsx  # Main container component
│   │   └── App.jsx        # Root component
│   └── package.json
├── database/
│   └── schema.sql         # PostgreSQL database schema
├── index.js               # Express server
├── queries.js             # Database query functions
└── package.json           # Backend dependencies

```

## React Components & Features

### Components
- **LinkContainer**: Main container component that manages state and handles API calls
- **Form**: Reusable form component for creating and editing links
- **Table**: Displays links in a table format with edit and delete actions

### React Hooks & Props
- **useState**: Used in `LinkContainer` and `Form` components to manage component state
- **useEffect**: Used to fetch data on component mount
- **Props**: Components communicate through props (e.g., `linkData`, `handleSubmit`, `removeLink`, `editLink`)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE favlinks;
```

2. Run the schema to create the table:
```bash
psql -U your_username -d favlinks -f database/schema.sql
```

Or manually execute the SQL in `database/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    URL TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (copy from `env.example.txt`):
```env
DB_USER=your_username
DB_HOST=localhost
DB_NAME=favlinks
DB_PASSWORD=your_password
DB_PORT=5432
```

3. Start the Express server:
```bash
npm start
```

The server will run on `http://localhost:9001`

### 3. Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm run dev
```

The React app will run on `http://localhost:3000`

## API Endpoints

The Express API provides the following endpoints:

- `GET /links` - Retrieve all links
- `POST /new` - Create a new link
- `PUT /links/:id` - Update an existing link
- `DELETE /links/:id` - Delete a link

## Usage

1. **Create a Link**: Fill in the form with a name and URL, then click "Submit"
2. **View Links**: All links are displayed in the table
3. **Edit a Link**: Click the "Edit" button on any row, modify the form, then click "Update"
4. **Delete a Link**: Click the "Delete" button on any row

## Development

### Running in Development Mode

1. Start the PostgreSQL database
2. Start the Express server (from root): `npm start`
3. Start the React dev server (from client): `npm run dev`

The Vite proxy is configured to forward API requests from the React app to the Express server.

### Building for Production

1. Build the React app:
```bash
cd client
npm run build
```

2. The Express server will serve the built React app from the `client/build` directory

## Technologies Used

- **Frontend**: React 18, Vite
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL
- **Database Driver**: pg (node-postgres)

## Code Highlights

### React State Management (useState)
```jsx
const [favLinks, setFavLinks] = useState([])
const [editingLink, setEditingLink] = useState(null)
```

### Component Props
```jsx
<Table 
  linkData={favLinks} 
  removeLink={handleRemove} 
  editLink={handleEdit} 
/>
```

### API Integration
```jsx
const response = await fetch('/links')
const data = await response.json()
setFavLinks(data)
```

## License

ISC

