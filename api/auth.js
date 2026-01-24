const { connectToDatabase } = require('./db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password, role } = req.body;
  const { db } = await connectToDatabase();

  try {
    // Admin Login
    if (role === 'admin') {
      const adminUser = process.env.ADMIN_USERNAME;
      const adminPass = process.env.ADMIN_PASSWORD;

      if (username === adminUser && password === adminPass) {
        res.status(200).json({
          success: true,
          user: { username, role: 'admin' },
          token: 'admin-session-token'
        });
      } else {
        res.status(401).json({ error: 'Invalid admin credentials' });
      }
    }

    // Student Login
    else {
      const student = await db.collection('students').findOne({ username });

      if (!student) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const isValidPassword = await bcrypt.compare(password, student.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      if (!student.active) {
        return res.status(403).json({ error: 'Account is disabled' });
      }

      if (new Date(student.expiry) < new Date()) {
        return res.status(403).json({ error: 'Account has expired' });
      }

      // Update last login
      await db.collection('students').updateOne(
        { username },
        { $set: { lastLogin: new Date().toISOString() } }
      );

      // Remove password from response
      delete student.password;

      res.status(200).json({
        success: true,
        user: student,
        token: 'student-session-token'
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};