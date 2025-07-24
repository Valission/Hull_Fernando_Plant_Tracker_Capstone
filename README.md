Plant Tracker is a full-stack web application that allows users to create, 
manage, and track care logs for their plants. It provides authentication, photo
uploads (via Cloudinary), and log history for actions like watering,
fertilizing, or repotting. 

User registration and login with JWT-based authentication

Add, view, and manage plants with photos

Log plant care activities with optional images

Secure image uploads using Cloudinary

Private dashboard for users to manage their own plants

View entered log history per plant

dependencies Used:
Node.js

Express.js

MongoDB with Mongoose

JWT (jsonwebtoken) for auth

bcrypt for password hashing

Cloudinary for image hosting

Multer for file uploads

React.js

React Router DOM

Axios / Fetch API

CSS Modules

Auth Routes:
POST /register – Create a new user

POST /login – Authenticate and return JWT token

Plant Routes:
GET /planti – Get all plants (unprotected)

POST /plant – Create a new plant (protected, image upload)

GET /user/plants – Get logged-in user's plants (protected)

GET /plant/:id/logs – Get logs for a specific plant (protected)

POST /plant/:id/logs – Add a new log to a plant (protected, image optional)

Log Routes: 
GET /user/logs – Get all logs from authenticated user (protected)

Notes:
Auth is handled using JWT stored in localStorage

Image uploads are directly streamed to Cloudinary

Only authenticated users can create, view, or update their own plants/logs