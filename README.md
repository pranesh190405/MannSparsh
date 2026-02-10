# CAMPUSCARE - Digital Mental Health Platform

A comprehensive mental health support system for university students, featuring AI support, gamified screening, video counselling, and peer forums.

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
   # MONGO_URI=mongodb://localhost:27017/campuscare
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

4. **Access the App**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

### Default Roles (Create via Register Page)
- **Student**: Default role on sign up.
- **Counsellor/Admin**: Update role manually in MongoDB or use seed script (not included).

## Architecture Notes
- The **Local Action Agent** runs on the backend to execute safe actions (booking, flagging) triggered by the AI's analysis.
- **WebRTC** uses a simple mesh network via Socket.io signaling.
