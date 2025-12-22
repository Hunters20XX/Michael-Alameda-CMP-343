# Create Blog Database with New User (Easier Alternative)
# Run this as Administrator

Write-Host "Creating blog database with new user..." -ForegroundColor Green

$PG_BIN = "C:\Program Files\PostgreSQL\18\bin"

# Check if we can connect as postgres (if password was set before)
$canConnectAsPostgres = $false
try {
    & "$PG_BIN\psql.exe" -U postgres -h localhost -c "SELECT 1;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        $canConnectAsPostgres = $true
        Write-Host "Can connect as postgres user." -ForegroundColor Green
    }
} catch {
    Write-Host "Cannot connect as postgres. Will try alternative methods." -ForegroundColor Yellow
}

if ($canConnectAsPostgres) {
    Write-Host "Creating blog user and database..." -ForegroundColor Cyan

    # Create user and database
    & "$PG_BIN\psql.exe" -U postgres -h localhost -c "CREATE USER IF NOT EXISTS bloguser WITH PASSWORD 'blogpass';"
    & "$PG_BIN\psql.exe" -U postgres -h localhost -c "ALTER USER bloguser CREATEDB;"
    & "$PG_BIN\psql.exe" -U postgres -h localhost -c "CREATE DATABASE IF NOT EXISTS posts_db OWNER bloguser;"

    # Update config to use new user
    $configPath = ".\config\database.env"
    $configContent = Get-Content $configPath
    $configContent = $configContent -replace "DB_USER=postgres", "DB_USER=bloguser"
    $configContent = $configContent -replace "DB_PASSWORD=password", "DB_PASSWORD=blogpass"
    $configContent | Set-Content $configPath

    Write-Host "Updated database configuration to use bloguser." -ForegroundColor Green
} else {
    Write-Host "Trying to modify pg_hba.conf for trust authentication..." -ForegroundColor Yellow

    # Modify pg_hba.conf to allow trust authentication for local connections
    $PG_DATA = "C:\Program Files\PostgreSQL\18\data"
    $PG_HBA = "$PG_DATA\pg_hba.conf"

    if (Test-Path $PG_HBA) {
        $hbaContent = Get-Content $PG_HBA
        $modified = $false

        # Add trust authentication for local connections
        $trustLine = "local   all             all                                     trust"
        if ($hbaContent -notcontains $trustLine) {
            # Insert after the first comment block
            for ($i = 0; $i -lt $hbaContent.Length; $i++) {
                if ($hbaContent[$i] -match "^# " -and $i -lt $hbaContent.Length - 1) {
                    if ($hbaContent[$i + 1] -match "^local") {
                        $hbaContent = $hbaContent[0..$i] + $trustLine + $hbaContent[($i+1)..($hbaContent.Length-1)]
                        $modified = $true
                        break
                    }
                }
            }
        }

        if ($modified) {
            $hbaContent | Set-Content $PG_HBA
            Write-Host "Modified pg_hba.conf to allow trust authentication." -ForegroundColor Green

            # Restart PostgreSQL service
            Write-Host "Restarting PostgreSQL service..."
            Restart-Service postgresql-x64-18

            # Now try to create user and database
            Write-Host "Creating blog user and database..."
            & "$PG_BIN\psql.exe" -U postgres -h localhost -c "CREATE USER IF NOT EXISTS bloguser WITH PASSWORD 'blogpass';"
            & "$PG_BIN\psql.exe" -U postgres -h localhost -c "ALTER USER bloguser CREATEDB;"
            & "$PG_BIN\psql.exe" -U postgres -h localhost -c "CREATE DATABASE IF NOT EXISTS posts_db OWNER bloguser;"

            # Update config to use new user
            $configPath = ".\config\database.env"
            $configContent = Get-Content $configPath
            $configContent = $configContent -replace "DB_USER=postgres", "DB_USER=bloguser"
            $configContent = $configContent -replace "DB_PASSWORD=password", "DB_PASSWORD=blogpass"
            $configContent | Set-Content $configPath

            Write-Host "Updated database configuration." -ForegroundColor Green
        } else {
            Write-Host "Could not modify pg_hba.conf. Please check PostgreSQL installation." -ForegroundColor Red
        }
    } else {
        Write-Host "Could not find pg_hba.conf file. Please check PostgreSQL installation." -ForegroundColor Red
    }
}

# Test the connection
Write-Host "Testing database connection..."
try {
    & "$PG_BIN\psql.exe" -U bloguser -h localhost -d posts_db -c "SELECT version();"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database connection successful!" -ForegroundColor Green
        Write-Host "You can now run: node server/server.js" -ForegroundColor Green
    } else {
        Write-Host "Database connection failed." -ForegroundColor Red
    }
} catch {
    Write-Host "Connection test failed: $($_.Exception.Message)" -ForegroundColor Red
}
