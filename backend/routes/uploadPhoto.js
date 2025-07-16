import cloudinary from '../cloudinaryConfig.js'
import authMiddleware from '../Middleware/authMiddleware.js'
import userLog from '../trackerSchema.js'
import multer from 'multer'
import streamifier from 'streamifier'
import express from 'express'

const upload = multer()

const uploadRouter = express.Router()

//Route to upload multiple images to a specific log entry
uploadRouter.post('/plant/:id/images', authMiddleware, upload.array('images'), async (req, res) => {
    try{
        const logId = req.params.id
        const userId = req.user

        const log = await userLog.findOne({_id: logId, belongedTo: userId})

        if (!log){
            return res.status(404).json({message: 'Log not found'})
        }
        const uploadedUrls = []

        for (let file of req.files){
            const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((err, result) => {
                if (result) resolve(result);
                else reject(err);
            });
            streamifier.createReadStream(buffer).pipe(stream);
        });
      };
      //wait for cloudinary to finish uploading image
        const result = await streamUpload(file.buffer)
        //saves the returned secured URL
        uploadedUrls.push(result.secure_url);

        }
        log.imageUrls.push(...uploadedUrls)
        await log.save()

        res.status(200).json({
            message:'image uploaded successfully',
            imageUrls: log.imageUrls
        })
    }
    catch(e){
        console.error(e)
        res.status(500).json({message: 'Image upload failed', error: e.message})
    }
})

export default uploadRouter