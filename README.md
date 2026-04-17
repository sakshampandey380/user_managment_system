# User Management Backend System

Node.js, Express.js, TypeScript, JWT, bcrypt, and MySQL backend for user registration, login, protected user access, admin user listing, and account blocking.

## Tech Stack

- Node.js + Express.js
- TypeScript with strict mode enabled
- MySQL using `mysql2`
- JWT using `jsonwebtoken`
- Password hashing using `bcryptjs`
- Environment variables using `dotenv`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a MySQL database:

```sql
CREATE DATABASE user_management_system;
```

3. Configure `.env`:

```env
PORT=3000
JWT_SECRET=your_secret_key
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=user_management_system
```

For XAMPP/phpMyAdmin, the default MySQL user is usually `root` with an empty password. If your MySQL user has a password, put that value in `DB_PASSWORD`.

4. Start the development server:

```bash
npm run dev
```

The server creates the `users` table automatically if it does not already exist.

## Build and Run

```bash
npm run build
npm start
```

## User Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Error Format

All errors return JSON in this shape:

```json
{
  "error": true,
  "message": "Description here"
}
```

## Authentication

Protected routes require this header:

```http
Authorization: Bearer <token>
```

Login tokens expire in 24 hours and contain:

```json
{
  "userId": 1,
  "role": "user"
}
```

## API Endpoints

### POST /register

Registers a new user with default role `user` and `is_active = true`.

Request:

```json
{
  "full_name": "John Doe",
  "date_of_birth": "1998-05-20",
  "email": "john@example.com",
  "password": "secret123"
}
```

Success response `201`:

```json
{
  "message": "User registered successfully"
}
```

Email already exists response `400`:

```json
{
  "error": true,
  "message": "Email already exists"
}
```

### POST /login

Request:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Success response `200`:

```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

Possible errors:

- `404` if user does not exist
- `403` if account is blocked
- `401` if password is wrong

### GET /users/:id

Protected route.

Authorization:

- Admin can access any user.
- User can access only their own data.

Success response `200`:

```json
{
  "id": 1,
  "full_name": "John Doe",
  "date_of_birth": "1998-05-20",
  "email": "john@example.com",
  "role": "user",
  "is_active": true,
  "created_at": "2026-04-17T10:00:00.000Z",
  "updated_at": "2026-04-17T10:00:00.000Z"
}
```

The password field is never returned.

### GET /users

Protected admin-only route.

Success response `200`:

```json
[
  {
    "id": 1,
    "full_name": "John Doe",
    "date_of_birth": "1998-05-20",
    "email": "john@example.com",
    "role": "user",
    "is_active": true,
    "created_at": "2026-04-17T10:00:00.000Z",
    "updated_at": "2026-04-17T10:00:00.000Z"
  }
]
```

Returns `403` if the authenticated user is not an admin.

### PUT /users/:id/block

Protected route.

Authorization:

- Admin can block any user.
- User can block only themselves.

Success response `200`:

```json
{
  "message": "User blocked successfully"
}
```

Returns `403` if a non-admin user tries to block another user.

## Validation Rules

- `full_name`: required and trimmed
- `date_of_birth`: required and must be a valid date
- `email`: required, trimmed, and must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `password`: required, trimmed, and minimum 6 characters

## Notes

- Passwords are hashed with bcrypt using `saltRounds = 10`.
- Plain text passwords are never stored or returned.
- JWT secrets and database settings are loaded from environment variables.
- Business logic lives in services, controllers only handle request and response flow.
