# Deployment Guide - CodeBasics Frontend

This guide covers building and deploying the CodeBasics frontend application to various environments.

---

## 🏗️ Build Process

### Production Build

**Command**:
```bash
npm run build
```

**What Happens**:
1. TypeScript compilation (`tsc -b`)
2. Vite bundling and minification
3. Asset optimization
4. Output to `dist/` directory

**Build Output**:
```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js      # App bundle
│   ├── vendor-[hash].js     # Vendor code
│   └── [name]-[hash].css    # Stylesheets
└── vite.svg            # Static assets
```

### Build Optimization

The build includes:
- ✅ Code minification
- ✅ Tree-shaking unused code
- ✅ CSS minification
- ✅ Asset compression
- ✅ Source maps (optional)

---

## 🚀 Deployment Platforms

### 1. Vercel Deployment

**Recommended** for best performance and zero-config deployment.

#### Setup via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Setup via GitHub

1. Connect repository to Vercel
2. Vercel auto-detects Vite project
3. Configure environment variables
4. Auto-deployments on push

#### Vercel Configuration

**File**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": {
      "default": "https://api.codebasics.com"
    }
  }
}
```

#### Environment Variables

Set in Vercel Dashboard:

```
VITE_API_URL=https://api.codebasics.com
VITE_ENABLE_TEACHER_DASHBOARD=true
VITE_ENABLE_ANALYTICS=true
```

#### Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x

---

### 2. Docker Deployment

#### Dockerfile

**File**: `Dockerfile`

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

**File**: `nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # SPA routing: redirect all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### Build and Run Docker Image

```bash
# Build image
docker build -t codebasics-frontend .

# Run container
docker run -p 3000:80 codebasics-frontend

# Access at http://localhost:3000
```

#### Docker Compose

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:5000
    depends_on:
      - backend
    networks:
      - codebasics

  backend:
    image: codebasics-backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/codebasics
    depends_on:
      - mongo
    networks:
      - codebasics

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - codebasics

volumes:
  mongo-data:

networks:
  codebasics:
```

Start services:

```bash
docker-compose up -d
```

---

### 3. Traditional Server Deployment

#### Deploy to Linux Server (Ubuntu)

**Prerequisites**:
- Ubuntu 20.04+
- Node.js 18+
- Nginx web server

**Steps**:

```bash
# 1. SSH into server
ssh user@server.com

# 2. Clone repository
cd /opt
git clone https://github.com/your-org/codebasics-frontend.git
cd codebasics-frontend

# 3. Install dependencies
npm ci

# 4. Build application
npm run build

# 5. Configure nginx
sudo cp nginx.conf /etc/nginx/sites-available/codebasics
sudo ln -s /etc/nginx/sites-available/codebasics /etc/nginx/sites-enabled/

# 6. Test nginx config
sudo nginx -t

# 7. Restart nginx
sudo systemctl restart nginx
```

#### Nginx Virtual Host

**File**: `/etc/nginx/sites-available/codebasics`

```nginx
server {
    listen 80;
    server_name codebasics.com www.codebasics.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name codebasics.com www.codebasics.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/codebasics.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/codebasics.com/privkey.pem;

    # Root directory
    root /opt/codebasics-frontend/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Request certificate
sudo certbot certonly --nginx -d codebasics.com -d www.codebasics.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

### 4. AWS Deployment

#### S3 + CloudFront

**Setup**:

```bash
# 1. Create S3 bucket
aws s3 mb s3://codebasics-frontend

# 2. Build application
npm run build

# 3. Upload to S3
aws s3 sync dist/ s3://codebasics-frontend --delete

# 4. Create CloudFront distribution (via AWS Console)
```

**S3 Bucket Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::codebasics-frontend/*"
    }
  ]
}
```

#### AWS Amplify

**Setup via CLI**:

```bash
# Install Amplify CLI
npm i -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

---

## 🔧 Environment Configuration

### Environment Variables by Environment

#### Development
```env
VITE_API_URL=http://localhost:5000
VITE_ENABLE_TEACHER_DASHBOARD=true
VITE_ENABLE_ANALYTICS=false
```

#### Staging
```env
VITE_API_URL=https://staging-api.codebasics.com
VITE_ENABLE_TEACHER_DASHBOARD=true
VITE_ENABLE_ANALYTICS=true
```

#### Production
```env
VITE_API_URL=https://api.codebasics.com
VITE_ENABLE_TEACHER_DASHBOARD=true
VITE_ENABLE_ANALYTICS=true
```

### Build with Environment

```bash
# Build for staging
VITE_API_URL=https://staging-api.codebasics.com npm run build

# Build for production
VITE_API_URL=https://api.codebasics.com npm run build
```

---

## 📊 Performance Optimization

### HTTP/2 Server Push

```nginx
location = /index.html {
    add_header Link "</assets/main-[hash].js>; rel=preload; as=script" always;
    add_header Link "</assets/style-[hash].css>; rel=preload; as=style" always;
}
```

### Compression

Enable Brotli or gzip:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_comp_level 6;
gzip_vary on;
```

### Caching Headers

```nginx
# Long-term caching for static assets
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# No caching for index.html
location = /index.html {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## 🔐 Security Headers

### Nginx Security Headers

```nginx
# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:" always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Enable XSS protection
add_header X-XSS-Protection "1; mode=block" always;

# Prevent clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 🚨 Error Handling

### 404 Error Page

**Nginx Configuration**:

```nginx
error_page 404 /index.html;
```

This ensures SPA routing works correctly (all non-matching routes redirect to index.html).

### Error Monitoring

Recommended tools:
- **Sentry** - Error tracking
- **Rollbar** - Error monitoring
- **New Relic** - Performance monitoring

---

## 📈 Monitoring & Analytics

### Setup Monitoring

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})
```

### Google Analytics

```typescript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🔄 Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test build locally with `npm run preview`
- [ ] Run linting: `npm run lint`
- [ ] Environment variables configured correctly
- [ ] API URL points to correct backend
- [ ] HTTPS enabled on production
- [ ] Security headers configured
- [ ] Caching headers optimized
- [ ] Error tracking setup
- [ ] Monitoring/analytics configured
- [ ] CDN/caching enabled
- [ ] Load testing completed
- [ ] Backup and rollback plan in place

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.PROD_API_URL }}

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          prod: true
```

---

## 🆘 Troubleshooting Deployment

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Blank Page on Deployment

- Check browser console for errors
- Verify `VITE_API_URL` environment variable
- Check SPA routing configuration (404 → index.html)
- Verify CSP headers allow resources

### Slow Page Load

- Enable gzip compression
- Configure caching headers
- Minimize bundle size (see SCALABILITY_REPORT.md)
- Use CDN for static assets

### CORS Errors

- Verify backend `Access-Control-Allow-Origin` header
- Check `withCredentials: true` in axios
- Review API endpoint configuration

---

## 📚 Next Steps

1. **Monitoring**: Set up error tracking and analytics
2. **Performance**: Review [SCALABILITY_REPORT.md](./SCALABILITY_REPORT.md)
3. **Security**: Review [SECURITY_REPORT.md](./SECURITY_REPORT.md)

---

**Last Updated**: May 27, 2026  
**Version**: 1.0.0
