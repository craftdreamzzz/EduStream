// Analytics Module
// Provides tracking and insights for admin dashboard

const Analytics = {
    // Track page views
    trackPageView(page) {
        const pageView = {
            page,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            device: Utils.isMobile() ? 'mobile' : 'desktop',
            referrer: document.referrer || 'direct'
        };

        const pageViews = Utils.getStorage('page_views') || [];
        pageViews.push(pageView);
        
        // Keep only last 1000 page views
        if (pageViews.length > 1000) {
            pageViews.shift();
        }
        
        Utils.setStorage('page_views', pageViews);
    },

    // Track user engagement (time spent on page)
    trackEngagement(page) {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const endTime = Date.now();
            const duration = Math.round((endTime - startTime) / 1000); // in seconds

            const engagement = {
                page,
                duration,
                timestamp: new Date().toISOString()
            };

            const engagements = Utils.getStorage('engagements') || [];
            engagements.push(engagement);
            
            if (engagements.length > 500) {
                engagements.shift();
            }
            
            Utils.setStorage('engagements', engagements);
        });
    },

    // Get student progress statistics
    getStudentStats(username) {
        const watchedVideos = Utils.getStorage('watched_videos') || {};
        const userWatched = watchedVideos[username] || [];
        
        const views = Utils.getStorage('video_views') || [];
        const userViews = views.filter(v => v.username === username);

        const sessions = Utils.getStorage('login_sessions') || [];
        const userSessions = sessions.filter(s => s.username === username);

        return {
            videosWatched: userWatched.length,
            totalViews: userViews.length,
            loginCount: userSessions.length,
            lastLogin: userSessions.length > 0 
                ? userSessions[userSessions.length - 1].timestamp 
                : null,
            averageSessionDuration: this.getAverageSessionDuration(username)
        };
    },

    // Get average session duration for a user
    getAverageSessionDuration(username) {
        const engagements = Utils.getStorage('engagements') || [];
        const userEngagements = engagements.filter(e => {
            const session = Utils.getStorage(CONFIG.STORAGE_KEYS.USER_SESSION);
            return session && session.username === username;
        });

        if (userEngagements.length === 0) return 0;

        const totalDuration = userEngagements.reduce((sum, e) => sum + e.duration, 0);
        return Math.round(totalDuration / userEngagements.length);
    },

    // Get video statistics
    getVideoStats() {
        const videos = Utils.getStorage('video_views') || [];
        const completions = Utils.getStorage('video_completions') || [];

        // Group by video ID
        const stats = {};
        
        videos.forEach(view => {
            if (!stats[view.videoId]) {
                stats[view.videoId] = {
                    views: 0,
                    completions: 0,
                    uniqueViewers: new Set()
                };
            }
            stats[view.videoId].views++;
            stats[view.videoId].uniqueViewers.add(view.username);
        });

        completions.forEach(comp => {
            if (stats[comp.videoId]) {
                stats[comp.videoId].completions++;
            }
        });

        // Convert Sets to counts
        Object.keys(stats).forEach(id => {
            stats[id].uniqueViewers = stats[id].uniqueViewers.size;
            stats[id].completionRate = stats[id].views > 0 
                ? Math.round((stats[id].completions / stats[id].views) * 100)
                : 0;
        });

        return stats;
    },

    // Get popular videos
    getPopularVideos(limit = 5) {
        const stats = this.getVideoStats();
        
        return Object.entries(stats)
            .sort((a, b) => b[1].views - a[1].views)
            .slice(0, limit)
            .map(([id, data]) => ({ id, ...data }));
    },

    // Get course completion rates
    getCourseCompletionRates() {
        const users = Utils.getStorage('watched_videos') || {};
        const rates = {
            BASIC: { completed: 0, total: 0 },
            INTERMEDIATE: { completed: 0, total: 0 },
            ADVANCED: { completed: 0, total: 0 }
        };

        // This would require loading actual user data
        // Implementation depends on data structure

        return rates;
    },

    // Export analytics data
    exportAnalytics() {
        return {
            pageViews: Utils.getStorage('page_views') || [],
            videoViews: Utils.getStorage('video_views') || [],
            completions: Utils.getStorage('video_completions') || [],
            sessions: Utils.getStorage('login_sessions') || [],
            engagements: Utils.getStorage('engagements') || [],
            exportedAt: new Date().toISOString()
        };
    },

    // Generate daily report
    generateDailyReport() {
        const today = new Date().toISOString().split('T')[0];
        
        const sessions = Utils.getStorage('login_sessions') || [];
        const views = Utils.getStorage('video_views') || [];
        const completions = Utils.getStorage('video_completions') || [];

        const todaySessions = sessions.filter(s => s.timestamp.startsWith(today));
        const todayViews = views.filter(v => v.timestamp.startsWith(today));
        const todayCompletions = completions.filter(c => c.completedAt.startsWith(today));

        return {
            date: today,
            logins: todaySessions.length,
            uniqueUsers: new Set(todaySessions.map(s => s.username)).size,
            videoViews: todayViews.length,
            videosCompleted: todayCompletions.length,
            deviceBreakdown: {
                mobile: todaySessions.filter(s => s.device === 'mobile').length,
                desktop: todaySessions.filter(s => s.device === 'desktop').length
            }
        };
    },

    // Clear old analytics data (keep last 30 days)
    cleanupOldData() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const cutoffDate = thirtyDaysAgo.toISOString();

        const dataKeys = ['page_views', 'video_views', 'video_completions', 'login_sessions', 'engagements'];

        dataKeys.forEach(key => {
            const data = Utils.getStorage(key) || [];
            const filtered = data.filter(item => {
                const itemDate = item.timestamp || item.completedAt;
                return itemDate >= cutoffDate;
            });
            Utils.setStorage(key, filtered);
        });

        console.log('Old analytics data cleaned up');
    },

    // Initialize analytics tracking
    init(page) {
        this.trackPageView(page);
        this.trackEngagement(page);
        
        // Cleanup old data weekly
        const lastCleanup = Utils.getStorage('last_analytics_cleanup');
        const now = Date.now();
        const weekInMs = 7 * 24 * 60 * 60 * 1000;

        if (!lastCleanup || (now - lastCleanup) > weekInMs) {
            this.cleanupOldData();
            Utils.setStorage('last_analytics_cleanup', now);
        }
    }
};

// Auto-initialize on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const pageName = window.location.pathname.split('/').pop() || 'index';
        Analytics.init(pageName);
    });
}
