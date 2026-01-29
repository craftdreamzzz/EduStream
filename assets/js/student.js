// Student Dashboard Module

const StudentDashboard = {
    currentUser: null,
    allVideos: [],
    userVideos: [],
    currentFilter: 'all',
    settings: null,

    async init(user) {
        this.currentUser = user;
        
        // Load settings first
        await this.loadSettings();
        
        // Update welcome message
        document.getElementById('welcomeText').textContent = `Welcome, ${user.name}!`;
        
        // Load videos
        await this.loadVideos();
        
        // Update dashboard
        this.updateDashboard();
        this.displayVideos();
    },

    async loadSettings() {
        try {
            this.settings = await API.getSettings();
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    },

    async loadVideos() {
        try {
            const allVideos = await API.getVideos();
            
            if (!allVideos || allVideos.length === 0) {
                console.error('No videos found');
                return;
            }

            // Filter videos for user's course
            this.userVideos = allVideos
                .filter(video => {
                    // Get student's access levels from their enrolled course
                    const studentAccess = CONFIG.COURSES[this.currentUser.course]?.access || [];
                    // Check if student has access to this video's course level
                    return studentAccess.includes(video.course);
                })
                .map(video => ({
                    ...video,
                    isUnlocked: this.isVideoUnlocked(video)
                }))
                .sort((a, b) => a.week - b.week || new Date(a.unlockDate) - new Date(b.unlockDate));

            this.allVideos = this.userVideos;

        } catch (error) {
            console.error('Error loading videos:', error);
            this.userVideos = [];
        }
    },

    isVideoUnlocked(video) {
        const unlockDate = new Date(video.unlockDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return unlockDate <= today;
    },

    updateDashboard() {
        // Course Info
        const course = CONFIG.COURSES[this.currentUser.course];
        if (course) {
            document.getElementById('courseIcon').textContent = course.icon;
            document.getElementById('courseName').textContent = course.name;
            document.getElementById('courseDuration').textContent = `Duration: ${course.duration} month${course.duration > 1 ? 's' : ''}`;
        }

        // Validity Info
        const expiryDate = new Date(this.currentUser.expiry);
        const today = new Date();
        const daysRemaining = Utils.getDaysDifference(today, expiryDate);
        
        document.getElementById('validityDate').textContent = Utils.formatDate(this.currentUser.expiry);
        document.getElementById('daysRemaining').textContent = `${daysRemaining} days remaining`;

        // Change color based on days remaining
        const validityElement = document.getElementById('validityDate');
        if (daysRemaining < 7) {
            validityElement.classList.remove('text-green-600');
            validityElement.classList.add('text-red-600');
        } else if (daysRemaining < 30) {
            validityElement.classList.remove('text-green-600');
            validityElement.classList.add('text-yellow-600');
        }

        // Progress Info
        const totalVideos = this.userVideos.length;
        const watchedVideos = this.currentUser.videosWatched?.length || 0;
        const progress = Utils.calculateProgress(watchedVideos, totalVideos);
        
        document.getElementById('progressPercent').textContent = `${progress}%`;
        document.getElementById('progressBar').style.width = `${progress}%`;

        // Next Video Alert
        const nextLockedVideo = this.userVideos.find(v => !v.isUnlocked);
        if (nextLockedVideo) {
            const alert = document.getElementById('nextVideoAlert');
            alert.classList.remove('hidden');
            document.getElementById('nextVideoInfo').textContent = 
                `${nextLockedVideo.title} unlocks on ${Utils.formatDate(nextLockedVideo.unlockDate)} (${nextLockedVideo.day})`;
        }

        // Trigger confetti if course completed
        if (progress === 100) {
            setTimeout(() => {
                Utils.triggerConfetti();
                this.showCourseCompletionModal();
            }, 500);
        }
    },

    displayVideos() {
        const container = document.getElementById('videosContainer');
        const skeleton = document.getElementById('videosSkeleton');
        const noVideos = document.getElementById('noVideosMessage');

        skeleton.classList.add('hidden');

        let videosToShow = this.allVideos;
        if (this.currentFilter === 'unlocked') {
            videosToShow = this.allVideos.filter(v => v.isUnlocked);
        } else if (this.currentFilter === 'locked') {
            videosToShow = this.allVideos.filter(v => !v.isUnlocked);
        }

        if (videosToShow.length === 0) {
            container.classList.add('hidden');
            noVideos.classList.remove('hidden');
            return;
        }

        noVideos.classList.add('hidden');
        container.classList.remove('hidden');
        container.innerHTML = '';

        videosToShow.forEach((video, index) => {
            const videoCard = this.createVideoCard(video, index);
            container.appendChild(videoCard);
        });
    },

    createVideoCard(video, index) {
        const card = document.createElement('div');
        card.className = 'bg-gray-50 rounded-lg p-4 card-hover transition-all duration-300';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 50).toString());

        const isWatched = this.currentUser.videosWatched?.includes(video._id);
        
        card.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <!-- Thumbnail -->
                <div class="relative md:w-48 flex-shrink-0">
                    <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-32 object-cover rounded-lg">
                    ${!video.isUnlocked ? `
                        <div class="locked-overlay">
                            <div class="text-center text-white">
                                <span class="text-4xl">🔒</span>
                                <p class="text-sm mt-2">Unlocks ${Utils.formatDate(video.unlockDate)}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${isWatched ? `
                        <div class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            ✓ Watched
                        </div>
                    ` : ''}
                </div>

                <!-- Video Info -->
                <div class="flex-1">
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="badge badge-info">Week ${video.week}</span>
                                <span class="badge badge-${video.isUnlocked ? 'success' : 'warning'}">
                                    ${video.day}
                                </span>
                                <span class="text-sm text-gray-500">${video.duration}</span>
                            </div>
                            <h3 class="text-lg font-bold text-gray-800 mb-2">${video.title}</h3>
                            <p class="text-gray-600 text-sm mb-3">${video.description}</p>
                            ${video.notes ? `
                                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded">
                                    <p class="text-xs text-yellow-700">📝 <strong>Note:</strong> ${video.notes}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <div class="flex items-center md:w-32 flex-shrink-0">
                    ${video.isUnlocked ? `
                        <button 
                            onclick="StudentDashboard.watchVideo('${video._id}')"
                            class="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                            ${isWatched ? '▶️ Rewatch' : '▶️ Watch Now'}
                        </button>
                    ` : `
                        <button 
                            disabled
                            class="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                        >
                            🔒 Locked
                        </button>
                    `}
                </div>
            </div>
        `;

        return card;
    },

    watchVideo(videoId) {
        window.location.href = `./player.html?video=${videoId}`;
    },

    showCourseCompletionModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-slideUp">
                <div class="text-6xl mb-4">🏆</div>
                <h2 class="text-3xl font-bold text-purple-600 mb-4">Congratulations!</h2>
                <p class="text-gray-700 mb-6">
                    You've completed all videos in the <strong>${CONFIG.COURSES[this.currentUser.course].name}</strong>!
                </p>
                <div class="bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg p-4 mb-6">
                    <p class="text-purple-800 font-semibold">Keep up the great work! 🎨✨</p>
                </div>
                <button 
                    onclick="this.closest('.fixed').remove()"
                    class="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                    Awesome!
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

// Filter videos function
function filterVideos(filter) {
    StudentDashboard.currentFilter = filter;
    
    const buttons = {
        all: document.getElementById('btnAll'),
        unlocked: document.getElementById('btnUnlocked'),
        locked: document.getElementById('btnLocked')
    };

    Object.keys(buttons).forEach(key => {
        if (key === filter) {
            buttons[key].classList.remove('bg-gray-200', 'text-gray-700');
            buttons[key].classList.add('bg-purple-600', 'text-white');
        } else {
            buttons[key].classList.remove('bg-purple-600', 'text-white');
            buttons[key].classList.add('bg-gray-200', 'text-gray-700');
        }
    });

    StudentDashboard.displayVideos();
}