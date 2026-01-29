import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-primary text-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                    <span>🧠</span> CampusMind
                </Link>
                <div className="flex items-center space-x-6">
                    {!user ? (
                        <>
                            <Link to="/login" className="hover:text-indigo-200 transition">Login</Link>
                            <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition shadow-sm">
                                Get Started
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="text-indigo-200">Hello, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="hover:text-red-200 transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
