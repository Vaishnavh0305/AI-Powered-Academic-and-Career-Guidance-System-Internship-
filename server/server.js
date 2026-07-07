const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/guidance';

app.use(cors());
app.use(express.json());

// MongoDB Schema
const UserDataSchema = new mongoose.Schema({
  userId: { type: String, default: 'default_student', unique: true },
  personalInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    dob: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  academics: {
    marks10: { type: String, default: '' },
    marks12: { type: String, default: '' },
    cgpa: { type: String, default: '' },
    history: { type: String, default: '0' },
    backlogs: { type: String, default: '0' },
    studyTime: { type: String, default: '1' },
    attendance: { type: String, default: '100' },
    marks: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    studyHours: { type: String, default: '0' },
    favSubject: { type: String, default: '' },
    achievements: { type: Array, default: [] },
    currentEducation: { type: String, default: '' }
  },
  programmingSkills: { type: Map, of: Number, default: {} },
  softSkills: { type: Map, of: Number, default: {} },
  interests: { type: Array, default: [] },
  certs: { type: Array, default: [] },
  projects: { type: Array, default: [] },
  internships: { type: Array, default: [] },
  hackathons: { type: Array, default: [] },
  prediction: { type: String, default: 'None' },
}, { timestamps: true });

const UserData = mongoose.model('UserData', UserDataSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  educationLevel: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/api/guidance', async (req, res) => {
  try {
    const email = req.query.email || 'default_student';
    let data = await UserData.findOne({ userId: email });
    if (!data) {
      // Find the user details from the registered User collection
      const user = await User.findOne({ email });
      const personalInfo = {
        name: user ? user.name : '',
        email: email !== 'default_student' ? email : '',
        phone: '',
        dob: '',
        address: ''
      };
      // Create profile with registered user details
      data = await UserData.create({ userId: email, personalInfo });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/guidance', async (req, res) => {
  try {
    const email = req.query.email || req.body.userId || 'default_student';
    const { personalInfo, academics, programmingSkills, softSkills, certs, prediction, projects, internships, hackathons } = req.body;
    const updatedData = await UserData.findOneAndUpdate(
      { userId: email },
      {
        personalInfo,
        academics,
        programmingSkills,
        softSkills,
        certs,
        prediction,
        projects,
        internships,
        hackathons
      },
      { new: true, upsert: true }
    );
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Auth API Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, educationLevel } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    const newUser = await User.create({ name, email, password, educationLevel });
    res.status(201).json({ message: 'Registration successful', user: { name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run Machine Learning Model Prediction
app.post('/api/predict', (req, res) => {
  const inputData = req.body;
  
  // Spawn python subprocess
  const pythonProcess = spawn('python', ['predict.py'], { cwd: __dirname });
  
  let outputData = '';
  let errorData = '';
  
  pythonProcess.stdout.on('data', (data) => {
    outputData += data.toString();
  });
  
  pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString();
  });
  
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Python predict.py error:', errorData);
      return res.status(500).json({ error: 'Failed to run prediction model', details: errorData });
    }
    try {
      const result = JSON.parse(outputData);
      res.json(result);
    } catch (e) {
      console.error('Failed to parse predict.py output:', outputData);
      res.status(500).json({ error: 'Invalid prediction output format' });
    }
  });
  
  // Send data to python stdin
  pythonProcess.stdin.write(JSON.stringify(inputData));
  pythonProcess.stdin.end();
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
