const express = require('express');
const router = express.Router();
const { getNews, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getNews).post(protect, createNews);
router.route('/:id').put(protect, updateNews).delete(protect, deleteNews);

module.exports = router;
