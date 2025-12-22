# 🚀 Deployment Guide

This guide covers deploying your full-stack blog application to Vercel with PostgreSQL.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Choose one of these options:
   - Vercel Postgres (recommended)
   - Supabase
   - Railway
   - AWS RDS
   - Any PostgreSQL provider

## Vercel Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### 2. Prepare Your Project
```bash
# Make sure you're in the project root
cd full-stack-blog-application

# Install all dependencies
npm run install-all

# Test the build locally
npm run build
```

### 3. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard → Storage → Create Database → Postgres
2. Copy the connection string
3. In Vercel project settings, add environment variables:
   ```
   POSTGRES_URL=your_connection_string
   DB_HOST=extracted_from_connection_string
   DB_PORT=5432
   DB_NAME=extracted_from_connection_string
   DB_USER=extracted_from_connection_string
   DB_PASSWORD=extracted_from_connection_string
   ```

#### Option B: External PostgreSQL
1. Create database on your chosen provider
2. Get connection credentials
3. Add to Vercel environment variables as shown above

### 4. Deploy to Vercel
```bash
# Deploy (will prompt for configuration)
vercel

# Or deploy directly to production
vercel --prod
```

### 5. Environment Variables

Add these to your Vercel project (Project Settings → Environment Variables):

**Required:**
```
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_username
DB_PASSWORD=your_db_password
NODE_ENV=production
```

**Optional:**
```
VERCEL_URL=your-deployment-url.vercel.app
```

### 6. Database Migration

After deployment, run database setup:
```bash
# Connect to your production database
psql "your_connection_string" -f server/schema.sql
```

## Troubleshooting

### Build Errors
```bash
# Check build logs in Vercel dashboard
vercel logs

# Test build locally
npm run build
```

### Database Connection Issues
```bash
# Test connection string format
# Should be: postgresql://user:password@host:port/database

# Check firewall settings
# Ensure database allows connections from 0.0.0.0/0
```

### Environment Variables
```bash
# Make sure variables are set in Vercel dashboard
# Redeploy after adding new variables
vercel --prod
```

## Alternative Deployment Options

### Render
1. Connect GitHub repo
2. Choose "Web Service"
3. Build Command: `npm run build`
4. Start Command: `npm run start`
5. Add environment variables

### Railway
1. Connect GitHub repo
2. Add PostgreSQL database
3. Variables auto-configured
4. Deploy automatically

### Netlify + Railway/Render
1. Deploy frontend to Netlify
2. Deploy backend to Railway/Render
3. Update API_BASE_URL in frontend

## Performance Optimization

### Vercel-Specific Optimizations
- Enable Vercel Analytics
- Set up proper caching headers
- Use Vercel Postgres for low latency

### Database Optimizations
- Enable connection pooling
- Add database indexes for frequent queries
- Monitor query performance

### Monitoring
- Check Vercel function logs
- Monitor database performance
- Set up error tracking (Sentry, LogRocket)

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Database connections work
- [ ] API endpoints respond correctly
- [ ] Frontend-backend communication works
- [ ] Environment variables are set
- [ ] Domain is configured (optional)
- [ ] SSL certificate is active
- [ ] Performance is acceptable
- [ ] Error handling works properly

## Common Issues & Solutions

### "Cannot connect to database"
- Check connection string format
- Verify credentials
- Ensure database allows external connections

### "Build failed"
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for syntax errors

### "Functions timeout"
- Optimize database queries
- Add proper error handling
- Consider query optimization

---

🎉 **Congratulations on your successful deployment!**

Update your README.md with the live deployment URL and share your achievement!
