# Full-Stack Review Platform

A full-stack business and product review application with user accounts, authenticated profile management, product discovery, and review workflows.

## Portfolio Context

This repository is a standalone portfolio version maintained by **Krishan Singh**. The implementation originated as a COMP229 academic project and was shared for course submission. The original classroom repository used the working name **Visitara**; this version removes course-style naming and reorganizes the project for portfolio presentation.

## Features

- User registration and sign-in
- JWT-based authenticated API routes
- Password hashing with bcrypt
- User profile retrieval and updates
- Product/business listing endpoints
- Create, list, search, and delete review workflows
- Review lookup by product or user
- React frontend with product/review/profile views
- MongoDB persistence through Mongoose
- Environment-based configuration

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

## Security Improvements in This Portfolio Version

The classroom source contained a database connection string directly in source code. This portfolio version does **not** copy that credential. MongoDB and JWT settings are read from environment variables.

No passwords, database credentials, or API secrets should be committed.

## Run Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Overview

- `POST /api/users` — register
- `POST /api/users/signin` — sign in
- `POST /api/users/signout` — sign out
- `GET /api/users/me` — authenticated profile
- `PUT /api/users/:userid` — update profile
- `GET /api/products` — list products/businesses
- `GET /api/products/:productid` — product details
- `GET /api/reviews` — list reviews
- `POST /api/reviews` — create review
- `GET /api/reviews/search?productId=...` — reviews by product
- `GET /api/reviews/usersearch?userId=...` — reviews by user
- `DELETE /api/reviews/:reviewid` — authenticated review deletion

## Tech Stack

**JavaScript · Node.js · Express · MongoDB · Mongoose · JWT · bcrypt · React · Vite · REST APIs**

## Academic Context

COMP229 — Web Application Development, Centennial College.
