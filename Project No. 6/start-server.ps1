# Real-Time Blog Server Startup Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  🚀 Starting Real-Time Blog Server" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Yellow
Write-Host "WebSocket real-time features enabled" -ForegroundColor Yellow
Write-Host ""

# Kill any existing server on port 8000
$existingProcess = netstat -ano | findstr :8000 | ForEach-Object {
    if ($_ -match '\s+(\d+)$') {
        $matches[1]
    }
}

if ($existingProcess) {
    Write-Host "Killing existing server process (PID: $existingProcess)..." -ForegroundColor Red
    taskkill /PID $existingProcess /F | Out-Null
    Start-Sleep -Seconds 2
}

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
& node "C:\Users\micha\OneDrive\Desktop\Cursor Assignments\Project No. 6\server\server.js"

Write-Host ""
Write-Host "Server stopped." -ForegroundColor Red
Read-Host "Press Enter to exit"
