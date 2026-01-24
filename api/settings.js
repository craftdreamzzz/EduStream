const { connectToDatabase } = require('./db');

module.exports = async (req, res) => {
  const { db } = await connectToDatabase();

  // GET - Fetch settings
  if (req.method === 'GET') {
    try {
      let settings = await db.collection('settings').findOne({ _id: 'app_settings' });
      
      // Default settings if none exist
      if (!settings) {
        settings = {
          _id: 'app_settings',
          logo: 'https://drive.google.com/uc?export=view&id=1sDhdvDS0ouqJ6Mjvuunj_kaBYHD6bmcP',
          instagramQR: 'https://drive.google.com/uc?export=view&id=1JW5gNJrjatrdroYPzCaEXSmIz4XmF_q0',
          youtubeQR: 'https://drive.google.com/uc?export=view&id=1Wti4lozjjiOkNsrlSD-8BqLRgE7WJt5x',
          whatsapp: '+918277414796',
          email: 'craftdreamzzz@gmail.com',
          artistName: 'Lavanya',
          contactAddress: 'Hebri, Udupi, Karnataka',
          appName: 'CraftDreamzzz Learning Portal',
          tagline: 'Master the Art of Henna Design',
          imageFolder: 'https://drive.google.com/drive/folders/1-PhCFJNuTUkCVOUEoKAhySEjdbvPfPtu',
          videoFolder: 'https://drive.google.com/drive/folders/1bsJkISSfbi5cuHq19DoV8a1nR_NJlU6D'
        };
        await db.collection('settings').insertOne(settings);
      }

      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  // PUT - Update settings (admin only)
  else if (req.method === 'PUT') {
    try {
      const updates = req.body;
      await db.collection('settings').updateOne(
        { _id: 'app_settings' },
        { $set: updates },
        { upsert: true }
      );
      res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};