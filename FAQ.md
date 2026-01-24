# ❓ Frequently Asked Questions (FAQ)

Common questions and troubleshooting guide for Mechanic Learning Portal.

---

## 🎥 Video Related

### Q: Why are my videos not loading?

**A:** Check these steps:
1. Verify Google Drive link permissions are set to "Anyone with the link"
2. Ensure you're using the correct file ID in `videos.json`
3. Test the Drive link directly in a browser
4. Check if video format is supported (MP4 recommended)
5. Clear browser cache and try again

### Q: Can students download the videos?

**A:** While we disable right-click and show warnings, students CAN technically screen-record videos. This is a limitation of web-based video players. Focus on:
- Providing value that students won't want to share
- Building trust with your students
- Offering additional benefits for enrolled students

### Q: Videos are loading slowly. How to fix?

**A:** 
1. Compress videos before uploading (use HandBrake)
2. Use 720p instead of 1080p for faster loading
3. Keep file size under 500MB
4. Consider AWS S3 + CloudFront for production

### Q: How to add subtitles to videos?

**A:** 
1. Upload video to YouTube (as unlisted)
2. Add subtitles in YouTube Studio
3. Embed YouTube video instead of Drive
4. Or use subtitle files (.srt) with HTML5 video player (AWS version)

---

## 👥 Student Management

### Q: How do I add a new student?

**A:** 
1. Open `data/users.json`
2. Add new entry:
```json
"new_username": {
    "password": "password123",
    "name": "Student Name",
    "course": "BASIC",
    "expiry": "2025-12-31",
    "active": true,
    "email": "email@example.com",
    "phone": "1234567890",
    "videosWatched": [],
    "progress": 0
}
```
3. Push changes to GitHub (if using GitHub Pages)

### Q: Student forgot their password. How to reset?

**A:**
1. Open `data/users.json`
2. Change the `password` field for that user
3. Send new password to student securely
4. Push changes to GitHub

### Q: How to extend student access?

**A:**
1. Open `data/users.json`
2. Update `expiry` date to future date
3. Push changes to GitHub

### Q: How to disable a student temporarily?

**A:**
1. Open `data/users.json`
2. Set `active: false` for that student
3. To re-enable, set `active: true`

---

## 🛡️ Admin Panel

### Q: I forgot admin password. How to reset?

**A:**
1. Open `assets/js/config.js`
2. Change the password in ADMIN object:
```javascript
ADMIN: {
    username: 'admin',
    password: 'NewPassword123'
}
```
3. Push changes to GitHub

### Q: Admin panel is not accessible

**A:**
1. Verify you're using correct URL: `your-site.com/admin/login.html`
2. Check credentials in `config.js`
3. Clear browser cache
4. Try incognito/private mode
5. Check browser console for errors (F12)

### Q: Can I have multiple admins?

**A:** 
In current version (GitHub Pages), only one admin is supported.
For AWS version, you can implement role-based access with multiple admins.

### Q: Changes in admin panel are not saving

**A:**
This is expected in GitHub Pages mode. Admin panel shows local changes only.
To persist changes:
1. Use admin panel to see what needs updating
2. Manually update JSON files
3. Push changes to GitHub

---

## 📅 Schedule & Timing

### Q: How to change video unlock schedule?

**A:**
1. Open `assets/js/config.js`
2. Modify `VIDEO_DAYS`:
```javascript
VIDEO_DAYS: ['Monday', 'Wednesday', 'Friday']
```

### Q: Can I unlock all videos at once?

**A:**
Yes, set all `unlockDate` values to past dates in `videos.json`:
```json
"unlockDate": "2025-01-01"
```

### Q: How to set different unlock times for different courses?

**A:**
Edit individual video entries in `videos.json` with specific dates:
```json
"week1_video1": {
    "unlockDate": "2025-02-01",  // Basic course
    ...
},
"week5_video1": {
    "unlockDate": "2025-03-01",  // Intermediate
    ...
}
```

---

## 💻 Technical Issues

### Q: Website not loading at all

**A:**
1. Check if GitHub Pages is enabled in repository settings
2. Verify repository is public
3. Wait 5-10 minutes after enabling Pages
4. Check for typos in URL
5. Try different browser

### Q: Getting 404 errors

**A:**
1. Verify file structure is correct
2. Check for typos in HTML file names
3. Ensure all files are pushed to GitHub
4. Check repository Settings → Pages is enabled

### Q: Videos show "Failed to load"

**A:**
1. Verify Drive links are correct
2. Check Drive file permissions
3. Test link in incognito mode
4. Ensure file ID is correct

