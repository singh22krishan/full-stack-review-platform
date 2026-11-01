# Full-Stack Review Platform

A full-stack business and product review application with user accounts, authenticated profile management, product discovery, and review workflows.

## Portfolio Context

This repository is a standalone portfolio version maintained by **Krishan Singh**. The implementation originated as a COMP229 academic project and was shared for course submission. The original classroom repository used the working name **Visitara**; this version removes course-style naming and reorganizes the project for portfolio presentation.

## Features

- User registration and sign-in
- JWT-based authenticated API routes
- Password hashing with bcrypt
- HttpOnly authentication cookies
- User profile retrieval and ownership-protected updates
- Product/business listing endpoints
- Create, list, search, and ownership-protected review deletion
- React frontend with product/review views
- MongoDB persistence through Mongoose
- Environment-based configuration
- GitHub Actions backend syntax + frontend production-build verification

## Architecture

```text
React / Vite frontend
        |
        | Axios / REST JSON
        v
Node.js + Express API
  |-- auth middleware
  |-- user routes
  |-- product routes
  |-- review routes
        |
        v
MongoDB / Mongoose
```

## Security Improvements

The classroom source contained a database connection string directly in source code. This clean portfolio history does **not** copy that credential. MongoDB and JWT settings are supplied through environment variables.

The current API also includes:

- bcrypt password hashing
- JWT verification middleware
- HttpOnly authentication cookies
- `Secure` + `SameSite=Strict` cookies in production
- no JWT returned in the sign-in JSON response
- registration/sign-in rate limiting
- global API rate limiting
- Helmet security headers
- restricted configurable CORS
- 64 KB JSON request-body limit
- input bounds for names, email, passwords, ratings, titles, and review text
- user ownership checks for profile updates and review deletion
- generic 500 responses instead of returning internal exception details

No passwords, database credentials, or API secrets should be committed.

## Run Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend requires `MONGO_URI` and `JWT_SECRET`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Overview

- `POST /api/users` — register
- `POST /api/users/signin` — sign in and set auth cookie
- `POST /api/users/signout` — clear auth cookie
- `GET /api/users/me` — authenticated profile
- `PUT /api/users/:userid` — ownership-protected profile update
- `GET /api/products` — list products/businesses
- `GET /api/products/:productid` — product details
- `GET /api/reviews` — list recent reviews
- `POST /api/reviews` — authenticated review creation
- `GET /api/reviews/search?productId=...` — reviews by product
- `GET /api/reviews/usersearch?userId=...` — reviews by user
- `DELETE /api/reviews/:reviewid` — ownership-protected deletion

## Build Verification

GitHub Actions verifies that the backend installs and parses successfully and that the React/Vite frontend completes a production build.

## Tech Stack

**JavaScript · Node.js · Express · MongoDB · Mongoose · JWT · bcrypt · Helmet · React · Vite · REST APIs · GitHub Actions**

## Academic Context

COMP229 — Web Application Development, Centennial College.
