const { connectToDatabase } = require('./db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  const { db } = await connectToDatabase();

  // GET - Fetch all students
  if (req.method === 'GET') {
    try {
      const students = await db.collection('students').find({}).toArray();
      // Remove passwords from response
      students.forEach(s => delete s.password);
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  }

  // POST - Create new student
  else if (req.method === 'POST') {
    try {
      const { username, password, name, email, phone, course, expiry } = req.body;

      // Check if username exists
      const existing = await db.collection('students').findOne({ username });
      if (existing) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = {
        username,
        password: hashedPassword,
        name,
        email: email || '',
        phone: phone || '',
        course,
        expiry,
        active: true,
        joinDate: new Date().toISOString(),
        videosWatched: [],
        lastLogin: null,
        progress: 0
      };

      await db.collection('students').insertOne(newStudent);
      delete newStudent.password;

      res.status(201).json(newStudent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create student' });
    }
  }

  // PUT - Update student
  else if (req.method === 'PUT') {
    try {
      const { username, updates } = req.body;

      // If password is being updated, hash it
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      await db.collection('students').updateOne(
        { username },
        { $set: updates }
      );

      res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update student' });
    }
  }

  // DELETE - Delete student
  else if (req.method === 'DELETE') {
    try {
      const { username } = req.body;
      await db.collection('students').deleteOne({ username });
      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete student' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};