import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware } from '../middleware/auth.js';
import config, { CLOUDINARY_URL } from '../config.js';

const router = express.Router();

// Initialize Cloudinary using the URL format which is more robust
cloudinary.config({
  cloudinary_url: CLOUDINARY_URL
});

// Log Cloudinary status for debugging
console.log('Cloudinary Initialized with URL:', {
  cloud_name: config.cloudinary.cloud_name,
  api_key_status: config.cloudinary.api_key ? `EXISTS (${config.cloudinary.api_key.length} chars)` : 'MISSING'
});

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Define config explicitly for this call to avoid singleton state issues
  const uploadConfig = {
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  };

  console.log('UPLOAD CALL - Using Config:', {
    cloud_name: uploadConfig.cloud_name,
    api_key: uploadConfig.api_key ? '***' + uploadConfig.api_key.slice(-4) : 'MISSING'
  });

  if (!uploadConfig.api_key || !uploadConfig.cloud_name) {
    return res.status(500).json({ message: `Cloudinary credentials missing in server config: key=${!!uploadConfig.api_key}, name=${!!uploadConfig.cloud_name}` });
  }

  try {
    const stream = cloudinary.uploader.upload_stream(
      { 
        resource_type: 'auto', 
        folder: 'tfn',
        ...uploadConfig // Pass config directly into the options object
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary SDK Error:', error);
          return res.status(500).json({ message: error.message });
        }
        res.json({ url: result?.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (err: any) {
    console.error('UPLOAD ROUTE CRASH:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
