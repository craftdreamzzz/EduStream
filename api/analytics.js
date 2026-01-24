const { connectToDatabase } = require('./db');

module.exports = async (req, res) => {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const { type } = req.query;

      if (type === 'stats') {
        const totalStudents = await db.collection('students').countDocuments();
        const activeStudents = await db.collection('students').countDocuments({
          active: true,
          expiry: { $gte: new Date().toISOString() }
        });
        const totalVideos = await db.collection('videos').countDocuments();
        const totalViews = await db.collection('video_views').countDocuments();

        res.status(200).json({
          totalStudents,
          activeStudents,
          totalVideos,
          totalViews
        });
      }

      else if (type === 'logins') {
        const logins = await db.collection('login_sessions')
          .find({})
          .sort({ timestamp: -1 })
          .limit(10)
          .toArray();
        res.status(200).json(logins);
      }

      else if (type === 'views') {
        const views = await db.collection('video_views')
          .find({})
          .sort({ timestamp: -1 })
          .limit(10)
          .toArray();
        res.status(200).json(views);
      }

      else {
        res.status(400).json({ error: 'Invalid analytics type' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  // POST - Track activity
  else if (req.method === 'POST') {
    try {
      const { type, data } = req.body;

      if (type === 'login') {
        await db.collection('login_sessions').insertOne(data);
      } else if (type === 'video_view') {
        await db.collection('video_views').insertOne(data);
      } else if (type === 'video_completion') {
        await db.collection('video_completions').insertOne(data);
        
        // Update student's watched videos
        await db.collection('students').updateOne(
          { username: data.username },
          { 
            $addToSet: { videosWatched: data.videoId },
            $inc: { progress: 1 }
          }
        );
      }

      res.status(200).json({ message: 'Activity tracked' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to track activity' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};