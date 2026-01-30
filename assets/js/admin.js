// Admin Dashboard Module

const AdminDashboard = {
    students: [],
    videos: [],
    stats: {},
    settings: null,

    async init() {
        await this.loadAllData();
        this.updateStats();
        this.displayStudents();
        this.displayVideos();
        this.loadAnalytics();
        await this.loadSettings();
    },

    async loadAllData() {
        try {
            Utils.showLoader(true);
            
            this.students = await API.getStudents();
            this.videos = await API.getVideos();
            // Convert all thumbnail URLs
            this.videos = this.videos.map(video => ({
                ...video,
                thumbnail: Utils.convertGDriveUrl(video.thumbnail)
            }));
            this.stats = await API.getAnalytics('stats');
            
            Utils.showLoader(false);
        } catch (error) {
            Utils.showLoader(false);
            console.error('Error loading data:', error);
            Utils.showToast('Error loading data', 'error');
        }
    },

    async loadSettings() {
        try {
            this.settings = await API.getSettings();
            this.displaySettings();
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    },

    displaySettings() {
        if (!this.settings) return;

        const settingsContainer = document.getElementById('settingsContainer');
        if (!settingsContainer) return;

        settingsContainer.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-3">Portal Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">App Name</label>
                            <input type="text" id="settingAppName" value="${this.settings.appName}" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Tagline</label>
                            <input type="text" id="settingTagline" value="${this.settings.tagline}" class="form-input">
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-3">Contact Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">Artist Name</label>
                            <input type="text" id="settingArtistName" value="${this.settings.artistName}" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">WhatsApp Number</label>
                            <input type="text" id="settingWhatsapp" value="${this.settings.whatsapp}" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Email</label>
                            <input type="email" id="settingEmail" value="${this.settings.email}" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Address</label>
                            <input type="text" id="settingAddress" value="${this.settings.contactAddress}" class="form-input">
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-3">Media Links (Google Drive URLs)</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="form-label">Logo URL</label>
                            <input type="url" id="settingLogo" value="${this.settings.logo}" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Instagram QR Code URL</label>
                            <input type="url" id="settingInstagramQR" value="${this.settings.instagramQR}" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">YouTube QR Code URL</label>
                            <input type="url" id="settingYoutubeQR" value="${this.settings.youtubeQR}" class="form-input">
                        </div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button onclick="AdminDashboard.saveSettings()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
                        💾 Save Settings
                    </button>
                </div>
            </div>
        `;
    },

    async saveSettings() {
        try {
            const updatedSettings = {
                appName: document.getElementById('settingAppName').value,
                tagline: document.getElementById('settingTagline').value,
                artistName: document.getElementById('settingArtistName').value,
                whatsapp: document.getElementById('settingWhatsapp').value,
                email: document.getElementById('settingEmail').value,
                contactAddress: document.getElementById('settingAddress').value,
                logo: document.getElementById('settingLogo').value,
                instagramQR: document.getElementById('settingInstagramQR').value,
                youtubeQR: document.getElementById('settingYoutubeQR').value
            };

            await API.updateSettings(updatedSettings);
            Utils.showToast('Settings saved successfully!', 'success');
        } catch (error) {
            Utils.showToast('Failed to save settings', 'error');
        }
    },

    updateStats() {
        document.getElementById('totalStudents').textContent = this.stats.totalStudents || 0;
        document.getElementById('activeStudents').textContent = this.stats.activeStudents || 0;
        document.getElementById('totalVideos').textContent = this.stats.totalVideos || 0;
        document.getElementById('totalViews').textContent = this.stats.totalViews || 0;
    },

    displayStudents() {
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';

        if (this.students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        <p class="text-xl mb-2">No students found</p>
                        <button onclick="showAddStudentModal()" class="text-blue-600 hover:underline">
                            Add your first student
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        this.students.forEach(student => {
            const row = document.createElement('tr');
            const isExpired = Utils.isDatePassed(student.expiry);
            const status = !student.active ? 'inactive' : isExpired ? 'expired' : 'active';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-semibold text-gray-900">${student.name}</div>
                    <div class="text-sm text-gray-500">${student.email || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <code class="text-sm bg-gray-100 px-2 py-1 rounded">${student.username}</code>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge badge-info">${CONFIG.COURSES[student.course]?.name || student.course}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    ${Utils.formatDate(student.expiry)}
                    ${isExpired ? '<br><span class="text-red-600 font-semibold">Expired</span>' : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-${status}">${status.toUpperCase()}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button 
                        onclick="editStudent('${student.username}')"
                        class="action-btn action-btn-edit"
                    >
                        ✏️ Edit
                    </button>
                    <button 
                        onclick="toggleStudent('${student.username}')"
                        class="action-btn action-btn-toggle"
                    >
                        ${student.active ? '⏸️ Disable' : '▶️ Enable'}
                    </button>
                    <button 
                        onclick="deleteStudent('${student.username}')"
                        class="action-btn action-btn-delete"
                    >
                        🗑️ Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    displayVideos() {
        const grid = document.getElementById('videosGrid');
        grid.innerHTML = '';

        if (this.videos.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-500">
                    <p class="text-xl mb-4">No videos found</p>
                    <button onclick="showAddVideoModal()" class="text-blue-600 hover:underline">
                        Add your first video
                    </button>
                </div>
            `;
            return;
        }

        this.videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';

            // Convert Google Drive URL before displaying
            const thumbnailUrl = Utils.convertGDriveUrl(video.thumbnail);
            
            card.innerHTML = `
                <img 
                    src="${thumbnailUrl}"" 
                    alt="${video.title}" 
                    class="w-full h-32 object-cover rounded-lg bg-gray-200"
                    onerror="this.src='https://placehold.co/640x360/8b5cf6/FFF/png?text=Video+Thumbnail'"
                >
                <div class="p-4">
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="badge badge-info">Week ${video.week}</span>
                        <span class="badge badge-success">${video.day}</span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">${video.title}</h3>
                    <p class="text-sm text-gray-600 mb-3">${video.description.substring(0, 80)}...</p>
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>📅 ${Utils.formatDate(video.unlockDate)}</span>
                        <span>👁️ ${video.viewed || 0} views</span>
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            onclick="editVideo('${video._id}')"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded font-semibold text-sm transition-all"
                        >
                            ✏️ Edit
                        </button>
                        <button 
                            onclick="deleteVideo('${video._id}')"
                            class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded font-semibold text-sm transition-all"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    async loadAnalytics() {
        try {
            const logins = await API.getAnalytics('logins');
            const views = await API.getAnalytics('views');

            // Display recent logins
            const loginsList = document.getElementById('recentLoginsList');
            if (logins.length === 0) {
                loginsList.innerHTML = '<p class="text-gray-500 text-sm">No login activity yet</p>';
            } else {
                loginsList.innerHTML = logins.map(session => `
                    <div class="activity-item">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-semibold text-sm">${session.username}</p>
                                <p class="text-xs text-gray-500">${session.role} • ${session.device}</p>
                            </div>
                            <div class="text-xs text-gray-500">
                                ${Utils.formatDateTime(session.timestamp)}
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            // Display recent views
            const viewsList = document.getElementById('recentViewsList');
            if (views.length === 0) {
                viewsList.innerHTML = '<p class="text-gray-500 text-sm">No video views yet</p>';
            } else {
                viewsList.innerHTML = views.map(view => {
                    const video = this.videos.find(v => v._id === view.videoId);
                    return `
                        <div class="activity-item">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-semibold text-sm">${video?.title || 'Unknown Video'}</p>
                                    <p class="text-xs text-gray-500">${view.username} • ${view.device}</p>
                                </div>
                                <div class="text-xs text-gray-500">
                                    ${Utils.formatDateTime(view.timestamp)}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }
};

// Student Management Functions
async function showAddStudentModal() {
    const modal = createModal('Add New Student', `
        <form id="addStudentForm" class="space-y-4">
            <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" name="name" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">Username *</label>
                <input type="text" name="username" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">Password *</label>
                <input type="text" name="password" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" name="phone" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Course *</label>
                <select name="course" class="form-select" required>
                    <option value="BASIC">Basic Course (1 month)</option>
                    <option value="INTERMEDIATE">Intermediate Course (2 months)</option>
                    <option value="PROFESSIONAL">Professional Course (3 months)</option>
                    <option value="BASIC_INTERMEDIATE">Basic + Intermediate (3 months)</option>
                    <option value="BASIC_PROFESSIONAL">Basic + Professional (4 months)</option>
                    <option value="INTERMEDIATE_PROFESSIONAL">Intermediate + Professional (5 months)</option>
                    <option value="ALL">All Courses - Complete Package (6 months)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Expiry Date *</label>
                <input type="date" name="expiry" class="form-input" required>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-300 rounded-lg font-semibold hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
                    Add Student
                </button>
            </div>
        </form>
    `);

    document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const studentData = Object.fromEntries(formData);
        
        try {
            await API.createStudent(studentData);
            Utils.showToast('Student added successfully!', 'success');
            await AdminDashboard.loadAllData();
            AdminDashboard.displayStudents();
            AdminDashboard.updateStats();
            closeModal();
        } catch (error) {
            Utils.showToast(error.message, 'error');
        }
    });
}

async function editStudent(username) {
    const student = AdminDashboard.students.find(s => s.username === username);
    if (!student) return;

    const modal = createModal('Edit Student', `
        <form id="editStudentForm" class="space-y-4">
            <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" name="name" value="${student.name}" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" value="${student.email || ''}" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" name="phone" value="${student.phone || ''}" class="form-input">
            </div>
            <div class="form-group">
                <select name="course" class="form-select" required>
                    <option value="BASIC" ${student.course === 'BASIC' ? 'selected' : ''}>Basic Course (1 month)</option>
                    <option value="INTERMEDIATE" ${student.course === 'INTERMEDIATE' ? 'selected' : ''}>Intermediate Course (2 months)</option>
                    <option value="PROFESSIONAL" ${student.course === 'PROFESSIONAL' ? 'selected' : ''}>Professional Course (3 months)</option>
                    <option value="BASIC_INTERMEDIATE" ${student.course === 'BASIC_INTERMEDIATE' ? 'selected' : ''}>Basic + Intermediate (3 months)</option>
                    <option value="BASIC_PROFESSIONAL" ${student.course === 'BASIC_PROFESSIONAL' ? 'selected' : ''}>Basic + Professional (4 months)</option>
                    <option value="INTERMEDIATE_PROFESSIONAL" ${student.course === 'INTERMEDIATE_PROFESSIONAL' ? 'selected' : ''}>Intermediate + Professional (5 months)</option>
                    <option value="ALL" ${student.course === 'ALL' ? 'selected' : ''}>All Courses - Complete Package (6 months)</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Expiry Date *</label>
                <input type="date" name="expiry" value="${student.expiry}" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">New Password (leave blank to keep current)</label>
                <input type="text" name="password" class="form-input" placeholder="Enter new password">
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-300 rounded-lg font-semibold hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                    Update Student
                </button>
            </div>
        </form>
    `);

    document.getElementById('editStudentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = Object.fromEntries(formData);
        
        // Remove password if empty
        if (!updates.password) {
            delete updates.password;
        }
        
        try {
            await API.updateStudent(username, updates);
            Utils.showToast('Student updated successfully!', 'success');
            await AdminDashboard.loadAllData();
            AdminDashboard.displayStudents();
            closeModal();
        } catch (error) {
            Utils.showToast(error.message, 'error');
        }
    });
}

async function toggleStudent(username) {
    const student = AdminDashboard.students.find(s => s.username === username);
    if (!student) return;

    try {
        await API.updateStudent(username, { active: !student.active });
        Utils.showToast(`Student ${!student.active ? 'enabled' : 'disabled'}`, 'success');
        await AdminDashboard.loadAllData();
        AdminDashboard.displayStudents();
    } catch (error) {
        Utils.showToast('Failed to toggle student status', 'error');
    }
}

async function deleteStudent(username) {
    const student = AdminDashboard.students.find(s => s.username === username);
    if (!student) return;

    if (confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
        try {
            await API.deleteStudent(username);
            Utils.showToast('Student deleted successfully', 'success');
            await AdminDashboard.loadAllData();
            AdminDashboard.displayStudents();
            AdminDashboard.updateStats();
        } catch (error) {
            Utils.showToast('Failed to delete student', 'error');
        }
    }
}

// Video Management Functions
function showAddVideoModal() {
    const modal = createModal('Add New Video', `
        <form id="addVideoForm" class="space-y-4">
            <div class="form-group">
                <label class="form-label">Video Title *</label>
                <input type="text" name="title" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description *</label>
                <textarea name="description" class="form-input" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Google Drive Link *</label>
                <input type="url" name="driveLink" class="form-input" placeholder="https://drive.google.com/file/d/..." required>
                <p class="text-xs text-gray-500 mt-1">Upload video to Google Drive first and paste the shareable link</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                    <label class="form-label">Week *</label>
                    <input type="number" name="week" class="form-input" min="1" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Day *</label>
                    <select name="day" class="form-select" required>
                        <option value="Monday">Monday</option>
                        <option value="Thursday">Thursday</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                    <label class="form-label">Unlock Date *</label>
                    <input type="date" name="unlockDate" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Duration *</label>
                    <input type="text" name="duration" class="form-input" placeholder="45 mins" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Course Level *</label>
                <select name="course" class="form-select" required>
                    <option value="BASIC">Basic</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="PROFESSIONAL">Professional</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Thumbnail URL</label>
                <input type="url" name="thumbnail" class="form-input" placeholder="https://drive.google.com/...">
                <p class="text-xs text-gray-500 mt-1">Optional: Upload thumbnail to Google Drive</p>
            </div>
            <div class="form-group">
                <label class="form-label">Notes (Optional)</label>
                <textarea name="notes" class="form-input" rows="2"></textarea>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-300 rounded-lg font-semibold hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" class="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                    Add Video
                </button>
            </div>
        </form>
    `);

    document.getElementById('addVideoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const videoData = Object.fromEntries(formData);
        
        // Generate ID
        videoData._id = `week${videoData.week}_video_${Utils.generateId()}`;
        videoData.week = parseInt(videoData.week);

        // Default thumbnail if not provided
        if (!videoData.thumbnail) {
            videoData.thumbnail = `https://placehold.co/640x360/8b5cf6/FFF/png?text=Week+${videoData.week}`;
        } else {
            // Auto-fix Google Drive URLs
            videoData.thumbnail = Utils.convertGDriveUrl(videoData.thumbnail);
            console.log('Converted thumbnail URL:', videoData.thumbnail);
        }

        try {
            await API.createVideo(videoData);
            Utils.showToast('Video added successfully!', 'success');
            await AdminDashboard.loadAllData();
            AdminDashboard.displayVideos();
            AdminDashboard.updateStats();
            closeModal();
        } catch (error) {
            Utils.showToast(error.message, 'error');
        }
    });
}

function editVideo(videoId) {
    const video = AdminDashboard.videos.find(v => v._id === videoId);
    if (!video) return;

    const modal = createModal('Edit Video', `
        <form id="editVideoForm" class="space-y-4">
            <div class="form-group">
                <label class="form-label">Video Title *</label>
                <input type="text" name="title" value="${video.title}" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description *</label>
                <textarea name="description" class="form-input" rows="3" required>${video.description}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Google Drive Link *</label>
                <input type="url" name="driveLink" value="${video.driveLink}" class="form-input" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                    <label class="form-label">Week *</label>
                    <input type="number" name="week" value="${video.week}" class="form-input" min="1" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Day *</label>
                    <select name="day" class="form-select" required>
                        <option value="Monday" ${video.day === 'Monday' ? 'selected' : ''}>Monday</option>
                        <option value="Thursday" ${video.day === 'Thursday' ? 'selected' : ''}>Thursday</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                    <label class="form-label">Unlock Date *</label>
                    <input type="date" name="unlockDate" value="${video.unlockDate}" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Duration *</label>
                    <input type="text" name="duration" value="${video.duration}" class="form-input" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Course Level *</label>
                <select name="course" class="form-select" required>
                    <option value="BASIC" ${video.course === 'BASIC' ? 'selected' : ''}>Basic Level</option>
                    <option value="INTERMEDIATE" ${video.course === 'INTERMEDIATE' ? 'selected' : ''}>Intermediate Level</option>
                    <option value="PROFESSIONAL" ${video.course === 'PROFESSIONAL' ? 'selected' : ''}>Professional Level</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Thumbnail URL</label>
                <input type="url" name="thumbnail" value="${video.thumbnail}" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Notes</label>
                <textarea name="notes" class="form-input" rows="2">${video.notes || ''}</textarea>
            </div>
            <div class="flex justify-end space-x-3">
                <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-300 rounded-lg font-semibold hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                    Update Video
                </button>
            </div>
        </form>
    `);

    document.getElementById('editVideoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = Object.fromEntries(formData);
        updates.week = parseInt(updates.week);

        // Auto-fix Google Drive URLs
        if (updates.thumbnail) {
            updates.thumbnail = Utils.convertGDriveUrl(updates.thumbnail);
        }

        try {
            await API.call(CONFIG.API.ENDPOINTS.VIDEOS, 'PUT', { videoId, updates });
            Utils.showToast('Video updated successfully!', 'success');
            await AdminDashboard.loadAllData();
            AdminDashboard.displayVideos();
            closeModal();
        } catch (error) {
            Utils.showToast(error.message, 'error');
        }
    });
}

