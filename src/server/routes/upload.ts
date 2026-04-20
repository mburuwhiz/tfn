import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware } from '../middleware/auth.js';
import config from '../config.js';

const router = express.Router();

// The user provided CLOUDINARY_URL format which inherently contains all credentials.
// Let's use it if available, otherwise fallback to the parts.
const envCloudinaryUrl = process.env.CLOUDINARY_URL;

if (envCloudinaryUrl) {
  cloudinary.config({
    cloudinary_url: envCloudinaryUrl
  });
  console.log('Cloudinary initialized via CLOUDINARY_URL env var.');
} else {
  cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  });
  console.log('Cloudinary initialized via config parts.');
}

// Multer config - memory storage for direct upload to Cloudinary stream
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Wrap the stream upload in a Promise so we can easily await it and catch errors
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'tfn'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary SDK Error:', error);
            return reject(error);
          }
          resolve(result);
        }
      );

      // Important: end the stream with the buffer
      stream.end(req.file?.buffer);
    });

    res.json({ url: (uploadResult as any).secure_url });
  } catch (err: any) {
    console.error('UPLOAD ROUTE CRASH:', err);
    res.status(500).json({ message: err.message || 'Failed to upload image' });
  }
});

export default router;
