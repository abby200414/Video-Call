🎥 Video Call Web Application (MERN Stack)

A real-time video calling web application built using the MERN stack with Socket.IO for real-time communication.
This project was developed as a hands-on learning implementation with guidance from Apna College, focusing on full-stack architecture, authentication flow, and real-time systems.

🚀 Features

🔐 User authentication & authorization
📹 Real-time video calling
🔊 Live audio/video streaming
🧑‍🤝‍🧑 One-to-one meeting support
📜 Call history tracking
🌐 Real-time signaling using WebSockets
📱 Responsive frontend UI

🛠 Tech Stack

Frontend

React (Vite)
React Router
Material UI (MUI)
Axios
Socket.IO Client
CSS Modules


Backend

Node.js
Express
MongoDB + Mongoose
Socket.IO
bcrypt (password hashing)
dotenv
CORS

📁 Project Structure

Video-Call/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── utils/
│   │   └── styles/
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── .env
│
└── README.md


🔄 Real-Time Communication

Socket.IO is used for:
User connection handling
Call signaling
Live meeting coordination
Sockets are managed through a dedicated socket controller on the backend.


📚 Learning Outcome

This project helped in understanding:
MERN stack integration
WebSocket-based real-time systems
Frontend–backend communication
Authentication handling
Scalable project structure
