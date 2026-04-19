const express = require('express');
const router = express.Router();
const { getGallery, deleteGalleryImage, addGalleryImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getGallery).post(protect, addGalleryImage);
router.route('/:id').delete(protect, deleteGalleryImage);

module.exports = router;
