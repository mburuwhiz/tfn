const Gallery = require('../models/Gallery');

const getGallery = async (req, res) => {
  const images = await Gallery.find({}).sort({ createdAt: -1 });
  res.json(images);
};

const deleteGalleryImage = async (req, res) => {
  const { id } = req.params;
  const image = await Gallery.findById(id);
  if (image) {
    await image.deleteOne();
    res.json({ message: 'Image removed' });
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
};

const addGalleryImage = async (req, res) => {
  const { url, description } = req.body;
  const image = await Gallery.create({ url, description });
  res.status(201).json(image);
};

module.exports = { getGallery, deleteGalleryImage, addGalleryImage };
