# AWS EC2 Deployment Guide

## Prerequisites

- AWS Account
- EC2 instance (Ubuntu 22.04 LTS recommended)
- SSH access to your instance
- Domain name (optional)

## Step 1: Launch EC2 Instance

1. Choose Ubuntu Server 22.04 LTS
2. Instance type: t2.medium or better (2GB+ RAM)
3. Configure security group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (3000) - Anywhere (for testing)

## Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

## Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Nginx
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2
```

## Step 4: Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/yourusername/debuggermind.git
cd debuggermind

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
nano .env.local
# Add your environment variables

# Build application
npm run build
```

## Step 5: Configure PM2

```bash
# Start application with PM2
pm2 start npm --name "debuggermind" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it provides
```

## Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/debuggermind
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/debuggermind /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Using Docker (Alternative Method)

```bash
# Build and run with Docker
docker build -t debuggermind .
docker run -d -p 3000:3000 --name debuggermind \
  -e API_BASE_URL=your-api-url \
  -e NEXT_PUBLIC_SITE_URL=your-site-url \
  debuggermind

# Or use docker-compose
docker-compose up -d
```

## Monitoring and Maintenance

```bash
# View application logs
pm2 logs debuggermind

# Monitor resources
pm2 monit

# Restart application
pm2 restart debuggermind

# Update application
git pull
npm install
npm run build
pm2 restart debuggermind
```

## Auto-Deploy with GitHub Actions

See `deployment/aws-deploy.yml` for CI/CD setup.