async function deleteVideo(videoId) {
    const video = AdminDashboard.videos.find(v => v._id === videoId);
    if (!video) return;

    if (confirm(`Are you sure you want to delete "${video.title}"? This action cannot be undone.`)) {
        try {
            await API.call(CONFIG.API.ENDPOINTS.VIDEOS, 'DELETE', { videoId });
            Utils.showToast('Video deleted successfully', 'success');
            await AdminDashboard.loadAllData();
            AdminDashboard.displayVideos();
            AdminDashboard.updateStats();
        } catch (error) {
            Utils.showToast('Failed to delete video', 'error');
        }
    }
}

// Settings Functions
function exportData() {
    const data = {
        students: AdminDashboard.students,
        videos: AdminDashboard.videos,
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `craftdreamzzz-backup-${Date.now()}.json`;
    a.click();
    
    Utils.showToast('Data exported successfully', 'success');
}

function clearCache() {
    if (confirm('This will clear all cached data. Are you sure?')) {
        localStorage.clear();
        Utils.showToast('Cache cleared', 'success');
        setTimeout(() => location.reload(), 1000);
    }
}

// Modal Utilities
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.className = 'fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full modal-content p-6 animate-slideUp">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-2xl font-bold text-gray-800">${title}</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function closeModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.remove();
    }
}

// Tab Switching
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`${tab}Tab`).classList.remove('hidden');
    document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
}