import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Screening from './pages/Screening';
import Appointments from './pages/Appointments';
import VideoRoom from './components/Video/VideoRoom';
import Forum from './pages/Forum';
import AdminDashboard from './pages/AdminDashboard';

// Temporary placeholders
// const Dashboard = () => <div><h2>Dashboard</h2><p>Welcome to CampusCare</p></div>;
// const Register = () => <div><h2>Register Page</h2></div>;
// const Screening = () => <div><h2>Screening</h2></div>;
// const Appointments = () => <div><h2>Appointments</h2></div>;
// const Chat = () => <div><h2>Chat Support</h2></div>;
// const Forum = () => <div><h2>Peer Forum</h2></div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/screening" element={<Screening />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/video/:roomId" element={<VideoRoom />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
