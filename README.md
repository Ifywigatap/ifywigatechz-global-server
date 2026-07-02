# IfyWigatechz Backend API

A comprehensive MERN backend for the IfyWigatechz website with user authentication, blog management, case studies, and contact management.

## Features

- **User Authentication**: Register, login, profile management
- **Blog Management**: Create, read, update, delete blog posts with comments and likes
- **Case Studies**: Manage case studies with testimonials and results
- **Contact Management**: Handle contact form submissions with admin dashboard
- **Role-Based Access**: User, subscriber, and admin roles
- **Password Security**: Bcrypt hashing and JWT tokens
- **Validation**: Input validation on all endpoints
- **Error Handling**: Comprehensive error handling middleware

## Installation

```bash
cd server
npm install
```

## Environment Setup

1. Create a `.env` file in the server directory (copy from `.env.example`):

```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

**Note for Production:** Update `CORS_ORIGIN` to your frontend's live domain (e.g., `https://www.ifywigatechz.com`).
```

## MongoDB Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and database
3. Get your connection string
4. Add the connection string to your `.env` file

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)
- `PUT /api/auth/change-password` - Change password (requires auth)

### Blog
- `GET /api/blog` - Get all published blog posts
- `GET /api/blog/:slug` - Get single blog post by slug
- `POST /api/blog` - Create blog post (admin only)
- `PUT /api/blog/:id` - Update blog post (author or admin)
- `DELETE /api/blog/:id` - Delete blog post (author or admin)
- `POST /api/blog/:id/like` - Like a post
- `POST /api/blog/:id/comments` - Add comment to post

### Case Studies
- `GET /api/case-studies` - Get all case studies
- `GET /api/case-studies/:slug` - Get single case study
- `POST /api/case-studies` - Create case study (admin only)
- `PUT /api/case-studies/:id` - Update case study (admin only)
- `DELETE /api/case-studies/:id` - Delete case study (admin only)

### Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all contacts (admin only)
- `GET /api/contacts/:id` - Get single contact (admin only)
- `PUT /api/contacts/:id` - Update contact status (admin only)
- `DELETE /api/contacts/:id` - Delete contact (admin only)

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Project Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── .env.example     # Environment template
├── package.json     # Dependencies
└── server.js        # Main server file
```

## Database Models

### User
- name, email, password
- role, phone, avatar
- profile info (bio, company, website, location)
- social links
- preferences (notifications, newsletter)

### BlogPost
- title, slug, content, excerpt
- author, category, tags
- featured image, view count, likes
- comments with replies
- SEO metadata

### CaseStudy
- title, slug, company, industry
- challenge, solution, results
- technologies, images
- testimonials, featured flag

### Contact
- name, email, phone, subject
- message, category, priority
- status (new, read, responded, closed)
- response tracking

## Error Handling

All endpoints return a consistent response format:

```json
{
  "ok": true/false,
  "message": "Success or error message",
  "data": {}
}
```

## Security

- Passwords are hashed with bcryptjs
- JWTs are signed with a secret key
- CORS is configured for allowed origins
- Input validation on all endpoints
- Admin routes protected with role-based middleware

## Development Tips

1. Always include a valid JWT token for protected routes
2. Use `req.userId` and `req.userRole` in controllers
3. Use the `asyncHandler` wrapper for automatic error handling
4. Validate input in middleware before reaching controllers
5. Follow the existing code structure for new features

## Contributing

1. Create a feature branch
2. Make your changes
3. Test your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
