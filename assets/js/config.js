// Application Configuration
const CONFIG = {
    APP_NAME: 'Mehandi Learning Portal',
    VERSION: '1.0.0',
    
    // Course Configuration
    COURSES: {
        BASIC: {
            name: 'Basic Course',
            duration: 1, // months
            color: '#10b981',
            icon: '🔧'
        },
        INTERMEDIATE: {
            name: 'Intermediate Course',
            duration: 2,
            color: '#3b82f6',
            icon: '⚙️'
        },
        ADVANCED: {
            name: 'Advanced Course',
            duration: 3,
            color: '#8b5cf6',
            icon: '🏆'
        }
    },

    // Video Schedule
    VIDEO_DAYS: ['Monday', 'Thursday'],
    
    // Session Configuration
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
    ACTIVITY_CHECK_INTERVAL: 60 * 1000, // 1 minute
    
    // Storage Keys
    STORAGE_KEYS: {
        USER_SESSION: 'user_session',
        ADMIN_SESSION: 'admin_session',
        THEME: 'theme_preference'
    },
    
    // API Configuration (for future AWS migration)
    API: {
        BASE_URL: window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api' 
            : 'https://your-aws-domain.com/api',
        ENDPOINTS: {
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            VIDEOS: '/videos',
            USERS: '/users',
            ANALYTICS: '/analytics'
        }
    },
    
    // Data Files (GitHub Pages - static mode)
    DATA_FILES: {
        USERS: './data/users.json',
        VIDEOS: './data/videos.json',
        SESSIONS: './data/sessions.json'
    },
    
    // Admin Credentials (Change these!)
    ADMIN: {
        username: 'admin',
        password: 'Admin@123' // CHANGE THIS IMMEDIATELY
    }
};

// Export for module usage (future AWS migration)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