### Q: Login not working

**A:**
1. Verify username/password in `users.json`
2. Check for extra spaces in credentials
3. Clear browser cache
4. Try different browser
5. Check browser console for errors

### Q: Session keeps expiring

**A:**
Default session timeout is 30 minutes. To change:
1. Open `assets/js/config.js`
2. Modify `SESSION_TIMEOUT`:
```javascript
SESSION_TIMEOUT: 60 * 60 * 1000, // 60 minutes
```

---

## 📱 Mobile & Devices

### Q: Not working on mobile phones

**A:**
The site is fully responsive. If issues occur:
1. Clear mobile browser cache
2. Try different browser (Chrome, Safari, Firefox)
3. Ensure JavaScript is enabled
4. Update browser to latest version

### Q: Videos not playing on iPhone/iPad

**A:**
1. Ensure Drive links are correct
2. Try Safari browser
3. Check iOS version (update if needed)
4. Some video codecs may not be supported - use MP4 H.264

### Q: Can students watch on TV?

**A:**
Yes! Students can:
1. Cast from phone/tablet to TV
2. Use TV's built-in browser
3. Use HDMI cable from laptop to TV
4. Use streaming devices (Chromecast, Fire Stick)

---

## 🔐 Security

### Q: Is the platform secure?

**A:**
Basic security is implemented:
- Password-protected access
- Session management
- HTTPS (via GitHub Pages)
- Activity logging

For production, consider:
- Stronger password requirements
- 2-factor authentication
- Database encryption
- Regular security audits

### Q: Can videos be downloaded?

**A:**
While we have anti-download measures, determined users can screen-record. 
Best practice: Focus on value delivery, not DRM.

### Q: How to prevent account sharing?

**A:**
In current version, hard to prevent completely.
For AWS version, implement:
- IP tracking
- Device fingerprinting
- Concurrent session limits
- Activity monitoring

---

## 💰 Costs & Scaling

### Q: Is this completely free?

**A:**
**GitHub Pages mode:**
- Hosting: FREE
- Google Drive: 15GB FREE (enough for ~30 videos)
- Total: $0/month

**Costs if scaling:**
- Custom domain: ~$12/year (optional)
- More Drive storage: $2/month for 100GB
- AWS hosting: $10-20/month (when you need it)

### Q: How many students can I support?

**A:**
**GitHub Pages:**
- Recommended: 2-50 students
- Max theoretical: 100+ students

**AWS:**
- 1000+ students easily
- Scale infinitely

### Q: When should I migrate to AWS?

**A:**
Migrate when you have:
- 50+ active students
- Need real-time features
- Want automated workflows
- Require better analytics
- Need better video delivery

---

## 🎨 Customization

### Q: How to change colors/theme?

**A:**
Edit `assets/css/main.css`:
```css
.gradient-bg {
    background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR 100%);
}
```

### Q: How to add logo?

**A:**
1. Add logo image to `assets/images/`
2. Update HTML files to reference:
```html
<img src="../assets/images/logo.png" alt="Logo">
```

### Q: Can I translate to other languages?

**A:**
Yes, but requires manual translation of all text in:
- HTML files
- JavaScript strings
- JSON data

For production, implement i18n library.

### Q: How to add more course levels?

**A:**
Edit `assets/js/config.js`:
```javascript
COURSES: {
    EXPERT: {
        name: 'Expert Course',
        duration: 6,
        color: '#gold',
        icon: '🏆'
    }
}
```

---

## 📊 Analytics & Tracking

### Q: How to see student activity?

**A:**
Check admin panel → Analytics tab for:
- Recent logins
- Video views
- Completion rates

### Q: How to export student data?

**A:**
Admin panel → Settings → Export Data
Downloads JSON with all data.

### Q: Can I integrate Google Analytics?

**A:**
Yes! Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🆘 Still Need Help?

1. **Check browser console** (F12) for error messages
2. **Verify JSON files** are valid using [JSONLint](https://jsonlint.com/)
3. **Test in incognito mode** to rule out cache issues
4. **Review documentation** in README.md
5. **Check GitHub Issues** for similar problems

---

## 📚 Additional Resources

- [Google Drive Help](https://support.google.com/drive)
- [GitHub Pages Docs](https://docs.github.com/pages)
- [HTML5 Video Guide](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [JSON Tutorial](https://www.w3schools.com/js/js_json_intro.asp)

---

**Can't find your question? Check the README.md or DEPLOYMENT.md files!** 📖
