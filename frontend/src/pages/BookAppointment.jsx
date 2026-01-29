import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BookAppointment = () => {
    const [counsellors, setCounsellors] = useState([]);
    const [formData, setFormData] = useState({
        counsellorId: '',
        date: '',
        timeSlot: '',
        mode: 'online'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCounsellors = async () => {
            try {
                const res = await api.get('/users/counsellors');
                setCounsellors(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load counsellors');
                setLoading(false);
            }
        };

        fetchCounsellors();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await api.post('/appointments', formData);
            setSuccess('Appointment booked successfully!');
            setTimeout(() => navigate('/student/history'), 2000); // Redirect after 2s
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book appointment');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Book an Appointment</h1>
            <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Select Counsellor</label>
                        <select
                            name="counsellorId"
                            value={formData.counsellorId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                            required
                        >
                            <option value="">-- Choose a Counsellor --</option>
                            {counsellors.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name} ({c.specialisation})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Time Slot</label>
                            <select
                                name="timeSlot"
                                value={formData.timeSlot}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                                required
                            >
                                <option value="">-- Select Time --</option>
                                <option value="09:00 AM">09:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="02:00 PM">02:00 PM</option>
                                <option value="03:00 PM">03:00 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Mode</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="mode"
                                    value="online"
                                    checked={formData.mode === 'online'}
                                    onChange={handleChange}
                                    className="text-primary focus:ring-primary"
                                />
                                <span>Online (Video Call)</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="mode"
                                    value="offline"
                                    checked={formData.mode === 'offline'}
                                    onChange={handleChange}
                                    className="text-primary focus:ring-primary"
                                />
                                <span>Offline (In-Person)</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
