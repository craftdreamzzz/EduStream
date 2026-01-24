# CraftDreamzzz Learning Portal 🎨

A complete online learning platform for Henna Design training courses with video content delivery, student management, and admin dashboard.

## ✨ Features

### For Students

- 🎨 **Henna Design Courses** - Basic,Intermediate and Professional levels
- 📱 **Mobile Friendly** - Works perfectly on all devices
- 🎥 **Video Streaming** - Google Drive embedded video player
- 📅 **Scheduled Content** - Videos unlock on Monday and Thursday
- 📊 **Progress Tracking** - Track course completion and watched videos
- 🏆 **Course Completion** - Achievement celebrations
- 🔒 **Secure Access** - Username/password authentication

### For Admin

- 👥 **Student Management** - Full CRUD operations
- 📹 **Video Management** - Upload, organize, and manage course videos
- 📊 **Analytics Dashboard** - View login activity and video statistics
- ⚙️ **Settings Panel** - Customize portal content, contact info, and branding
- 💾 **Data Export** - Backup all data

## 🚀 Tech Stack

- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: MongoDB Atlas
- **Hosting**: Vercel + GitHub Pages
- **Video Storage**: Google Drive

## 📁 Project Structure

```
craftdreamzzz-portal/
├── api/                    # Vercel serverless functions
│   ├── auth.js            # Authentication
│   ├── students.js        # Student management
│   ├── videos.js          # Video management
│   ├── analytics.js       # Analytics tracking
│   ├── settings.js        # Portal settings
│   └── db.js              # MongoDB connection
├── admin/
│   ├── index.html         # Admin dashboard
│   └── login.html         # Admin login
├── student/
│   ├── dashboard.html     # Student dashboard
│   └── player.html        # Video player
├── assets/
│   ├── css/
│   │   ├── main.css       # Global styles
│   │   └── admin.css      # Admin styles
│   └── js/
│       ├── config.js      # Configuration
│       ├── utils.js       # Utility functions
│       ├── auth.js        # Authentication logic
│       ├── student.js     # Student dashboard logic
│       ├── video.js       # Video player logic
│       └── admin.js       # Admin dashboard logic
├── .env                   # Environment variables (NOT COMMITTED)
├── .gitignore
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## 🔧 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/craftdreamzzz-portal.git
cd craftdreamzzz-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup MongoDB Atlas

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free M0)
3. Get connection string
4. Update `.env` file

### 4. Setup Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`

### 5. Configure Environment Variables in Vercel

```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
```

## 🔐 Security

- Passwords are hashed with bcrypt
- Admin credentials stored as environment variables
- MongoDB connection string secured
- Session management with timeout
- Input validation on all endpoints

## 📧 Contact

- **Email**: craftdreamzzz@gmail.com
- **Phone**: +91 82774 14796
- **Artist**: Lavanya
- **Location**: Hebri, Udupi, Karnataka

## 📝 License

© 2026 CraftDreamzzz. All rights reserved.
