// Video Player Module

const VideoPlayer = {
    async loadVideo(videoId) {
        try {
            // Load video from API
            const videos = await API.getVideos();
            const video = videos.find(v => v._id === videoId);
            
            if (!video) {
                throw new Error('Video not found');
            }
            
            // Display video info
            document.getElementById('videoTitle').textContent = video.title;
            document.getElementById('videoDescription').textContent = video.description;
            document.getElementById('videoWeek').textContent = `Week ${video.week}`;
            document.getElementById('videoDuration').textContent = video.duration;
            document.getElementById('videoDay').textContent = video.day;

            // Show notes if available
            if (video.notes) {
                document.getElementById('notesSection').classList.remove('hidden');
                document.getElementById('videoNotes').textContent = video.notes;
            }

            // Embed video player
            this.embedVideo(video.driveLink);

            return video;

        } catch (error) {
            console.error('Error loading video:', error);
            Utils.showToast(error.message, 'error');
            return null;
        }
    },

    embedVideo(driveLink) {
        const container = document.getElementById('videoContainer');
        
        // Get proper embed URL
        const embedUrl = Utils.getDriveEmbedUrl(driveLink);

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        // Replace loading spinner with iframe
        container.innerHTML = '';
        container.appendChild(iframe);

        // Add load event listener
        iframe.addEventListener('load', () => {
            console.log('Video loaded successfully');
        });

        iframe.addEventListener('error', () => {
            console.error('Error loading video');
            Utils.showToast('Failed to load video. Please contact admin.', 'error');
        });
    },

    async markAsWatched(videoId, username) {
        try {
            await API.trackActivity('video_completion', {
                videoId,
                username,
                completedAt: new Date().toISOString()
            });

            return true;

        } catch (error) {
            console.error('Error marking video as watched:', error);
            return false;
        }
    },

    async trackView(videoId, username) {
        try {
            const viewData = {
                videoId,
                username,
                timestamp: new Date().toISOString(),
                device: Utils.isMobile() ? 'mobile' : 'desktop',
                userAgent: navigator.userAgent
            };

            // Store view data
            const views = Utils.getStorage('video_views') || [];
            views.push(viewData);
            
            // Keep only last 1000 views
            if (views.length > 1000) {
                views.shift();
            }
            
            Utils.setStorage('video_views', views);

            console.log('View tracked:', viewData);

        } catch (error) {
            console.error('Error tracking view:', error);
        }
    },

    logWatchCompletion(videoId, username) {
        const completionData = {
            videoId,
            username,
            completedAt: new Date().toISOString()
        };

        const completions = Utils.getStorage('video_completions') || [];
        completions.push(completionData);
        
        // Keep only last 500 completions
        if (completions.length > 500) {
            completions.shift();
        }
        
        Utils.setStorage('video_completions', completions);

        console.log('Watch completion logged:', completionData);
    },

    // Get video statistics (for future analytics)
    getVideoStats(videoId) {
        const views = Utils.getStorage('video_views') || [];
        const completions = Utils.getStorage('video_completions') || [];

        const videoViews = views.filter(v => v.videoId === videoId);
        const videoCompletions = completions.filter(c => c.videoId === videoId);

        return {
            totalViews: videoViews.length,
            totalCompletions: videoCompletions.length,
            completionRate: videoViews.length > 0 
                ? Math.round((videoCompletions.length / videoViews.length) * 100) 
                : 0
        };
    }
};
