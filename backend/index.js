require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const SelectedCourse = require('./models/SelectedCourse');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/courses', (req, res) => {
  const courses = require('./courses.json');
  res.json(courses);
});

app.post('/api/selected-courses', async (req, res) => {
  try {
    const saved = await SelectedCourse.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
