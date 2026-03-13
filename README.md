# MANNSPARSH - Digital Mental Health Platform

A comprehensive mental health support system for university students, featuring AI support, gamified screening, video counselling, and peer forums.

# Collaborators : 
- **Name**: M PRANESH
- **Roll Number**: CB.SC.U4CSE23334

- **Name**: Juturu Naga Abhinava Sai 
- **Roll Number**: CB.SC.U4CSE23563 

- **Name**: Bhuvanesh S
- **Roll Number**: CB.SC.U4CSE23544

## Features

- **Gamified Screening**: Story-based PHQ-9 & GAD-7 assessments.
- **AI Companion**: Empathetic chatbot using OpenAI API (System Prompt engineered for safety).
- **Video Counselling**: WebRTC-based video sessions with university counsellors.
- **Peer Forum**: Anonymous actionable support community.
- **Admin Dashboard**: Analytics on mental health trends.
- **Security**: JWT Authentication, Role-based access (Student, Counsellor, Admin).

## Tech Stack

- **Frontend**: React, Vite, Material UI, Socket.io Client
- **Backend**: Node.js, Express, MongoDB, Socket.io, WebRTC
- **AI**: OpenAI API + Local Action Agent

## Usage Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or Atlas URI)

### Setup

1. **Clone/Download** the repository.

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # MONGO_URI=mongodb+srv://praneshcollege1904_db_user:Aspirant190405@cluster0.59igkhl.mongodb.net/?appName=Cluster0
   # JWT_SECRET=your_secret
   # OPENAI_API_KEY=your_key
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Live Deployments & Demo

- **Frontend (Vercel)**: [https://mann-sparsh.vercel.app/login](https://mann-sparsh.vercel.app/login)
- **Backend API (Render)**: [https://mannsparsh.onrender.com](https://mannsparsh.onrender.com)
- **Video Demonstration**: [YouTube Link - Watch Here](https://youtu.be/j5i7TVRZlW8)

### Default Roles (Create via Register Page)
- **Student**: Default role on sign up
  -- alice@test.com , password : password123
- **Counsellor/Admin**: Update role manually in MongoDB or use seed script (not included).
  -- counsellor@test.com , password : password123

## Architecture Notes
- The **Local Action Agent** runs on the backend to execute safe actions (booking, flagging) triggered by the AI's analysis.
- **WebRTC** uses a simple mesh network via Socket.io signaling.
