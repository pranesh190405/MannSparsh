import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: '',
        year: '',
        specialisation: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password, role, department, year, specialisation } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/register', formData);
            sessionStorage.setItem('user', JSON.stringify(res.data));

            const role = res.data.role;
            if (role === 'counsellor') {
                navigate('/counsellor/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-6 border border-gray-100">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-100">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">I am a...</label>
                    <select
                        name="role"
                        value={role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition bg-white"
                    >
                        <option value="student">Student</option>
                        <option value="counsellor">Counsellor</option>
                    </select>
                </div>

                {role === 'student' && (
                    <>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Department</label>
                            <input
                                type="text"
                                name="department"
                                value={department}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Year of Study</label>
                            <input
                                type="text"
                                name="year"
                                value={year}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                        </div>
                    </>
                )}

                {role === 'counsellor' && (
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Specialisation</label>
                        <input
                            type="text"
                            name="specialisation"
                            value={specialisation}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md mt-2"
                >
                    Register
                </button>
            </form>
            <p className="mt-6 text-center text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Register;
