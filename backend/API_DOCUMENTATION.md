# API Documentation

Complete API reference for the Notes & Bookmarks Manager backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## HTTP Status Codes

- `200` - OK (successful GET, PUT, DELETE)
- `201` - Created (successful POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, string
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### Login User

Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Notes Endpoints

All note endpoints require authentication.

### Create Note

Create a new note.

**Endpoint:** `POST /api/notes`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "My First Note",
  "content": "This is the content of my note",
  "tags": ["personal", "ideas"],
  "isFavorite": false
}
```

**Validation Rules:**
- `title`: Required, string, max 200 characters
- `content`: Required, string
- `tags`: Optional, array of strings
- `isFavorite`: Optional, boolean (default: false)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc456def789...",
    "title": "My First Note",
    "content": "This is the content of my note",
    "tags": ["personal", "ideas"],
    "isFavorite": false,
    "user": "64abc123def456...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get All Notes

Retrieve all notes for the authenticated user with optional search and filtering.

**Endpoint:** `GET /api/notes`

**Authentication:** Required

**Query Parameters:**
- `q` (optional): Search term for full-text search
- `tags` (optional): Comma-separated tags for filtering

**Examples:**
```
GET /api/notes
GET /api/notes?q=javascript
GET /api/notes?tags=personal,work
GET /api/notes?q=meeting&tags=work
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64abc456def789...",
      "title": "My First Note",
      "content": "This is the content",
      "tags": ["personal", "ideas"],
      "isFavorite": false,
      "user": "64abc123def456...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64abc789def012...",
      "title": "Another Note",
      "content": "More content here",
      "tags": ["work"],
      "isFavorite": true,
      "user": "64abc123def456...",
      "createdAt": "2024-01-16T14:20:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

---

### Get Single Note

Retrieve a specific note by ID.

**Endpoint:** `GET /api/notes/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Note ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc456def789...",
    "title": "My First Note",
    "content": "This is the content",
    "tags": ["personal", "ideas"],
    "isFavorite": false,
    "user": "64abc123def456...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Note not found"
}
```

---

### Update Note

Update an existing note.

**Endpoint:** `PUT /api/notes/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Note ID

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "content": "Updated content",
  "tags": ["updated", "modified"],
  "isFavorite": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc456def789...",
    "title": "Updated Note Title",
    "content": "Updated content",
    "tags": ["updated", "modified"],
    "isFavorite": true,
    "user": "64abc123def456...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-17T09:15:00.000Z"
  }
}
```

---

### Delete Note

Delete a note.

**Endpoint:** `DELETE /api/notes/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Note ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Note not found"
}
```

---

## Bookmarks Endpoints

All bookmark endpoints require authentication.

### Create Bookmark

Create a new bookmark.

**Endpoint:** `POST /api/bookmarks`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "GitHub",
  "url": "https://github.com",
  "description": "Code hosting platform",
  "tags": ["dev", "tools"],
  "isFavorite": true
}
```

**Auto-fetch Title:**
If `title` is empty or not provided, the API will automatically fetch the webpage title:
```json
{
  "url": "https://github.com",
  "description": "Code hosting platform",
  "tags": ["dev"]
}
```

**Validation Rules:**
- `title`: Optional (auto-fetched if empty), string, max 300 characters
- `url`: Required, valid URL starting with http:// or https://
- `description`: Optional, string, max 1000 characters
- `tags`: Optional, array of strings
- `isFavorite`: Optional, boolean (default: false)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc789def012...",
    "title": "GitHub: Let's build from here",
    "url": "https://github.com",
    "description": "Code hosting platform",
    "tags": ["dev", "tools"],
    "isFavorite": true,
    "user": "64abc123def456...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Please provide a valid URL starting with http:// or https://"
}
```

---

### Get All Bookmarks

Retrieve all bookmarks for the authenticated user with optional search and filtering.

**Endpoint:** `GET /api/bookmarks`

**Authentication:** Required

**Query Parameters:**
- `q` (optional): Search term for full-text search
- `tags` (optional): Comma-separated tags for filtering

**Examples:**
```
GET /api/bookmarks
GET /api/bookmarks?q=github
GET /api/bookmarks?tags=dev,tools
GET /api/bookmarks?q=documentation&tags=dev
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64abc789def012...",
      "title": "GitHub",
      "url": "https://github.com",
      "description": "Code hosting platform",
      "tags": ["dev", "tools"],
      "isFavorite": true,
      "user": "64abc123def456...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64abc012def345...",
      "title": "Stack Overflow",
      "url": "https://stackoverflow.com",
      "description": "Q&A for developers",
      "tags": ["dev", "help"],
      "isFavorite": false,
      "user": "64abc123def456...",
      "createdAt": "2024-01-16T11:45:00.000Z",
      "updatedAt": "2024-01-16T11:45:00.000Z"
    }
  ]
}
```

---

### Get Single Bookmark

Retrieve a specific bookmark by ID.

**Endpoint:** `GET /api/bookmarks/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Bookmark ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc789def012...",
    "title": "GitHub",
    "url": "https://github.com",
    "description": "Code hosting platform",
    "tags": ["dev", "tools"],
    "isFavorite": true,
    "user": "64abc123def456...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Bookmark not found"
}
```

---

### Update Bookmark

Update an existing bookmark.

**Endpoint:** `PUT /api/bookmarks/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Bookmark ID

**Request Body:**
```json
{
  "title": "GitHub - Updated",
  "url": "https://github.com",
  "description": "Updated description",
  "tags": ["development", "git"],
  "isFavorite": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc789def012...",
    "title": "GitHub - Updated",
    "url": "https://github.com",
    "description": "Updated description",
    "tags": ["development", "git"],
    "isFavorite": false,
    "user": "64abc123def456...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-17T13:20:00.000Z"
  }
}
```

---

### Delete Bookmark

Delete a bookmark.

**Endpoint:** `DELETE /api/bookmarks/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Bookmark ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Bookmark not found"
}
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 400 Bad Request (Validation)
```json
{
  "success": false,
  "message": "Title is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

## CORS

CORS is enabled for all origins in development. Configure for specific origins in production.

## Pagination

Currently not implemented. All results are returned in a single response. Consider adding pagination for large datasets.
