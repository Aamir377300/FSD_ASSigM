# Notes & Bookmarks Manager - Backend API

Production-ready REST API built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication
- User-scoped data (notes and bookmarks)
- Full CRUD operations for notes and bookmarks
- Search functionality (text search)
- Tag-based filtering
- Auto-fetch webpage titles for bookmarks
- Input validation and error handling
- Clean architecture with separation of concerns

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Custom middleware
- **Web Scraping**: Axios + Cheerio (for bookmark titles)

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── noteController.js     # Notes CRUD operations
│   └── bookmarkController.js # Bookmarks CRUD operations
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Centralized error handling
│   └── validator.js         # Input validation
├── models/
│   ├── User.js              # User schema
│   ├── Note.js              # Note schema
│   └── Bookmark.js          # Bookmark schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── noteRoutes.js        # Note endpoints
│   └── bookmarkRoutes.js    # Bookmark endpoints
├── utils/
│   └── fetchTitle.js        # Webpage title fetcher
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── server.js                # Application entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/notes-bookmarks
   JWT_SECRET=your_super_secret_jwt_key_change_this
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

6. **Verify server is running**
   ```bash
   curl http://localhost:5000/api/health
   ```

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Notes Endpoints

All note endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

#### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my note",
  "tags": ["personal", "ideas"],
  "isFavorite": false
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "64abc456...",
    "title": "My First Note",
    "content": "This is the content of my note",
    "tags": ["personal", "ideas"],
    "isFavorite": false,
    "user": "64abc123...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer <token>

# With search query
GET /api/notes?q=javascript

# With tag filter
GET /api/notes?tags=personal,work

# Combined
GET /api/notes?q=meeting&tags=work

Response (200):
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64abc456...",
      "title": "My First Note",
      "content": "This is the content",
      "tags": ["personal"],
      "isFavorite": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Single Note
```http
GET /api/notes/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "64abc456...",
    "title": "My First Note",
    "content": "This is the content",
    "tags": ["personal"],
    "isFavorite": false
  }
}
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Note Title",
  "content": "Updated content",
  "tags": ["updated"],
  "isFavorite": true
}

Response (200):
{
  "success": true,
  "data": {
    "_id": "64abc456...",
    "title": "Updated Note Title",
    "content": "Updated content",
    "tags": ["updated"],
    "isFavorite": true
  }
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {}
}
```

### Bookmarks Endpoints

All bookmark endpoints require authentication.

#### Create Bookmark
```http
POST /api/bookmarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "GitHub",
  "url": "https://github.com",
  "description": "Code hosting platform",
  "tags": ["dev", "tools"],
  "isFavorite": true
}

# Auto-fetch title (leave title empty)
{
  "url": "https://github.com",
  "description": "Code hosting platform",
  "tags": ["dev"]
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "64abc789...",
    "title": "GitHub: Let's build from here",
    "url": "https://github.com",
    "description": "Code hosting platform",
    "tags": ["dev", "tools"],
    "isFavorite": true,
    "user": "64abc123...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Bookmarks
```http
GET /api/bookmarks
Authorization: Bearer <token>

# With search
GET /api/bookmarks?q=github

# With tags
GET /api/bookmarks?tags=dev,tools

Response (200):
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64abc789...",
      "title": "GitHub",
      "url": "https://github.com",
      "description": "Code hosting platform",
      "tags": ["dev", "tools"],
      "isFavorite": true
    }
  ]
}
```

#### Get Single Bookmark
```http
GET /api/bookmarks/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "_id": "64abc789...",
    "title": "GitHub",
    "url": "https://github.com",
    "description": "Code hosting platform"
  }
}
```

#### Update Bookmark
```http
PUT /api/bookmarks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "GitHub - Updated",
  "url": "https://github.com",
  "description": "Updated description",
  "tags": ["development"],
  "isFavorite": false
}

Response (200):
{
  "success": true,
  "data": {
    "_id": "64abc789...",
    "title": "GitHub - Updated",
    "url": "https://github.com",
    "description": "Updated description",
    "tags": ["development"],
    "isFavorite": false
  }
}
```

#### Delete Bookmark
```http
DELETE /api/bookmarks/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {}
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Data Models

### User
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Note
```javascript
{
  title: String (required, max 200 chars),
  content: String (required),
  tags: [String] (lowercase),
  isFavorite: Boolean (default: false),
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Bookmark
```javascript
{
  title: String (required, max 300 chars),
  url: String (required, validated),
  description: String (max 1000 chars),
  tags: [String] (lowercase),
  isFavorite: Boolean (default: false),
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Key Features Explained

### JWT Authentication
- Tokens expire in 30 days
- All note and bookmark routes are protected
- Token must be included in Authorization header

### Auto-fetch Bookmark Titles
- If title is empty when creating a bookmark, the API fetches the webpage title
- Uses Axios to fetch HTML and Cheerio to parse it
- Falls back to URL if title cannot be fetched

### Search & Filter
- Text search uses MongoDB text indexes
- Tag filtering supports multiple tags (comma-separated)
- Both can be combined in a single query

### User Data Isolation
- All queries automatically filter by authenticated user
- Users can only access their own notes and bookmarks

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login (save the token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Create Note (replace TOKEN)
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test Note","content":"Test content","tags":["test"]}'

# Get Notes
curl -X GET http://localhost:5000/api/notes \
  -H "Authorization: Bearer TOKEN"
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or managed MongoDB
4. Enable CORS only for your frontend domain
5. Use HTTPS in production
6. Consider rate limiting and request validation
7. Set up logging and monitoring

## License

MIT
