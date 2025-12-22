#!/bin/bash

# Full-Stack Blog Application Deployment Script
# This script helps prepare and deploy your application

echo "🚀 Full-Stack Blog Application Deployment Script"
echo "================================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Build client
echo "🔨 Building client application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build client"
    exit 1
fi

echo "✅ Client built successfully"

# Check if vercel CLI is installed
if ! command_exists vercel; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel

    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI"
        exit 1
    fi
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "Please login to Vercel:"
    vercel login

    if [ $? -ne 0 ]; then
        echo "❌ Vercel login failed"
        exit 1
    fi
fi

echo "✅ Vercel authentication confirmed"

# Deploy options
echo ""
echo "🌐 Deployment Options:"
echo "1. Deploy to production (--prod)"
echo "2. Deploy to preview (staging)"
echo "3. Exit"

read -p "Choose deployment option (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to production..."
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to preview..."
        vercel
        ;;
    3)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Copy the deployment URL from Vercel"
    echo "2. Update README.md with the live URL"
    echo "3. Set up your production database"
    echo "4. Test all features in production"
    echo "5. Set up monitoring and analytics"
    echo ""
    echo "📖 Don't forget to update your README.md with:"
    echo "- Live deployment URL"
    echo "- Any specific deployment notes"
    echo "- Performance metrics"
    echo ""
    echo "⭐ Your full-stack application is now live!"
else
    echo "❌ Deployment failed. Check the logs above for details."
    exit 1
fi
