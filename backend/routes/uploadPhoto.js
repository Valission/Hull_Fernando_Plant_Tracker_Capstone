import express from 'express'
import multer from 'multer'
import streamifier from 'streamifier'
import PlantInfo from '../plantSchema.js'
import { cloudinary } from '../cloudinaryConfig.js'

const upload = multer()  // memory storage by default
const router = express.Router()

router.post('/plant', upload.single('photo'), async (req, res) => {
  try {
    // Extract fields from form data
    const { plantName, fertilizer, Sunlight, whenToWater, lastWatered } = req.body

    if (!plantName) {
      return res.status(400).json({ message: 'plantName is required' })
    }

    // Upload image buffer to Cloudinary if photo exists
    let photoUrl = ''
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result)
            else reject(error)
          })
          streamifier.createReadStream(buffer).pipe(stream)
        })
      }
      const result = await streamUpload(req.file.buffer)
      photoUrl = result.secure_url
    }

    // Create plant document
    const newPlant = new PlantInfo({
      plantName,
      fertilizer,
      Sunlight,
      whenToWater,
      lastWatered: lastWatered ? new Date(lastWatered) : undefined,
      photo: photoUrl,
    })

    await newPlant.save()

    res.status(201).json(newPlant)
  } catch (error) {
    console.error('Failed to create plant:', error)
    res.status(500).json({ message: 'Failed to create plant', error: error.message })
  }
})

export default router