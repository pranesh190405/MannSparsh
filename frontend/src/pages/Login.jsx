import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', formData);
            sessionStorage.setItem('user', JSON.stringify(res.data));

            const role = res.data.role;
            if (role === 'counsellor') {
                navigate('/counsellor/dashboard');
            } else {
                // Default to student
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-100">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-100">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="student@college.edu"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                >
                    Login
                </button>
            </form>
            <p className="mt-6 text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
};

export default Login;
