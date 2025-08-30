Notsa 📚
A full-stack note-sharing web application for college students to organise their notes with ease, built with the MERN stack (MongoDB, Express, React, Node.js). Designed to make sharing and accessing course materials simple and efficient.

(You should replace the image above with a real screenshot of your application!)

About The Project
Notsa was created to solve a common problem for college students: the disorganized and difficult process of sharing study notes, modules, and PDFs. This platform provides a centralized, easy-to-navigate hub where any student can upload materials for a specific subject, and any other student can view them.

This project was built from scratch in Anjarakandy, Kerala, as a complete MERN stack application.

Key Features
User Authentication: Secure user registration and login using JWT (JSON Web Tokens).

Dynamic Subject Creation: Users can create their own subject "folders" on the fly.

PDF Note Management: Upload, view, and delete PDF notes within their respective subjects.

In-App PDF Viewer: View notes directly in the browser without needing to download them first, powered by react-pdf.

Secure Deletion: A confirmation modal requires users to type the name of the subject or note to prevent accidental deletion.

RESTful API: A complete backend API built with Express and Mongoose.

Local File Storage: Uses multer for efficient local file handling during development.

Built With
MongoDB & Mongoose: Database for storing user, subject, and note metadata.

Express.js: Backend framework for building the RESTful API.

React.js: Frontend library for building the user interface.

Node.js: JavaScript runtime for the server.

Other Key Libraries:

bcryptjs for password hashing.

jsonwebtoken for user authentication.

multer for handling file uploads.

react-pdf for in-browser PDF rendering.

axios for frontend-backend communication.

Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js and npm installed: https://nodejs.org/

MongoDB Community Server installed and running: https://www.mongodb.com/try/download/community

Installation
Clone the repository

git clone [https://github.com/azlanabdulla/Notsa-note-sharing.git](https://github.com/azlanabdulla/Notsa-note-sharing.git)
cd Notsa-note-sharing

Setup the Backend

# Navigate to the backend folder
cd backend

# Install NPM packages
npm install

# Create a .env file in the backend root and add your variables
# (Copy from .env.example)
MONGO_URI="mongodb://127.0.0.1:27017/notsa"
JWT_SECRET="your_super_secret_key"

# Create the uploads folder
mkdir uploads

# Start the backend server (on port 5000)
npm run dev

Setup the Frontend (Open a new, separate terminal)

# Navigate to the frontend folder
cd frontend

# Install NPM packages
npm install react-pdf
npm install

# Start the frontend React app (on port 3000)
npm start

The application should now be running and accessible at http://localhost:3000.
