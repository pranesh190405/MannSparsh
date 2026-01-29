import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if they try to access a wrong route
        if (user.role === 'student') {
            return <Navigate to="/student/dashboard" replace />;
        } else if (user.role === 'counsellor') {
            return <Navigate to="/counsellor/dashboard" replace />;
        } else if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
