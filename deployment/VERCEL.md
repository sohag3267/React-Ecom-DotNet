# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/debuggermind)

## Manual Deployment Steps

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Configure Environment Variables

In your Vercel dashboard or via CLI:

```bash
vercel env add API_BASE_URL
vercel env add API_BASE_URL_V1
vercel env add NEXT_PUBLIC_SITE_URL
```

### 4. Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Environment Variables Setup

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable               | Description          | Example                             |
| ---------------------- | -------------------- | ----------------------------------- |
| `API_BASE_URL`         | Backend API base URL | `https://api.yourdomain.com`        |
| `API_BASE_URL_V1`      | Backend API v1 URL   | `https://api.yourdomain.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Your site URL        | `https://yourdomain.com`            |

## Custom Domain

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificates are automatically provisioned

## Continuous Deployment

Vercel automatically deploys when you push to:

- `main` branch → Production
- Other branches → Preview deployments

## Performance Optimization

- Edge Functions enabled by default
- Automatic image optimization
- Global CDN distribution
- ISR (Incremental Static Regeneration) support

## Monitoring

Access deployment logs and analytics at:

- https://vercel.com/dashboard
