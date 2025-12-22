# Database Setup Guide

This guide will help you set up PostgreSQL for the blog application.

## Prerequisites

- PostgreSQL 18 installed and running on Windows
- Node.js and npm installed

## Quick Setup

1. **Run the setup script** (as Administrator if needed):
   ```powershell
   .\setup-db.ps1
   ```

2. **Or set up manually**:

   a. Open PowerShell as Administrator

   b. Set the postgres user password:
   ```sql
   psql -U postgres -h localhost -c "ALTER USER postgres PASSWORD 'password';"
   ```

   c. Create the database:
   ```sql
   psql -U postgres -h localhost -c "CREATE DATABASE posts_db;"
   ```

   d. Load the schema:
   ```sql
   psql -U postgres -h localhost -d posts_db -f ".\data\schema.sql"
   ```

## Configuration

The database configuration is in `config/database.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=posts_db
DB_USER=postgres
DB_PASSWORD=120202
```

## Troubleshooting

### Password Authentication Failed
- Make sure PostgreSQL is running: `Get-Service postgresql-x64-18`
- The postgres user password might be different. Check your PostgreSQL installation.
- You may need to run the setup script as Administrator.

### Connection Refused
- Verify PostgreSQL is running on port 5432
- Check if firewall is blocking the connection

### Database Doesn't Exist
- Run the setup script or create the database manually as shown above

## Testing the Setup

After setup, run the server:
```bash
npm start
```

You should see:
```
Initializing database...
Connected to PostgreSQL database
Database initialized successfully
Server is running on http://localhost:8000
```

## Manual psql Commands

If you need to interact with PostgreSQL directly:

```bash
# Connect to database
psql -U postgres -h localhost -d posts_db

# List databases
\l

# List tables
\dt

# View table schema
\d posts

# Exit psql
\q
```
