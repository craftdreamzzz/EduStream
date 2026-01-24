# 🚀 Deployment Guide

Complete guide for deploying Mechanic Learning Portal to GitHub Pages (Free) and AWS (Production).

---

## 📦 Option 1: GitHub Pages (FREE - Recommended for Start)

### Prerequisites
- GitHub account (free)
- Git installed (optional, can use GitHub web interface)

### Step-by-Step Deployment

#### Method A: Using GitHub Web Interface (Easiest)

1. **Create Repository**
   - Go to [GitHub](https://github.com)
   - Click "+" → "New repository"
   - Name: `mechanic-course`
   - Set to Public
   - Click "Create repository"

2. **Upload Files**
   - Click "uploading an existing file"
   - Drag and drop ALL project files
   - Write commit message: "Initial commit"
   - Click "Commit changes"

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Click "Pages" in sidebar
   - Source: Select "main" branch
   - Click "Save"
   - Wait 2-3 minutes

4. **Access Your Site**
   - URL will be: `https://YOUR_USERNAME.github.io/mechanic-course/`
   - Copy this URL and share with students

#### Method B: Using Git Command Line

```bash
# Navigate to project folder
cd mechanic-course

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/mechanic-course.git

# Push to GitHub
git push -u origin main
```

Then enable Pages in repository settings.

#### Method C: Using GitHub Desktop

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in to GitHub
3. Click "Add" → "Add Existing Repository"
4. Select your project folder
5. Click "Publish repository"
6. Enable Pages in web settings

### ✅ Verification

Test your deployment:
1. Open `https://YOUR_USERNAME.github.io/mechanic-course/`
2. Login with demo credentials
3. Check if videos load (may need Drive links)
4. Test admin panel

### 🔄 Updating Content

When you make changes:

```bash
git add .
git commit -m "Updated videos/students"
git push
```

Changes go live in 1-2 minutes.

### 🎯 GitHub Pages Limitations

**Pros:**
- ✅ Completely FREE
- ✅ Unlimited bandwidth
- ✅ SSL certificate included
- ✅ Fast CDN delivery
- ✅ Easy to update

**Cons:**
- ❌ Data stored in JSON files only
- ❌ No real-time database
- ❌ Manual updates required
- ❌ 100 GB soft bandwidth limit/month
- ❌ Changes require git push

**Best For:** 2-50 students, testing, MVP

---

## 🏢 Option 2: AWS Deployment (Production-Ready)

### Architecture Overview

```
User → CloudFront CDN
      ↓
    S3 (Frontend) + API Gateway
      ↓
    Lambda Functions / EC2
      ↓
    MongoDB Atlas / RDS
      ↓
    S3 (Video Storage)
```

### Prerequisites
- AWS Account
- Node.js installed
- Basic terminal knowledge

### Cost Estimate (50-100 students)
- S3 Storage: $1-2/month
- CloudFront: $3-5/month
- EC2 t3.micro: $3.50/month
- MongoDB Atlas: Free tier
- **Total: ~$10-15/month**

### Step 1: Setup AWS Account

1. Go to [AWS Console](https://aws.amazon.com)
2. Create account (requires credit card)
3. Complete verification

### Step 2: Deploy Frontend to S3

```bash
# Install AWS CLI
# Mac: brew install awscli
# Windows: Download from AWS website

# Configure AWS
aws configure
# Enter: Access Key, Secret Key, Region (ap-south-1 for India)

# Create S3 bucket
aws s3 mb s3://mechanic-learning-portal

# Upload files
aws s3 sync . s3://mechanic-learning-portal --exclude ".git/*"

# Enable static website hosting
aws s3 website s3://mechanic-learning-portal --index-document index.html

# Make public (careful!)
aws s3api put-bucket-policy --bucket mechanic-learning-portal --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::mechanic-learning-portal/*"
  }]
}'
```

### Step 3: Setup CloudFront (CDN)

1. Go to CloudFront in AWS Console
2. Create distribution
3. Origin: Select your S3 bucket
4. Default cache behavior: Allow GET, HEAD
5. Create distribution
6. Wait 15-20 minutes for deployment
7. Note the CloudFront URL (e.g., `d1234.cloudfront.net`)

### Step 4: Setup Backend (Node.js + Express)

Create backend structure:

```
backend/
├── server.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   └── videos.js
├── models/
│   ├── User.js
│   └── Video.js
└── package.json
```

**server.js:**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/videos', require('./routes/videos'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Step 5: Setup MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 Free tier)
4. Add database user
5. Whitelist IP: 0.0.0.0/0 (all IPs)
6. Get connection string
7. Update in backend

### Step 6: Deploy Backend to EC2

```bash
# Launch EC2 instance
# AMI: Ubuntu Server 22.04
# Type: t3.micro (free tier)
# Storage: 8GB

# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your backend code
git clone your-backend-repo
cd backend

# Install dependencies
npm install

# Install PM2 (process manager)
sudo npm install -g pm2

# Start server
pm2 start server.js
pm2 startup
pm2 save

# Install Nginx
sudo apt update
sudo apt install nginx

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/default
```

**Nginx Config:**
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
    }
}
```

```bash
# Restart Nginx
sudo systemctl restart nginx

