import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-white text-center py-6 text-gray-500 text-sm border-t">
                &copy; {new Date().getFullYear()} CampusMind. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
