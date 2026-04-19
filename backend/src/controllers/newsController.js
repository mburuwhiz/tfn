const News = require('../models/News');

const getNews = async (req, res) => {
  const news = await News.find({}).sort({ createdAt: -1 });
  res.json(news);
};

const createNews = async (req, res) => {
  const { title, content, mediaUrl } = req.body;
  const news = await News.create({ title, content, mediaUrl });
  res.status(201).json(news);
};

const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, mediaUrl } = req.body;

  const news = await News.findById(id);
  if (news) {
    news.title = title;
    news.content = content;
    news.mediaUrl = mediaUrl;
    const updatedNews = await news.save();
    res.json(updatedNews);
  } else {
    res.status(404).json({ message: 'News not found' });
  }
};

const deleteNews = async (req, res) => {
  const { id } = req.params;
  const news = await News.findById(id);
  if (news) {
    await news.deleteOne();
    res.json({ message: 'News removed' });
  } else {
    res.status(404).json({ message: 'News not found' });
  }
};

module.exports = { getNews, createNews, updateNews, deleteNews };
