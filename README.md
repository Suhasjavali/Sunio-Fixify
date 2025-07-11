# Sunio Fixify

Sunio Fixify is a full-stack web application designed to connect users with service providers for various home maintenance and repair services. The project consists of a Node.js/Express backend and a React frontend.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database](#database)
- [Contributing](#contributing)

## Features
- User authentication (register/login)
- Browse and request various home services (plumbing, electrical, carpentry, etc.)
- Service provider dashboard
- Responsive UI

## Tech Stack
- **Frontend:** React, CSS
- **Backend:** Node.js, Express
- **Database:** SQL (with scripts provided)

## Project Structure
```
backend/           # Node.js/Express backend
frontend/
  sunio-flexi/     # React frontend
```

## Getting Started

### Prerequisites
- Node.js (v14 or above)
- npm
- SQL database (e.g., MySQL, PostgreSQL)

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your database using the provided SQL scripts (e.g., `fix_schema.sql`).
4. Configure your database connection in `db.js`.
5. Start the backend server:
   ```sh
   node server.js
   ```

### Frontend Setup
1. Navigate to the frontend React app:
   ```sh
   cd frontend/sunio-flexi
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

The frontend will typically run on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000) (or as configured).

## Database
- SQL scripts for creating and updating tables are in the `backend/` folder.
- Update `db.js` with your database credentials.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
