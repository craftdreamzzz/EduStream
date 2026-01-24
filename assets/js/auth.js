// Authentication Module

const Auth = {
    // Current session data
    currentUser: null,
    isAdmin: false,

    // Initialize auth state
    async init() {
        this.checkSession();
    },

    // Check if user/admin is logged in
    checkSession() {
        const userSession = Utils.getStorage(CONFIG.STORAGE_KEYS.USER_SESSION);
        const adminSession = Utils.getStorage(CONFIG.STORAGE_KEYS.ADMIN_SESSION);

        if (userSession) {
            this.currentUser = userSession;
            this.isAdmin = false;
            
            // Check session expiry
            if (Utils.isSessionExpired()) {
                this.logout('Session expired. Please login again.');
                return false;
            }
            return true;
        }

        if (adminSession) {
            this.currentUser = adminSession;
            this.isAdmin = true;
            
            if (Utils.isSessionExpired()) {
                this.logout('Session expired. Please login again.');
                return false;
            }
            return true;
        }

        return false;
    },

    // Student Login
    async loginStudent(username, password) {
        try {
            Utils.showLoader(true);

            const response = await API.call(CONFIG.API.ENDPOINTS.AUTH, 'POST', {
                username,
                password,
                role: 'student'
            });

            if (!response.success) {
                throw new Error('Login failed');
            }

            // Create session
            const session = {
                ...response.user,
                loginTime: new Date().toISOString()
            };

            Utils.setStorage(CONFIG.STORAGE_KEYS.USER_SESSION, session);
            Utils.updateLastActivity();

            // Track login
            await API.trackActivity('login', {
                username,
                role: 'student',
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                device: Utils.isMobile() ? 'mobile' : 'desktop'
            });

            Utils.showLoader(false);
            Utils.showToast(`Welcome back, ${response.user.name}!`, 'success');

            setTimeout(() => {
                window.location.href = './student/dashboard.html';
            }, 500);

            return true;

        } catch (error) {
            Utils.showLoader(false);
            Utils.showToast(error.message, 'error');
            return false;
        }
    },

    // Admin Login
    async loginAdmin(username, password) {
        try {
            Utils.showLoader(true);

            const response = await API.call(CONFIG.API.ENDPOINTS.AUTH, 'POST', {
                username,
                password,
                role: 'admin'
            });

            if (!response.success) {
                throw new Error('Invalid admin credentials');
            }

            const session = {
                username,
                role: 'admin',
                loginTime: new Date().toISOString()
            };

            Utils.setStorage(CONFIG.STORAGE_KEYS.ADMIN_SESSION, session);
            Utils.updateLastActivity();

            // Track login
            await API.trackActivity('login', {
                username,
                role: 'admin',
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                device: Utils.isMobile() ? 'mobile' : 'desktop'
            });

            Utils.showLoader(false);
            Utils.showToast('Admin login successful!', 'success');

            setTimeout(() => {
                window.location.href = './index.html';
            }, 500);

            return true;

        } catch (error) {
            Utils.showLoader(false);
            Utils.showToast(error.message, 'error');
            return false;
        }
    },

    // Logout
    logout(message = 'Logged out successfully') {
        const isAdminLogout = this.isAdmin;

        // Clear session
        Utils.removeStorage(CONFIG.STORAGE_KEYS.USER_SESSION);
        Utils.removeStorage(CONFIG.STORAGE_KEYS.ADMIN_SESSION);
        Utils.removeStorage('last_activity');

        this.currentUser = null;
        this.isAdmin = false;

        Utils.showToast(message, 'info');

        // Redirect to login
        setTimeout(() => {
            if (isAdminLogout) {
                window.location.href = '../admin/login.html';
            } else {
                window.location.href = '../index.html';
            }
        }, 500);
    },

    // Get current user
    getCurrentUser() {
        if (!this.currentUser) {
            this.checkSession();
        }
        return this.currentUser;
    },

    // Require authentication (use in protected pages)
    requireAuth(adminOnly = false) {
        const isLoggedIn = this.checkSession();

        if (!isLoggedIn) {
            Utils.showToast('Please login to continue', 'warning');
            setTimeout(() => {
                window.location.href = adminOnly ? '../admin/login.html' : '../index.html';
            }, 1000);
            return false;
        }

        if (adminOnly && !this.isAdmin) {
            Utils.showToast('Admin access required', 'error');
            setTimeout(() => {
                window.location.href = '../admin/login.html';
            }, 1000);
            return false;
        }

        return true;
    },

    // Track login activity (saves to sessions.json in future)
    async trackLogin(username, role) {
        try {
            const loginData = {
                username,
                role,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                device: Utils.isMobile() ? 'mobile' : 'desktop'
            };

            // In GitHub mode, just store in localStorage
            // In AWS mode, this will POST to backend
            const sessions = Utils.getStorage('login_sessions') || [];
            sessions.push(loginData);
            
            // Keep only last 100 sessions
            if (sessions.length > 100) {
                sessions.shift();
            }
            
            Utils.setStorage('login_sessions', sessions);

            console.log('Login tracked:', loginData);
        } catch (error) {
            console.error('Failed to track login:', error);
        }
    },

    // Auto-logout on session timeout
    startSessionMonitor() {
        setInterval(() => {
            if (this.checkSession() && Utils.isSessionExpired()) {
                this.logout('Session expired due to inactivity');
            }
        }, CONFIG.ACTIVITY_CHECK_INTERVAL);
    }
};

// Auto-start session monitoring
if (typeof document !== 'undefined') {
    Auth.startSessionMonitor();
}