# Get SSL certificate (free)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Step 7: Setup Video Storage on S3

```bash
# Create S3 bucket for videos
aws s3 mb s3://mechanic-videos-storage

# Upload videos
aws s3 cp week1_video1.mp4 s3://mechanic-videos-storage/videos/

# Generate signed URLs in backend
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

function getSignedUrl(key) {
    return s3.getSignedUrl('getObject', {
        Bucket: 'mechanic-videos-storage',
        Key: key,
        Expires: 3600 // 1 hour
    });
}
```

### Step 8: Update Frontend Config

Edit `assets/js/config.js`:

```javascript
API: {
    BASE_URL: 'https://your-domain.com/api',
    ENDPOINTS: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        VIDEOS: '/videos',
        USERS: '/users'
    }
}
```

### Step 9: Setup Domain (Optional)

1. Buy domain from Namecheap/GoDaddy (~$12/year)
2. Point DNS to CloudFront:
   - Type: CNAME
   - Name: www
   - Value: d1234.cloudfront.net

---

## 🔒 Security Checklist

### For GitHub Pages:
- [ ] Change default admin password
- [ ] Use strong student passwords
- [ ] Don't commit sensitive data
- [ ] Enable 2FA on GitHub account

### For AWS:
- [ ] Enable MFA on AWS account
- [ ] Use IAM roles (not root credentials)
- [ ] Encrypt data at rest (S3)
- [ ] Use HTTPS only (CloudFront + SSL)
- [ ] Implement rate limiting
- [ ] Set up CloudWatch alarms
- [ ] Regular security patches
- [ ] Database backups enabled

---

## 📊 Monitoring & Maintenance

### GitHub Pages:
- Monitor via GitHub Insights
- Check browser console for errors
- Manual updates only

### AWS:
```bash
# Setup CloudWatch monitoring
# CPU usage alerts
# Bandwidth alerts
# Error rate alerts

# Setup automated backups
aws backup create-backup-plan ...

# Setup auto-scaling (optional)
aws autoscaling create-auto-scaling-group ...

# Regular updates
sudo apt update && sudo apt upgrade
pm2 update
```

---

## 🔄 Migration Path: GitHub → AWS

When ready to migrate:

1. **Export data**
   ```javascript
   // Use admin panel "Export Data" button
   // Downloads JSON with all students/videos
   ```

2. **Import to AWS**
   ```javascript
   // Run migration script
   node scripts/migrate-data.js
   ```

3. **Update DNS**
   - Point domain to AWS instead of GitHub
   - Test thoroughly
   - Monitor for issues

4. **Decommission GitHub**
   - Archive repository
   - Keep as backup

---

## 💰 Cost Comparison

| Feature | GitHub Pages | AWS |
|---------|-------------|-----|
| Hosting | FREE | $3-5/month |
| Database | JSON files | $0-10/month |
| Videos | Google Drive FREE | $2-5/month |
| SSL | FREE | FREE (Let's Encrypt) |
| Updates | Manual | Automated |
| Scalability | Limited | Unlimited |
| **Total** | **$0/month** | **$10-20/month** |

---

## 🎯 Recommendation

**Start with GitHub Pages:**
- Perfect for 2-20 students
- Zero cost
- Easy to manage
- Learn the system

**Migrate to AWS when:**
- 50+ students
- Need real-time features
- Require automated workflows
- Want professional deployment

---

## 📞 Support

For deployment issues:
- GitHub Pages: Check [GitHub Status](https://www.githubstatus.com/)
- AWS: Check [AWS Service Health](https://status.aws.amazon.com/)

**Good luck with your deployment!** 🚀
