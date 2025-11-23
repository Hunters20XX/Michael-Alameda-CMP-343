# Database Setup Instructions

## Prerequisites
- PostgreSQL installed and running
- Database user with appropriate permissions

## Setup Steps

1. **Create the database:**
   ```sql
   CREATE DATABASE favlinks;
   ```

2. **Run the schema file:**
   ```bash
   psql -U your_username -d favlinks -f schema.sql
   ```
   
   Or using psql interactively:
   ```sql
   \c favlinks
   \i schema.sql
   ```

3. **Verify the table was created:**
   ```sql
   \dt
   SELECT * FROM links;
   ```

## Environment Variables

Make sure your `.env` file contains:
```
DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=favlinks
DB_PASSWORD=your_database_password
DB_PORT=5432
```

## Testing the Connection

Once the server is running, you can test the database connection by visiting:
- `http://localhost:9001/api/health`

This will return the database connection status and PostgreSQL version.

