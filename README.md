# Blog Website with Role-Based Access Control (RBAC)

This project is a full-stack blog website where users can create, update, and delete blogs. It includes a Role-Based Access Control (RBAC) system with three types of users: **User**, **SuperUser**, and **Admin**, each with distinct permissions. The application is built with a React.js frontend and a Node.js backend.

Test admin credentials
username - loki@gmail.com
password - 123456


## Features

### General Features
- **CRUD Operations for Blogs**: Users can create, update, and delete their blogs.
- **Authentication**: Secure login and registration using JWT.
- **RBAC**:
  - **User**: Can create, update, and delete their blogs.
  - **SuperUser**: Can view all users and update their roles (create, update, delete blogs).
  - **Admin**: Can view all users and superusers, change roles, and grant additional permissions:
    - Delete other users' blogs.
    - Delete users or superusers.
    - Change user permissions.

---

## Tech Stack

### Frontend
- **React.js**: For building the user interface.
- **React Router DOM**: For routing.
- **TailwindCSS**: For styling.
- **Axios**: For making HTTP requests.
- **React Hook Form**: For form handling.
- **React Hot Toast**: For notifications.

### Backend
- **Node.js**: For server-side scripting.
- **Express.js**: For building the API.
- **MongoDB with Mongoose**: For the database.
- **Cloudinary & Multer**: For handling media uploads.
- **JWT**: For authentication and authorization.

---

## Installation

### Prerequisites
- **Node.js** and **npm** installed on your system.
- **MongoDB** instance (local or cloud).

### Setup

#### 1. Clone the repository
```bash
git clone https://github.com/LoKii0007/vrv-task.git
cd vrv-task
```

#### 2. Install dependencies

##### Frontend
```bash
cd frontend
npm install
```

##### Backend
```bash
cd backend
npm install
```

#### 3. Environment variables

Create `.env` files in both the `frontend` and `backend` directories with the following variables:

##### Backend `.env`
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

update the baseUrl in src/hooks/global

#### 4. Start the development servers

##### Backend
```bash
cd backend
npm run dev
```

##### Frontend
```bash
cd frontend
npm run dev
```

---

## Project Structure

### Frontend
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Application pages
│   ├── hooks/            # Custom hooks
│   ├── App.jsx            # Main app component
│   └── main.jsx         # Entry point
├── public/               # Static assets
└── package.json          # Frontend dependencies
```

### Backend
```
backend/
├── controllers/          # Logic for handling API requests
├── models/               # Mongoose schemas
├── routes/               # API endpoints
├── utils/                # Utility functions
├── index.js              # Server entry point
└── package.json          # Backend dependencies
```

---

## Usage

### User Roles and Permissions
1. **User**:
   - Can manage their blogs.
2. **SuperUser**:
   - Can view and manage all users' roles.
3. **Admin**:
   - Can manage users, superusers, and their permissions.

---
