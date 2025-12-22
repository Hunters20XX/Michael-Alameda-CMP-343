# Full-Stack Blog Application Deployment Script
# This script helps prepare and deploy your application

param(
    [switch]$Production,
    [switch]$Help
)

if ($Help) {
    Write-Host "Full-Stack Blog Application Deployment Script" -ForegroundColor Cyan
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1                 # Interactive deployment"
    Write-Host "  .\deploy.ps1 -Production     # Deploy to production"
    Write-Host "  .\deploy.ps1 -Help          # Show this help"
    Write-Host ""
    Write-Host "Requirements:" -ForegroundColor Yellow
    Write-Host "  - Node.js 18+"
    Write-Host "  - npm"
    Write-Host "  - Vercel CLI (will be installed if missing)"
    Write-Host "  - Vercel account"
    exit 0
}

Write-Host "🚀 Full-Stack Blog Application Deployment Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm run install-all
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Build client
Write-Host "🔨 Building client application..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Client built successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to build client: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check if vercel CLI is installed
if (-not (Test-Command "vercel")) {
    Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
    try {
        npm install -g vercel
        Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Vercel CLI: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Check if user is logged in to Vercel
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
try {
    $vercelUser = & vercel whoami 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Vercel authentication confirmed" -ForegroundColor Green
    } else {
        Write-Host "Please login to Vercel:" -ForegroundColor Yellow
        & vercel login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Vercel login failed" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    & vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel login failed" -ForegroundColor Red
        exit 1
    }
}

# Deployment logic
if ($Production) {
    Write-Host "🚀 Deploying to production..." -ForegroundColor Magenta
    & vercel --prod
    $deployResult = $LASTEXITCODE
} else {
    Write-Host ""
    Write-Host "🌐 Deployment Options:" -ForegroundColor Cyan
    Write-Host "1. Deploy to production (--prod)"
    Write-Host "2. Deploy to preview (staging)"
    Write-Host "3. Exit"
    Write-Host ""

    $choice = Read-Host "Choose deployment option (1-3)"

    switch ($choice) {
        "1" {
            Write-Host "🚀 Deploying to production..." -ForegroundColor Magenta
            & vercel --prod
            $deployResult = $LASTEXITCODE
        }
        "2" {
            Write-Host "🚀 Deploying to preview..." -ForegroundColor Magenta
            & vercel
            $deployResult = $LASTEXITCODE
        }
        "3" {
            Write-Host "👋 Exiting..." -ForegroundColor Yellow
            exit 0
        }
        default {
            Write-Host "❌ Invalid option" -ForegroundColor Red
            exit 1
        }
    }
}

if ($deployResult -eq 0) {
    Write-Host ""
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy the deployment URL from Vercel"
    Write-Host "2. Update README.md with the live URL"
    Write-Host "3. Set up your production database"
    Write-Host "4. Test all features in production"
    Write-Host "5. Set up monitoring and analytics"
    Write-Host ""
    Write-Host "📖 Don't forget to update your README.md with:" -ForegroundColor Yellow
    Write-Host "- Live deployment URL"
    Write-Host "- Any specific deployment notes"
    Write-Host "- Performance metrics"
    Write-Host ""
    Write-Host "⭐ Your full-stack application is now live!" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "🌟 Share your achievement and star the repo!" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed. Check the logs above for details." -ForegroundColor Red
    exit 1
}
