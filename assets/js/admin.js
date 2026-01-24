// Admin Dashboard Module

const AdminDashboard = {
    students: {},
    videos: {},
    sessions: [],
    views: [],

    async init() {
        await this.loadAllData();
        this.updateStats();
        this.displayStudents();
        this.displayVideos();
        this.loadAnalytics();
        this.loadSettings();
    },

    async loadAllData() {
        try {
            Utils.showLoader(true);
            
            // Load all data files
            this.students = await Utils.loadJSON('../data/users.json') || {};
            this.videos = await Utils.loadJSON('../data/videos.json') || {};
            this.sessions = Utils.getStorage('login_sessions') || [];
            this.views = Utils.getStorage('video_views') || [];
            
            Utils.showLoader(false);
        } catch (error) {
            Utils.showLoader(false);
            console.error('Error loading data:', error);
            Utils.showToast('Error loading data', 'error');
        }
    },

    updateStats() {
        // Total students
        const totalStudents = Object.keys(this.students).length;
        document.getElementById('totalStudents').textContent = totalStudents;

        // Active students
        const activeStudents = Object.values(this.students).filter(s => 
            s.active && !Utils.isDatePassed(s.expiry)
        ).length;
        document.getElementById('activeStudents').textContent = activeStudents;

        // Total videos
        document.getElementById('totalVideos').textContent = Object.keys(this.videos).length;

        // Total views
        document.getElementById('totalViews').textContent = this.views.length;
    },

    displayStudents() {
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';

        if (Object.keys(this.students).length === 0) {
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

        Object.entries(this.students).forEach(([username, student]) => {
            const row = document.createElement('tr');
            const isExpired = Utils.isDatePassed(student.expiry);
            const status = !student.active ? 'inactive' : isExpired ? 'expired' : 'active';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-semibold text-gray-900">${student.name}</div>
                    <div class="text-sm text-gray-500">${student.email || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <code class="text-sm bg-gray-100 px-2 py-1 rounded">${username}</code>
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
                        onclick="editStudent('${username}')"
                        class="action-btn action-btn-edit"
                    >
                        ✏️ Edit
                    </button>
                    <button 
                        onclick="toggleStudent('${username}')"
                        class="action-btn action-btn-toggle"
                    >
                        ${student.active ? '⏸️ Disable' : '▶️ Enable'}
                    </button>
                    <button 
                        onclick="deleteStudent('${username}')"
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

        if (Object.keys(this.videos).length === 0) {
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

        Object.entries(this.videos).forEach(([id, video]) => {
            const card = document.createElement('div');
            card.className = 'video-card';
            
            const views = this.views.filter(v => v.videoId === id).length;
            
            card.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}" class="video-card-thumbnail">
                <div class="p-4">
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="badge badge-info">Week ${video.week}</span>
                        <span class="badge badge-success">${video.day}</span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">${video.title}</h3>
                    <p class="text-sm text-gray-600 mb-3">${video.description.substring(0, 80)}...</p>
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>📅 ${Utils.formatDate(video.unlockDate)}</span>
                        <span>👁️ ${views} views</span>
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            onclick="editVideo('${id}')"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded font-semibold text-sm transition-all"
                        >
                            ✏️ Edit
                        </button>
                        <button 
                            onclick="deleteVideo('${id}')"
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

    loadAnalytics() {
        // Recent Logins
        const loginsList = document.getElementById('recentLoginsList');
        const recentLogins = this.sessions.slice(-10).reverse();

        if (recentLogins.length === 0) {
            loginsList.innerHTML = '<p class="text-gray-500 text-sm">No login activity yet</p>';
            return;
        }

        loginsList.innerHTML = recentLogins.map(session => `
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

        // Recent Views
        const viewsList = document.getElementById('recentViewsList');
        const recentViews = this.views.slice(-10).reverse();

        if (recentViews.length === 0) {
            viewsList.innerHTML = '<p class="text-gray-500 text-sm">No video views yet</p>';
            return;
        }

        viewsList.innerHTML = recentViews.map(view => {
            const video = this.videos[view.videoId];
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
    },

    loadSettings() {
        document.getElementById('appVersion').textContent = CONFIG.VERSION;
        document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
    }
};

// Tab Switching
function switchTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tab}Tab`).classList.remove('hidden');
    document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
}

// Student Management Functions
function showAddStudentModal() {
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
                    <option value="ADVANCED">Advanced Course (3 months)</option>
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

    document.getElementById('addStudentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const studentData = Object.fromEntries(formData);
        
        // Add to students object
        AdminDashboard.students[studentData.username] = {
            ...studentData,
            active: true,
            joinDate: new Date().toISOString().split('T')[0],
            videosWatched: [],
            progress: 0
        };

        Utils.showToast('Student added! (Note: Changes are stored locally in GitHub mode)', 'success');
        AdminDashboard.displayStudents();
        AdminDashboard.updateStats();
        closeModal();
    });
}

function editStudent(username) {
    const student = AdminDashboard.students[username];
    // Implementation similar to addStudent but with existing data
    Utils.showToast('Edit feature - update data in users.json file', 'info');
}

function toggleStudent(username) {
    AdminDashboard.students[username].active = !AdminDashboard.students[username].active;
    Utils.showToast(`Student ${AdminDashboard.students[username].active ? 'enabled' : 'disabled'}`, 'success');
    AdminDashboard.displayStudents();
    AdminDashboard.updateStats();
}

function deleteStudent(username) {
    if (confirm(`Are you sure you want to delete ${AdminDashboard.students[username].name}?`)) {
        delete AdminDashboard.students[username];
        Utils.showToast('Student deleted', 'success');
        AdminDashboard.displayStudents();
        AdminDashboard.updateStats();
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
                    <option value="ADVANCED">Advanced</option>
                </select>
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

    document.getElementById('addVideoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const videoData = Object.fromEntries(formData);
        
        const videoId = `week${videoData.week}_video_${Utils.generateId()}`;
        
        AdminDashboard.videos[videoId] = {
            ...videoData,
            week: parseInt(videoData.week),
            thumbnail: `https://via.placeholder.com/640x360/667eea/ffffff?text=Week+${videoData.week}`,
            viewed: 0
        };

        Utils.showToast('Video added! (Note: Changes are stored locally in GitHub mode)', 'success');
        AdminDashboard.displayVideos();
        AdminDashboard.updateStats();
        closeModal();
    });
}

function editVideo(videoId) {
    Utils.showToast('Edit feature - update data in videos.json file', 'info');
}

function deleteVideo(videoId) {
    if (confirm('Are you sure you want to delete this video?')) {
        delete AdminDashboard.videos[videoId];
        Utils.showToast('Video deleted', 'success');
        AdminDashboard.displayVideos();
        AdminDashboard.updateStats();
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
    a.download = `mehandi-portal-backup-${Date.now()}.json`;
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
