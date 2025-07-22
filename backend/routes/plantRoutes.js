import express from 'express';
import multer from 'multer';
import PlantInfo from '../models/PlantInfo.js';  // adjust path as needed
import { cloudinary } from '../cloudinaryConfig.js'; // your cloudinary setup
import streamifier from 'streamifier';
import authMiddleware from '../Middleware/authMiddleware.js'; // your auth middleware

const router = express.Router();
const upload = multer(); // stores files in memory

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

export default router;