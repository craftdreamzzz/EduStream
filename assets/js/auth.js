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

            // Load users data
            const users = await Utils.loadJSON(CONFIG.DATA_FILES.USERS);
            
            if (!users || !users[username]) {
                throw new Error('Invalid username or password');
            }

            const user = users[username];

            // Verify password
            if (user.password !== password) {
                throw new Error('Invalid username or password');
            }

            // Check if account is active
            if (!user.active) {
                throw new Error('Your account has been disabled. Please contact admin.');
            }

            // Check expiry
            if (Utils.isDatePassed(user.expiry)) {
                throw new Error('Your account has expired. Please contact admin to renew.');
            }

            // Create session
            const session = {
                username: username,
                name: user.name,
                course: user.course,
                expiry: user.expiry,
                loginTime: new Date().toISOString()
            };

            // Save session
            Utils.setStorage(CONFIG.STORAGE_KEYS.USER_SESSION, session);
            Utils.updateLastActivity();

            // Track login
            this.trackLogin(username, 'student');

            Utils.showLoader(false);
            Utils.showToast(`Welcome back, ${user.name}!`, 'success');

            // Redirect to dashboard
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

            // Verify admin credentials
            if (username !== CONFIG.ADMIN.username || password !== CONFIG.ADMIN.password) {
                throw new Error('Invalid admin credentials');
            }

            // Create admin session
            const session = {
                username: username,
                role: 'admin',
                loginTime: new Date().toISOString()
            };

            Utils.setStorage(CONFIG.STORAGE_KEYS.ADMIN_SESSION, session);
            Utils.updateLastActivity();

            // Track login
            this.trackLogin(username, 'admin');

            Utils.showLoader(false);
            Utils.showToast('Admin login successful!', 'success');

            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = './admin/index.html';
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
