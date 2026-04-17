# 🔐 User Management Backend System

A secure and scalable backend application built with **Node.js, Express.js, TypeScript, MySQL, JWT, and bcrypt**.

This project implements a complete user management system featuring authentication, role-based authorization, protected APIs, and account lifecycle control. It follows clean architecture principles and real-world backend development practices.

---

## 🚀 Features

* User Registration & Login (JWT-based authentication)
* Role-based Authorization (`admin` / `user`)
* Protected Routes with Middleware
* Ownership-based Access Control
* Admin-only User Listing
* User Account Blocking (Soft Delete)
* Input Validation & Error Handling
* Secure Password Hashing (bcrypt)
* Environment-based Configuration

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Language:** TypeScript (strict mode enabled)
* **Database:** MySQL (`mysql2`)
* **Authentication:** JSON Web Tokens (`jsonwebtoken`)
* **Security:** bcrypt (`bcryptjs`)
* **Environment:** dotenv

---

## ⚙️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Setup Database

Create a MySQL database:

```sql
CREATE DATABASE user_management_system;
```

---

### 3. Configure Environment Variables

Create a `.env` file:

```env
PORT=3000
JWT_SECRET=your_secret_key

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=user_management_system
```

> 💡 If you're using XAMPP/phpMyAdmin, default MySQL credentials are usually `root` with no password.

---

### 4. Run the Application

```bash
npm run dev
```

The application will automatically create the required `users` table if it does not exist.

---

## 🏗️ Build & Production

```bash
npm run build
npm start
```

---

## 🗄️ Database Schema

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

---

## 🔐 Authentication

Protected routes require a JWT token:

```http
Authorization: Bearer <token>
```

* Token expires in **24 hours**
* Payload structure:

```json
{
  "userId": 1,
  "role": "user"
}
```

---

## 📡 API Endpoints

### 🔹 POST `/register`

Registers a new user.

```json
{
  "full_name": "John Doe",
  "date_of_birth": "1998-05-20",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success (201):**

```json
{
  "message": "User registered successfully"
}
```

---

### 🔹 POST `/login`

Authenticates user and returns JWT.

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success (200):**

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 🔹 GET `/users/:id` (Protected)

* Admin → access any user
* User → access only their own data

**Response excludes password**

---

### 🔹 GET `/users` (Admin Only)

Returns all users.

* ❌ Returns `403` if not admin

---

### 🔹 PUT `/users/:id/block` (Protected)

Blocks a user account (`is_active = false`)

* Admin → block any user
* User → block self only

---

## ⚠️ Error Handling

All errors follow a consistent format:

```json
{
  "error": true,
  "message": "Description here"
}
```

### Status Codes

* `400` → Validation errors
* `401` → Unauthorized (JWT issues)
* `403` → Forbidden (permission / blocked user)
* `404` → Resource not found
* `500` → Server error

---

## ✅ Validation Rules

* `full_name` → required, trimmed
* `date_of_birth` → required, valid date
* `email` → required, trimmed, valid format
* `password` → required, minimum 6 characters

---

## 🔒 Security Practices

* Passwords are hashed using bcrypt (`saltRounds = 10`)
* Plain text passwords are never stored or returned
* JWT is used for secure authentication
* Blocked users cannot log in
* Sensitive data is never exposed in API responses

---

## 🧠 Architecture & Design

* Clean separation of concerns:

  * Controllers → handle requests/responses
  * Services → business logic
  * Middleware → authentication & error handling
* TypeScript ensures type safety and scalability
* Modular structure for maintainability

---

## 📌 Notes

* Database table is auto-created on server start
* Environment variables are required for configuration
* Designed to follow real-world backend standards

---

## 👨‍💻 Author

**Saksham**

This project was developed as part of a backend assignment to demonstrate practical understanding of authentication, authorization, and secure API design.

---

## 📬 Final Thoughts

This project showcases:

* Secure backend development
* Role-based access control
* Clean and maintainable architecture

Feedback and suggestions are always welcome 🚀
