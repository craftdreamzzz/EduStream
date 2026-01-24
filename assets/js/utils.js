// Utility Functions

const Utils = {
    // Date & Time Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    },

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN');
    },

    isDatePassed(dateString) {
        return new Date(dateString) < new Date();
    },

    getDaysDifference(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    getNextVideoDay() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Monday = 1, Thursday = 4
        if (dayOfWeek < 1) return 'Monday';
        if (dayOfWeek >= 1 && dayOfWeek < 4) return 'Thursday';
        if (dayOfWeek >= 4) return 'Monday (next week)';
    },

    // Validation Functions
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePassword(password) {
        return password.length >= 6;
    },

    // Storage Functions
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    getStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },

    removeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    clearAllStorage() {
        localStorage.clear();
    },

    // UI Functions
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 animate-slideIn ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 
            'bg-blue-500'
        }`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('animate-slideOut');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    showLoader(show = true) {
        let loader = document.getElementById('globalLoader');
        if (!loader && show) {
            loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            loader.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-xl">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
                    <p class="mt-4 text-gray-700">Loading...</p>
                </div>
            `;
            document.body.appendChild(loader);
        } else if (loader && !show) {
            loader.remove();
        }
    },

    // Confetti Animation
    triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
            }, 250);
            
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 400);
        }
    },

    // File/Data Loading (GitHub Pages mode)
    async loadJSON(filepath) {
        try {
            const response = await fetch(filepath);
            if (!response.ok) throw new Error('Failed to load data');
            return await response.json();
        } catch (error) {
            console.error('Error loading JSON:', error);
            return null;
        }
    },

    // Embed Google Drive Video
    getDriveEmbedUrl(driveUrl) {
        // Convert various Drive URL formats to embed format
        const fileIdMatch = driveUrl.match(/[-\w]{25,}/);
        if (fileIdMatch) {
            return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
        }
        return driveUrl;
    },

    // Progress Calculation
    calculateProgress(videosWatched, totalVideos) {
        if (totalVideos === 0) return 0;
        return Math.round((videosWatched / totalVideos) * 100);
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!', 'success');
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },

    // Device detection
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Session activity tracking
    updateLastActivity() {
        const timestamp = new Date().toISOString();
        this.setStorage('last_activity', timestamp);
    },

    getLastActivity() {
        return this.getStorage('last_activity');
    },

    isSessionExpired() {
        const lastActivity = this.getLastActivity();
        if (!lastActivity) return true;
        
        const lastTime = new Date(lastActivity).getTime();
        const now = new Date().getTime();
        const diff = now - lastTime;
        
        return diff > CONFIG.SESSION_TIMEOUT;
    }
};

// Initialize activity tracking
if (typeof document !== 'undefined') {
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, () => Utils.updateLastActivity(), { passive: true });
    });
}
