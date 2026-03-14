# Generic VPS Deployment Guide

This guide explains how to deploy the application to any Virtual Private Server (VPS) running Linux (Ubuntu/Debian recommended). This applies to providers like:

- DigitalOcean (Droplets)
- AWS (EC2)
- Linode
- Vultr
- Google Cloud Compute Engine
- Hetzner

## Prerequisites

1. **A VPS Instance**:
   - OS: Ubuntu 20.04 LTS or 22.04 LTS (Recommended)
   - RAM: Minimum 2GB (Next.js build process can be memory intensive)
   - CPU: 1 vCPU or more
2. **Domain Name** (Optional but recommended): Pointed to your VPS IP address.
3. **SSH Access**: You should be able to `ssh root@your-ip`.

---

## Method 1: Docker Deployment (Recommended)

This is the easiest and most consistent way to deploy.

### 1. Prepare the Server

SSH into your server and install Docker:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install -y docker-compose-plugin
```

### 2. Transfer Files

You don't need the entire source code, just the deployment files. However, cloning the repo is often easiest.

**Option A: Git Clone (Easiest)**

```bash
# Install Git
sudo apt install -y git

# Clone your repository
git clone https://github.com/yourusername/elite-store-client.git
cd elite-store-client
```

**Option B: SCP (If code is local only)**

```bash
# Run this from your LOCAL machine
scp -r ./* root@your-vps-ip:/var/www/elite-store-client
```

### 3. Configure Environment

Create the production environment file:

```bash
cd elite-store-client
cp .env.example .env.production
nano .env.production
```

Edit the file with your production values:

```env
API_BASE_URL=https://api.yourdomain.com
API_BASE_URL_V1=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

### 4. Build and Run

```bash
# Build and start the container in detached mode
docker compose -f docker-compose.yml up -d --build
```

Your app is now running on port 3000!

### 5. Setup Nginx (Reverse Proxy)

To serve on port 80/443 and use your domain:

```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/elite-store
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/elite-store /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL Certificate (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Method 2: Manual Deployment (Node.js + PM2)

Use this if you want to run directly on the metal without Docker.

### 1. Install Node.js

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v
npm -v
```

### 2. Install PM2

PM2 is a process manager to keep your app running.

```bash
sudo npm install -g pm2
```

### 3. Clone and Install

```bash
git clone https://github.com/yourusername/elite-store-client.git
cd elite-store-client

# Install dependencies
npm install --legacy-peer-deps
```

### 4. Configure Environment

```bash
cp .env.example .env.production
nano .env.production
# Add your production variables
```

### 5. Build

```bash
npm run build
```

### 6. Start Application

```bash
# Start with PM2
pm2 start npm --name "elite-store" -- start

# Save process list so it restarts on reboot
pm2 save
pm2 startup
```

### 7. Nginx & SSL

Follow steps 5 and 6 from the Docker method above to set up Nginx and SSL.

---

## Updating Your Deployment

### Docker Method

```bash
cd elite-store-client
git pull
docker compose -f docker-compose.yml up -d --build
```

### PM2 Method

```bash
cd elite-store-client
git pull
npm install --legacy-peer-deps
npm run build
pm2 restart elite-store
```
