import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaHome, FaCalendarAlt, FaUserMd, FaRocketchat, FaSignOutAlt, FaClipboardList, FaUsers } from 'react-icons/fa';

const DashboardLayout = ({ role }) => {
    const studentLinks = [
        { label: 'Home', path: '/student/dashboard', icon: '🏠' },
        { label: 'Book Appointment', path: '/student/book', icon: '📅' },
        { label: 'My History', path: '/student/history', icon: <FaCalendarAlt /> },
        { label: 'AI Chat', path: '/student/chat', icon: <FaRocketchat /> },
        { label: 'Screening Test', path: '/student/test', icon: <FaClipboardList /> }
    ];

    const counsellorLinks = [
        { label: 'Dashboard', path: '/counsellor/dashboard', icon: '📊' },
        { label: 'Manage Appointments', path: '/counsellor/appointments', icon: '📅' },
        { label: 'Students', path: '/counsellor/students', icon: '🎓' },
    ];

    const links = role === 'student' ? studentLinks : counsellorLinks;

    return (
        <div className="flex h-[calc(100vh-64px)]"> {/* Adjust height for Navbar */}
            <Sidebar links={links} />
            <div className="ml-64 flex-1 p-8 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
