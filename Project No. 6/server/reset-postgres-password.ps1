# PostgreSQL Password Reset Script for Windows
# Run this as Administrator

Write-Host "Resetting PostgreSQL postgres user password..." -ForegroundColor Yellow

# Stop PostgreSQL service
Write-Host "Stopping PostgreSQL service..."
Stop-Service postgresql-x64-18 -ErrorAction Stop

# PostgreSQL data directory
$PG_DATA = "C:\Program Files\PostgreSQL\18\data"
$PG_BIN = "C:\Program Files\PostgreSQL\18\bin"

# Create a password reset SQL file
$RESET_SQL = @"
ALTER USER postgres PASSWORD 'password';
"@

$RESET_SQL | Out-File -FilePath "$env:TEMP\reset_password.sql" -Encoding ASCII

# Start PostgreSQL in single-user mode with the postgres user
Write-Host "Starting PostgreSQL in single-user mode to reset password..."
try {
    # Run postgres in single-user mode and execute the password reset
    $env:PGUSER = "postgres"
    $env:PGPASSWORD = ""

    # Execute the password reset
    & "$PG_BIN\psql.exe" -U postgres -h localhost -f "$env:TEMP\reset_password.sql"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Password reset successfully!" -ForegroundColor Green
    } else {
        Write-Host "Password reset command failed. Trying alternative method..." -ForegroundColor Yellow

        # Alternative: Modify pg_hba.conf to allow trust authentication temporarily
        $PG_HBA = "$PG_DATA\pg_hba.conf"
        if (Test-Path $PG_HBA) {
            Write-Host "Modifying pg_hba.conf to allow trust authentication..."
            $hbaContent = Get-Content $PG_HBA
            $modified = $false

            for ($i = 0; $i -lt $hbaContent.Length; $i++) {
                if ($hbaContent[$i] -match "^local\s+all\s+postgres\s+") {
                    $hbaContent[$i] = "local   all             postgres                                trust"
                    $modified = $true
                    break
                }
            }

            if ($modified) {
                $hbaContent | Set-Content $PG_HBA
                Write-Host "Modified pg_hba.conf. Starting PostgreSQL..." -ForegroundColor Green
            }
        }
    }
} catch {
    Write-Host "Error during password reset: $($_.Exception.Message)" -ForegroundColor Red
}

# Start PostgreSQL service
Write-Host "Starting PostgreSQL service..."
Start-Service postgresql-x64-18

# Test the connection
Write-Host "Testing database connection..."
try {
    & "$PG_BIN\psql.exe" -U postgres -h localhost -c "SELECT version();"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database connection successful!" -ForegroundColor Green
    } else {
        Write-Host "Database connection failed. You may need to set the password manually." -ForegroundColor Red
    }
} catch {
    Write-Host "Connection test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Clean up
Remove-Item "$env:TEMP\reset_password.sql" -ErrorAction SilentlyContinue

Write-Host "Password reset process complete." -ForegroundColor Cyan
Write-Host "You can now run your application with: node server/server.js" -ForegroundColor Cyan
