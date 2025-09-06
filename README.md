# 🛡️ Auth System

A complete **authentication system** for Node.js and TypeScript, supporting:

- Email/password authentication
- Google OAuth 2.0
- GitHub OAuth 2.0
- JWT-based authentication for protected routes
- Refresh token mechanism
- Logout functionality
- Input validation with Joi
- Error handling

---

## 📝 Features

### Authentication

- **Register**: create a new user with email and password.
- **Login**: login using email/password.
- **Google Login**: login using Google account.
- **GitHub Login**: login using GitHub account.
- **Refresh Token**: get a new access token using a refresh token.
- **Logout**: invalidate the refresh token.

### Security

- JWT for stateless authentication
- Passwords hashed with bcrypt
- Protected routes with `isAuthenticated` middleware
- Rate limiting, Helmet, HPP, CORS

### Input Validation

- Joi schema validation for all endpoints (register, login, refresh token)

### Error Handling

- Centralized error handling with custom `AppError` class
- Detailed error messages and HTTP status codes

---

## ⚡ Endpoints

### Public Routes

| Method | Route                     | Description                    |
|--------|---------------------------|--------------------------------|
| GET    | `/oauthloginPage`         | Links for Google/GitHub login |
| POST   | `/auth/register`          | Register a new user            |
| POST   | `/auth/login`             | Login with email/password      |
| POST   | `/auth/refresh-token`     | Get a new access token         |

### OAuth Routes

| Method | Route                       | Description                 |
|--------|-----------------------------|-----------------------------|
| GET    | `/auth/google`              | Login with Google           |
| GET    | `/auth/google/callback`     | Google OAuth callback       |
| GET    | `/auth/google/failure`      | Google login failure        |
| GET    | `/auth/github`              | Login with GitHub           |
| GET    | `/auth/github/callback`     | GitHub OAuth callback       |
| GET    | `/auth/github/failure`      | GitHub login failure        |

### Protected Routes

| Method | Route              | Description       |
|--------|------------------|-----------------|
| PATCH  | `/auth/logout`     | Logout user      |

> Use `Authorization: Bearer <token>` header to access protected routes.

