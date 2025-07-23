import express from 'express';
import multer from 'multer';
import PlantInfo from '../models/PlantInfo.js';  
import { cloudinary } from '../cloudinaryConfig.js'; 
import streamifier from 'streamifier';
import authMiddleware from '../Middleware/authMiddleware.js'; 

const router = express.Router();
const upload = multer(); 

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

router.post('/plant', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { plantName, fertilizer, Sunlight, whenToWater } = req.body;

    if (!plantName) {
      return res.status(400).json({ error: 'plantName is required' });
    }

    let photoUrl = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      photoUrl = result.secure_url;
    }

    const newPlant = new PlantInfo({
      plantName,
      fertilizer,
      Sunlight,
      whenToWater,
      photo: photoUrl,
    });

    const savedPlant = await newPlant.save();
    res.status(201).json(savedPlant);

  } catch (error) {
    console.error('Error creating plant:', error);
    res.status(500).json({ error: 'Failed to create plant' });
  }
});

router.post('/:id/logs', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const plantId = req.params.id;
    const { action, note } = req.body;

    if (!plantId) {
      return res.status(400).json({ error: 'Plant ID is required' });
    }

    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newLog = {
      action: Array.isArray(action) ? action : [action],
      note,
      image: imageUrl,
      createdAt: new Date(),
    };

    const updatedPlant = await PlantInfo.findByIdAndUpdate(
      plantId,
      { $push: { logs: { $each: [newLog], $position: 0 } } }, 
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.status(201).json(updatedPlant);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});


export default router;