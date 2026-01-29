import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ links }) => {
    const location = useLocation();

    return (
        <aside className="w-64 bg-white shadow-lg h-[calc(100vh-64px)] fixed overflow-y-auto">
            <div className="py-6">
                <h3 className="px-6 text-xs uppercase text-gray-400 font-semibold tracking-wider mb-4">
                    Menu
                </h3>
                <ul className="space-y-1">
                    {links.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${location.pathname === link.path
                                        ? 'bg-indigo-50 text-primary border-r-4 border-primary'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {link.icon && <span className="mr-3 text-lg">{link.icon}</span>}
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
