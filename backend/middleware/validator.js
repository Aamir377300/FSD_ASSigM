const validateNote = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Content is required'
    });
  }

  next();
};

const validateBookmark = (req, res, next) => {
  const { url } = req.body;

  if (!url || url.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'URL is required'
    });
  }

  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(url)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid URL starting with http:// or https://'
    });
  }

  next();
};

module.exports = { validateNote, validateBookmark };
