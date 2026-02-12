import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import CounsellorRegister from './pages/CounsellorRegister';
import Dashboard from './pages/Dashboard';
import CounsellorDashboard from './pages/CounsellorDashboard';
import CounsellorAvailability from './pages/CounsellorAvailability';
import CounsellorForum from './pages/CounsellorForum';
import Chat from './pages/Chat';
import Screening from './pages/Screening';
import Appointments from './pages/Appointments';
import VideoRoom from './components/Video/VideoRoom';
import Forum from './pages/Forum';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/counsellor/register" element={<CounsellorRegister />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/counsellor/dashboard" element={<CounsellorDashboard />} />
          <Route path="/counsellor/availability" element={<CounsellorAvailability />} />
          <Route path="/counsellor/forum" element={<CounsellorForum />} />
          <Route path="/screening" element={<Screening />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/forum" element={<Forum />} />
        </Route>
        <Route path="/video/:roomId" element={<VideoRoom />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
