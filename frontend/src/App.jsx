import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import BookAppointment from './pages/BookAppointment';
import MyHistory from './pages/MyHistory';
import AIChat from './pages/AIChat';
import ScreeningTest from './pages/ScreeningTest';

// Counsellor Pages
import CounsellorDashboard from './pages/CounsellorDashboard';
import ManageAppointments from './pages/ManageAppointments';
import StudentList from './pages/StudentList';
import VideoCall from './pages/VideoCall';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/login" replace />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="video-call" element={<VideoCall />} />

                    {/* Protected Routes for Students */}
                    <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                        <Route path="student" element={<DashboardLayout role="student" />}>
                            <Route path="dashboard" element={<StudentDashboard />} />
                            <Route path="book" element={<BookAppointment />} />
                            <Route path="history" element={<MyHistory />} />
                            <Route path="chat" element={<AIChat />} />
                            <Route path="test" element={<ScreeningTest />} />
                            {/* Default redirect */}
                            <Route index element={<Navigate to="dashboard" replace />} />
                        </Route>
                    </Route>

                    {/* Protected Routes for Counsellors */}
                    <Route element={<ProtectedRoute allowedRoles={['counsellor']} />}>
                        <Route path="counsellor" element={<DashboardLayout role="counsellor" />}>
                            <Route path="dashboard" element={<CounsellorDashboard />} />
                            <Route path="appointments" element={<ManageAppointments />} />
                            <Route path="students" element={<StudentList />} />
                            {/* Default redirect */}
                            <Route index element={<Navigate to="dashboard" replace />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
