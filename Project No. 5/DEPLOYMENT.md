# Deployment Guide

This guide will help you deploy the Favorite Links application to Heroku.

## Prerequisites

1. A Heroku account (sign up at https://www.heroku.com)
2. Heroku CLI installed (https://devcenter.heroku.com/articles/heroku-cli)
3. Git installed and configured
4. PostgreSQL database (Heroku will provide this)

## Step 1: Install Heroku CLI

If you haven't already, install the Heroku CLI:
- Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
- Mac: `brew tap heroku/brew && brew install heroku`
- Linux: Follow instructions at https://devcenter.heroku.com/articles/heroku-cli

## Step 2: Login to Heroku

```bash
heroku login
```

## Step 3: Create a Heroku App

```bash
heroku create your-app-name
```

Replace `your-app-name` with your desired app name (must be unique).

## Step 4: Add PostgreSQL Database

```bash
heroku addons:create heroku-postgresql:mini
```

This adds a free PostgreSQL database to your app. The `DATABASE_URL` environment variable will be automatically set.

## Step 5: Initialize Database Schema

Run the database schema on Heroku:

```bash
heroku pg:psql < database/schema.sql
```

Or if you prefer to run it interactively:

```bash
heroku pg:psql
```

Then paste the contents of `database/schema.sql` into the psql prompt.

## Step 6: Deploy to Heroku

Make sure all your changes are committed to Git:

```bash
git add .
git commit -m "Prepare for Heroku deployment"
```

Deploy to Heroku:

```bash
git push heroku main
```

(If your default branch is `master`, use `git push heroku master`)

## Step 7: Open Your App

```bash
heroku open
```

Your app should now be live!

## Alternative: Deploy via GitHub

1. Push your code to GitHub
2. In Heroku Dashboard, go to your app → Deploy tab
3. Connect your GitHub repository
4. Enable automatic deploys (optional)
5. Click "Deploy Branch"

## Environment Variables

The app automatically uses:
- `DATABASE_URL` - Set automatically by Heroku Postgres addon
- `PORT` - Set automatically by Heroku

For local development, create a `.env` file based on `.env.example`.

## Troubleshooting

### Check logs:
```bash
heroku logs --tail
```

### Run database migrations:
```bash
heroku pg:psql < database/schema.sql
```

### Check database connection:
```bash
heroku pg:info
```

### Restart the app:
```bash
heroku restart
```

## Other Deployment Options

### Render.com
1. Create account at render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Add PostgreSQL database
5. Set build command: `npm run heroku-postbuild`
6. Set start command: `npm start`

### Railway
1. Create account at railway.app
2. Create new project from GitHub
3. Add PostgreSQL service
4. Deploy automatically

### Vercel (Frontend) + Railway/Render (Backend)
- Deploy frontend to Vercel
- Deploy backend to Railway or Render
- Update frontend API URLs to point to backend URL

## Notes

- The app builds the React frontend during deployment
- Static files are served by the Express server
- Database migrations should be run after deployment
- Free tiers may have limitations (sleeping dynos, database size, etc.)

