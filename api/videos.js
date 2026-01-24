const { connectToDatabase } = require('./db');

module.exports = async (req, res) => {
  const { db } = await connectToDatabase();

  // GET - Fetch all videos or by course
  if (req.method === 'GET') {
    try {
      const { course } = req.query;
      const query = course ? { course } : {};
      const videos = await db.collection('videos').find(query).sort({ week: 1, unlockDate: 1 }).toArray();
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  }

  // POST - Create new video
  else if (req.method === 'POST') {
    try {
      const videoData = req.body;
      videoData.createdAt = new Date().toISOString();
      videoData.viewed = 0;
      
      await db.collection('videos').insertOne(videoData);
      res.status(201).json(videoData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create video' });
    }
  }

  // PUT - Update video
  else if (req.method === 'PUT') {
    try {
      const { videoId, updates } = req.body;
      await db.collection('videos').updateOne(
        { _id: videoId },
        { $set: updates }
      );
      res.status(200).json({ message: 'Video updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update video' });
    }
  }

  // DELETE - Delete video
  else if (req.method === 'DELETE') {
    try {
      const { videoId } = req.body;
      await db.collection('videos').deleteOne({ _id: videoId });
      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete video' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};