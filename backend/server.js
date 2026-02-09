const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route for testing
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Notes & Bookmarks API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      notes: '/api/notes',
      bookmarks: '/api/bookmarks'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found. Available routes: /api/auth, /api/notes, /api/bookmarks`
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
