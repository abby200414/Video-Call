# 🎥 Video Call Web Application (MERN Stack)

A real-time video calling web application built using the MERN stack with Socket.IO for real-time communication. This project was developed as a hands-on learning implementation with guidance from Apna College, focusing on full-stack architecture, authentication flow, and real-time systems.

---

## 🚀 **Features**

### 🔐 **Authentication & Security**
- User registration and login with secure password hashing
- JWT-based authentication and authorization
- Protected routes and API endpoints

### 📹 **Real-Time Video Calling**
- One-to-one video meetings with live audio/video streaming
- Real-time call signaling using WebSockets
- Toggle video/audio during calls
- Screen sharing capability

### 🎯 **User Experience**
- Responsive UI designed with Material-UI (MUI)
- Call history tracking
- Intuitive meeting controls
- Real-time connection status indicators

### ⚡ **Performance & Reliability**
- Optimized WebRTC connections
- Efficient socket event handling
- Scalable backend architecture
- Minimal latency for real-time communication

---

## 🛠️ **Tech Stack**

### **Frontend**
- **React** with Vite for fast development
- **React Router** for navigation
- **Material-UI (MUI)** for modern UI components
- **Socket.IO Client** for real-time communication
- **Axios** for HTTP requests
- **WebRTC API** for peer-to-peer connections
- **CSS Modules** for component styling

### **Backend**
- **Node.js** with **Express.js** server
- **MongoDB** with **Mongoose** ODM
- **Socket.IO** for WebSocket management
- **bcrypt** for password hashing
- **JWT** for authentication tokens
- **dotenv** for environment variables
- **CORS** for cross-origin resource sharing

---

## 📁 **Project Structure**

```
Video-Call/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Call/
│   │   │   ├── UI/
│   │   │   └── Layout/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CallRoom.jsx
│   │   │   └── History.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── webrtc.js
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── callController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   └── CallHistory.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── callRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── socketHandler.js
│   │   └── helpers.js
│   ├── app.js
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## 🔄 **Real-Time Communication**

### **Socket.IO Implementation**

```javascript
// Key Socket Events
io.on('connection', (socket) => {
  // User connection management
  socket.on('user-connected', (userId) => {});
  
  // Call signaling
  socket.on('call-user', (data) => {});
  socket.on('answer-call', (data) => {});
  socket.on('call-ended', (data) => {});
  
  // ICE candidates exchange
  socket.on('ice-candidate', (data) => {});
  
  // Media control
  socket.on('toggle-media', (data) => {});
});
```

### **WebRTC Flow**
1. **Signaling**: Socket.IO exchanges connection metadata
2. **Connection**: Establish peer-to-peer connection
3. **Streaming**: Exchange audio/video streams
4. **Control**: Manage media controls and screen sharing

---

## ⚙️ **Setup & Installation**

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Modern web browser with WebRTC support

### **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI and JWT secret to .env
npm start
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### **Environment Variables**
```env
# Backend .env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Frontend .env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📚 **Learning Outcomes**

This project helped in understanding:

### **Technical Skills**
- ✅ MERN stack integration and deployment
- ✅ WebSocket-based real-time communication systems
- ✅ WebRTC peer-to-peer connections
- ✅ JWT authentication flow implementation
- ✅ RESTful API design and best practices

### **Architectural Concepts**
- ✅ Separation of concerns in full-stack applications
- ✅ Context API for state management
- ✅ Event-driven architecture with Socket.IO
- ✅ Database design with MongoDB
- ✅ Error handling and validation

### **Soft Skills**
- ✅ Problem-solving in real-time systems
- ✅ Debugging complex communication flows
- ✅ Project structure organization
- ✅ Documentation writing
- ✅ Version control with Git

---

## 🎯 **Future Enhancements**

- [ ] Group video calling (multiple participants)
- [ ] Chat functionality during calls
- [ ] Recording and playback of calls
- [ ] Push notifications for incoming calls
- [ ] Contact management system
- [ ] File sharing during calls
- [ ] Virtual backgrounds
- [ ] Meeting scheduling with calendar integration

---

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 **License**

This project is open-source and available under the [MIT License](LICENSE).

---

## 👨‍💻 **Author**

**Abhay**  
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

## 🙏 **Acknowledgments**

- [Apna College](https://www.youtube.com/@ApnaCollegeOfficial) for guidance and learning resources
- Socket.IO and WebRTC communities for excellent documentation
- All open-source libraries used in this project

---

<div align="center">
  
### **⭐ Star this repo if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/video-call-app?style=social)](https://github.com/yourusername/video-call-app/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/video-call-app?style=social)](https://github.com/yourusername/video-call-app/network/members)

</div>

---

> **Note**: This project is for educational purposes and demonstrates the implementation of real-time video calling features using modern web technologies.
