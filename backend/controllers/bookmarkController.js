const Bookmark = require('../models/Bookmark');
const { fetchWebpageTitle } = require('../utils/fetchTitle');

exports.createBookmark = async (req, res, next) => {
  try {
    let { title, url, description, tags, isFavorite } = req.body;

    if (!title || title.trim().length === 0) {
      title = await fetchWebpageTitle(url);
    }

    const bookmark = await Bookmark.create({
      title,
      url,
      description: description || '',
      tags: tags || [],
      isFavorite: isFavorite || false,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const { q, tags } = req.query;
    let query = { user: req.user.id };

    if (q) {
      query.$text = { $search: q };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    res.status(200).json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBookmark = async (req, res, next) => {
  try {
    const { title, url, description, tags, isFavorite } = req.body;

    let bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    bookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      { title, url, description, tags, isFavorite },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    await Bookmark.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
