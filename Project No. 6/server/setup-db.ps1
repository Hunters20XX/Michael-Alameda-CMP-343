# PostgreSQL Setup Script for Windows PowerShell
# Run this as Administrator if needed

Write-Host "Setting up PostgreSQL database for the blog application..." -ForegroundColor Green

# Set the postgres password (you may need to change this)
$PG_PASSWORD = "password"

# PostgreSQL bin directory (adjust if different)
$PG_BIN = "C:\Program Files\PostgreSQL\18\bin"

# Check if psql exists
if (!(Test-Path "$PG_BIN\psql.exe")) {
    Write-Host "PostgreSQL psql not found at $PG_BIN\psql.exe" -ForegroundColor Red
    Write-Host "Please check your PostgreSQL installation path" -ForegroundColor Yellow
    exit 1
}

Write-Host "Setting postgres user password..." -ForegroundColor Cyan
& "$PG_BIN\psql.exe" -U postgres -h localhost -c "ALTER USER postgres PASSWORD '$PG_PASSWORD';"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to set postgres password. You may need to run this as Administrator or set the password manually." -ForegroundColor Red
    exit 1
}

Write-Host "Creating posts_db database..." -ForegroundColor Cyan
& "$PG_BIN\psql.exe" -U postgres -h localhost -c "CREATE DATABASE posts_db;"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Database may already exist or there was an error creating it." -ForegroundColor Yellow
} else {
    Write-Host "Database created successfully!" -ForegroundColor Green
}

Write-Host "Loading schema..." -ForegroundColor Cyan
& "$PG_BIN\psql.exe" -U postgres -h localhost -d posts_db -f ".\data\schema.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to load schema. Please check the schema.sql file." -ForegroundColor Red
    exit 1
}

Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host "You can now run your application with: npm start" -ForegroundColor Green
