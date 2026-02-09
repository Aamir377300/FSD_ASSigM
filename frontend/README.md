# Notes & Bookmarks Manager - Frontend

Modern, responsive web application built with Next.js and Tailwind CSS.

## Features

- User authentication (login/register)
- Create, read, update, delete notes and bookmarks
- Real-time search functionality
- Tag-based filtering
- Mark items as favorites
- Responsive design (mobile, tablet, desktop)
- Protected routes with JWT authentication
- Clean, minimal UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## Project Structure

```
frontend/
├── app/
│   ├── bookmarks/
│   │   └── page.js           # Bookmarks page
│   ├── notes/
│   │   └── page.js           # Notes page
│   ├── login/
│   │   └── page.js           # Login page
│   ├── register/
│   │   └── page.js           # Register page
│   ├── layout.js             # Root layout with navbar
│   ├── page.js               # Home page (redirects)
│   └── globals.css           # Global styles
├── components/
│   ├── Navbar.js             # Navigation bar
│   ├── NoteCard.js           # Note display card
│   ├── NoteModal.js          # Note create/edit modal
│   ├── BookmarkCard.js       # Bookmark display card
│   ├── BookmarkModal.js      # Bookmark create/edit modal
│   └── SearchBar.js          # Search and filter component
├── context/
│   └── AuthContext.js        # Authentication context
├── lib/
│   └── api.js                # Axios instance with interceptors
├── .env.local.example        # Environment variables template
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages Overview

### Authentication Pages

#### `/login`
- Email and password login
- Link to registration page
- Error handling for invalid credentials

#### `/register`
- User registration with name, email, password
- Password validation (min 6 characters)
- Automatic login after registration

### Main Pages

#### `/notes`
- Display all user notes in a grid layout
- Search notes by text
- Filter notes by tags
- Create new notes
- Edit existing notes
- Delete notes
- Mark notes as favorites

#### `/bookmarks`
- Display all user bookmarks in a grid layout
- Search bookmarks by text
- Filter bookmarks by tags
- Create new bookmarks
- Edit existing bookmarks
- Delete bookmarks
- Mark bookmarks as favorites
- Auto-fetch webpage titles

## Components

### Navbar
- Navigation links (Notes, Bookmarks)
- User name display
- Logout button
- Active route highlighting

### NoteCard
- Displays note title, content preview, tags
- Shows creation date
- Edit and delete buttons
- Favorite indicator (star icon)

### NoteModal
- Create/edit note form
- Title and content inputs
- Tag input (comma-separated)
- Favorite checkbox
- Form validation

### BookmarkCard
- Displays bookmark title, URL, description
- Shows creation date
- Edit and delete buttons
- Favorite indicator
- Clickable URL (opens in new tab)

### BookmarkModal
- Create/edit bookmark form
- URL input with validation
- Optional title (auto-fetches if empty)
- Description and tags inputs
- Favorite checkbox

### SearchBar
- Text search input
- Tag filter buttons
- Active tag highlighting
- Real-time filtering

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is automatically included in all API requests
4. Protected routes redirect to login if no token
5. Token is validated on page load
6. Logout removes token and redirects to login

## API Integration

The app uses Axios with interceptors for:
- Automatic token injection in request headers
- Automatic redirect to login on 401 errors
- Centralized error handling

```javascript
// Example API call
import api from '@/lib/api'

const response = await api.get('/notes')
const notes = response.data.data
```

## Styling

### Tailwind CSS Classes Used

- Layout: `flex`, `grid`, `max-w-7xl`, `mx-auto`
- Spacing: `p-4`, `m-6`, `space-x-4`
- Colors: `bg-blue-600`, `text-gray-900`, `border-gray-300`
- Typography: `text-3xl`, `font-bold`, `text-sm`
- Effects: `shadow-md`, `hover:shadow-lg`, `transition`
- Responsive: `md:grid-cols-2`, `lg:grid-cols-3`

### Custom Styles

- Line clamping for text overflow
- Smooth transitions on hover
- Focus states for accessibility
- Mobile-first responsive design

## Responsive Design

### Breakpoints

- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

### Mobile Optimizations

- Touch-friendly button sizes
- Readable font sizes
- Proper spacing for touch targets
- Responsive navigation
- Full-width modals on mobile

## State Management

### AuthContext

Provides global authentication state:
- `user` - Current user object
- `loading` - Auth loading state
- `login(email, password)` - Login function
- `register(name, email, password)` - Register function
- `logout()` - Logout function

Usage:
```javascript
import { useAuth } from '@/context/AuthContext'

const { user, login, logout } = useAuth()
```

## Error Handling

- Form validation errors displayed inline
- API errors shown in alert boxes
- Network errors handled gracefully
- 401 errors trigger automatic logout
- User-friendly error messages

## Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Deploy to hosting platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify
   - Custom server

## Environment Variables

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Next.js automatic code splitting
- Image optimization (if images added)
- CSS purging with Tailwind
- Client-side caching with React state
- Lazy loading of modals

## Accessibility

- Semantic HTML elements
- Keyboard navigation support
- Focus states on interactive elements
- ARIA labels where needed
- Color contrast compliance

## Future Enhancements

- Rich text editor for notes
- Bookmark preview thumbnails
- Export notes to PDF/Markdown
- Bulk operations (delete, tag)
- Dark mode support
- Offline support with PWA
- Drag-and-drop reordering
- Note sharing functionality

## Troubleshooting

### API Connection Issues
- Verify backend is running on correct port
- Check NEXT_PUBLIC_API_URL in .env.local
- Ensure CORS is enabled on backend

### Authentication Issues
- Clear localStorage and try logging in again
- Check JWT_SECRET matches between frontend and backend
- Verify token expiration settings

### Build Errors
- Delete `.next` folder and rebuild
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## License

MIT
