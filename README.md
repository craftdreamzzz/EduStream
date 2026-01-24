# 🔧 Mechanic Learning Portal

A complete online learning platform for mechanic training courses with video content delivery, student management, and admin dashboard.

## ✨ Features

### For Students
- 📱 **Responsive Design** - Works on mobile, tablet, desktop, and TV
- 🎥 **Video Streaming** - Google Drive embedded video player
- 📅 **Scheduled Content** - Videos unlock on Monday and Thursday
- 📊 **Progress Tracking** - Track course completion and watched videos
- 🏆 **Course Completion** - Confetti animation on course completion
- 🔒 **Secure Access** - Username/password authentication with session management

### For Admin
- 👥 **Student Management** - Add, edit, disable, delete students
- 📹 **Video Management** - Upload, organize, and manage course videos
- 📊 **Analytics Dashboard** - View login activity and video statistics
- ⚙️ **Settings Panel** - Export data and manage system settings

### Course Structure
- **Basic Course** - 1 month duration
- **Intermediate Course** - 2 months duration
- **Advanced Course** - 3 months duration
- Videos unlock **Monday and Thursday** each week

## 🚀 Quick Start

### 1. Clone/Download Repository

```bash
git clone https://github.com/YOUR_USERNAME/mechanic-course.git
cd mechanic-course
```

### 2. Update Admin Credentials

⚠️ **IMPORTANT:** Change default admin credentials in `assets/js/config.js`:

```javascript
ADMIN: {
    username: 'admin',        // Change this!
    password: 'Admin@123'     // Change this!
}
```

### 3. Add Your Videos

1. Upload videos to **Google Drive**
2. Set sharing to "Anyone with the link"
3. Copy the shareable link
4. Update `data/videos.json` with your Drive links:

```json
"week1_video1": {
    "driveLink": "https://drive.google.com/file/d/YOUR_FILE_ID/preview",
    ...
}
```

### 4. Add Students

Update `data/users.json` with student credentials:

```json
"username": {
    "password": "password123",
    "name": "Student Name",
    "course": "BASIC",
    "expiry": "2025-07-21",
    "active": true,
    ...
}
```

### 5. Deploy to GitHub Pages

#### Method 1: GitHub Desktop
1. Create new repository on GitHub
2. Upload all files
3. Go to Settings → Pages
4. Select branch: `main`
5. Click Save
6. Your site will be live at: `https://username.github.io/mechanic-course/`

#### Method 2: Command Line
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mechanic-course.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

## 📁 Project Structure

```
mechanic-course/
├── index.html                 # Main login page
├── admin/
│   ├── index.html            # Admin dashboard
│   └── login.html            # Admin login
├── student/
│   ├── dashboard.html        # Student dashboard
│   └── player.html           # Video player
├── assets/
│   ├── css/
│   │   ├── main.css         # Global styles
│   │   └── admin.css        # Admin styles
│   └── js/
│       ├── config.js         # Configuration
│       ├── utils.js          # Utility functions
│       ├── auth.js           # Authentication
│       ├── student.js        # Student logic
│       ├── video.js          # Video player logic
│       └── admin.js          # Admin logic
└── data/
    ├── users.json            # Student database
    ├── videos.json           # Video catalog
    └── sessions.json         # Session tracking
```

## 🎯 Usage Guide

### Student Login
1. Go to `https://your-site.github.io/mechanic-course/`
2. Enter username and password
3. View dashboard with course info
4. Watch unlocked videos
5. Track progress

### Admin Access
1. Click "Admin" tab on login page
2. Enter admin credentials
3. Access admin dashboard
4. Manage students and videos
5. View analytics

## 🔐 Default Credentials

### Demo Student
- **Username:** demo_student
- **Password:** demo123

### Admin
- **Username:** admin
- **Password:** Admin@123 (⚠️ Change this immediately!)

## 📊 Data Management

### GitHub Pages Mode (Current)
- Data stored in JSON files
- Changes made in admin panel are **local only**
- To persist changes: Manually update JSON files and push to GitHub

### AWS Migration (Future)
The codebase is ready for AWS migration:
1. Set up Node.js backend (Express)
2. Use MongoDB/PostgreSQL for database
3. Implement REST API endpoints
4. Update `CONFIG.API.BASE_URL` in config.js
5. All frontend code will work without changes

## 🎨 Customization

### Change Colors
Edit `assets/css/main.css` and update gradient backgrounds:

```css
.gradient-bg {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Add More Courses
Update `assets/js/config.js`:

```javascript
COURSES: {
    EXPERT: {
        name: 'Expert Course',
        duration: 6,
        color: '#gold',
        icon: '🎖️'
    }
}
```

### Change Video Schedule
Update `CONFIG.VIDEO_DAYS` in config.js:

```javascript
VIDEO_DAYS: ['Monday', 'Wednesday', 'Friday']
```

## 🛡️ Security Features

- ✅ Session management with auto-logout
- ✅ Password-protected access
- ✅ Admin-only routes
- ✅ Right-click disabled on video player
- ✅ Anti-screen recording warnings
- ✅ Activity tracking and logging

⚠️ **Note:** Videos can still be screen-recorded. Focus on value delivery rather than DRM.

## 📱 Supported Devices

- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile phones (iOS, Android)
- ✅ Tablets (iPad, Android tablets)
- ✅ Smart TVs with web browsers
- ✅ Landscape and portrait modes

## 🐛 Troubleshooting

### Videos Not Loading?
1. Check Google Drive link is correct
2. Ensure Drive file is set to "Anyone with link"
3. Check browser console for errors
4. Try different browser

### Login Not Working?
1. Check username/password in `data/users.json`
2. Clear browser cache
3. Check browser console for errors

### Admin Panel Not Accessible?
1. Verify admin credentials in `config.js`
2. Use admin login page: `/admin/login.html`
3. Check browser console

## 📈 Future Enhancements

Planned features for AWS version:
- [ ] Real-time database updates
- [ ] Email notifications
- [ ] Payment integration
- [ ] Certificate generation
- [ ] Live chat support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

## 💰 Cost Breakdown

### GitHub Pages (Free)
- ✅ Hosting: FREE
- ✅ SSL Certificate: FREE
- ✅ Custom Domain: ~$12/year (optional)
- ✅ Google Drive: 15GB FREE

### AWS Migration (When Needed)
- S3 Storage: ~$0.023/GB/month
- CloudFront CDN: ~$0.085/GB transfer
- EC2 Server: ~$3.50/month (t3.micro)
- MongoDB Atlas: FREE tier available
- **Estimated:** $10-20/month for 50-100 students

## 📞 Support

For issues or questions:
1. Check documentation
2. Review browser console errors
3. Check GitHub Issues

## 📄 License

This project is licensed under the MIT License.

## 🎓 Credits

Developed for mechanic training courses with focus on accessibility and ease of use.

---

**Made with ❤️ for mechanics learning to master their craft**

🔧 Happy Learning! 🔧
