import express from 'express';
import cors from 'cors';

import 'dotenv/config';

import connectDb from './db.js';
import uploadRouter from './routes/uploadPhoto.js';
import userRouter from './routes/authRoutes.js';


import multer from 'multer';
import streamifier from 'streamifier'

import {cloudinary, upload } from './Middleware/cloudinary.js';

import PlantInfo from './plantSchema.js';
import userLog from './trackerSchema.js';
import authMiddleware from './Middleware/authMiddleware.js';

const app = express();
const port = process.env.PORT;
const uploads = multer(); 

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', userRouter);
app.use('/upload', uploadRouter);

app.get('/planti', async (req, res) => {
  try {
    const info = await PlantInfo.find();
    res.status(200).json(info);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
});

/* Protected route that is only available once the user logs in and provides a valid JWT token */
app.get('/private', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user}` });
});

app.get('/user/logs', authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const logs = await userLog.find({ belongedTo: userId }).populate('plant');
    const userPlants = logs.map(log =>log.plant)

    res.status(200).json(logs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get('/user/plants', authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const plants = await PlantInfo.find({ belongedTo: userId });
    res.status(200).json(plants);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get('/plant/:id/logs', authMiddleware, async (req, res) => {
  try {
    const plantId = req.params.id;

    const logs = await userLog.find({ plant: plantId }).populate('plant');

    res.status(200).json(logs);
  } catch (e) {
    console.error('Error fetching logs:', e);
    res.status(500).json({ message: 'Failed to fetch plant logs' });
  }
});

app.post('/plant/:id/logs', authMiddleware, uploads.single('image'), async (req, res) => {
  try {
    const plantId = req.params.id;
    const { action, note } = req.body;

    let imageUrl = '';

    if (req.file && req.file.buffer) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newLog = new userLog({
      action: Array.isArray(action) ? action : [action],
      note,
      image: imageUrl,
      plant: plantId,
      belongedTo: req.user,
      createdAt: new Date(),
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (e) {
    console.error('Failed to create log:', e);
    res.status(500).json({ message: 'Failed to create log' });
  }
});

app.post('/plant', authMiddleware, uploads.single('photo'), async (req, res) => {
  try {
    const { plantName, fertilizer, Sunlight, whenToWater } = req.body;

    if (!plantName) {
      return res.status(400).json({ message: 'plantName is required' });
    }

    let photoUrl = '';

    if (req.file && req.file.buffer) {
      const result = await uploadToCloudinary(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const newPlant = new PlantInfo({
      plantName,
      fertilizer,
      Sunlight,
      whenToWater,
      photo: photoUrl,
      belongedTo: req.user, 
    });

    await newPlant.save();

    res.status(201).json(newPlant);
  } catch (e) {
    console.error('Failed to create plant:', e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/plants', upload.array('images'), authMiddleware, async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path); 
    const plant = new Plant({
      name: req.body.name,
      imageUrls,
      owner: req.user._id, // comes from JWT middleware
    });

    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// 404 handler - for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware - catches errors in routes
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});



// Connect to DB, then start the server
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });