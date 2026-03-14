# Railway Deployment Guide

## Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/debuggermind)

## Manual Deployment Steps

### 1. Install Railway CLI

```bash
npm i -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Initialize Project

```bash
railway init
```

### 4. Set Environment Variables

```bash
railway variables set API_BASE_URL=https://api.yourdomain.com
railway variables set API_BASE_URL_V1=https://api.yourdomain.com/api/v1
railway variables set NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 5. Deploy

```bash
railway up
```

## Environment Variables

Set these in Railway Dashboard → Variables:

```env
API_BASE_URL=https://api.yourdomain.com
API_BASE_URL_V1=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

## Custom Domain

1. Go to Railway Dashboard → Settings
2. Click "Generate Domain" for free railway.app subdomain
3. Or add custom domain in "Custom Domains" section
4. Update your DNS records

## Auto-Deploy

Railway automatically deploys when you push to connected Git repository.

## Monitoring

- View logs: `railway logs`
- Check metrics in Railway Dashboard
- Set up alerts for downtime

## Scaling

Railway auto-scales based on traffic. Configure in:

- Dashboard → Settings → Resources
