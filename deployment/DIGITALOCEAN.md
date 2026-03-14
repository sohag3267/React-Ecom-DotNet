# DigitalOcean App Platform Deployment

## Quick Deploy

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/yourusername/debuggermind)

## Manual Steps

### 1. Create App

1. Go to DigitalOcean Control Panel
2. Click "Create" → "Apps"
3. Connect your GitHub repository
4. Select `debuggermind` repository

### 2. Configure Build Settings

- **Build Command**: `npm run build`
- **Run Command**: `npm start`
- **HTTP Port**: 3000
- **Environment**: Node.js

### 3. Environment Variables

Add in App Settings:

```
API_BASE_URL=https://api.yourdomain.com
API_BASE_URL_V1=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

### 4. Deploy

Click "Create Resources" to deploy.

## App Spec (app.yaml)

```yaml
name: debuggermind
services:
  - name: web
    github:
      repo: yourusername/debuggermind
      branch: main
      deploy_on_push: true
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xs
    http_port: 3000
    routes:
      - path: /
    envs:
      - key: API_BASE_URL
        value: ${API_BASE_URL}
      - key: API_BASE_URL_V1
        value: ${API_BASE_URL_V1}
      - key: NEXT_PUBLIC_SITE_URL
        value: ${NEXT_PUBLIC_SITE_URL}
      - key: NODE_ENV
        value: production
```

## Using DigitalOcean Droplet

See `deployment/DROPLET.md` for VPS deployment.
