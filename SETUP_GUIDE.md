# 🚀 Quick Setup Guide

## Step 1: Change Admin Password (2 minutes)

Open `assets/js/config.js` and change:

```javascript
ADMIN: {
    username: 'your_admin_username',  // Change this
    password: 'Your$ecureP@ss123'     // Change this
}
```

## Step 2: Upload Videos to Google Drive (10 minutes)

1. Go to [Google Drive](https://drive.google.com)
2. Upload your mechanic training videos
3. For each video:
   - Right-click → Get link
   - Change to "Anyone with the link"
   - Copy the link
4. Get the FILE_ID from the link:
   ```
   https://drive.google.com/file/d/FILE_ID_HERE/view
   ```

## Step 3: Update Video Links (5 minutes)

Open `data/videos.json` and replace `YOUR_DRIVE_FILE_ID_HERE` with your actual File IDs:

```json
"week1_video1": {
    "driveLink": "https://drive.google.com/file/d/1AbC2DeF3GhI4JkL5MnO6PqR7StU8VwX9/preview",
    "title": "Introduction to Automotive Mechanics",
    ...
}
```

## Step 4: Add Your Students (3 minutes)

Open `data/users.json` and add students:

```json
"ramesh123": {
    "password": "ramesh@password",
    "name": "Ramesh Kumar",
    "course": "BASIC",
    "expiry": "2025-12-31",
    "active": true,
    "email": "ramesh@example.com",
    "phone": "9876543210"
}
```

## Step 5: Deploy to GitHub Pages (5 minutes)

### Option A: GitHub Website
1. Create account on [GitHub](https://github.com)
2. Click "New repository"
3. Name it `mechanic-course`
4. Upload all project files
5. Go to Settings → Pages
6. Select branch: `main`
7. Click Save
8. ✅ Done! Site live at: `https://YOUR_USERNAME.github.io/mechanic-course/`

### Option B: GitHub Desktop
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in
3. Create new repository
4. Add all files
5. Publish to GitHub
6. Enable Pages in repository settings

## Step 6: Test Everything (5 minutes)

1. Open your site URL
2. Test student login:
   - Username: `demo_student`
   - Password: `demo123`
3. Test admin login:
   - Username: `admin`
   - Password: `Admin@123` (or your changed password)
4. Check if videos load properly

## 🎯 Total Time: ~30 minutes

---

## 📝 Important Notes

### Video Format Tips
- ✅ Use MP4 format
- ✅ Resolution: 720p or 1080p
- ✅ Keep file size under 500MB for faster loading
- ✅ Use descriptive filenames

### Course Schedule
Videos unlock based on:
- **Monday** - First video of the week
- **Thursday** - Second video of the week

Edit `unlockDate` in `videos.json` to control when videos appear.

### Student Management
To add more students later:
1. Open `data/users.json`
2. Add new entry
3. Push changes to GitHub
4. Changes reflect immediately

### Course Durations
- **Basic:** 1 month (4 weeks, 8 videos)
- **Intermediate:** 2 months (8 weeks, 16 videos)
- **Advanced:** 3 months (12 weeks, 24 videos)

---

## 🆘 Common Issues

### Videos Not Loading?
1. Check Drive link permissions (must be "Anyone with link")
2. Verify FILE_ID is correct
3. Try opening Drive link directly in browser

### Students Can't Login?
1. Check username/password in `users.json`
2. Ensure `active: true`
3. Check expiry date is in future

### Admin Panel Not Working?
1. Verify credentials in `config.js`
2. Clear browser cache
3. Use `/admin/login.html` URL

---

## 🔄 Updating Content

### Add New Video
1. Upload to Google Drive
2. Add entry to `data/videos.json`
3. Push changes to GitHub

### Extend Student Access
1. Open `data/users.json`
2. Change `expiry` date to future date
3. Push changes to GitHub

### Disable Student
1. Open `data/users.json`
2. Set `active: false`
3. Push changes to GitHub

---

## 📞 Need Help?

1. Check README.md for detailed docs
2. Review browser console for errors (F12)
3. Verify all JSON files are valid (use [JSONLint](https://jsonlint.com/))

---

**Ready to launch? Follow the steps above and you'll be live in 30 minutes!** 🚀
