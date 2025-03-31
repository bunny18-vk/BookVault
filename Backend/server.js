const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Student Schema and Model
const studentSchema = new mongoose.Schema({
  fullName: String,
  studentId: String,
  email: String,
  branch: String,
  password: String, // This will be hashed
  gender: String,
  mobileNumber: String,
});

const Student = mongoose.model('Student', studentSchema);


// Sign-up Route
app.post('/signup', async (req, res) => {
  const { fullName, studentId, email, branch, password, gender, mobileNumber } = req.body;

  if (!fullName || !studentId || !email || !branch || !password || !gender || !mobileNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      fullName,
      studentId,
      email,
      branch,
      password: hashedPassword, // Save the hashed password
      gender,
      mobileNumber,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Registered Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

  
app.post('/login', async (req, res) => {
    const { studentId, password } = req.body;
  
    try {
      // Find student by studentId
      const student = await Student.findOne({ studentId });
  
      if (!student) {
        return res.status(400).json({ error: 'Student ID not found' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, student.password);
  
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Send response with student details (exclude password)
      res.json({
        message: 'Login successful',
        studentId: student.studentId,
        fullName: student.fullName,
        email: student.email,
        branch: student.branch,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
