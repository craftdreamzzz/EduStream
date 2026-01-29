// Application Configuration
const CONFIG = {
    APP_NAME: 'CraftDreamzzz Learning Portal',
    VERSION: '2.0.0',
    
    // Course Configuration - Updated for Henna Design
    COURSES: {
        BASIC: {
            name: 'Basic Course',
            duration: 1,
            color: '#10b981',
            icon: '🎨',
            description: 'Foundation of Henna Art',
            access: ['BASIC']
        },
        INTERMEDIATE: {
            name: 'Intermediate Course',
            duration: 2,
            color: '#3b82f6',
            icon: '✨',
            description: 'Advanced Henna Techniques',
            access: ['INTERMEDIATE']
        },
        PROFESSIONAL: {
            name: 'Professional Course',
            duration: 3,
            color: '#8b5cf6',
            icon: '👑',
            description: 'Master Henna Artist Level',
            access: ['PROFESSIONAL']
        },
        BASIC_INTERMEDIATE: {
            name: 'Basic + Intermediate',
            duration: 3,
            color: '#06b6d4',
            icon: '🎨✨',
            description: 'Foundation + Advanced Techniques',
            access: ['BASIC', 'INTERMEDIATE']
        },
        BASIC_PROFESSIONAL: {
            name: 'Basic + Professional',
            duration: 4,
            color: '#ec4899',
            icon: '🎨👑',
            description: 'Foundation + Master Level',
            access: ['BASIC', 'PROFESSIONAL']
        },
        INTERMEDIATE_PROFESSIONAL: {
            name: 'Intermediate + Professional',
            duration: 5,
            color: '#f59e0b',
            icon: '✨👑',
            description: 'Advanced + Master Level',
            access: ['INTERMEDIATE', 'PROFESSIONAL']
        },
        ALL: {
            name: 'All Courses (Complete Package)',
            duration: 6,
            color: '#ef4444',
            icon: '🎨✨👑',
            description: 'Basic + Intermediate + Professional',
            access: ['BASIC', 'INTERMEDIATE', 'PROFESSIONAL']
        }
    },
    
    // Video Schedule
    VIDEO_DAYS: ['Monday', 'Thursday'],
    
    // Session Configuration
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    ACTIVITY_CHECK_INTERVAL: 60 * 1000, // 1 minute
    
    // Storage Keys
    STORAGE_KEYS: {
        USER_SESSION: 'user_session',
        ADMIN_SESSION: 'admin_session',
        THEME: 'theme_preference'
    },
    
    // API Endpoints
    API: {
        BASE_URL: window.location.origin,
        ENDPOINTS: {
            AUTH: '/api/auth',
            STUDENTS: '/api/students',
            VIDEOS: '/api/videos',
            ANALYTICS: '/api/analytics',
            SETTINGS: '/api/settings'
        }
    },
    
    // Contact Information (editable via admin panel)
    CONTACT: {
        WHATSAPP: '+918277414796',
        EMAIL: 'craftdreamzzz@gmail.com',
        ARTIST: 'Lavanya',
        ADDRESS: 'Hebri, Udupi, Karnataka'
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}