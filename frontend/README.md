

---

# 🚀 ConnectIQ

> A real-time intent-based professional networking platform built using MERN stack and Socket.io

---

## 📌 Overview

ConnectIQ is a full-stack networking platform that connects users based on **skills, goals, and intent** rather than random social connections.

It introduces:

* 🎯 Intent-based matching
* 🧠 Recommendation engine
* ⚡ Real-time communication system
* 🛡️ Trust & risk scoring mechanism

This project simulates a **LinkedIn + Discord-style intelligent networking system**.

---

## ✨ Features

### 👤 Authentication System

* User Signup & Login
* JWT-based authentication
* Secure password hashing using bcrypt

---

### 🎯 Intent-Based Networking

Users define their purpose:

* Study partner
* Project collaboration
* Mentorship
* Job opportunities
* Startup networking

---

### 🧠 Smart Matching Engine

* Skill-based similarity scoring
* Interest overlap detection
* Trust score weighting
* Ranked user recommendations

---

### 🤝 Connection System

* Send / accept / reject connection requests
* Real-time request updates
* Prevent duplicate connections

---

### ⚡ Real-Time Communication (Socket.io)

* Instant messaging system
* Live connection requests
* Online/offline user tracking
* Real-time notifications

---

### 💬 Chat System

* One-to-one messaging
* Persistent message storage (MongoDB)
* Chat history retrieval
* Real-time message delivery

---

### 🛡️ Trust & Safety System

* User reporting system
* Risk score tracking
* Trust score decay & boost logic
* Blocking of suspicious users in matching/chat

---

## 🧠 Tech Stack

### Frontend

* React.js
* Axios
* Socket.io-client
* React Router DOM
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.io
* JWT Authentication
* bcrypt.js

### Database

* MongoDB (Mongoose ODM)

---

## 🏗️ System Architecture

```text
Frontend (React)
      │
      ▼
Backend (Node + Express + Socket.io)
      │
      ▼
MongoDB (Database)
```

---

## 📁 Project Structure

### Backend

```text
backend/
│
├── models/
│   ├── User.js
│   ├── Intent.js
│   ├── Connection.js
│   ├── Message.js
│   └── Report.js
│
├── controllers/
├── routes/
├── middleware/
├── sockets/
├── config/
├── server.js
└── app.js
```

---

### Frontend

```text
frontend/
│
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   └── Chat.jsx
│   │
│   ├── components/
│   ├── socket.js
│   ├── api.js
│   └── App.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone repository

```bash
git clone https://github.com/your-username/connectiq.git
cd connectiq
```

---

### 2️⃣ Backend setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
node server.js
```

---

### 3️⃣ Frontend setup

```bash
cd frontend
npm install
npm start
```

---

## 🔌 Socket.io Events

### Connection Events

* `user_connected`
* `user_online`
* `user_offline`

---

### Networking Events

* `send_request`
* `receive_request`
* `request_accepted`
* `request_rejected`

---

### Chat Events

* `send_message`
* `receive_message`
* `typing`
* `stop_typing`

---

## 🧠 Core System Logic

### 🎯 Matching Engine

* Compares user skills
* Matches interests
* Applies trust score weighting
* Generates ranked recommendations

---

### 🛡️ Trust System

* Reports reduce trust score
* Risk score increases with abuse
* Low-trust users are filtered from recommendations and chat

---

## 🚀 Future Improvements

* AI-powered recommendation engine
* Group chat system
* Push notifications
* Advanced admin dashboard
* Analytics for user engagement
* Resume-based auto profile builder

---

## 👨‍💻 Author

**Monisha**



## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

---

