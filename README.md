# Personal Notes & Bookmark Manager

A full-stack MERN application for managing personal notes and bookmarks with JWT authentication, search functionality, and tag-based filtering.

## Overview

This is a production-ready application built as a demonstration of clean architecture, proper validation, and scalable structure. The project consists of a RESTful API backend and a modern responsive frontend.

## Features

### Core Functionality
- **Notes Management**: Create, read, update, and delete personal notes
- **Bookmarks Management**: Save and organize web bookmarks
- **Search**: Full-text search across notes and bookmarks
- **Tag Filtering**: Organize and filter items by tags
- **Favorites**: Mark important items as favorites
- **Auto-fetch Titles**: Automatically fetch webpage titles for bookmarks

### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- User-scoped data (users can only access their own data)
- Protected API routes
- Token expiration handling

### User Experience
- Clean, minimal UI with Tailwind CSS
- Responsive design (mobile, tablet, desktop)
- Real-time search and filtering
- Intuitive modals for create/edit operations
- Loading states and error handling

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Web Scraping**: Axios + Cheerio (for bookmark titles)
- **Validation**: Custom middleware

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## Project Structure

```
.
├── backend/                    # Node.js/Express API
│   ├── config/                # Database configuration
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Auth, validation, error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── utils/                 # Helper functions
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                   # Next.js application
│   ├── app/                   # Next.js pages (App Router)
│   ├── components/            # React components
│   ├── context/               # React Context (Auth)
│   ├── lib/                   # Utilities (API client)
│   └── package.json
│
└── README.md                   # This file
```

## Quick Start

### Prerequisites
- Node.js v16 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure `.env`:
   ```env
   PORT=5002
   MONGODB_URI=mongodb://localhost:27017/notes-bookmarks
   JWT_SECRET=your_super_secret_jwt_key_change_this
   NODE_ENV=development
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:5002`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5002/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Notes
- `POST /api/notes` - Create note (protected)
- `GET /api/notes` - Get all notes with optional search/filter (protected)
- `GET /api/notes/:id` - Get single note (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)

### Bookmarks
- `POST /api/bookmarks` - Create bookmark (protected)
- `GET /api/bookmarks` - Get all bookmarks with optional search/filter (protected)
- `GET /api/bookmarks/:id` - Get single bookmark (protected)
- `PUT /api/bookmarks/:id` - Update bookmark (protected)
- `DELETE /api/bookmarks/:id` - Delete bookmark (protected)

### Query Parameters
- `q` - Search term for text search
- `tags` - Comma-separated tags for filtering (e.g., `?tags=work,personal`)

## Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Note
```javascript
{
  title: String,
  content: String,
  tags: [String],
  isFavorite: Boolean,
  user: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookmark
```javascript
{
  title: String,
  url: String,
  description: String,
  tags: [String],
  isFavorite: Boolean,
  user: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Key Features Explained

### JWT Authentication
- Tokens are generated on login/register
- Tokens expire in 30 days
- All note and bookmark routes require authentication
- Frontend stores token in localStorage
- Automatic token injection in API requests

### Auto-fetch Bookmark Titles
When creating a bookmark, if the title field is left empty, the backend:
1. Fetches the webpage HTML using Axios
2. Parses it with Cheerio
3. Extracts the title from `<title>`, Open Graph, or Twitter meta tags
4. Falls back to the URL if title cannot be fetched

### Search & Filter
- Text search uses MongoDB text indexes for performance
- Searches across title and content/description fields
- Tag filtering supports multiple tags
- Both can be combined in a single query

### User Data Isolation
- All queries automatically filter by authenticated user ID
- Users cannot access other users' data
- Enforced at the database query level

## Architecture Decisions

### Backend
- **MVC Pattern**: Separation of routes, controllers, and models
- **Middleware Chain**: Auth → Validation → Controller → Error Handler
- **Centralized Error Handling**: Single middleware for all errors
- **Environment Variables**: Configuration separated from code
- **Text Indexes**: MongoDB text indexes for efficient search

### Frontend
- **App Router**: Next.js 14 App Router for modern routing
- **Context API**: Simple global state for authentication
- **Axios Interceptors**: Automatic token injection and error handling
- **Component Composition**: Reusable cards, modals, and search components
- **Client-Side Rendering**: 'use client' for interactive components

## Testing the Application

### Using cURL

Register a user:
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

Login:
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Create a note (replace TOKEN):
```bash
curl -X POST http://localhost:5002/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My Note","content":"Note content","tags":["personal"]}'
```

### Using the UI

1. Open `http://localhost:3000`
2. Click "Register" and create an account
3. You'll be automatically logged in and redirected to Notes page
4. Click "+ New Note" to create your first note
5. Navigate to "Bookmarks" to manage bookmarks

## Production Deployment

### Backend Deployment

1. Set environment variables:
   ```env
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<strong-random-secret>
   PORT=5002
   ```

2. Build and start:
   ```bash
   npm start
   ```


### Frontend Deployment

1. Update environment variable:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Deploy to:
   - Vercel (recommended)
   - Netlify
   - AWS Amplify
   - Custom server with `npm start`

## Security Considerations

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens have expiration
- CORS is enabled (configure for production)
- Input validation on all endpoints
- MongoDB injection prevention with Mongoose
- User data isolation at query level
- HTTPS required in production

## Performance Optimizations

- MongoDB indexes on frequently queried fields
- Text indexes for search functionality
- Next.js automatic code splitting
- Tailwind CSS purging unused styles
- Axios request/response interceptors
- React Context for minimal re-renders


